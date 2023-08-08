import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { DesktopWrapper, Icon, MobileWrapper, Popover, Text, StaticUrl } from '@deriv/components';
import { routes, platforms, formatMoney } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { MenuLinks } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { connect } from 'Stores/connect';
import { BinaryLink } from 'App/Components/Routes';
import DerivBrandLogo from 'Assets/SvgComponents/header/deriv-rebranding-logo.svg';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import CurrencySelectionModal from '../../CurrencySelectionModal';
import AccountInfo from 'App/Components/Layout/Header/account-info';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';
import DefaultMobileLinks from './default-mobile-links';
import ShowNotifications from './show-notifications';
import TradersHubOnboarding from './traders-hub-onboarding';

const Divider = () => {
    return <div className='trading-hub-header__divider' />;
};

export const TradersHubHomeButton = ({ is_dark_mode }) => {
    const history = useHistory();
    const { pathname } = history.location;

    return (
        <div
            className={classNames('trading-hub-header__tradershub', {
                'trading-hub-header__tradershub--active': pathname === routes.traders_hub,
            })}
            onClick={() => history.push(routes.traders_hub)}
        >
            <div className='trading-hub-header__tradershub--home-logo'>
                <Icon
                    icon={is_dark_mode ? 'IcAppstoreHomeDark' : 'IcAppstoreTradersHubHome'}
                    size={is_dark_mode ? 15 : 17}
                />
            </div>
            <Text className='trading-hub-header__tradershub--text'>
                <Localize i18n_default_text="Trader's Hub" />
            </Text>
        </div>
    );
};

