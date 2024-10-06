import { action, makeObservable, observable } from 'mobx';
import Constants from '../constants/constants';
import { TRootStore } from '../types';

type TOnIframeLoadedCallback = (ev: MessageEvent) => void;

export default class IframeStore {
    constructor(public root_store: TRootStore) {
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
    }

    iframe_height = 0;
    iframe_url = '';
    is_session_timeout = true;
    onIframeLoaded: TOnIframeLoadedCallback | null = null;
    timeout_session: NodeJS.Timeout | null = null;

    setSessionTimeout(is_session_time_out: boolean): void {
        this.is_session_timeout = is_session_time_out;
        if (is_session_time_out) {
            this.removeOnIframeLoaded();
        }
    }

    async checkIframeLoaded(): Promise<void> {
        const { modules, ui } = this.root_store;
        const { is_mobile } = ui;

        this.removeOnIframeLoaded();

        const trusted_origins = ['https://cashier.deriv.com', 'https://doughflow-test.4x.my'];

        this.onIframeLoaded = (e: MessageEvent) => {
            if (trusted_origins.includes(e.origin)) {
                modules.cashier.general_store.setLoading(false);
                // set the height of the container after content loads so that the
                // loading bar stays vertically centered until the end
                if (is_mobile) {
                    this.setContainerHeight(window.innerHeight - 100);
                } else {
                    this.setContainerHeight(window.innerHeight - 190);
                }
                // do not remove the listener
                // on every iframe screen change we need to update the height to more/less to match the new content
            }
        };
        window.addEventListener('message', this.onIframeLoaded, false);
    }

    removeOnIframeLoaded(): void {
        if (this.onIframeLoaded) {
            window.removeEventListener('message', this.onIframeLoaded, false);
            this.onIframeLoaded = null;
        }
    }

    clearTimeoutCashierUrl(): void {
        if (this.timeout_session) {
            clearTimeout(this.timeout_session);
        }
    }

    setTimeoutCashierUrl(is_withdrawal?: boolean): void {
        this.clearTimeoutCashierUrl();
        if (is_withdrawal) {
            this.timeout_session = setTimeout(() => {
                this.setSessionTimeout(true);
            }, 60000);
        }
    }

    setIframeUrl(url?: string): void {
        const { client } = this.root_store;

        if (url) {
            this.iframe_url = url;

            const container = this.root_store.modules.cashier.general_store.active_container;

            if (container in Constants.map_action) {
                const container_key = container as keyof typeof Constants.map_action;

                // after we set iframe url we can clear verification code
                client.setVerificationCode('', Constants.map_action[container_key]);
            }
        } else {
            this.iframe_url = '';
        }
    }

    setContainerHeight(height: number): void {
        this.iframe_height = height;
    }

    clearIframe(): void {
        this.setContainerHeight(0);
        this.setIframeUrl('');
        this.clearTimeoutCashierUrl();
        this.setSessionTimeout(true);
    }
}
