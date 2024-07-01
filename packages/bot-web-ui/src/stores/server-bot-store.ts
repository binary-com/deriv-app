import { action, makeObservable, observable } from 'mobx';
import { api_base } from '@deriv/bot-skeleton';
import RootStore from './root-store';
import { initial_req_schema, TRequestSchema, TBotList, TBotListItem } from '../pages/server-bot/request_schema';

interface IServerBotStore {
    bot_list: TBotListItem[];
    notifications: Array<string>;
    setNotifications: (notifications: string) => void;
    getBotList: () => void;
    notifyBot: (bot_id: string, should_change_status: boolean) => void;
    createBot: () => void;
    removeBot: (bot_id: string) => void;
    startBot: (bot_id: string) => void;
    stopBot: (bot_id: string) => void;
    setValue: (name: string, value: string) => void;
    setValueServerBot: (form_data: any) => void;
    makeRequest: (req_schema: TRequestSchema) => Promise<TBotResponse>;
    setFormValues: (currency: string) => void;
    setStatusBot: (status: string, bot_id: string) => void;
}

type TBotListResponse = {
    bot_list: TBotList;
    echo_req: {
        bot_list: number;
        req_id: number;
    };
    msg_type: 'bot_list';
    req_id: number;
};

type TKeysResponse =
    | { bot_list: TBotList }
    | { bot_create: number }
    | { bot_start: number }
    | { bot_stop: number }
    | { bot_notification: number };

type TBotResponse = {
    echo_req: {
        bot_list: number;
        req_id: number;
    };
    msg_type: 'bot_list';
    req_id: number;
} & TKeysResponse;

export type TFormData = {
    [key: string]: string | number | boolean;
};

export default class ServerBotStore implements IServerBotStore {
    bot_list: TBotListItem[] = [];
    notifications: Array<string> = [];
    root_store: RootStore;
    form_data: TFormData = {};

    constructor(root_store: RootStore) {
        this.root_store = root_store;
        makeObservable(this, {
            bot_list: observable,
            notifications: observable,
            form_data: observable,
            setValueServerBot: action.bound,
            setNotifications: action.bound,
            setValue: action.bound,
            getBotList: action.bound,
            notifyBot: action.bound,
            createBot: action.bound,
            removeBot: action.bound,
            startBot: action.bound,
            stopBot: action.bound,
            setFormValues: action.bound,
            setStatusBot: action.bound,
        });
    }

    setValue = (name: string, value: string | number | boolean) => {
        this.form_data[name as keyof TFormData] = value;
    };

    setValueServerBot = (form_data: any) => {
        this.form_data = form_data;
    };

    makeRequest = (req_schema: TRequestSchema): Promise<TBotResponse> => {
        return new Promise((resolve, reject) => {
            api_base.api
                ?.send(req_schema)
                .then((data: TBotResponse) => resolve(data))
                .catch((error: Error) => reject(error));
        });
    };

    setFormValues = (currency: string) => {
        const data = JSON.parse(localStorage.getItem('server-form-fields') ?? '{}');

        const parameters = initial_req_schema.data.parameters;
        const contract_parameters = initial_req_schema.data.contract_parameters;

        Object.keys(data).forEach(key => {
            if (key === 'size' || key === 'take_profit' || key === 'stop_loss') {
                parameters[key] = data[key];
            }
            if (key === 'stake') {
                parameters.initial_stake = data.stake;
            }
            if (key === 'type') {
                contract_parameters.contract_type = data.type;
            }
            if (key === 'duration' || key === 'symbol' || key === 'duration_unit' || key === 'amount') {
                (contract_parameters[key] as string | number) = data[key];
            }
            if (key === 'currency') {
                contract_parameters[key] = data[currency || 'USD'];
            }
            this.setValue(key, data[key]);
        });
    };

    getBotList = () => {
        /* eslint-disable no-unused-vars */
        const api_status = api_base.getConnectionStatus();
        setTimeout(() => {
            // eslint-disable-next-line
            // if (api_status === 'Connected') { // need handle the first loading
            api_base?.api
                ?.send({
                    bot_list: 1,
                })
                .then((data: TBotListResponse) => {
                    this.bot_list = data.bot_list.bot_listing;
                    return data.bot_list.bot_listing;
                })
                .catch((error: Error) => {
                    /* eslint-disable no-console */
                    this.setNotifications(error?.error?.message);
                });
        }, 2000);
    };

    createBot = () => {
        console.log('create', this.form_data);

        this.makeRequest(initial_req_schema)
            .then(data => {
                this.setNotifications(data.bot_create.message);
                if (this.form_data.action === 'RUN') {
                    this.startBot(data?.bot_create?.bot_id);
                }
                return data;
            })
            .catch((error: Error) => {
                /* eslint-disable no-console */
                console.error(error);
                this.setNotifications(error?.error?.message);
            })
            .then(() => this.getBotList());
    };

    removeBot = (bot_id: string) => {
        this.makeRequest({
            bot_remove: 1,
            bot_id,
        })
            .then(data => {
                this.setNotifications(data.bot_remove.message);
            })
            .catch((error: Error) => {
                /* eslint-disable no-console */
                console.error(error);
                this.setNotifications(error?.error?.message);
            })
            .then(() => this.getBotList());
    };

    startBot = (bot_id: string) => {
        this.notifyBot(bot_id);
        this.makeRequest({
            bot_start: 1,
            bot_id,
        })
            .then(data => {
                this.setNotifications(data.bot_start.message);
            })
            .catch((error: Error) => {
                /* eslint-disable no-console */
                console.error(error);
                this.setNotifications(error?.error?.message);
            });
    };

    stopBot = (bot_id: string) => {
        this.makeRequest({
            bot_stop: 1,
            bot_id,
        })
            .then(data => {
                this.setNotifications(data.bot_stop.message);
            })
            .catch((error: Error) => {
                /* eslint-disable no-console */
                console.error(error);
                this.setNotifications(error?.error?.message);
            })
            .then(() => this.getBotList());
    };

    notifyBot = (bot_id: string, should_change_status = true) => {
        if (should_change_status) {
            this.setStatusBot('started', bot_id);
        }
        this.makeRequest({
            bot_notification: 1,
            subscribe: 1,
            bot_id,
        })
            .then(data => {
                this.setNotifications(data?.bot_notification?.message);
                return data;
            })
            .catch((error: Error) => {
                /* eslint-disable no-console */
                console.error(error);
                this.setNotifications(error?.error?.message);
            });
    };

    setNotifications = (notifications: string) => {
        this.notifications.push(notifications);
    };

    setStatusBot = (status: string, bot_id: string) => {
        this.bot_list = this.bot_list.map(bot => (bot.bot_id === bot_id ? { ...bot, status } : bot));
    };
}
