import { action, computed, makeObservable, observable, reaction } from 'mobx';
import moment from 'moment';
import { ProposalOpenContract } from '@deriv/api-types';
import { api_base } from '@deriv/bot-skeleton';
import { isEnded } from '@deriv/shared';
import { TClientStore } from '@deriv/stores/types';
import { localize } from '@deriv/translations';
import { botNotification } from 'Components/bot-notification/bot-notification';
import { downloadFile } from 'Utils/download';
import { SERVER_BOT_CONFIG } from '../pages/server-side-bot/config';

export type TFormData = {
    [key: string]: string | number | boolean;
};

export type TServerBotItem = {
    bot_id: string;
    name: string;
    status: string;
    strategy: string;
};

export type TServerBotTransaction = {
    display_name: string;
    profit: string;
    purchase_time: string;
};

const isValidJSON = (text: string) => {
    try {
        JSON.parse(text);
        return true; // The string is valid JSON
    } catch (error) {
        return false; // The string is not valid JSON
    }
};

const getAPI = async () => {
    let interval = null;

    return new Promise(resolve => {
        interval = setInterval(() => {
            if (api_base?.api) {
                clearInterval(interval);
                return resolve(api_base.api);
            }
        }, 10);
    });
};

// STRUCTURE of the transactions object:
// transactions: {
//     [bot_id]: {
//         [contract_id]: ProposalOpenContract[],
//     },
// };

export const JOURNAL_TYPE = Object.freeze({
    BUY: 'BUY',
    LOSS: 'LOSS',
    WON: 'WON',
    INFO: 'INFO',
    ERROR: 'ERROR',
});

export type TJournalOptions = {
    msg?: string;
    amount?: string;
    bot_id?: string;
    contract_id?: string;
    time?: string;
};

export type TBotTransactions = {
    [key: string]: {
        [key: string]: ProposalOpenContract;
    };
};

export type TJournalItem = {
    type: typeof JOURNAL_TYPE[keyof typeof JOURNAL_TYPE];
    order?: number;
    msg?: string;
    amount?: string;
    bot_id?: string;
    time?: string;
};

export type TLossThresholdWarningData = {
    show: boolean;
    loss_amount?: string | number;
    currency?: string;
    highlight_field?: Array<string>;
    already_shown?: boolean;
};

export const getDate = (epoch: number) => {
    const DATE_TIME_FORMAT_WITH_OFFSET = 'YYYY-MM-DD HH:mm:ss Z';
    return moment.unix(epoch).utc().local().format(DATE_TIME_FORMAT_WITH_OFFSET);
};

export default class ServerBotStore {
    client_store: TClientStore;
    is_loading_bot_list = true;
    active_bot_id = '';
    bot_list: TServerBotItem[] = [];
    active_bot: Partial<TServerBotItem> = {
        status: 'stopped',
    };

    transactions: TBotTransactions = {};
    journal: TJournalItem[] = [];
    order = 0;

    subscriptions: { [key: string]: any } = {};

    pocs: { [key: string]: ProposalOpenContract } = {};
    should_subscribe = true;
    loss_threshold_warning_data: TLossThresholdWarningData = {
        show: false,
    };
    current_duration_min_max = {
        min: 0,
        max: 10,
    };
    selected_strategy = 'MARTINGALE';
    form_data: TFormData = {
        symbol: SERVER_BOT_CONFIG.DEFAULT.symbol,
        tradetype: SERVER_BOT_CONFIG.DEFAULT.tradetype,
        durationtype: SERVER_BOT_CONFIG.DEFAULT.durationtype,
        action: 'RUN',
    };

    constructor(client_store: TClientStore) {
        this.client_store = client_store;
        makeObservable(this, {
            is_loading_bot_list: observable,
            active_bot_id: observable,
            bot_list: observable,
            transactions: observable,
            active_bot: observable,
            pocs: observable,
            journal: observable,
            should_subscribe: observable,
            selected_strategy: observable,
            form_data: observable,
            current_duration_min_max: observable,
            loss_threshold_warning_data: observable,
            setShouldSubscribe: action,
            performance: computed,
            setListLoading: action,
            getBotList: action,
            subscribeToBotNotification: action,
            createBot: action,
            deleteBot: action,
            startBot: action,
            stopBot: action,
            setTransaction: action,
            resetTransactions: action,
            handleProposalOpenContract: action,
            resetJournal: action,
            onJournalMessage: action,
            setJournal: action,
            setBotList: action,
            setActiveBotId: action,
            setLossThresholdWarningData: action,
            initializeLossThresholdWarningData: action,
            setCurrentDurationMinMax: action,
            setSelectedStrategy: action,
            resetValues: action,
        });

        reaction(
            () => this.client_store.is_virtual,
            (is_virtual: boolean) => {
                if (this?.client_store?.is_logged_in && is_virtual) {
                    this.resetValues();
                }
            }
        );
    }

