import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
    Button,
    DesktopWrapper,
    Div100vhContainer,
    FadeWrapper,
    MobileWrapper,
    PageOverlay,
    VerticalTab,
    Loading,
} from '@deriv/components';
import { localize } from '@deriv/translations';
import { getSelectedRoute, getStaticUrl, isMobile, routes, WS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import AccountPromptDialog from '../Components/account-prompt-dialog.jsx';
import 'Sass/cashier.scss';

const Cashier = ({
    history,
    is_account_transfer_visible,
    is_account_setting_loaded,
    is_cashier_default,
    is_logged_in,
    is_logging_in,
    is_onramp_tab_visible,
    is_p2p_enabled,
    is_payment_agent_transfer_visible,
    is_payment_agent_visible,
    // is_virtual,
    is_visible,
    location,
    onMount,
    p2p_notification_count,
    routeBackInApp,
    routes: routes_config,
    setAccountSwitchListener,
    setTabIndex,
    tab_index,
    toggleCashier,
}) => {
    React.useEffect(() => {
        toggleCashier();
        // we still need to populate the tabs shown on cashier
        (async () => {
            await WS.wait('authorize');
            onMount();
            setAccountSwitchListener();
        })();

        return () => {
            toggleCashier();
        };
    }, []);

    const onClickClose = () => routeBackInApp(history);
    const getMenuOptions = () => {
        const options = [];
        routes_config.forEach(route => {
            if (
                !route.is_invisible &&
                (route.path !== routes.cashier_pa || is_payment_agent_visible) &&
                (route.path !== routes.cashier_pa_transfer || is_payment_agent_transfer_visible) &&
                (route.path !== routes.cashier_p2p || is_p2p_enabled) &&
                (route.path !== routes.cashier_onramp || is_onramp_tab_visible) &&
                (route.path !== routes.cashier_acc_transfer || is_account_transfer_visible)
            ) {
                options.push({
                    ...(route.path === routes.cashier_p2p && { count: p2p_notification_count }),
                    default: route.default,
                    icon: route.icon_component,
                    label: route.getTitle(),
                    value: route.component,
                    path: route.path,
                    has_side_note: route.path !== routes.cashier_p2p, // Set to true to create the 3-column effect without passing any content. If there is content, the content should be passed in.
                });
            }
        });

        return options;
    };

    const selected_route = isMobile() ? getSelectedRoute({ routes: routes_config, pathname: location.pathname }) : null;
    // const should_show_tab_headers_note =
    //     !is_virtual &&
    //     (location.pathname.startsWith(routes.cashier_deposit) ||
    //         location.pathname.startsWith(routes.cashier_withdrawal));

    const is_default_route = !!getSelectedRoute({ routes: routes_config, pathname: location.pathname }).default;

    // '|| !is_account_setting_loaded' condition added to make sure client_tnc_status loaded
    if ((!is_logged_in && is_logging_in) || !is_account_setting_loaded) {
        return <Loading is_fullscreen />;
    }
    return (
        <FadeWrapper is_visible={is_visible} className='cashier-page-wrapper' keyname='cashier-page-wrapper'>
            <AccountPromptDialog />
            <div className='cashier'>
                <PageOverlay
                    header={isMobile() && !is_cashier_default ? selected_route.getTitle() : localize('Cashier')}
                    onClickClose={onClickClose}
                >
                    <DesktopWrapper>
                        <VerticalTab
                            alignment='center'
                            id='cashier'
                            classNameHeader='cashier__tab-header'
                            current_path={location.pathname}
                            is_floating
                            setVerticalTabIndex={setTabIndex}
                            vertical_tab_index={is_default_route ? 0 : tab_index}
                            is_full_width
                            is_routed
                            list={getMenuOptions()}
                            tab_headers_note={
                                <Button
                                    id='cashier_learn_more'
                                    className='cashier-page-wrapper__button'
                                    text={localize('Learn more about payment methods')}
                                    onClick={() => window.open(getStaticUrl('/payment-methods'))}
                                    secondary
                                />
                            }
                            // TODO: Uncomment when Ewallet.Exchange is available
                            // tab_headers_note={
                            //     should_show_tab_headers_note ? (
                            //         <Text as='p' size='xxs' className='cashier__tab-header-note'>
                            //             <Localize
                            //                 i18n_default_text='Want to exchange between e-wallet currencies? Try <0>Ewallet.Exchange</0>'
                            //                 components={[
                            //                     <a
                            //                         key={0}
                            //                         href='https://ewallet.exchange'
                            //                         rel='noopener noreferrer'
                            //                         target='_blank'
                            //                         className='link'
                            //                     />,
                            //                 ]}
                            //             />
                            //         </Text>
                            //     ) : undefined
                            // }
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='cashier__wrapper--is-mobile' height_offset='80px'>
                            {selected_route && (
                                <selected_route.component
                                    component_icon={selected_route.icon_component}
                                    history={history}
                                    menu_options={getMenuOptions()}
                                />
                            )}
                        </Div100vhContainer>
                    </MobileWrapper>
                </PageOverlay>
            </div>
        </FadeWrapper>
    );
};

Cashier.propTypes = {
    history: PropTypes.object,
    is_account_transfer_visible: PropTypes.bool,
    is_account_setting_loaded: PropTypes.bool,
    is_cashier_default: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_logging_in: PropTypes.bool,
    is_onramp_tab_visible: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    location: PropTypes.object,
    onMount: PropTypes.func,
    p2p_notification_count: PropTypes.number,
    routeBackInApp: PropTypes.func,
    routes: PropTypes.arrayOf(PropTypes.object),
    setAccountSwitchListener: PropTypes.func,
    setTabIndex: PropTypes.func,
    tab_index: PropTypes.number,
    toggleCashier: PropTypes.func,
};

export default connect(({ client, common, modules, ui }) => ({
    is_cashier_default: modules.cashier.is_cashier_default,
    is_account_transfer_visible: modules.cashier.is_account_transfer_visible,
    is_account_setting_loaded: client.is_account_setting_loaded,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    is_onramp_tab_visible: modules.cashier.onramp.is_onramp_tab_visible,
    is_p2p_enabled: modules.cashier.is_p2p_enabled,
    is_payment_agent_transfer_visible: modules.cashier.is_payment_agent_transfer_visible,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    is_virtual: client.is_virtual,
    is_visible: ui.is_cashier_visible,
    onMount: modules.cashier.onMountCommon,
    p2p_notification_count: modules.cashier.p2p_notification_count,
    routeBackInApp: common.routeBackInApp,
    setAccountSwitchListener: modules.cashier.setAccountSwitchListener,
    setTabIndex: modules.cashier.setCashierTabIndex,
    tab_index: modules.cashier.cashier_route_tab_index,
    toggleCashier: ui.toggleCashier,
}))(withRouter(Cashier));
