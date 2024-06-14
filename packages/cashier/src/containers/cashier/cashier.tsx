import React, { useCallback, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    Button,
    DesktopWrapper,
    Div100vhContainer,
    FadeWrapper,
    MobileOrTabletWrapper,
    PageOverlay,
    VerticalTab,
    Loading,
} from '@deriv/components';
import {
    useAuthorize,
    useOnrampVisible,
    useAccountTransferVisible,
    useIsP2PEnabled,
    usePaymentAgentTransferVisible,
    useP2PNotificationCount,
    useP2PSettings,
} from '@deriv/hooks';
import { getSelectedRoute, getStaticUrl, routes, setPerformanceValue, WS } from '@deriv/shared';
import ErrorDialog from '../../components/error-dialog';
import { TRoute } from '../../types';
import { localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';
import type { TCoreStores } from '@deriv/stores/types';
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
    has_side_note: boolean;
    icon: string;
    label: string;
    path?: string;
    value?: typeof React.Component;
};

const Cashier = observer(({ history, location, routes: routes_config }: TCashierProps) => {
    const { common, ui, client } = useStore();
    const { withdraw, general_store, payment_agent } = useCashierStore();
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
        isLoading: is_payment_agent_checking,
        isSuccess: is_payment_agent_transfer_visible_is_success,
    } = usePaymentAgentTransferVisible();
    const { is_payment_agent_visible } = payment_agent;
    const { is_from_derivgo } = common;
    const { is_cashier_visible: is_visible, is_mobile_or_tablet, toggleCashier, toggleReadyToDepositModal } = ui;
    const { currency, is_account_setting_loaded, is_logged_in, is_logging_in, is_svg, is_virtual } = client;
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
                    // Set to true to create the 3-column effect without passing any content. If there is content, the content should be passed in.
                    has_side_note:
                        route.path !== routes.cashier_deposit &&
                        route.path !== routes.cashier_withdrawal &&
                        route.path !== routes.cashier_p2p,
                });
            }
        });

        return options;
    }, [
        is_account_transfer_visible,
        is_onramp_visible,
        is_p2p_enabled,
        is_payment_agent_transfer_visible,
        is_payment_agent_visible,
        p2p_notification_count,
        routes_config,
    ]);

    const selected_route = useMemo(
        () => getSelectedRoute({ routes: routes_config, pathname: location.pathname }),
        [location.pathname, routes_config]
    );

    const is_default_route = !!selected_route.default;

    const getHeaderTitle = useMemo(() => {
        if (!is_mobile_or_tablet || (is_default_route && (is_loading || is_cashier_onboarding)))
            return localize('Cashier');

        return selected_route.getTitle?.();
    }, [is_cashier_onboarding, is_default_route, is_loading, selected_route, is_mobile_or_tablet]);

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

    if (
        ((!is_logged_in || is_mobile_or_tablet) && is_logging_in) ||
        !is_account_setting_loaded ||
        is_payment_agent_checking ||
        (is_p2p_enabled_loading && !is_p2p_enabled_success)
    ) {
        return <Loading is_fullscreen />;
    }

    // measure performance metrics (load cashier time)
    setPerformanceValue('load_cashier_time');

    return (
        <FadeWrapper is_visible={is_visible} className='cashier__page-wrapper' keyname='cashier__page-wrapper'>
            <ErrorDialog error={error} />
            <div className='cashier'>
                <PageOverlay header={getHeaderTitle} onClickClose={onClickClose} is_from_app={is_from_derivgo}>
                    <DesktopWrapper>
                        <VerticalTab
                            current_path={location.pathname}
                            is_floating
                            setVerticalTabIndex={setTabIndex}
                            vertical_tab_index={is_default_route ? 0 : tab_index}
                            is_full_width
                            is_routed
                            list={getMenuOptions}
                            tab_headers_note={
                                <Button
                                    id='cashier_learn_more'
                                    className='cashier__page-wrapper-button'
                                    text={localize('Learn more about payment methods')}
                                    onClick={() => window.open(getStaticUrl('/payment-methods'))}
                                    secondary
                                />
                            }
                        />
                    </DesktopWrapper>
                    <MobileOrTabletWrapper>
                        <Div100vhContainer className='cashier__wrapper--is-mobile' height_offset='80px'>
                            {selected_route?.component && (
                                <selected_route.component
                                    component_icon={selected_route.icon_component}
                                    history={history}
                                    menu_options={getMenuOptions}
                                />
                            )}
                        </Div100vhContainer>
                    </MobileOrTabletWrapper>
                </PageOverlay>
            </div>
        </FadeWrapper>
    );
});
export default withRouter(Cashier);
