import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { reaction } from 'mobx';
import { Analytics } from '@deriv-com/analytics';
import { Loading } from '@deriv/components';
import { useP2PCompletedOrdersNotification, useP2PSettings, useGrowthbookGetFeatureValue } from '@deriv/hooks';
import { isEmptyObject, routes, WS } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { getLanguage } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
// import { URLConstants } from '@deriv-com/utils';
import { init } from 'Utils/server_time';
import { waitWS } from 'Utils/websocket';
import { useStores } from 'Stores';
import AppContent from 'Components/app-content.jsx';
import { setLanguage } from 'Components/i18next';
import { ModalManager, ModalManagerContextProvider } from 'Components/modal-manager';
import Routes from 'Components/routes';
import './app.scss';

const App = () => {
    const is_production = process.env.NODE_ENV === 'production';
    const [is_p2p_standalone_enabled, isGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'p2p_standalone_enabled',
        defaultValue: false,
    });
    const { notifications, client, ui, common, modules } = useStore();
    const { balance, currency, is_logging_in, loginid } = client;
    const { setOnRemount } = modules?.cashier?.general_store;

    const { isDesktop } = useDevice();
    const { setP2POrderProps, setP2PRedirectTo } = notifications;

    const history = useHistory();
    const location = useLocation();

    const { buy_sell_store, general_store, order_store } = useStores();
    const { p2p_settings, subscribe } = useP2PSettings();

    const lang = getLanguage();

    const [order_id, setOrderId] = React.useState(null);
    const [action_param, setActionParam] = React.useState();
    const [code_param, setCodeParam] = React.useState();
    useP2PCompletedOrdersNotification();

    // TODO: This will redirect the internal users to the standalone application temporarily. Remove this once the standalone application is ready.
    React.useEffect(() => {
        if (isGBLoaded) {
            if (is_p2p_standalone_enabled) {
                // window.location.href = is_production ? URLConstants.derivP2pProduction : URLConstants.derivP2pStaging;
                window.location.href = 'http://localhost:5173';
            }
        }
    }, [isGBLoaded, is_p2p_standalone_enabled, is_production]);

    React.useEffect(() => {
        init();
        general_store.setListItemLimit(isDesktop ? 10 : 50);

        general_store.setExternalStores({ client, common, modules, notifications, ui });
        general_store.setWebsocketInit(WS);
        subscribe();

        setP2PRedirectTo({
            routeToMyProfile: () => {
                history.push(routes.p2p_my_profile);
                general_store.setActiveIndex(3);
            },
        });

        // Check if advertiser info has been subscribed to before the user navigates to
        // /advertiser?=id{counterparty_advertiser_id} from the url
        const disposeAdvertiserInfoSubscribedReaction = reaction(
            () => general_store.is_advertiser_info_subscribed && general_store.counterparty_advertiser_id,
            () => {
                if (
                    /\/advertiser$/.test(location.pathname) &&
                    general_store.is_advertiser_info_subscribed &&
                    general_store.counterparty_advertiser_id
                ) {
                    buy_sell_store.setShowAdvertiserPage(true);
                    history.push({
                        pathname: routes.p2p_advertiser_page,
                        search: `?id=${general_store.counterparty_advertiser_id}`,
                    });
                }
            }
        );

        // Redirect back to /p2p, this was implemented for the mobile team. Do not remove.
        if (/\/verification$/.test(location.pathname)) {
            localStorage.setItem('is_verifying_p2p', true);
            history.push(routes.p2p_my_profile);
        }

        // force safari refresh on back/forward
        window.onpageshow = function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        };
        waitWS('authorize').then(() => {
            general_store.onMount();
            setOnRemount(general_store.onMount);
            if (localStorage.getItem('is_verifying_p2p')) {
                localStorage.removeItem('is_verifying_p2p');
                general_store.setActiveIndex(general_store.path.my_ads);
            }
        });

        // Redirect to the correct tab based on the url on page load
        if (/\/orders$/.test(location.pathname)) {
            history.push(routes.p2p_orders);
            general_store.setActiveIndex(1);
        } else if (/\/my-ads$/.test(location.pathname)) {
            history.push(routes.p2p_my_ads);
            general_store.setActiveIndex(2);
        } else if (/\/my-profile$/.test(location.pathname)) {
            history.push(routes.p2p_my_profile);
            general_store.setActiveIndex(3);
        } else if (/\/advertiser$/.test(location.pathname)) {
            if (location.search || general_store.counterparty_advertiser_id) {
                const url_params = new URLSearchParams(location.search);
                const id = url_params.get('id');
                const advert_id = url_params.get('advert_id');

                general_store.setCounterpartyAdvertiserId(id);

                if (advert_id) {
                    general_store.setCounterpartyAdvertId(advert_id);
                    history.replace({
                        pathname: routes.p2p_advertiser_page,
                        search: `?id=${id}&advert_id=${advert_id}`,
                    });
                } else {
                    // DO NOT REMOVE. This will prevent the page from redirecting to buy sell on reload from advertiser page
                    // as it resets the URL search params
                    history.replace({ pathname: routes.p2p_advertiser_page, search: `?id=${id}` });
                }
            } else {
                history.push(routes.p2p_buy_sell);
            }
        }

        return () => {
            general_store.onUnmount();
            disposeAdvertiserInfoSubscribedReaction();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (!isEmptyObject(p2p_settings)) {
            p2p_settings.currency_list.forEach(currency => {
                const { is_default, value } = currency;

                if (is_default && !buy_sell_store.selected_local_currency) {
                    buy_sell_store.setSelectedLocalCurrency(value);
                    buy_sell_store.setLocalCurrency(value);
                }
            });
        }
    }, [p2p_settings]);

    // Redirect to /p2p/buy-sell if user navigates to /p2p without a subroute
    React.useEffect(() => {
        if (/\/p2p$/.test(location.pathname) || location.pathname === '/cashier/p2p/') {
            history.push(routes.p2p_buy_sell);
            general_store.setActiveIndex(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    React.useEffect(() => {
        const url_params = new URLSearchParams(location.search);

        let passed_order_id;

        setActionParam(url_params.get('action'));

        if (!isDesktop) {
            setCodeParam(localStorage.getItem('verification_code.p2p_order_confirm'));
        } else if (!code_param) {
            if (url_params.has('code')) {
                setCodeParam(url_params.get('code'));
            } else if (localStorage.getItem('verification_code.p2p_order_confirm')) {
                setCodeParam(localStorage.getItem('verification_code.p2p_order_confirm'));
            }
        }

        // Different emails give us different params (order / order_id),
        // don't remove order_id since it's consistent for mobile and web for 2FA
        if (url_params.has('order_id')) {
            passed_order_id = url_params.get('order_id');
        } else if (url_params.has('order')) {
            passed_order_id = url_params.get('order');
        }

        if (passed_order_id) {
            setQueryOrder(passed_order_id);
        }

        return () => setQueryOrder(null);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setQueryOrder]);

    React.useEffect(() => {
        if (loginid && currency) {
            Analytics.trackEvent('ce_cashier_deposit_onboarding_form', {
                action: 'open_deposit_subpage',
                form_name: 'ce_cashier_deposit_onboarding_form',
                deposit_category: 'p2p',
                currency,
                login_id: loginid,
            });
        }
    }, [currency, loginid]);

    const setQueryOrder = React.useCallback(
        input_order_id => {
            const current_query_params = new URLSearchParams(location.search);

            if (!isDesktop) {
                current_query_params.delete('action');
                current_query_params.delete('code');
            }

            if (current_query_params.has('order_id') || current_query_params.has('order')) {
                current_query_params.delete('order');
                current_query_params.delete('order_id');
            }

            if (input_order_id) {
                current_query_params.append('order', input_order_id);
            }

            if (!input_order_id) {
                history.replace({
                    search: '',
                    hash: location.hash,
                });

                setOrderId(null);
            } else if (order_id !== input_order_id) {
                // Changing query params
                history.push({
                    pathname: routes.p2p_orders,
                    search: current_query_params.toString(),
                    hash: location.hash,
                });

                setOrderId(input_order_id);
            }
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [history, location.hash, location.search]
    );

    React.useEffect(() => {
        setLanguage(lang);
    }, [lang]);

    const navigateToOrderDetails = id => {
        history.push({ pathname: routes.p2p_orders, search: `?order=${id}` });
    };

    React.useEffect(() => {
        if (order_id) {
            general_store.redirectTo('orders');
            order_store.setOrderId(order_id);
        }
        setP2POrderProps({
            order_id,
            redirectToOrderDetails: general_store.redirectToOrderDetails,
            setP2POrderTab: general_store.setP2POrderTab,
            setIsRatingModalOpen: is_open =>
                is_open ? general_store.showModal({ key: 'RatingModal' }) : general_store.hideModal(),
            navigateToOrderDetails,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    React.useEffect(() => {
        general_store.setAccountBalance(balance);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [balance]);

    React.useEffect(() => {
        if (action_param && code_param) {
            // We need an extra state since we delete the code from the query params.
            // Do not remove.
            order_store.setVerificationCode(code_param);
            order_store.setActionParam(action_param);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action_param, code_param]);

    if (is_logging_in || general_store.is_loading || is_p2p_standalone_enabled) {
        return <Loading className='p2p__loading' />;
    }

    return (
        <main className='p2p'>
            <ModalManagerContextProvider>
                <ModalManager />
                <AppContent order_id={order_id} />
                <Routes />
            </ModalManagerContextProvider>
        </main>
    );
};

export default observer(App);