    resetValues = () => {
        this.is_loading_bot_list = true;
        this.active_bot_id = '';
        this.bot_list = [];
        this.active_bot = {
            status: 'stopped',
        };
        this.order = 0;
        this.transactions = {};
        this.journal = [];
        this.subscriptions = {};
        this.pocs = {};
        this.should_subscribe = true;
    };

    get performance() {
        let total_runs = 0;
        const active_bot_id = this.active_bot.bot_id;
        if (!active_bot_id) return { total_stake: 0, total_payout: 0, total_profit: 0 };
        const transactions = this.transactions[active_bot_id as string] || {};
        const txns = Object.values(transactions);
        if (!txns.length) return { total_stake: 0, total_payout: 0, total_profit: 0 };

        const statistics = [...txns].reduce(
            (stats, data) => {
                const is_completed = isEnded(data);
                const profit = Number(data.profit);
                const payout = Number(data.payout);
                const buy_price = Number(data.buy_price);

                if (is_completed) {
                    if (profit > 0) {
                        stats.won_contracts += 1;
                        stats.total_payout += payout;
                    } else {
                        stats.lost_contracts += 1;
                    }
                    stats.total_profit += profit;
                    stats.total_stake += buy_price;
                    total_runs += 1;
                }
                return stats;
            },
            {
                lost_contracts: 0,
                number_of_runs: 0,
                total_profit: 0,
                total_payout: 0,
                total_stake: 0,
                won_contracts: 0,
            }
        );
        statistics.number_of_runs = total_runs;
        return statistics;
    }

    setActiveBotId = (bot_id: string) => {
        this.active_bot_id = bot_id;
    };

    setActiveBot = (active_bot: Partial<TServerBotItem>) => {
        this.active_bot = active_bot;
    };

