import { configure } from 'mobx';
import { CashierStore } from '@deriv/cashier';
import { CFDStore } from '@deriv/cfd';
import NetworkMonitor from 'Services/network-monitor';
import WS from 'Services/ws-methods';
import RootStore from 'Stores';

configure({ enforceActions: 'observed' });

const setStorageEvents = root_store => {
    window.addEventListener('storage', evt => {
        switch (evt.key) {
            case 'client.accounts': {
                const active_loginid = root_store.client.loginid;
                const new_currency = JSON.parse(evt.newValue)?.[active_loginid]?.currency;
                const old_currency = JSON.parse(evt.oldValue)?.[active_loginid]?.currency;

                if (document.hidden && new_currency && old_currency !== new_currency) {
                    root_store.client.updateAccountCurrency(new_currency, false);
                }
                break;
            }
            case 'active_loginid':
                if (localStorage.getItem('active_loginid') === 'null' || !localStorage.getItem('active_loginid')) {
                    root_store.client.logout();
                }
                if (document.hidden) {
                    window.location.reload();
                }
                break;
            case 'reality_check_dismissed':
                if (document.hidden) {
                    // if new value is true, hide reality check, otherwise show it
                    root_store.client.setVisibilityRealityCheck(!JSON.parse(evt.newValue));
                }
                break;
            // no default
        }
    });
};

const initStore = notification_messages => {
    // Check Endpoint from URL need to be done before initializing store to avoid
    // race condition with setting up user session from URL
    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);
    if (url_params.get('action') === 'signup') {
        // If a user comes from the signup process,
        // we need to give him a clean setup
        const server_url = localStorage.getItem('config.server_url');
        const app_id = localStorage.getItem('config.app_id');

        localStorage.clear();

        if (server_url) localStorage.setItem('config.server_url', server_url);
        if (app_id) localStorage.setItem('config.app_id', app_id);
    }

    const root_store = new RootStore();

    setStorageEvents(root_store);

    NetworkMonitor.init(root_store);

    root_store.client.init();
    root_store.common.init();
    root_store.pushwoosh.init();
    root_store.ui.init(notification_messages);
    root_store.modules.attachModule('cashier', new CashierStore(root_store, WS));
    root_store.modules.cashier.general_store.init();
    root_store.modules.attachModule('cfd', new CFDStore({ root_store, WS }));
    root_store.common.setPlatform();

    return root_store;
};

export default initStore;
