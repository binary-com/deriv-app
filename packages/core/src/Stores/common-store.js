import * as SocketCache from '_common/base/socket_cache';
import { action, computed, makeObservable, observable } from 'mobx';
import { changeLanguage } from '@deriv/translations';
import { getAllowedLanguages } from '@deriv-com/translations';
import {
    UNSUPPORTED_LANGUAGES,
    getAppId,
    getUrlSmartTrader,
    initMoment,
    setLocale,
    isMobile,
    platforms,
    routes,
    toMoment,
} from '@deriv/shared';
import BaseStore from './base-store';
import BinarySocket from '_common/base/socket_base';
import ServerTime from '_common/base/server_time';
import WS from 'Services/ws-methods';
import { currentLanguage } from 'Utils/Language/index';

export default class CommonStore extends BaseStore {
    constructor(root_store) {
        super({ root_store });

        makeObservable(this, {
            addRouteHistoryItem: action.bound,
            allowed_languages: observable,
            app_id: observable,
            app_router: observable,
            app_routing_history: observable,
            changeCurrentLanguage: action.bound,
            changeSelectedLanguage: action.bound,
            changing_language_timer_id: observable,
            checkAppId: action.bound,
            current_language: observable,
            deposit_url: observable,
            error: observable,
            has_error: observable,
            init: action.bound,
            is_from_derivgo: computed,
            is_language_changing: observable,
            is_network_online: observable,
            is_socket_opened: observable,
            network_status: observable,
            platform: observable,
            routeBackInApp: action.bound,
            routeTo: action.bound,
            selected_contract_type: observable,
            server_time: observable,
            services_error: observable,
            setAppRouterHistory: action.bound,
            setAppstorePlatform: action.bound,
            setDepositURL: action.bound,
            setError: action.bound,
            setInitialRouteHistoryItem: action.bound,
            setIsSocketOpened: action.bound,
            setNetworkStatus: action.bound,
            setPlatform: action.bound,
            setSelectedContractType: action.bound,
            setServerTime: action.bound,
            setServicesError: action.bound,
            resetServicesError: action.bound,
            setWithdrawURL: action.bound,
            showError: action.bound,
            was_socket_opened: observable,
            withdraw_url: observable,
        });
    }

    allowed_languages = Object.keys(getAllowedLanguages(UNSUPPORTED_LANGUAGES));
    app_id = undefined;
    app_router = { history: null };
    app_routing_history = [];
    changing_language_timer_id = '';
    current_language = currentLanguage;
    deposit_url = '';
    has_error = false;
    is_language_changing = false;
    is_network_online = false;
    is_socket_opened = false;
    error = {
        type: 'info',
        message: '',
    };
    network_status = {};
    platform = '';
    selected_contract_type = '';
    server_time = ServerTime.get() || toMoment(); // fallback: get current time from moment.js
    services_error = {};
    was_socket_opened = false;
    withdraw_url = '';

    setSelectedContractType(contract_type) {
        this.selected_contract_type = contract_type;
    }

    init() {
        this.setPlatform();
    }

    checkAppId() {
        if (this.app_id && this.app_id !== getAppId()) {
            BinarySocket.closeAndOpenNewConnection();
        }
        this.app_id = getAppId();
    }

    changeCurrentLanguage(new_language) {
        if (this.current_language !== new_language) {
            if (this.changing_language_timer_id) clearTimeout(this.changing_language_timer_id);
            this.current_language = new_language;
            this.is_language_changing = true;
            this.changing_language_timer_id = setTimeout(() => {
                this.is_language_changing = false;
            }, 2500);
        }
    }

    changeSelectedLanguage = async key => {
        SocketCache.clear();
        if (key === 'EN') {
            window.localStorage.setItem('i18n_language', key);
        }
        await WS?.wait('authorize');
        return new Promise((resolve, reject) => {
            WS.setSettings({
                set_settings: 1,
                preferred_language: key,
            }).then(async () => {
                const new_url = new URL(window.location.href);
                if (key === 'EN') {
                    new_url.searchParams.delete('lang');
                } else {
                    new_url.searchParams.set('lang', key);
                }
                window.history.pushState({ path: new_url.toString() }, '', new_url.toString());
                try {
                    await initMoment(key);
                    await setLocale(key);
                    await changeLanguage(key, () => {
                        this.changeCurrentLanguage(key);
                        BinarySocket.closeAndOpenNewConnection(key);
                        this.root_store.client.setIsAuthorize(false);
                    });
                    resolve();
                } catch (e) {
                    reject();
                }
            });
        });
    };

    setAppstorePlatform(platform) {
        this.platform = platform;
    }

    setPlatform() {
        const search = window.location.search;
        if (search) {
            const url_params = new URLSearchParams(search);
            const platform = url_params.get('platform');
            if (platform) {
                this.platform = platform;
                window.sessionStorage.setItem('config.platform', this.platform);
            }
        }
    }

    get is_from_derivgo() {
        return platforms[this.platform]?.platform_name === platforms.derivgo.platform_name;
    }

    // eslint-disable-next-line class-methods-use-this
    get is_from_outside_cashier() {
        return !window.location.pathname.startsWith(routes.cashier);
    }

