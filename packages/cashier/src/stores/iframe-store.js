import { action, observable, makeObservable } from 'mobx';
import Constants from 'Constants/constants';

export default class IframeStore {
    constructor({ WS, root_store }) {
        makeObservable(this, {
            iframe_height: observable,
            iframe_url: observable,
            is_session_timeout: observable,
            timeout_session: observable,
            setSessionTimeout: action.bound,
            checkIframeLoaded: action.bound,
            clearTimeoutCashierUrl: action.bound,
            setTimeoutCashierUrl: action.bound,
            setIframeUrl: action.bound,
            setContainerHeight: action.bound,
            clearIframe: action.bound,
        });

        this.root_store = root_store;
        this.WS = WS;
    }

    iframe_height = 0;
    iframe_url = '';
    is_session_timeout = true;

    onIframeLoaded = '';
    timeout_session = '';

    setSessionTimeout(is_session_time_out) {
        this.is_session_timeout = is_session_time_out;
        if (is_session_time_out) {
            this.removeOnIframeLoaded();
        }
    }

    async checkIframeLoaded() {
        const { modules, ui } = this.root_store;

        this.removeOnIframeLoaded();
        this.onIframeLoaded = function (e) {
            if (/cashier|doughflow/.test(e.origin)) {
                modules.cashier.general_store.setLoading(false);
                // set the height of the container after content loads so that the
                // loading bar stays vertically centered until the end
                if (ui.is_mobile) {
                    this.setContainerHeight(window.innerHeight - 100);
                } else {
                    this.setContainerHeight(window.innerHeight - 190);
                }
                // do not remove the listener
                // on every iframe screen change we need to update the height to more/less to match the new content
            }
        }.bind(this);
        window.addEventListener('message', this.onIframeLoaded, false);
    }

    removeOnIframeLoaded() {
        if (this.onIframeLoaded) {
            window.removeEventListener('message', this.onIframeLoaded, false);
            this.onIframeLoaded = '';
        }
    }

    clearTimeoutCashierUrl() {
        if (this.timeout_session) {
            clearTimeout(this.timeout_session);
        }
    }

    setTimeoutCashierUrl() {
        this.clearTimeoutCashierUrl();
        this.timeout_session = setTimeout(() => {
            this.setSessionTimeout(true);
        }, 60000);
    }

    setIframeUrl(url, container = this.root_store.modules.cashier.general_store.active_container) {
        const { client, ui } = this.root_store;

        if (url) {
            this.iframe_url = `${url}&theme=${ui.is_dark_mode_on ? 'dark' : 'light'}`;
            // after we set iframe url we can clear verification code
            client.setVerificationCode('', Constants.map_action[container]);
        } else {
            this.iframe_url = url;
        }
    }

    setContainerHeight(height) {
        this.iframe_height = height;
    }

    clearIframe() {
        this.setContainerHeight(0);
        this.setIframeUrl('');
        this.clearTimeoutCashierUrl();
        this.setSessionTimeout(true);
    }
}