    onMessage = ({ data }) => {
        const { msg_type, echo_req } = data;

        if (data?.error) {
            if (data.error.message) {
                this.onJournalMessage(JOURNAL_TYPE.ERROR, {
                    msg: data.error.message,
                });
                botNotification(data.error.message);
            }
        }
        try {
            if (msg_type === 'proposal_open_contract' && !data.error) {
                this.handleProposalOpenContract(data.proposal_open_contract);
            }

            if (msg_type === 'bot_notification') {
                const { message, error } = data.bot_notification;

                if (error) {
                    // eslint-disable-next-line no-console
                    console.info(error, 'BOT SERVER ERROR');
                    return;
                }
                const { bot_id } = echo_req;

                if (isValidJSON(message)) {
                    const { msg, msg_type } = JSON.parse(message);

                    if (msg_type === 'poc') {
                        this.setTransaction(msg, bot_id);
                    }

                    if (msg_type === 'transaction' && msg?.action === 'buy') {
                        // eslint-disable-next-line no-console
                        this.onJournalMessage(JOURNAL_TYPE.BUY, {
                            msg: localize('Contract purchased ({{contract_id}})', { contract_id: msg.contract_id }),
                            bot_id,
                        });
                    }

                    if (msg_type === 'transaction' && msg?.action === 'sell') {
                        const is_profit = msg.profit > 0;
                        const type = is_profit ? JOURNAL_TYPE.WON : JOURNAL_TYPE.LOSS;
                        this.onJournalMessage(type, { amount: msg.profit, bot_id });
                    }

                    if (msg_type === 'stop') {
                        const { reason } = msg;
                        if (reason.message) {
                            this.onJournalMessage(JOURNAL_TYPE.INFO, { msg: reason.message, bot_id });
                            botNotification(reason.message);
                        }
                        if (reason?.be?.message) {
                            const msg = `${reason?.be?.message || localize('Something went wrong')} (code: ${
                                reason?.be?.code || localize('Unknown')
                            })`;
                            botNotification(msg);
                            this.onJournalMessage(JOURNAL_TYPE.ERROR, { msg, bot_id });
                            const bot_list = [...this.bot_list];
                            const index = bot_list.findIndex(bot => bot.bot_id === bot_id);
                            bot_list[index].status = 'stopped';
                            this.setBotList(bot_list);
                            this.setActiveBot({
                                bot_id,
                                status: 'stopped',
                            });
                        }
                        const bot_list = [...this.bot_list];
                        const index = bot_list.findIndex(bot => bot.bot_id === bot_id);
                        bot_list[index].status = 'stopped';
                        this.setBotList(bot_list);
                        this.setActiveBot({
                            bot_id,
                            status: 'stopped',
                        });
                    }
                }
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.dir(error);
        }
    };

    onJournalMessage = (type: string, options: TJournalOptions) => {
        const { msg = '', bot_id = '', amount = '', time = '' } = options;
        switch (type) {
            case JOURNAL_TYPE.INFO:
                this.setJournal({ type: JOURNAL_TYPE.INFO, msg });
                break;
            case JOURNAL_TYPE.ERROR:
                this.setJournal({ type: JOURNAL_TYPE.ERROR, msg });
                break;
            case JOURNAL_TYPE.BUY: {
                const journal_item = {
                    type: JOURNAL_TYPE.BUY,
                    msg,
                    time,
                };
                this.setJournal(journal_item);
                break;
            }
            case JOURNAL_TYPE.WON: {
                if (amount) {
                    this.setJournal({ type: JOURNAL_TYPE.WON, amount });
                }
                break;
            }
            case JOURNAL_TYPE.LOSS: {
                if (amount) {
                    this.setJournal({ type: JOURNAL_TYPE.LOSS, amount });
                }
                break;
            }
            default:
                // eslint-disable-next-line no-console
                console.log(options, bot_id, 'onJournalMessage');
        }
    };

    setJournal = (journal: TJournalItem) => {
        this.journal = [...this.journal, { ...journal, order: this.order }];
        this.order += 1;
    };

    resetJournal = () => {
        this.journal = [];
    };

    downloadJournal = async () => {
        try {
            const items = [[localize('Journal')]];
            [...this.journal].map(item => {
                let combined_message;

                switch (item?.type) {
                    case JOURNAL_TYPE.WON:
                        combined_message = `Profit amount: ${item?.amount ?? ''}`;
                        break;
                    case JOURNAL_TYPE.LOSS:
                        combined_message = `Loss amount: ${item?.amount ?? ''}`;
                        break;
                    default:
                        combined_message = `${item?.type ?? ''}:${item?.msg ?? ''}`;
                        break;
                }
                items.push([combined_message]);
            });
            const content = items.map(e => e.join(',')).join('\n');
            downloadFile(localize('Journal'), content);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.dir(error);
        }
    };
    handleProposalOpenContract = (poc: ProposalOpenContract) => {
        if (poc && !poc?.contract_id && this.active_bot?.bot_id) return;

        const { contract_id } = poc;
        const { bot_id = '' } = this.active_bot;
        const transactions = this.transactions[bot_id as string] || {};
        let contract = transactions[contract_id as unknown as string];
        if (!contract) return;
        contract = poc;
        this.setTransaction(contract, bot_id);

        this.pocs = {
            ...this.pocs,
            [String(poc.contract_id)]: poc,
        };
    };

    setTransaction = (poc: ProposalOpenContract, bot_id: string) => {
        if (poc.contract_id) {
            this.transactions = {
                ...this.transactions,
                [bot_id]: {
                    ...this.transactions[bot_id],
                    [poc.contract_id]: poc,
                },
            };
        }
    };

    resetTransactions = () => {
        this.transactions = {};
    };

    setShouldSubscribe = (should_subscribe: boolean) => {
        this.should_subscribe = should_subscribe;
    };

    getBotList = async () => {
        try {
            this.setListLoading(true);
            await getAPI();
            // eslint-disable-next-line no-console
            console.info('%cCONNECTION ESTABLISHED', 'color:green;');
            await api_base.api.expectResponse('authorize');
            // eslint-disable-next-line no-console
            console.info('%cAUTHORIZATION SUCCESSFUL', 'color:green;');

            if (this.should_subscribe) api_base.api?.onMessage()?.subscribe(this.onMessage);

            const { bot_list, error } = await api_base.api.send({ bot_list: 1 });
            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }

            // Updated the bot_list after running the bot
            const list = [...bot_list.bot_list];
            this.setBotList(list);
            const running_bot = list.find(bot => bot.status === 'running');

            // Setting the active_bot object with the running bot details
            if (running_bot?.bot_id) {
                this.setActiveBot(running_bot);
                this.subscribeToBotNotification(running_bot?.bot_id);
            }

            if (this.should_subscribe && !!list.length) {
                this.onJournalMessage(JOURNAL_TYPE.INFO, {
                    msg: localize('Bots loaded successfully'),
                });
            }

            this.setShouldSubscribe(false);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.dir(error);
        } finally {
            this.setListLoading(false);
        }
    };

