import classNames from 'classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { routes, getDecimalPlaces, platforms } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { MenuLinks, PlatformSwitcher } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import NewVersionNotification from 'App/Containers/new-version-notification.jsx';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { AccountsInfoLoader } from 'App/Components/Layout/Header/Components/Preloader';
import TradersHubHomeButton from './traders-hub-home-button';
import HeaderAccountActions from './header-account-actions';
import { useDevice } from '@deriv/hooks';

const DTraderHeader = observer(() => {
    const { client, common, ui, notifications, traders_hub } = useStore();
    const {
        currency,
        has_any_real_account,
        is_bot_allowed,
        is_dxtrade_allowed,
        is_logged_in,
        is_logging_in,
        is_mt5_allowed,
        is_virtual,
        is_switching,
    } = client;
    const { app_routing_history, platform, current_language } = common;
    const { header_extension, is_app_disabled, is_route_modal_on, toggleReadyToDepositModal, is_real_acc_signup_on } =
        ui;
    const { addNotificationMessage, client_notifications, removeNotificationMessage } = notifications;
    const { setTogglePlatformType } = traders_hub;

    const history = useHistory();
    const { isDesktop } = useDevice();

    const addUpdateNotification = () => addNotificationMessage(client_notifications?.new_version_available);
    const removeUpdateNotification = React.useCallback(
        () => removeNotificationMessage({ key: 'new_version_available' }),
        [removeNotificationMessage]
    );

    React.useEffect(() => {
        document.addEventListener('IgnorePWAUpdate', removeUpdateNotification);
        return () => document.removeEventListener('IgnorePWAUpdate', removeUpdateNotification);
    }, [removeUpdateNotification]);

    const handleClickCashier = () => {
        if (!has_any_real_account && is_virtual) {
            toggleReadyToDepositModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

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
                    {isDesktop && (
                        <PlatformSwitcher
                            app_routing_history={app_routing_history}
                            platform_config={filterPlatformsForClients(platform_config)}
                            setTogglePlatformType={setTogglePlatformType}
                            current_language={current_language}
                        />
                    )}
                    {!isDesktop && (
                        <React.Fragment>
                            <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />
                            {header_extension && is_logged_in && (
                                <div className='header__menu-left-extensions'>{header_extension}</div>
                            )}
                        </React.Fragment>
                    )}
                    {isDesktop && <TradersHubHomeButton />}
                    <MenuLinks />
                </div>

                <div
                    className={classNames('header__menu-right', {
                        'header__menu-right--hidden': !isDesktop && is_logging_in,
                    })}
                >
                    {isDesktop && (
                        <div className='header__menu--dtrader--separator--account'>
                            <div className='header__menu--dtrader--separator' />
                        </div>
                    )}
                    {(is_logging_in || is_switching) && (
                        <div
                            id='dt_core_header_acc-info-preloader'
                            className={classNames('acc-info__preloader__dtrader', {
                                'acc-info__preloader__dtrader--no-currency': !currency,
                                'acc-info__preloader__dtrader--is-crypto': getDecimalPlaces(currency) > 2,
                            })}
                        >
                            <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={!isDesktop} speed={3} />
                        </div>
                    )}
                    <HeaderAccountActions onClickDeposit={handleClickCashier} />
                </div>
            </div>
            {is_real_acc_signup_on && <RealAccountSignup />}
            <SetAccountCurrencyModal />
            <NewVersionNotification onUpdate={addUpdateNotification} />
        </header>
    );
});

export default DTraderHeader;
