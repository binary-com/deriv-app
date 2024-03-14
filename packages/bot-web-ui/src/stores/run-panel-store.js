import React from 'react';
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';
import { error_types, message_types, observer, unrecoverable_errors } from '@deriv/bot-skeleton';
import { isSafari, mobileOSDetect, routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { botNotification } from 'Components/bot-notification/bot-notification';
import { notification_message } from 'Components/bot-notification/bot-notification-utils';
import { contract_stages } from 'Constants/contract-stage';
import { run_panel } from 'Constants/run-panel';
import { journalError, switch_account_notification } from 'Utils/bot-notifications';

export default class RunPanelStore {
    constructor(root_store, core) {
        makeObservable(this, {
            active_index: observable,
            contract_stage: observable,
            dialog_options: observable,
            has_open_contract: observable,
            is_running: observable,
            is_statistics_info_modal_open: observable,
            is_drawer_open: observable,
            is_dialog_open: observable,
            is_sell_requested: observable,
            run_id: observable,
            error_type: observable,
            show_bot_stop_message: observable,
            statistics: computed,
            is_stop_button_visible: computed,
            is_stop_button_disabled: computed,
            is_clear_stat_disabled: computed,
            onStopButtonClick: action.bound,
            onStopBotClick: action.bound,
            stopBot: action.bound,
            onClearStatClick: action.bound,
            clearStat: action.bound,
            toggleStatisticsInfoModal: action.bound,
            toggleDrawer: action.bound,
            setActiveTabIndex: action.bound,
            onCloseDialog: action.bound,
            performSelfExclusionCheck: action.bound,
            showStopMultiplierContractDialog: action.bound,
            showLoginDialog: action.bound,
            showRealAccountDialog: action.bound,
            showClearStatDialog: action.bound,
            showIncompatibleStrategyDialog: action.bound,
            showContractUpdateErrorDialog: action.bound,
            onBotSellEvent: action.bound,
            onBotStopEvent: action.bound,
            onBotReadyEvent: action.bound,
            onBotTradeAgain: action.bound,
            onContractStatusEvent: action.bound,
            onClickSell: action.bound,
            onBotContractEvent: action.bound,
            onError: action.bound,
            showErrorMessage: action.bound,
            switchToJournal: action.bound,
            setContractStage: action.bound,
            setHasOpenContract: action.bound,
            setIsRunning: action.bound,
            setShowBotStopMessage: action.bound,
            onMount: action.bound,
            onUnmount: action.bound,
            handleInvalidToken: action.bound,
            onRunButtonClick: action.bound,
            registerBotListeners: action.bound,
            registerReactions: action.bound,
            onBotRunningEvent: action.bound,
            unregisterBotListeners: action.bound,
            clear: action.bound,
            preloadAudio: action.bound,
            stopMyBot: action.bound,
            closeMultiplierContract: action.bound,
        });

        this.root_store = root_store;
        this.dbot = this.root_store.dbot;
        this.core = core;
        this.disposeReactionsFn = this.registerReactions();
        this.timer = null;
    }

    active_index = 0;
    contract_stage = contract_stages.NOT_RUNNING;
    dialog_options = {};
    has_open_contract = false;
    is_running = false;
    is_statistics_info_modal_open = false;
    is_drawer_open = true;
    is_dialog_open = false;
    is_sell_requested = false;
    show_bot_stop_message = false;

    run_id = '';

    // when error happens, if it is unrecoverable_errors we reset run-panel
    // we activate run-button and clear trade info and set the ContractStage to NOT_RUNNING
    // otherwise we keep opening new contracts and set the ContractStage to PURCHASE_SENT
    error_type = undefined;

    get statistics() {
        let total_runs = 0;
        const { transactions } = this.root_store.transactions;
        const statistics = transactions.reduce(
            (stats, { data: trx }) => {
                if (trx.is_completed) {
                    if (trx.profit > 0) {
                        stats.won_contracts += 1;
                        stats.total_payout += trx.payout;
                    } else {
                        stats.lost_contracts += 1;
                    }

                    stats.total_profit += trx.profit;
                    stats.total_stake += trx.buy_price;
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

    get is_stop_button_visible() {
        return this.is_running || this.has_open_contract;
    }

    get is_stop_button_disabled() {
        return [contract_stages.PURCHASE_SENT, contract_stages.IS_STOPPING].includes(this.contract_stage);
    }

    get is_clear_stat_disabled() {
        const { journal, transactions } = this.root_store;

        return (
            this.is_running ||
            this.has_open_contract ||
            (journal.unfiltered_messages.length === 0 && transactions?.transactions?.length === 0)
        );
    }

    setShowBotStopMessage(value) {
        this.show_bot_stop_message = value;
        if (value)
            botNotification(notification_message.bot_stop, {
                label: localize('Reports'),
                onClick: () => (window.location.href = routes.reports),
            });
    }

    async performSelfExclusionCheck() {
        const { self_exclusion } = this.root_store;
        await self_exclusion.checkRestriction();
    }

    async onRunButtonClick() {
        let timer_counter = 1;
        if (window.sendRequestsStatistic) {
            performance.clearMeasures();
            performance.mark('bot-start');
            // Log is sent every 10 seconds for 5 minutes
            this.timer = setInterval(() => {
                window.sendRequestsStatistic(true);
                performance.clearMeasures();
                if (timer_counter === 12) {
                    clearInterval(this.timer);
                } else {
                    timer_counter++;
                }
            }, 10000);
        }
        const { summary_card, route_prompt_dialog, self_exclusion } = this.root_store;
        const { client, ui } = this.core;
        const is_ios = mobileOSDetect() === 'iOS';
        this.dbot.saveRecentWorkspace();
        this.dbot.unHighlightAllBlocks();
        if (!client.is_logged_in) {
            this.showLoginDialog();
            return;
        }

        /**
         * Due to Apple's policy on cellular data usage in ios audioElement.play() should be initially called on
         * user action(e.g click/touch) to be downloaded, otherwise throws an error. Also it should be called
         * syncronously, so keep above await.
         */
        if (is_ios || isSafari()) this.preloadAudio();

        if (!self_exclusion.should_bot_run) {
            self_exclusion.setIsRestricted(true);
            return;
        }
        self_exclusion.setIsRestricted(false);

        this.registerBotListeners();

        if (!this.dbot.shouldRunBot()) {
            this.unregisterBotListeners();
            return;
        }

        ui.setAccountSwitcherDisabledMessage(
            localize(
                'Account switching is disabled while your bot is running. Please stop your bot before switching accounts.'
            )
        );
        runInAction(() => {
            this.setIsRunning(true);
            ui.setPromptHandler(true, route_prompt_dialog.shouldNavigateAfterPrompt);
            this.toggleDrawer(true);
            this.run_id = `run-${Date.now()}`;

            summary_card.clear();
            this.setContractStage(contract_stages.STARTING);
            this.dbot.runBot();
        });
        this.setShowBotStopMessage(false);
    }

    onStopButtonClick() {
        const { is_multiplier } = this.root_store.summary_card;

        if (is_multiplier) {
            this.showStopMultiplierContractDialog();
        } else {
            this.stopBot();
        }
    }

    onStopBotClick() {
        const { is_multiplier } = this.root_store.summary_card;
        const { summary_card } = this.root_store;

        if (is_multiplier) {
            this.showStopMultiplierContractDialog();
        } else {
            this.stopBot();
            summary_card.clear();
            this.setShowBotStopMessage(true);
        }
    }

    stopBot() {
        const { ui } = this.core;

        this.dbot.stopBot();

        ui.setPromptHandler(false);

        if (this.error_type) {
            // when user click stop button when there is a error but bot is retrying
            this.setContractStage(contract_stages.NOT_RUNNING);
            ui.setAccountSwitcherDisabledMessage(false);
            this.setIsRunning(false);
        } else if (this.has_open_contract) {
            // when user click stop button when bot is running
            this.setContractStage(contract_stages.IS_STOPPING);
        } else {
            // when user click stop button before bot start running
            this.setContractStage(contract_stages.NOT_RUNNING);
            this.unregisterBotListeners();
            ui.setAccountSwitcherDisabledMessage(false);
            this.setIsRunning(false);
        }

        if (this.error_type) {
            this.error_type = undefined;
        }

        if (this.timer) {
            clearInterval(this.timer);
        }
        if (window.sendRequestsStatistic) {
            window.sendRequestsStatistic(true);
            performance.clearMeasures();
        }
    }

    onClearStatClick() {
        this.showClearStatDialog();
    }

    clearStat() {
        const { summary_card, journal, transactions } = this.root_store;

        this.setIsRunning(false);
        this.setHasOpenContract(false);
        this.clear();
        journal.clear();
        summary_card.clear();
        transactions.clear();
        this.setContractStage(contract_stages.NOT_RUNNING);
    }

    toggleStatisticsInfoModal() {
        this.is_statistics_info_modal_open = !this.is_statistics_info_modal_open;
    }

    toggleDrawer(is_open) {
        this.is_drawer_open = is_open;
    }

    setActiveTabIndex(index) {
        this.active_index = index;

        if (this.active_index !== 1) {
            this.root_store.transactions.setActiveTransactionId(null);
        }
    }

    onCloseDialog() {
        this.is_dialog_open = false;
    }

    stopMyBot() {
        const { summary_card, quick_strategy } = this.root_store;
        const { ui } = this.core;
        const { toggleStopBotDialog } = quick_strategy;

        ui.setPromptHandler(false);
        this.dbot.terminateBot();
        this.onCloseDialog();
        summary_card.clear();
        toggleStopBotDialog();
        if (this.timer) {
            clearInterval(this.timer);
        }
        if (window.sendRequestsStatistic) {
            window.sendRequestsStatistic(true);
            performance.clearMeasures();
        }
    }

    closeMultiplierContract() {
        const { quick_strategy } = this.root_store;
        const { toggleStopBotDialog } = quick_strategy;

        this.onClickSell();
        this.stopBot();
        this.onCloseDialog();
        toggleStopBotDialog();
    }

    showStopMultiplierContractDialog() {
        const { summary_card } = this.root_store;
        const { ui } = this.core;

        this.onOkButtonClick = () => {
            ui.setPromptHandler(false);
            this.dbot.terminateBot();
            if (this.timer) {
                clearInterval(this.timer);
            }
            if (window.sendRequestsStatistic) {
                window.sendRequestsStatistic(true);
                performance.clearMeasures();
            }
            this.onCloseDialog();
            summary_card.clear();
        };
        this.onCancelButtonClick = () => {
            this.onClickSell();
            this.stopBot();
            this.onCloseDialog();
        };
        this.dialog_options = {
            title: localize('Keep your current contract?'),
            message: (
                <Localize
                    i18n_default_text='Would you like to keep your current contract or close it? If you decide to keep it running, you can check and close it later on the <0>Reports</0> page.'
                    components={[
                        <a
                            key={0}
                            className='link'
                            rel='noopener noreferrer'
                            target='_blank'
                            href='/reports/positions'
                        />,
                    ]}
                />
            ),
            ok_button_text: localize('Keep my contract'),
            cancel_button_text: localize('Close my contract'),
        };
        this.is_dialog_open = true;
    }

    showLoginDialog() {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title: localize('Please log in'),
            message: localize('You need to log in to run the bot.'),
        };
        this.is_dialog_open = true;
    }

    showRealAccountDialog() {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title: localize("Deriv Bot isn't quite ready for real accounts"),
            message: localize('Please switch to your demo account to run your Deriv Bot.'),
        };
        this.is_dialog_open = true;
    }

    showClearStatDialog() {
        this.onOkButtonClick = () => {
            this.clearStat();
            this.onCloseDialog();
        };
        this.onCancelButtonClick = this.onCloseDialog;
        this.dialog_options = {
            title: localize('Are you sure?'),
            message: localize(
                'This will clear all data in the summary, transactions, and journal panels. All counters will be reset to zero.'
            ),
        };
        this.is_dialog_open = true;
    }

    showIncompatibleStrategyDialog() {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title: localize('Import error'),
            message: localize('This strategy is currently not compatible with Deriv Bot.'),
        };
        this.is_dialog_open = true;
    }

    showContractUpdateErrorDialog(message) {
        this.onOkButtonClick = this.onCloseDialog;
        this.onCancelButtonClick = undefined;
        this.dialog_options = {
            title: localize('Contract Update Error'),
            message: localize(message),
        };
        this.is_dialog_open = true;
    }

    registerBotListeners() {
        const { summary_card, transactions } = this.root_store;

        observer.register('bot.running', this.onBotRunningEvent);
        observer.register('bot.sell', this.onBotSellEvent);
        observer.register('bot.stop', this.onBotStopEvent);
        observer.register('bot.bot_ready', this.onBotReadyEvent);
        observer.register('bot.click_stop', this.onStopButtonClick);
        observer.register('bot.trade_again', this.onBotTradeAgain);
        observer.register('contract.status', this.onContractStatusEvent);
        observer.register('bot.contract', this.onBotContractEvent);
        observer.register('bot.contract', summary_card.onBotContractEvent);
        observer.register('bot.contract', transactions.onBotContractEvent);
        observer.register('Error', this.onError);
    }

    registerReactions() {
        const { client, common, notifications } = this.core;

        const registerIsSocketOpenedListener = () => {
            if (common.is_socket_opened) {
                this.disposeIsSocketOpenedListener = reaction(
                    () => client.loginid,
                    loginid => {
                        if (loginid && this.is_running) {
                            notifications.addNotificationMessage(switch_account_notification);
                        }
                        this.dbot.terminateBot();
                        this.unregisterBotListeners();
                    }
                );
            } else if (typeof this.disposeLogoutListener === 'function') {
                this.disposeLogoutListener();
            }
        };

        registerIsSocketOpenedListener();

        this.disposeLogoutListener = reaction(
            () => common.is_socket_opened,
            () => registerIsSocketOpenedListener()
        );

        this.disposeStopBotListener = reaction(
            () => !this.is_running,
            () => {
                if (!this.is_running) this.setContractStage(contract_stages.NOT_RUNNING);
            }
        );

        return () => {
            if (typeof this.disposeIsSocketOpenedListener === 'function') {
                this.disposeIsSocketOpenedListener();
            }

            if (typeof this.disposeLogoutListener === 'function') {
                this.disposeLogoutListener();
            }

            if (typeof this.disposeStopBotListener === 'function') {
                this.disposeStopBotListener();
            }
        };
    }

    onBotRunningEvent() {
        this.setHasOpenContract(true);

        // prevent new version update
        const ignore_new_version = new Event('IgnorePWAUpdate');
        document.dispatchEvent(ignore_new_version);
        const { self_exclusion } = this.root_store;

        if (self_exclusion.should_bot_run && self_exclusion.run_limit !== -1) {
            self_exclusion.run_limit -= 1;
            if (self_exclusion.run_limit < 0) {
                this.onStopButtonClick();
            }
        }
    }

    onBotSellEvent() {
        this.is_sell_requested = true;
    }

    onBotStopEvent() {
        const { self_exclusion, summary_card } = this.root_store;
        const { ui } = this.core;
        const indicateBotStopped = () => {
            this.error_type = undefined;
            this.setContractStage(contract_stages.NOT_RUNNING);
            ui.setAccountSwitcherDisabledMessage(false);
            this.unregisterBotListeners();
            self_exclusion.resetSelfExclusion();
        };
        if (this.error_type === error_types.RECOVERABLE_ERRORS) {
            // Bot should indicate it started in below cases:
            // - When error happens it's a recoverable error
            const { shouldRestartOnError, timeMachineEnabled } = this.dbot.interpreter.bot.tradeEngine.options;
            const is_bot_recoverable = shouldRestartOnError || timeMachineEnabled;

            if (is_bot_recoverable) {
                this.error_type = undefined;
                this.setContractStage(contract_stages.PURCHASE_SENT);
            } else {
                this.setIsRunning(false);
                indicateBotStopped();
            }
        } else if (this.error_type === error_types.UNRECOVERABLE_ERRORS) {
            // Bot should indicate it stopped in below cases:
            // - When error happens and it's an unrecoverable error
            this.setIsRunning(false);
            indicateBotStopped();
        } else if (this.has_open_contract) {
            // Bot should indicate the contract is closed in below cases:
            // - When bot was running and an error happens
            this.error_type = undefined;
            this.is_sell_requested = false;
            this.setContractStage(contract_stages.CONTRACT_CLOSED);
            ui.setAccountSwitcherDisabledMessage(false);
            this.unregisterBotListeners();
            self_exclusion.resetSelfExclusion();
        }

        this.setHasOpenContract(false);

        summary_card.clearContractUpdateConfigValues();

        // listen for new version update
        const listen_new_version = new Event('ListenPWAUpdate');
        document.dispatchEvent(listen_new_version);
    }

    onBotReadyEvent() {
        this.setIsRunning(false);
        observer.unregisterAll('bot.bot_ready');
    }

    onBotTradeAgain(is_trade_again) {
        if (!is_trade_again) {
            this.stopBot();
        }
    }

    onContractStatusEvent(contract_status) {
        switch (contract_status.id) {
            case 'contract.purchase_sent': {
                this.setContractStage(contract_stages.PURCHASE_SENT);
                break;
            }
            case 'contract.purchase_received': {
                this.setContractStage(contract_stages.PURCHASE_RECEIVED);

                // Close transaction-specific popover, if any.
                this.root_store.transactions.setActiveTransactionId(null);

                const { buy } = contract_status;
                const { is_virtual } = this.core.client;

                if (!is_virtual) {
                    this.core.gtm.pushDataLayer({ event: 'dbot_purchase', buy_price: buy.buy_price });
                }

                break;
            }
            case 'contract.sold': {
                this.is_sell_requested = false;
                this.setContractStage(contract_stages.CONTRACT_CLOSED);
                break;
            }
            default:
                break;
        }
    }

    onClickSell() {
        const { is_multiplier } = this.root_store.summary_card;

        if (is_multiplier) {
            this.setContractStage(contract_stages.IS_STOPPING);
        }

        this.dbot.interpreter.bot.getInterface().sellAtMarket();
    }

    clear = () => {
        observer.emit('statistics.clear');
    };

    onBotContractEvent(data) {
        if (data?.is_sold) {
            this.is_sell_requested = false;
            this.setContractStage(contract_stages.CONTRACT_CLOSED);
        }
    }

    onError(data) {
        // data.error for API errors, data for code errors
        const error = data.error || data;
        if (unrecoverable_errors.includes(error.code)) {
            this.root_store.summary_card.clear();
            this.error_type = error_types.UNRECOVERABLE_ERRORS;
        } else {
            this.error_type = error_types.RECOVERABLE_ERRORS;
        }

        const error_message = error?.message;
        this.showErrorMessage(error_message);
    }

    showErrorMessage(data) {
        const { journal } = this.root_store;
        const { notifications, ui } = this.core;
        journal.onError(data);
        if (journal.journal_filters.some(filter => filter === message_types.ERROR)) {
            this.toggleDrawer(true);
            this.setActiveTabIndex(run_panel.JOURNAL);
            ui.setPromptHandler(false);
        } else {
            notifications.addNotificationMessage(journalError(this.switchToJournal));
            notifications.removeNotificationMessage({ key: 'bot_error' });
        }
    }

    switchToJournal() {
        const { journal } = this.root_store;
        const { notifications } = this.core;
        journal.journal_filters.push(message_types.ERROR);
        this.setActiveTabIndex(run_panel.JOURNAL);
        this.toggleDrawer(true);
        notifications.toggleNotificationsModal();
        notifications.removeNotificationByKey({ key: 'bot_error' });
    }

    unregisterBotListeners = () => {
        observer.unregisterAll('bot.running');
        observer.unregisterAll('bot.stop');
        observer.unregisterAll('bot.click_stop');
        observer.unregisterAll('bot.trade_again');
        observer.unregisterAll('contract.status');
        observer.unregisterAll('bot.contract');
        observer.unregisterAll('Error');
    };

    setContractStage(contract_stage) {
        this.contract_stage = contract_stage;
    }

    setHasOpenContract(has_open_contract) {
        this.has_open_contract = has_open_contract;
    }

    setIsRunning(is_running) {
        this.is_running = is_running;
    }

    onMount() {
        const { journal } = this.root_store;
        observer.register('ui.log.error', this.showErrorMessage);
        observer.register('ui.log.notify', journal.onNotify);
        observer.register('ui.log.success', journal.onLogSuccess);
        observer.register('client.invalid_token', this.handleInvalidToken);
    }

    onUnmount() {
        const { journal, summary_card, transactions } = this.root_store;

        if (!this.is_running) {
            this.unregisterBotListeners();
            this.disposeReactionsFn();
            journal.disposeReactionsFn();
            summary_card.disposeReactionsFn();
            transactions.disposeReactionsFn();
        }

        observer.unregisterAll('ui.log.error');
        observer.unregisterAll('ui.log.notify');
        observer.unregisterAll('ui.log.success');
        observer.unregisterAll('client.invalid_token');
    }

    async handleInvalidToken() {
        const { client } = this.core;
        await client.logout();
        this.setActiveTabIndex(run_panel.SUMMARY);
    }

    preloadAudio() {
        const strategy_sounds = this.dbot.getStrategySounds();

        strategy_sounds.forEach(sound => {
            const audioElement = document.getElementById(sound);

            audioElement.muted = true;
            audioElement.play().catch(() => {
                // suppressing abort error, thrown on immediate .pause()
            });
            audioElement.pause();
            audioElement.muted = false;
        });
    }
}
