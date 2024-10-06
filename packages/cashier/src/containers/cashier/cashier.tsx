import React, { useCallback, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Div100vhContainer, FadeWrapper, PageOverlay, VerticalTab, Loading } from '@deriv/components';
import {
    useAuthorize,
    useOnrampVisible,
    useAccountTransferVisible,
    useIsP2PEnabled,
    usePaymentAgentList,
    usePaymentAgentTransferVisible,
    useP2PNotificationCount,
    useP2PSettings,
} from '@deriv/hooks';
import { getSelectedRoute, routes, setPerformanceValue, WS, matchRoute } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import type { TCoreStores } from '@deriv/stores/types';
import { useDevice } from '@deriv-com/ui';
import ErrorDialog from '../../components/error-dialog';
import { TRoute } from '../../types';
import { useCashierStore } from '../../stores/useCashierStores';
import './cashier.scss';

type TCashierProps = RouteComponentProps & {
    routes: TRoute[];
    tab_index: number;
    onMount: (should_remount?: boolean) => void;
    setAccountSwitchListener: () => void;
    setTabIndex: (index: number) => void;
    routeBackInApp: TCoreStores['common']['routeBackInApp'];
    toggleCashier: TCoreStores['ui']['toggleCashier'];
    resetLastLocation: () => void;
};

type TCashierOptions = {
    count?: number;
    default?: boolean;
    icon: string;
    label: string;
    path?: string;
    value?: typeof React.Component;
};

