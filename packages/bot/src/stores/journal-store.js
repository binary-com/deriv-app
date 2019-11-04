import {
    observable,
    action }                     from 'mobx';
import { formatDate }            from 'deriv-shared/utils/date';
import { observer }              from '../utils/observer';
import {
    message_types,
    unrecoverable_errors }        from '../constants/message-types';

export default class JournalStore {
    constructor(root_store) {
        this.root_store = root_store;

        observer.register('ui.log.success', this.onLogSuccess);
        observer.register('ui.log.error', this.onError);
        observer.register('Error', this.onError);
        observer.register('Notify', this.onNotify);
    }

    get serverTime () {
        return this.root_store.core.common.server_time;
    }

    @observable messages = [];

    @action.bound
    onLogSuccess(data) {
        this.pushMessage(data, message_types.success);
    }

    @action.bound
    onError(data) {
        if (unrecoverable_errors.includes(data.name)) {
            this.root_store.contract_card.clear();
            this.root_store.run_panel.is_continue_trading = false;
        } else {
            this.root_store.run_panel.is_continue_trading = true;
        }
        this.root_store.run_panel.setActiveTabIndex(2);
        this.root_store.run_panel.is_error_happened = true;
        this.pushMessage(data , message_types.error);
    }

    @action.bound
    onNotify(data) {
        this.pushMessage(data , message_types.notify);
    }

    @action.bound
    clear() {
        this.messages = this.messages.slice(0, 0);  // force array update
    }
    
    @action.bound
    pushMessage(data, message_type) {
        const date = formatDate(this.serverTime.get());
        const time = formatDate(this.serverTime.get(), 'HH:mm:ss [GMT]');
        let message;
        if (typeof data === 'string') {
            message = `${data}`;
        } else {
            message = `${data.message}`;
        }

        this.messages.unshift({ date, time , message ,message_type });
        this.messages = this.messages.slice(0);  // force array update
    }

    @action.bound
    onUnmount() {
        // TODO unregister is not working
        observer.unregister('ui.log.success', this.onLogSuccess);
        observer.unregister('ui.log.error', this.onLogError);
        observer.unregister('Error', this.onLogError);
        observer.unregister('Notify', this.onNotify);
    }
}
