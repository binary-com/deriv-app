import * as React from 'react';
import classNames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { Icon, Popover, StaticUrl, Loading } from '@deriv/components';
import { useIsRealAccountNeededForCashier } from '@deriv/hooks';
import { routes, platforms, formatMoney, makeLazyLoader, moduleLoader } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { MenuLinks } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { BinaryLink } from 'App/Components/Routes';
import DerivBrandLogo from 'Assets/SvgComponents/header/deriv-rebranding-logo.svg';
import DefaultMobileLinks from './default-mobile-links';
import ShowNotifications from './show-notifications';
import TradersHubOnboarding from './traders-hub-onboarding';
import TradersHubHomeButton from './traders-hub-home-button';

type TPlatformConfig = typeof platform_config;
type TPlatforms = typeof platforms;

const RealAccountSignup = makeLazyLoader(
    () =>
        moduleLoader(
            () => import(/* webpackChunkName: "core_real_account_signup" */ 'App/Containers/RealAccountSignup')
        ),
    () => <Loading />
)();

const AccountInfo = makeLazyLoader(
    () =>
        moduleLoader(
            () => import(/* webpackChunkName: "core_account-info" */ 'App/Components/Layout/Header/account-info')
        ),
    () => <Loading />
)();

const SetAccountCurrencyModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "core_set-account-currency-info" */ 'App/Containers/SetAccountCurrencyModal'
                )
        ),
    () => <Loading />
)();

const CurrencySelectionModal = makeLazyLoader(
    () =>
        moduleLoader(
            () => import(/* webpackChunkName: "core_currency-selection-modal" */ '../../CurrencySelectionModal')
        ),
    () => <Loading />
)();

const TradersHubHeader = observer(() => {
    const { client, common, traders_hub, ui } = useStore();
    const {
        account_type,
        balance,
        country_standpoint,
        currency,
        has_any_real_account,
        is_eu,
        is_logged_in,
        is_mt5_allowed,
        is_virtual,
    } = client;
    const { platform } = common;
    const { modal_data } = traders_hub;
    const {
        header_extension,
        is_accounts_switcher_on,
        is_app_disabled,
        is_mobile,
        is_route_modal_on,
        account_switcher_disabled_message,
        toggleAccountsDialog,
        toggleNeedRealAccountForCashierModal,
        toggleReadyToDepositModal,
        is_real_acc_signup_on,
        is_set_currency_modal_visible,
    } = ui;

    const history = useHistory();
    const { pathname } = useLocation();
    const cashier_routes = pathname.startsWith(routes.cashier);
    const real_account_needed_for_cashier = useIsRealAccountNeededForCashier();
    const account_balance = formatMoney(currency, balance ?? '', true);

    const filterPlatformsForClients = (payload: TPlatformConfig) =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });

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

    return (
        <header
            className={classNames('traders-hub-header', {
                'traders-hub-header--is-disabled': is_app_disabled || is_route_modal_on,
                'traders-hub-header--is-hidden': platforms[platform as keyof TPlatforms],
            })}
        >
            <div className='traders-hub-header__menu-left'>
                {is_mobile && (
                    <React.Fragment>
                        <ToggleMenuDrawer {...{ platform_config: filterPlatformsForClients(platform_config) }} />
                        {header_extension && is_logged_in && <div>{header_extension}</div>}
                    </React.Fragment>
                )}
                <div
                    className={classNames('traders-hub-header__logo-wrapper', {
                        'traders-hub-header__logo-wrapper--cashier': cashier_routes,
                    })}
                >
                    <StaticUrl href='/'>
                        <DerivBrandLogo className='traders-hub-header__logo' />
                    </StaticUrl>
                </div>
                {!is_mobile && (
                    <React.Fragment>
                        <div className='traders-hub-header__divider' />
                        <TradersHubHomeButton />
                    </React.Fragment>
                )}
                <MenuLinks {...{ is_traders_hub_routes: true }} />
            </div>
            {!is_mobile && (
                <React.Fragment>
                    <div className='traders-hub-header__menu-right'>
                        <div className='traders-hub-header__divider' />
                        <div className='traders-hub-header__menu-right--items'>
                            <div className='traders-hub-header__menu-right--items--onboarding'>
                                <TradersHubOnboarding />
                            </div>
                            <div className='traders-hub-header__menu-right--items--notifications'>
                                <ShowNotifications />
                            </div>
                            <Popover
                                classNameBubble='account-settings-toggle__tooltip'
                                alignment='bottom'
                                message={<Localize i18n_default_text='Manage account settings' />}
                                should_disable_pointer_events
                                zIndex='9999'
                            >
                                <BinaryLink className='traders-hub-header__setting' to={routes.personal_details}>
                                    <Icon icon='IcUserOutline' size={20} />
                                </BinaryLink>
                            </Popover>
                            {cashier_routes && (
                                <div className='traders-hub-header__menu-right--items--account-toggle'>
                                    <AccountInfo
                                        acc_switcher_disabled_message={account_switcher_disabled_message}
                                        account_type={account_type}
                                        balance={account_balance}
                                        country_standpoint={country_standpoint}
                                        currency={currency}
                                        is_dialog_on={is_accounts_switcher_on}
                                        is_disabled={false}
                                        is_eu={is_eu}
                                        is_virtual={is_virtual}
                                        toggleDialog={toggleAccountsDialog}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {is_real_acc_signup_on && <RealAccountSignup />}
                </React.Fragment>
            )}
            {is_mobile && (
                <React.Fragment>
                    <div className='traders-hub-header__mobile-parent'>
                        <div className='traders-hub-header__menu-middle'>
                            {cashier_routes ? (
                                <React.Fragment>
                                    <div className='traders-hub-header__menu-right--items--notifications__cashier'>
                                        <ShowNotifications />
                                    </div>
                                    <div className='traders-hub-header__menu-right--items--account-toggle'>
                                        <AccountInfo
                                            acc_switcher_disabled_message={account_switcher_disabled_message}
                                            account_type={account_type}
                                            balance={account_balance}
                                            country_standpoint={country_standpoint}
                                            currency={currency}
                                            is_dialog_on={is_accounts_switcher_on}
                                            is_disabled={false}
                                            is_eu={is_eu}
                                            is_virtual={is_virtual}
                                            toggleDialog={toggleAccountsDialog}
                                        />
                                    </div>
                                </React.Fragment>
                            ) : (
                                <DefaultMobileLinks handleClickCashier={handleClickCashier} />
                            )}
                        </div>
                    </div>
                    {is_real_acc_signup_on && <RealAccountSignup />}
                </React.Fragment>
            )}
            {is_set_currency_modal_visible && <SetAccountCurrencyModal />}
            {modal_data.active_modal === 'currency_selection' && (
                <CurrencySelectionModal is_visible={modal_data.active_modal === 'currency_selection'} />
            )}
        </header>
    );
});

export default TradersHubHeader;