const Cashier = observer(({ history, location, routes: routes_config }: TCashierProps) => {
    const { common, ui, client } = useStore();
    const { isDesktop, isMobile } = useDevice();
    const { withdraw, general_store } = useCashierStore();
    const { error } = withdraw;
    const {
        is_cashier_onboarding,
        is_loading,
        onMountCommon: onMount,
        setAccountSwitchListener,
        setCashierTabIndex: setTabIndex,
        cashier_route_tab_index: tab_index,
        setActiveTab,
    } = general_store;
    const {
        data: is_payment_agent_transfer_visible,
        isLoading: is_payment_agent_transfer_checking,
        isSuccess: is_payment_agent_transfer_visible_is_success,
    } = usePaymentAgentTransferVisible();
    const { current_language, is_from_derivgo } = common;
    const { is_cashier_visible: is_visible, toggleCashier, toggleReadyToDepositModal } = ui;
    const { account_settings, currency, is_account_setting_loaded, is_logged_in, is_logging_in, is_svg, is_virtual } =
        client;
    const {
        data: paymentAgentList,
        isLoading: is_payment_agent_list_loading,
        isSuccess: is_payment_agent_list_success,
    } = usePaymentAgentList(currency);
    const is_payment_agent_visible = paymentAgentList && paymentAgentList.length > 0;
    const is_account_transfer_visible = useAccountTransferVisible();
    const is_onramp_visible = useOnrampVisible();
    const p2p_notification_count = useP2PNotificationCount();
    const {
        subscribe,
        p2p_settings,
        rest: { isSubscribed },
    } = useP2PSettings();
    const { is_p2p_enabled, is_p2p_enabled_success, is_p2p_enabled_loading } = useIsP2PEnabled();
    const { isSuccess } = useAuthorize();

    const onClickClose = () => history.push(routes.traders_hub);
    const getMenuOptions = useMemo(() => {
        const options: TCashierOptions[] = [];
        routes_config.forEach(route => {
            if (
                !route.is_invisible &&
                (route.path !== routes.cashier_pa || is_payment_agent_visible) &&
                (route.path !== routes.cashier_pa_transfer || is_payment_agent_transfer_visible) &&
                (route.path !== routes.cashier_p2p || is_p2p_enabled) &&
                (route.path !== routes.cashier_onramp || is_onramp_visible) &&
                (route.path !== routes.cashier_acc_transfer || is_account_transfer_visible)
            ) {
                options.push({
                    ...(route.path === routes.cashier_p2p && { count: p2p_notification_count }),
                    default: route.default,
                    icon: route.icon_component,
                    label: route.getTitle(),
                    value: route.component,
                    path: route.path,
                });
            }
        });

        return options;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        is_account_transfer_visible,
        is_onramp_visible,
        is_p2p_enabled,
        is_payment_agent_transfer_visible,
        is_payment_agent_visible,
        p2p_notification_count,
        account_settings.preferred_language,
        current_language,
        routes_config,
    ]);

    const selected_route = useMemo(
        () => getSelectedRoute({ routes: routes_config, pathname: location.pathname }),
        [location.pathname, routes_config]
    );

    const is_default_route = !!selected_route.default;

    const getHeaderTitle = () => {
        if (isDesktop || (is_default_route && (is_loading || is_cashier_onboarding))) return localize('Cashier');

        return selected_route.getTitle?.();
    };

    const updateActiveTab = useCallback(
        (path?: string) => {
            switch (path) {
                case routes.cashier_deposit:
                    setActiveTab('deposit');
                    break;
                case routes.cashier_withdrawal:
                    setActiveTab('withdraw');
                    break;
                case routes.cashier_pa:
                    setActiveTab('payment_agent');
                    break;
                case routes.cashier_pa_transfer:
                    setActiveTab('payment_agent_transfer');
                    break;
                case routes.cashier_acc_transfer:
                    setActiveTab('account_transfer');
                    break;
                case routes.cashier_onramp:
                    setActiveTab('onramp');
                    break;
                default:
                    setActiveTab('deposit');
                    break;
            }
        },
        [setActiveTab]
    );

    useEffect(() => {
        updateActiveTab(selected_route.path);
    }, [selected_route, updateActiveTab]);

    useEffect(() => {
        toggleCashier();
        // we still need to populate the tabs shown on cashier
        return () => {
            toggleCashier();
        };
    }, [toggleCashier]);

    useEffect(() => {
        (async () => {
            await WS?.wait('authorize');
            if (is_logged_in) {
                onMount();
                setAccountSwitchListener();
            }
        })();
    }, [is_logged_in, onMount, setAccountSwitchListener]);

    React.useEffect(() => {
        if (isSuccess && !isSubscribed) {
            subscribe();
        }
    }, [isSuccess, p2p_settings, subscribe, isSubscribed]);

    useEffect(() => {
        if (
            is_payment_agent_transfer_visible_is_success &&
            !is_payment_agent_transfer_visible &&
            history.location.pathname === routes.cashier_pa_transfer
        ) {
            history.push(routes.cashier_deposit);
        }
    }, [history, is_payment_agent_transfer_visible, is_payment_agent_transfer_visible_is_success]);

    useEffect(() => {
        if (!is_onramp_visible && history.location.pathname === routes.cashier_onramp) {
            history.push(routes.cashier_deposit);
        }
    }, [history, is_onramp_visible]);

    useEffect(() => {
        if (is_p2p_enabled_success && !is_p2p_enabled && history.location.pathname.startsWith(routes.cashier_p2p)) {
            const url_params = new URLSearchParams(history.location.search);
            const advert_id = url_params.get('advert_id');

            history.push(routes.cashier_deposit);

            if (advert_id) {
                if (is_virtual) {
                    toggleReadyToDepositModal();
                } else {
                    error.setErrorMessage({
                        code: 'ShareMyAdsError',
                        message:
                            currency !== 'USD' && is_svg
                                ? localize('Deriv P2P is currently unavailable in this currency.')
                                : localize('Deriv P2P is currently unavailable in your country.'),
                    });
                }
            }
        }
    }, [
        currency,
        error,
        history,
        is_p2p_enabled,
        is_p2p_enabled_success,
        is_svg,
        is_virtual,
        toggleReadyToDepositModal,
    ]);

    const is_p2p_loading = is_p2p_enabled_loading && !is_p2p_enabled_success;
    const is_payment_agent_loading = is_payment_agent_list_loading && !is_payment_agent_list_success;
    const is_cashier_loading =
        ((!is_logged_in || isMobile) && is_logging_in) ||
        !is_account_setting_loaded ||
        is_payment_agent_transfer_checking ||
        is_p2p_loading ||
        is_payment_agent_loading;

    if (is_cashier_loading) {
        return <Loading is_fullscreen />;
    }

    // Calculation of `initial_tab_index` must be performed after cashier loading
    // Because at this stage `getMenuOptions` list has all available routes
    const initial_tab_index = Math.max(
        getMenuOptions.findIndex(item => matchRoute(item, location.pathname)),
        0
    );

    // measure performance metrics (load cashier time)
    setPerformanceValue('load_cashier_time');

    return (
        <FadeWrapper is_visible={is_visible} className='cashier__page-wrapper' keyname='cashier__page-wrapper'>
            <ErrorDialog error={error} />
            <div className='cashier'>
                <PageOverlay header={getHeaderTitle()} onClickClose={onClickClose} is_from_app={is_from_derivgo}>
                    {isDesktop ? (
                        <VerticalTab
                            current_path={location.pathname}
                            initial_vertical_tab_index={initial_tab_index}
                            is_floating
                            setVerticalTabIndex={setTabIndex}
                            vertical_tab_index={is_default_route ? 0 : tab_index}
                            is_full_width
                            is_routed
                            list={getMenuOptions}
                        />
                    ) : (
                        <Div100vhContainer className='cashier__wrapper--responsive' height_offset='80px'>
                            {selected_route?.component && (
                                <selected_route.component
                                    component_icon={selected_route.icon_component}
                                    history={history}
                                    menu_options={getMenuOptions}
                                />
                            )}
                        </Div100vhContainer>
                    )}
                </PageOverlay>
            </div>
        </FadeWrapper>
    );
});
export default withRouter(Cashier);