const TradingHubHeader = ({
    header_extension,
    is_app_disabled,
    is_dark_mode,
    is_eu,
    is_logged_in,
    is_mt5_allowed,
    is_route_modal_on,
    modal_data,
    platform,
    acc_switcher_disabled_message,
    account_type,
    balance,
    is_acc_switcher_disabled,
    is_virtual,
    currency,
    country_standpoint,
    is_acc_switcher_on,
    toggleAccountsDialog,
    has_any_real_account,
    toggleReadyToDepositModal,
    toggleNeedRealAccountForCashierModal,
}) => {
    const { pathname } = useLocation();
    const cashier_routes = pathname.startsWith(routes.cashier);
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });
    const history = useHistory();

    const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();

    const toggleModal = () => {
        if (!has_any_real_account) {
            toggleReadyToDepositModal();
        } else if (window.location.pathname === routes.traders_hub) {
            toggleNeedRealAccountForCashierModal();
        }
    };

    const handleClickCashier = () => {
        if ((!has_any_real_account && is_virtual) || real_account_needed_for_cashier) {
            toggleModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    const AccountInfoComponent = React.useCallback(
        () => (
            <AccountInfo
                acc_switcher_disabled_message={acc_switcher_disabled_message}
                account_type={account_type}
                balance={formatMoney(currency, balance, true)}
                is_disabled={is_acc_switcher_disabled}
                is_eu={is_eu}
                is_virtual={is_virtual}
                currency={currency}
                country_standpoint={country_standpoint}
                is_dialog_on={is_acc_switcher_on}
                toggleDialog={toggleAccountsDialog}
            />
        ),
        [
            is_acc_switcher_on,
            is_acc_switcher_disabled,
            is_eu,
            is_virtual,
            currency,
            country_standpoint,
            toggleAccountsDialog,
            account_type,
            balance,
            acc_switcher_disabled_message,
        ]
    );

    return (
        <header
            className={classNames('trading-hub-header', {
                'trading-hub-header--is-disabled': is_app_disabled || is_route_modal_on,
                'trading-hub-header--is-hidden': platforms[platform],
            })}
        >
            <div className='trading-hub-header__menu-left'>
                <MobileWrapper>
                    <ToggleMenuDrawer platform_config={filterPlatformsForClients(platform_config)} />

                    {header_extension && is_logged_in && <div>{header_extension}</div>}
                </MobileWrapper>
                <div
                    className={classNames('trading-hub-header__logo-wrapper', {
                        'trading-hub-header__logo-wrapper--cashier': cashier_routes,
                    })}
                >
                    <StaticUrl href='/'>
                        <DerivBrandLogo className='trading-hub-header__logo' />
                    </StaticUrl>
                </div>
                <DesktopWrapper>
                    <Divider />
                    <TradersHubHomeButton is_dark_mode={is_dark_mode} />
                </DesktopWrapper>
                <MenuLinks is_traders_hub_routes />
            </div>
            <DesktopWrapper>
                <div className='trading-hub-header__menu-right'>
                    <Divider />
                    <div className='trading-hub-header__menu-right--items'>
                        <div className='trading-hub-header__menu-right--items--onboarding'>
                            <TradersHubOnboarding />
                        </div>
                        <div className='trading-hub-header__menu-right--items--notifications'>
                            <ShowNotifications />
                        </div>
                        <Popover
                            classNameBubble='account-settings-toggle__tooltip'
                            alignment='bottom'
                            message={<Localize i18n_default_text='Manage account settings' />}
                            should_disable_pointer_events
                            zIndex={9999}
                        >
                            <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                                <Icon icon='IcUserOutline' size={20} />
                            </BinaryLink>
                        </Popover>
                        {cashier_routes && (
                            <div className='trading-hub-header__menu-right--items--account-toggle'>
                                <AccountInfoComponent />
                            </div>
                        )}
                    </div>
                </div>
                <RealAccountSignup />
            </DesktopWrapper>
            <MobileWrapper>
                <div className='trading-hub-header__mobile-parent'>
                    <div className='trading-hub-header__menu-middle'>
                        {cashier_routes ? (
                            <React.Fragment>
                                <div className='trading-hub-header__menu-right--items--notifications__cashier'>
                                    <ShowNotifications />
                                </div>
                                <div className='trading-hub-header__menu-right--items--account-toggle'>
                                    <AccountInfoComponent />
                                </div>
                            </React.Fragment>
                        ) : (
                            <DefaultMobileLinks handleClickCashier={handleClickCashier} />
                        )}
                    </div>
                </div>
                <RealAccountSignup />
            </MobileWrapper>
            <SetAccountCurrencyModal />
            <CurrencySelectionModal is_visible={modal_data.active_modal === 'currency_selection'} />
        </header>
    );
};

TradingHubHeader.propTypes = {
    header_extension: PropTypes.any,
    is_app_disabled: PropTypes.bool,
    is_dark_mode: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
    is_settings_modal_on: PropTypes.bool,
    modal_data: PropTypes.object,
    platform: PropTypes.string,
    settings_extension: PropTypes.array,
    acc_switcher_disabled_message: PropTypes.string,
    account_type: PropTypes.string,
    balance: PropTypes.string,
    currency: PropTypes.string,
    is_acc_switcher_disabled: PropTypes.bool,
    country_standpoint: PropTypes.object,
    is_acc_switcher_on: PropTypes.bool,
    is_virtual: PropTypes.bool,
    toggleAccountsDialog: PropTypes.func,
    has_any_real_account: PropTypes.bool,
    toggleReadyToDepositModal: PropTypes.func,
    toggleNeedRealAccountForCashierModal: PropTypes.func,
};

export default connect(({ client, common, ui, traders_hub }) => ({
    header_extension: ui.header_extension,
    is_app_disabled: ui.is_app_disabled,
    is_dark_mode: ui.is_dark_mode_on,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_route_modal_on: ui.is_route_modal_on,
    modal_data: traders_hub.modal_data,
    platform: common.platform,
    acc_switcher_disabled_message: ui.account_switcher_disabled_message,
    account_type: client.account_type,
    balance: client.balance,
    currency: client.currency,
    country_standpoint: client.country_standpoint,
    is_acc_switcher_on: !!ui.is_accounts_switcher_on,
    is_virtual: client.is_virtual,
    toggleAccountsDialog: ui.toggleAccountsDialog,
    has_any_real_account: client.has_any_real_account,
    toggleReadyToDepositModal: ui.toggleReadyToDepositModal,
    toggleNeedRealAccountForCashierModal: ui.toggleNeedRealAccountForCashierModal,
    content_flag: traders_hub.content_flag,
}))(withRouter(TradingHubHeader));