    setInitialRouteHistoryItem(location) {
        if (window.location.href.indexOf('?ext_platform_url=') !== -1) {
            const ext_url = decodeURI(new URL(window.location.href).searchParams.get('ext_platform_url'));
            const { setExternalParams } = this.root_store.client;
            setExternalParams({
                url: ext_url,
                should_redirect: true,
            });
            if (ext_url?.indexOf(getUrlSmartTrader()) === 0) {
                this.addRouteHistoryItem({ pathname: ext_url, action: 'PUSH', is_external: true });
            } else if (ext_url?.indexOf(routes.cashier_p2p) === 0) {
                this.addRouteHistoryItem({ pathname: ext_url, action: 'PUSH' });
            } else {
                this.addRouteHistoryItem({ ...location, action: 'PUSH' });
            }

            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            this.addRouteHistoryItem({ ...location, action: 'PUSH' });
        }
    }

    setServerTime(server_time) {
        this.server_time = server_time;
    }

    setIsSocketOpened(is_socket_opened) {
        // note that it's not for account switch that we're doing this,
        // but rather to reset account related stores like portfolio and contract-trade
        const should_broadcast_account_change = this.was_socket_opened && is_socket_opened;

        this.is_socket_opened = is_socket_opened;
        this.was_socket_opened = this.was_socket_opened || is_socket_opened;

        if (should_broadcast_account_change) {
            this.root_store.client.broadcastAccountChangeAfterAuthorize();
        }
    }

    setNetworkStatus(status, is_online) {
        if (this.network_status.class) {
            this.network_status.class = status.class;
            this.network_status.tooltip = status.tooltip;
        } else {
            this.network_status = status;
        }
        this.is_network_online = is_online;

        const { addNotificationMessage, client_notifications, removeNotificationMessage } =
            this.root_store.notifications;
        if (!is_online) {
            addNotificationMessage(client_notifications.you_are_offline);
        } else {
            removeNotificationMessage(client_notifications.you_are_offline);
        }
    }

    setError(has_error, error) {
        this.has_error = has_error;
        this.error = {
            type: error ? error.type : 'info',
            ...(error && {
                header: error.header,
                message: error.message,
                redirect_label: error.redirect_label,
                redirectOnClick: error.redirectOnClick,
                should_show_refresh: error.should_show_refresh,
                redirect_to: error.redirect_to,
                should_clear_error_on_click: error.should_clear_error_on_click,
                should_redirect: error.should_redirect,
                setError: this.setError,
            }),
        };
    }

    showError({
        message,
        header,
        redirect_label,
        redirectOnClick,
        should_show_refresh,
        redirect_to,
        should_clear_error_on_click,
        should_redirect,
    }) {
        this.setError(true, {
            header,
            message,
            redirect_label,
            redirectOnClick,
            should_show_refresh,
            redirect_to,
            should_clear_error_on_click,
            type: 'error',
            should_redirect,
        });
    }

    setDepositURL(deposit_url) {
        this.deposit_url = deposit_url;
    }

    setWithdrawURL(withdraw_url) {
        this.withdraw_url = withdraw_url;
    }
    resetServicesError() {
        this.services_error = {};
    }
    setServicesError(error, hide_toast = false) {
        this.services_error = error;
        if (isMobile()) {
            if (error.code === 'CompanyWideLimitExceeded' || error.code === 'PleaseAuthenticate') {
                this.root_store.ui.toggleServicesErrorModal(true);
            } else if (!hide_toast) {
                this.root_store.ui.addToast({
                    content: error.message,
                    type: 'error',
                });
            }
        } else {
            this.root_store.ui.toggleServicesErrorModal(true);
        }
    }

    setAppRouterHistory(history) {
        this.app_router.history = history;
    }

    routeTo(pathname) {
        if (this.app_router.history) this.app_router.history.push(pathname);
    }

    addRouteHistoryItem(router_action) {
        const check_existing = this.app_routing_history.findIndex(
            i => i.pathname === router_action.pathname && i.action === 'PUSH'
        );
        if (check_existing > -1) {
            this.app_routing_history.splice(check_existing, 1);
        }
        this.app_routing_history.unshift(router_action);
    }

    isCurrentLanguage = lang => lang === this.current_language;

    routeBackInApp(history, additional_platform_path = []) {
        let route_to_item_idx = -1;
        const route_to_item = this.app_routing_history.find((history_item, idx) => {
            if (history_item.action === 'PUSH') {
                if (history_item.is_external) {
                    return true;
                }

                const parent_path = history_item.pathname.split('/')[1];
                const platform_parent_paths = [routes.mt5, routes.bot, routes.trade, routes.dxtrade].map(
                    i => i.split('/')[1]
                ); // map full path to just base path (`/mt5/abc` -> `mt5`)

                if (
                    platform_parent_paths.includes(parent_path) ||
                    additional_platform_path.includes(history_item.pathname)
                ) {
                    route_to_item_idx = idx;
                    return true;
                }
            }

            return false;
        });

        if (route_to_item) {
            if (route_to_item.is_external) {
                window.location.href = route_to_item.pathname;
                return;
            } else if (route_to_item_idx > -1) {
                this.app_routing_history.splice(0, route_to_item_idx + 1);
                // remove once p2p is ready
                const ui_store = this.root_store.ui;
                if (route_to_item.pathname === routes.cashier_p2p && ui_store.is_mobile)
                    history.push(`${route_to_item.pathname}/verification`);
                else history.push(route_to_item.pathname);
                return;
            }
        }

        history.push(routes.trade);
    }
}