    setBotList = (bot_list: TServerBotItem[]) => {
        this.bot_list = [...bot_list];
    };

    setListLoading = (is_loading_bot_list: boolean) => {
        this.is_loading_bot_list = is_loading_bot_list;
    };

    subscribeToBotNotification = async (bot_id: string) => {
        try {
            if (this.subscriptions[bot_id]) return;
            const { subscription } = await api_base.api.send({ bot_notification: 1, bot_id, subscribe: 1 });

            this.subscriptions = {
                ...this.subscriptions,
                [bot_id]: subscription.id,
            };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.dir(error);
        }
    };

    createBot = async (data: TFormData) => {
        try {
            const { bot_create, error } = await api_base.api.send({
                bot_create: 1,
                data: {
                    name: data.name,
                    strategy: 'martingale',
                    contract_parameters: {
                        amount: data.stake,
                        basis: 'stake',
                        contract_type: data.type,
                        currency: this.client_store?.currency ?? 'USD',
                        duration: data.duration,
                        duration_unit: data.durationtype,
                        symbol: data.symbol,
                        barrier: data.last_digit_prediction,
                    },
                    parameters: {
                        initial_stake: data.stake,
                        size: data.size,
                        stop_loss: data.loss,
                        take_profit: data.profit,
                    },
                },
            });

            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }

            this.onJournalMessage(JOURNAL_TYPE.INFO, {
                bot_id: bot_create.bot_id,
                msg: bot_create.message,
            });
            this.getBotList();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.dir(error);
        }
    };

    deleteBot = async (bot_id: string) => {
        try {
            const { bot_remove, error } = await api_base.api.send({
                bot_remove: 1,
                bot_id,
            });
            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }

            this.getBotList();
            botNotification(bot_remove.message);
            this.onJournalMessage(JOURNAL_TYPE.INFO, {
                msg: bot_remove.message || localize('Bot deleted successfully'),
                bot_id,
            });

            const subscriptions = { ...this.subscriptions };
            delete subscriptions[bot_id];
            this.subscriptions = subscriptions;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.dir(error);
        }
    };

    startBot = async (bot_id: string) => {
        try {
            this.setActiveBot({
                bot_id,
                status: 'starting',
            });
            if (!this.subscriptions[bot_id]) this.subscribeToBotNotification(bot_id);

            const { bot_start, error } = await api_base.api.send({
                bot_start: 1,
                bot_id,
            });
            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }
            const bot_list = [...this.bot_list];
            const index = bot_list.findIndex(bot => bot.bot_id === bot_id);
            bot_list[index].status = 'running';
            this.setBotList(bot_list);
            this.setActiveBot(bot_list[index]);

            const msg = bot_start?.message || localize('Bot started successfully');
            botNotification(msg);
            this.onJournalMessage(JOURNAL_TYPE.INFO, {
                msg,
                bot_id,
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.dir(error);
        }
    };

    stopBot = async (bot_id: string) => {
        try {
            this.setActiveBot({
                ...this.active_bot,
                status: 'stopping',
            });

            const { bot_stop, error } = await api_base.api.send({
                bot_stop: 1,
                bot_id,
            });

            if (error) {
                // eslint-disable-next-line no-console
                console.dir(error);
                return;
            }

            const bot_list = [...this.bot_list];
            const index = bot_list.findIndex(bot => bot.bot_id === bot_id);
            bot_list[index].status = 'stopped';
            this.setBotList(bot_list);
            this.setActiveBot({
                ...this.active_bot,
                status: 'stopped',
            });

            this.onJournalMessage(JOURNAL_TYPE.INFO, {
                msg: bot_stop?.message || localize('Bot stopped successfully'),
                bot_id,
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.dir(error);
        }
    };

    setLossThresholdWarningData = (data: TLossThresholdWarningData) => {
        this.loss_threshold_warning_data = {
            ...this.loss_threshold_warning_data,
            ...data,
        };
    };

    initializeLossThresholdWarningData = () => {
        this.loss_threshold_warning_data = {
            show: false,
            highlight_field: [],
            already_shown: false,
        };
    };

    setCurrentDurationMinMax = (min = 0, max = 10) => {
        this.current_duration_min_max = {
            min,
            max,
        };
    };

    setValue = (name: string, value: string | number | boolean) => {
        this.form_data[name as keyof TFormData] = value;
    };

    setSelectedStrategy = (strategy: string) => {
        this.selected_strategy = strategy;
    };
}
