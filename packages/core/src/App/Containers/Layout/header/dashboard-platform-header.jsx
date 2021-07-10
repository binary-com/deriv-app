import * as React from 'react';
import PropTypes from 'prop-types';
import { useHistory, withRouter } from 'react-router-dom';
import { Button, DesktopWrapper, Icon, MobileWrapper, Money, Popover, Text } from '@deriv/components';
import { getPlatformInformation, isMobile, routes } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { PlatformSwitcher, ToggleNotifications } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { connect } from 'Stores/connect';
import { BinaryLink } from 'App/Components/Routes';

const Divider = () => {
    return <div className='dashboard-platform-header__divider' />;
};

const MyApps = () => {
    const history = useHistory();

    return (
        <div className='dashboard-platform-header__my-apps' onClick={() => history.push(routes.dashboard)}>
            <Icon icon='IcWalletMyApps' size={16} />
            <Text size='s' line_height='xxl' weight='bold' className='dashboard-platform-header__my-apps--title'>
                {localize('My apps')}
            </Text>
            <Divider />
        </div>
    );
};

const PlatformInformation = ({ app_routing_history }) => {
    return (
        <div className='dashboard-platform-header__platform-information'>
            <Icon
                className='dashboard-platform-header__platform-information--icon'
                icon={getPlatformInformation(app_routing_history).icon}
                size={24}
            />
            <Text size='s' weight='bold' line_height='xxl'>
                {getPlatformInformation(app_routing_history).header}
            </Text>
        </div>
    );
};

const ShowReports = () => {
    return (
        <div className='dashboard-platform-header__report'>
            <BinaryLink id='db_reports_tab' key='db_reports_tab' to={routes.reports}>
                <Icon icon='IcReports' size={20} />
            </BinaryLink>
        </div>
    );
};

const ShowNotifications = ({ is_notifications_visible, notifications_count, toggleNotifications }) => {
    return (
        <div className='dashboard-platform-header__notification'>
            <ToggleNotifications
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotifications}
                tooltip_message={<Localize i18n_default_text='View notifications' />}
            />
        </div>
    );
};

const ShowSettings = ({ toggleSettings }) => {
    return (
        <div className='dashboard-platform-header__setting'>
            <Popover alignment='top'>
                <a
                    id='dt_settings_toggle'
                    onClick={toggleSettings}
                    className='dashboard-platform-header__setting--icon'
                >
                    <Icon icon='IcGearLight' size={22} />
                </a>
            </Popover>
        </div>
    );
};

const AccountBalance = ({ balance, currency }) => {
    return (
        <div className='dashboard-platform-header__balance'>
            <Divider />
            <Icon icon='IcWalletDerivApps' size={28} className='dashboard-platform-header__balance--icon' />
            <Text size='s' line_height='xxl' weight='bold' color='profit-success'>
                <Money amount={balance} currency={currency} show_currency />
            </Text>
        </div>
    );
};

const DashboardPlatformHeader = ({
    account_status,
    app_routing_history,
    balance,
    currency,
    disableApp,
    enableApp,
    header_extension,
    is_dark_mode,
    is_logged_in,
    is_mt5_allowed,
    is_notifications_visible,
    is_onramp_tab_visible,
    is_p2p_enabled,
    is_payment_agent_transfer_visible,
    is_payment_agent_visible,
    is_settings_modal_on,
    is_virtual,
    location,
    logoutClient,
    needs_financial_assessment,
    notifications_count,
    setDarkMode,
    settings_extension,
    should_allow_authentication,
    toggleNotifications,
    toggleSettingsModal,
}) => {
    const toggle_menu_drawer_ref = React.useRef(null);
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });
    const history = useHistory();
    return (
        <header className='dashboard-platform-header'>
            <div className='dashboard-platform-header__menu-left'>
                <MobileWrapper>
                    <ToggleMenuDrawer
                        ref={toggle_menu_drawer_ref}
                        should_allow_authentication={should_allow_authentication}
                        account_status={account_status}
                        enableApp={enableApp}
                        disableApp={disableApp}
                        location={location}
                        logoutClient={logoutClient}
                        is_dark_mode={is_dark_mode}
                        is_logged_in={is_logged_in}
                        is_p2p_enabled={is_p2p_enabled}
                        is_payment_agent_transfer_visible={is_payment_agent_transfer_visible}
                        is_onramp_tab_visible={is_onramp_tab_visible}
                        is_payment_agent_visible={is_payment_agent_visible}
                        is_virtual={is_virtual}
                        needs_financial_assessment={needs_financial_assessment}
                        toggleTheme={setDarkMode}
                        platform_header={getPlatformInformation(app_routing_history).header}
                        platform_switcher={
                            <PlatformSwitcher
                                app_routing_history={app_routing_history}
                                is_mobile
                                platform_config={filterPlatformsForClients(platform_config)}
                                toggleDrawer={toggle_menu_drawer_ref.current?.toggleDrawer}
                            />
                        }
                    />
                    {header_extension && is_logged_in && <div>{header_extension}</div>}
                </MobileWrapper>
                <DesktopWrapper>
                    <MyApps />
                    <PlatformInformation app_routing_history={app_routing_history} />
                </DesktopWrapper>
            </div>
            <div className='dashboard-platform-header__menu-right'>
                <DesktopWrapper>
                    <ShowReports />
                </DesktopWrapper>
                <ShowNotifications
                    is_notifications_visible={is_notifications_visible}
                    notifications_count={notifications_count}
                    toggleNotifications={toggleNotifications}
                />
                <DesktopWrapper>
                    <ShowSettings
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_settings_modal_on={is_settings_modal_on}
                        toggleSettingsModal={toggleSettingsModal}
                        settings_extension={settings_extension}
                    />
                </DesktopWrapper>
                <AccountBalance balance={balance} currency={currency} />
                <Button
                    small={isMobile()}
                    has_effect
                    text={localize('Top up')}
                    onClick={() => history.push(routes.dashboard)}
                    primary
                    className='dashboard-platform-header__button'
                />
            </div>
        </header>
    );
};

DashboardPlatformHeader.propTypes = {
    account_status: PropTypes.object,
    app_routing_history: PropTypes.array,
    balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currency: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    header_extension: PropTypes.any,
    is_dark_mode: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_onramp_tab_visible: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_virtual: PropTypes.bool,
    logoutClient: PropTypes.func,
    needs_financial_assessment: PropTypes.bool,
    notifications_count: PropTypes.number,
    setDarkMode: PropTypes.func,
    should_allow_authentication: PropTypes.bool,
    toggleNotifications: PropTypes.func,
};

export default connect(({ client, common, modules, ui }) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    balance: client.balance,
    currency: client.currency,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    header_extension: ui.header_extension,
    is_dark_mode: ui.is_dark_mode_on,
    is_logged_in: client.is_logged_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_notifications_visible: ui.is_notifications_visible,
    is_onramp_tab_visible: modules.cashier.general.onramp.is_onramp_tab_visible,
    is_p2p_enabled: modules.cashier.general.is_p2p_enabled,
    is_payment_agent_transfer_visible: modules.cashier.general.is_payment_agent_transfer_visible,
    is_payment_agent_visible: modules.cashier.general.is_payment_agent_visible,
    is_virtual: client.is_virtual,
    logoutClient: client.logout,
    needs_financial_assessment: client.needs_financial_assessment,
    notifications_count: ui.filtered_notifications.length,
    setDarkMode: ui.setDarkMode,
    should_allow_authentication: client.should_allow_authentication,
    toggleNotifications: ui.toggleNotificationsModal,
}))(withRouter(DashboardPlatformHeader));
