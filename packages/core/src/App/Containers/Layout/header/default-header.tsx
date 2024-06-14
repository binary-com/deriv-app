import React from 'react';
import classNames from 'classnames';
import { getDecimalPlaces, platforms, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import platform_config from 'App/Constants/platform-config';
import { useHistory, useLocation } from 'react-router-dom';
import HeaderAccountActions from './header-account-actions';
import { useDevice } from '@deriv-com/ui';
import DerivShortLogo from './deriv-short-logo';

const DefaultHeader = observer(() => {
    const { client, common, notifications, traders_hub, ui } = useStore();
    const {
        currency,
        is_bot_allowed,
        is_dxtrade_allowed,
        is_logged_in,
        is_logging_in,
        is_mt5_allowed,
        is_switching,
        is_landing_company_loaded,
    } = client;
    const { app_routing_history, current_language, platform } = common;
    const { addNotificationMessage, client_notifications, removeNotificationMessage } = notifications;
    const { setTogglePlatformType } = traders_hub;
    const {
        header_extension,
        is_app_disabled,
        is_route_modal_on,
        is_trading_assessment_for_existing_user_enabled,
        is_real_acc_signup_on,
    } = ui;

    const history = useHistory();
    const { isDesktop } = useDevice();
    const location = useLocation();
    const should_hide_platform_switcher = location.pathname === routes.traders_hub;

    const addUpdateNotification = () => addNotificationMessage(client_notifications?.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, [removeUpdateNotification]);

    const onClickDeposit = () => history.push(routes.cashier_deposit);

    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            if (config.link_to === routes.dxtrade) {
                return is_dxtrade_allowed;
            }
            if (
                config.link_to === routes.bot ||
                config.href === routes.binarybot ||
                config.href === routes.smarttrader
            ) {
                return is_bot_allowed;
            }
            return true;
        });

    return (
        <header
            className={classNames('header', {
                'header--is-disabled': is_app_disabled || is_route_modal_on,
                'header--is-hidden': platforms[platform],
            })}
        >
            <div className='header__menu-items'>
                <div className='header__menu-left'>
                    {!isDesktop ? (
                        <React.Fragment>
                            <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                            {header_extension && is_logged_in && (
                                <div className='header__menu-left-extensions'>{header_extension}</div>
                            )}
                            <DerivShortLogo />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <DerivShortLogo />
                            <div className='header__divider' />
                            {!should_hide_platform_switcher && (
                                <PlatformSwitcher
                                    app_routing_history={app_routing_history}
                                    is_landing_company_loaded={is_landing_company_loaded}
                                    is_logged_in={is_logged_in}
                                    is_logging_in={is_logging_in}
                                    platform_config={filterPlatformsForClients(platform_config)}
                                    setTogglePlatformType={setTogglePlatformType}
                                    current_language={current_language}
                                />
                            )}
                        </React.Fragment>
                    )}
                    <MenuLinks />
                </div>
                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--hidden': !isDesktop && is_logging_in,
                    })}
                >
                    {(is_logging_in || is_switching) && (
                        <div
                            id='dt_core_header_acc-info-preloader'
                            className={classNames('acc-info__preloader', {
                                'acc-info__preloader--no-currency': !currency,
                                'acc-info__preloader--is-crypto': getDecimalPlaces(currency) > 2,
                            })}
                        >
                            <AccountsInfoLoader
                                is_logged_in={is_logged_in}
                                is_mobile_or_tablet={!isDesktop}
                                speed={3}
                            />
                        </div>
                    )}
                    <HeaderAccountActions onClickDeposit={onClickDeposit} />
                </div>
            </div>
            {/*
                Prevent the modals that are part of Real Account signup to get triggered when the corresponding store value changes by
                removing the parent element from DOM
            */}
            {!is_trading_assessment_for_existing_user_enabled && is_real_acc_signup_on && <RealAccountSignup />}
            <SetAccountCurrencyModal />
            <NewVersionNotification onUpdate={addUpdateNotification} />
        </header>
    );
});

export default DefaultHeader;
