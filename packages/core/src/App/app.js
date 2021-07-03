import { configure } from 'mobx';

import NetworkMonitor from 'Services/network-monitor';
// import OutdatedBrowser      from 'Services/outdated-browser';
import RootStore from 'Stores';
import CommonResources from 'Services/common-resources';

configure({ enforceActions: 'observed' });

const setStorageEvents = root_store => {
    window.addEventListener('storage', evt => {
        switch (evt.key) {
            case 'client.accounts': {
                const active_loginid = root_store.client.loginid;
                const new_currency = JSON.parse(evt.newValue)[active_loginid]?.currency;
                const old_currency = JSON.parse(evt.oldValue)[active_loginid]?.currency;

                if (document.hidden && new_currency && old_currency !== new_currency) {
                    root_store.client.updateAccountCurrency(new_currency, false);
                }
                break;
            }
            case 'active_loginid':
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
    CommonResources.init(root_store);

    // TODO: Re-enable and update browser checking
    // OutdatedBrowser.init(root_store);!
    root_store.client.init();
    root_store.ui.init(notification_messages);
    root_store.pushwoosh.init();

    return root_store;
};

export default initStore;
