import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import {
    Button,
    DesktopWrapper,
    MobileWrapper,
    Div100vhContainer,
    Icon,
    Money,
    Tabs,
    ThemedScrollbars,
    Text,
    useOnClickOutside,
} from '@deriv/components';
import {
    routes,
    isCryptocurrency,
    formatMoney,
    getMT5Account,
    getMT5AccountDisplay,
    getMT5AccountKey,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { getAccountTitle } from 'App/Containers/RealAccountSignup/helpers/constants';
import { connect } from 'Stores/connect';
import { AccountsItemLoader } from 'App/Components/Layout/Header/Components/Preloader';
import AccountList from './account-switcher-account-list.jsx';
import AccountWrapper from './account-switcher-account-wrapper.jsx';

const AccountSwitcher = props => {
    const [active_tab_index, setActiveTabIndex] = React.useState(
        !props.is_virtual || props.should_show_real_accounts_list ? 0 : 1
    );
    const [is_deriv_demo_visible, setDerivDemoVisible] = React.useState(true);
    const [is_deriv_real_visible, setDerivRealVisible] = React.useState(true);
    const [is_dmt5_demo_visible, setDmt5DemoVisible] = React.useState(true);
    const [is_dmt5_real_visible, setDmt5RealVisible] = React.useState(true);

    const wrapper_ref = React.useRef();

    const toggleVisibility = section => {
        switch (section) {
            case 'demo_deriv':
                return setDerivDemoVisible(!is_deriv_demo_visible);
            case 'demo_dmt5':
                return setDmt5DemoVisible(!is_dmt5_demo_visible);
            case 'real_deriv':
                return setDerivRealVisible(!is_deriv_real_visible);
            case 'real_dmt5':
                return setDmt5RealVisible(!is_dmt5_real_visible);
            default:
                return false;
        }
    };

    const handleLogout = () => {
        closeAccountsDialog();
        if (props.is_positions_drawer_on) {
            props.togglePositionsDrawer(); // TODO: hide drawer inside logout, once it is a mobx action
        }
        props.logoutClient().then(() => {
            props.routeBackInApp(props.history);
        });
    };

    const closeAccountsDialog = () => {
        props.toggleAccountsDialog(false);
    };

    const validateClickOutside = event => props.is_visible && !event.target.classList.contains('acc-info');

    useOnClickOutside(wrapper_ref, closeAccountsDialog, validateClickOutside);

    const redirectToMt5 = account_type => {
        closeAccountsDialog();
        props.history.push(`${routes.mt5}#${account_type}`);
    };

    const hasRequiredCredentials = () => {
        // for MT5 Real Financial STP, if true, users can instantly create a new account by setting password
        if (!props.account_settings) return false;
        const { citizen, tax_identification_number, tax_residence } = props.account_settings;
        return !!(citizen && tax_identification_number && tax_residence);
    };

    const should_redirect_fstp_password = props.is_fully_authenticated && hasRequiredCredentials();

    const openMt5RealAccount = account_type => {
        const has_required_account =
            account_type === 'synthetic' ? props.has_malta_account : props.has_maltainvest_account;

        if (props.is_eu && !has_required_account) {
            closeAccountsDialog();
            props.openAccountNeededModal(
                account_type === 'synthetic' ? props.standpoint.gaming_company : props.standpoint.financial_company,
                account_type === 'synthetic' ? localize('Deriv Synthetic') : localize('Deriv Financial'),
                account_type === 'synthetic' ? localize('DMT5 Synthetic') : localize('DMT5 Financial')
            );
        } else {
            if (should_redirect_fstp_password)
                sessionStorage.setItem('open_mt5_account_type', `real.${account_type}.set_password`);
            else sessionStorage.setItem('open_mt5_account_type', `real.${account_type}`);
            redirectToMt5Real();
        }
    };

    const redirectToMt5Real = () => {
        redirectToMt5('real');
    };

    const openMt5DemoAccount = account_type => {
        sessionStorage.setItem('open_mt5_account_type', `demo.${account_type}`);
        redirectToMt5Demo();
    };

    const redirectToMt5Demo = () => {
        redirectToMt5('demo');
    };

    const setAccountCurrency = () => {
        closeAccountsDialog();
        props.toggleSetCurrencyModal();
    };

    const showAccountTypesModal = () => {
        closeAccountsDialog();
        props.toggleAccountTypesModal(true);
    };

    const isDemo = account => account.account_type === 'demo';

    // * mt5_login_list returns these:
    // landing_company_short: "svg" | "malta" | "maltainvest" |  "vanuatu"  | "labuan" | "bvi"
    // account_type: "real" | "demo"
    // market_type: "financial" | "gaming"
    // sub_account_type: "financial" | "financial_stp" | "swap_free"
    //
    // (all market type gaming are synthetic accounts and can only have financial or swap_free sub account)
    //
    // * we should map them to landing_company:
    // mt_financial_company: { financial: {}, financial_stp: {}, swap_free: {} }
    // mt_gaming_company: { financial: {}, swap_free: {} }
    const getRemainingAccounts = existing_mt5_accounts => {
        const gaming_config = getMtConfig('gaming', props.landing_companies?.mt_gaming_company, existing_mt5_accounts);
        const financial_config = getMtConfig(
            'financial',
            props.landing_companies?.mt_financial_company,
            existing_mt5_accounts
        );

        return [...gaming_config, ...financial_config];
    };

    const getMtConfig = (market_type, landing_company, existing_mt5_accounts) => {
        const mt5_config = [];
        if (landing_company) {
            Object.keys(landing_company).forEach(company => {
                const has_account = existing_mt5_accounts.find(
                    account => account.sub_account_type === company && account.market_type === market_type
                );
                if (!has_account) {
                    const type = getMT5AccountKey(market_type, company);
                    if (type) {
                        mt5_config.push({
                            icon: getMT5Account(market_type, company),
                            title: getMT5AccountDisplay(market_type, company),
                            type,
                        });
                    }
                }
            });
        }
        return mt5_config;
    };

    const doSwitch = async loginid => {
        closeAccountsDialog();
        if (props.account_loginid === loginid) return;
        await props.switchAccount(loginid);
    };

    const resetBalance = async () => {
        closeAccountsDialog();
        props.resetVirtualBalance();
    };

    // Real accounts is always the first tab index based on design
    const isRealAccountTab = active_tab_index === 0;

    const getSortedAccountList = () => {
        // sort accounts as follows:
        // top is fiat, then crypto (each alphabetically by currency), then demo
        return props.account_list.slice().sort((a, b) => {
            const a_currency = props.accounts[a.loginid].currency;
            const b_currency = props.accounts[b.loginid].currency;
            const a_is_crypto = isCryptocurrency(a_currency);
            const b_is_crypto = isCryptocurrency(b_currency);
            const a_is_fiat = !a_is_crypto;
            const b_is_fiat = !b_is_crypto;
            if (a.is_virtual || b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
                return a_currency < b_currency ? -1 : 1;
            } else if (a_is_fiat && b_is_crypto) {
                return -1;
            }
            return 1;
        });
    };

    const getSortedMT5List = () => {
        // for MT5, synthetic, financial, financial stp
        return props.mt5_login_list.slice().sort((a, b) => {
            const a_is_demo = isDemo(a);
            const b_is_demo = isDemo(b);

            if (a_is_demo && !b_is_demo) {
                return 1;
            }
            if (b_is_demo && !a_is_demo) {
                return -1;
            }
            if (a.market_type === 'gaming') {
                return -1;
            }
            if (a.sub_account_type === 'financial') {
                return b.market_type === 'gaming' ? 1 : -1;
            }
            return 1;
        });
    };

    const getDemoMT5 = () => {
        return getSortedMT5List().filter(isDemo);
    };

    const getRemainingDemoMT5 = () => {
        return getRemainingAccounts(getDemoMT5());
    };

    const getRealMT5 = () => {
        return getSortedMT5List().filter(account => !isDemo(account));
    };

    const getRemainingRealMT5 = () => {
        return getRemainingAccounts(getRealMT5());
    };

    const canOpenMulti = () => {
        if (props.available_crypto_currencies.length < 1 && !props.has_fiat) return true;
        return !props.is_virtual;
    };

    // SVG clients can't upgrade.
    const getRemainingRealAccounts = () => {
        if (
            !canOpenMulti() ||
            (props.is_eu &&
                (props.landing_company_shortcode === 'malta' ||
                    (props.landing_company_shortcode === 'iom' && props.upgradeable_landing_companies.length !== 0)))
        ) {
            return props.upgradeable_landing_companies;
        }
        return [];
    };

    const hasSetCurrency = () => {
        return props.account_list.filter(account => !account.is_virtual).some(account => account.title !== 'Real');
    };

    const canUpgrade = () => {
        return !!(props.is_virtual && props.can_upgrade_to);
    };

    const getTotalDemoAssets = () => {
        const vrtc_loginid = props.account_list.find(account => account.is_virtual).loginid;
        const vrtc_balance = props.accounts[vrtc_loginid] ? props.accounts[vrtc_loginid].balance : 0;
        const mt5_demo_total = props.mt5_login_list
            .filter(account => isDemo(account))
            .reduce(
                (total, account) => {
                    total.balance += account.balance;
                    return total;
                },
                { balance: 0 }
            );
        return Array.isArray(props.mt5_login_list) ? mt5_demo_total.balance + vrtc_balance : vrtc_balance;
    };

    const getTotalRealAssets = () => {
        return props.obj_total_balance.amount_real + props.obj_total_balance.amount_mt5;
    };

    if (!props.is_logged_in) return false;

    const total_assets_message_demo = props.is_mt5_allowed
        ? localize('Total assets in your Deriv and DMT5 demo accounts.')
        : localize('Total assets in your Deriv demo accounts.');

    const total_assets_message_real = props.is_mt5_allowed
        ? localize('Total assets in your Deriv and DMT5 real accounts.')
        : localize('Total assets in your Deriv real accounts.');

    const total_assets_message = isRealAccountTab ? total_assets_message_real : total_assets_message_demo;

    const demo_accounts = (
        <div className='acc-switcher__list-wrapper'>
            <AccountWrapper
                header={localize('Deriv Accounts')}
                is_visible={is_deriv_demo_visible}
                toggleVisibility={() => {
                    toggleVisibility('demo_deriv');
                }}
            >
                <div className='acc-switcher__accounts'>
                    {getSortedAccountList()
                        .filter(account => account.is_virtual)
                        .map(account => (
                            <AccountList
                                key={account.loginid}
                                balance={props.accounts[account.loginid].balance}
                                currency={props.accounts[account.loginid].currency}
                                currency_icon={`IcCurrency-${account.icon}`}
                                display_type={'currency'}
                                has_balance={'balance' in props.accounts[account.loginid]}
                                has_reset_balance={props.accounts[props.account_loginid].is_virtual}
                                is_disabled={account.is_disabled}
                                is_virtual={account.is_virtual}
                                loginid={account.loginid}
                                onClickAccount={account.is_disabled ? undefined : () => doSwitch(account.loginid)}
                                onClickResetVirtualBalance={resetBalance}
                                selected_loginid={props.account_loginid}
                            />
                        ))}
                </div>
            </AccountWrapper>
            {props.is_mt5_allowed && (
                <React.Fragment>
                    <div className='acc-switcher__separator acc-switcher__separator--no-padding' />
                    <AccountWrapper
                        header={localize('DMT5 Accounts')}
                        is_visible={is_dmt5_demo_visible}
                        toggleVisibility={() => {
                            toggleVisibility('demo_dmt5');
                        }}
                    >
                        {props.is_loading_mt5 ? (
                            <div className='acc-switcher__accounts--is-loading'>
                                <AccountsItemLoader speed={3} />
                            </div>
                        ) : (
                            <React.Fragment>
                                {!!getDemoMT5().length && (
                                    <div className='acc-switcher__accounts'>
                                        {getDemoMT5().map(account => (
                                            <AccountList
                                                key={account.login}
                                                market_type={account.market_type}
                                                sub_account_type={account.sub_account_type}
                                                balance={account.balance}
                                                currency={account.currency}
                                                currency_icon={`IcMt5-${getMT5Account(
                                                    account.market_type,
                                                    account.sub_account_type
                                                )}`}
                                                has_balance={'balance' in account}
                                                loginid={account.display_login}
                                                onClickAccount={redirectToMt5Demo}
                                            />
                                        ))}
                                    </div>
                                )}
                                {getRemainingDemoMT5().map(account => (
                                    <div key={account.title} className='acc-switcher__new-account'>
                                        <Icon icon={`IcMt5-${account.icon}`} size={24} />
                                        <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                            {account.title}
                                        </Text>
                                        <Button
                                            onClick={() => openMt5DemoAccount(account.type)}
                                            className='acc-switcher__new-account-btn'
                                            secondary
                                            small
                                        >
                                            {localize('Add')}
                                        </Button>
                                    </div>
                                ))}
                            </React.Fragment>
                        )}
                    </AccountWrapper>
                </React.Fragment>
            )}
        </div>
    );

    const real_accounts = (
        <div className='acc-switcher__list-wrapper'>
            <React.Fragment>
                <AccountWrapper
                    header={localize('Deriv Accounts')}
                    is_visible={is_deriv_real_visible}
                    toggleVisibility={() => {
                        toggleVisibility('real_deriv');
                    }}
                >
                    <div className='acc-switcher__accounts'>
                        {getSortedAccountList()
                            .filter(account => !account.is_virtual)
                            .map(account => {
                                return (
                                    <AccountList
                                        key={account.loginid}
                                        balance={props.accounts[account.loginid].balance}
                                        currency={props.accounts[account.loginid].currency}
                                        currency_icon={`IcCurrency-${account.icon}`}
                                        display_type={'currency'}
                                        has_balance={'balance' in props.accounts[account.loginid]}
                                        is_disabled={account.is_disabled}
                                        is_virtual={account.is_virtual}
                                        is_eu={props.is_eu}
                                        loginid={account.loginid}
                                        onClickAccount={
                                            account.is_disabled ? undefined : () => doSwitch(account.loginid)
                                        }
                                        selected_loginid={props.account_loginid}
                                    />
                                );
                            })}
                    </div>
                    {getRemainingRealAccounts().map((account, index) => (
                        <div key={index} className='acc-switcher__new-account'>
                            <Icon icon='IcDeriv' size={24} />
                            <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                {getAccountTitle(account, {
                                    account_residence: props.client_residence,
                                })}
                            </Text>
                            <Button
                                onClick={() => {
                                    props.openRealAccountSignup(account);
                                }}
                                className='acc-switcher__new-account-btn'
                                secondary
                                small
                            >
                                {localize('Add')}
                            </Button>
                        </div>
                    ))}
                    {!canUpgrade() && canOpenMulti() && (
                        <Button
                            className='acc-switcher__btn'
                            secondary
                            onClick={
                                hasSetCurrency() ? () => props.openRealAccountSignup('manage') : setAccountCurrency
                            }
                        >
                            {props.has_fiat && props.available_crypto_currencies?.length === 0
                                ? localize('Manage account')
                                : localize('Add or manage account')}
                        </Button>
                    )}
                </AccountWrapper>
            </React.Fragment>
            {props.is_mt5_allowed && (
                <React.Fragment>
                    <div className='acc-switcher__separator acc-switcher__separator--no-padding' />
                    <AccountWrapper
                        header={localize('DMT5 Accounts')}
                        is_visible={is_dmt5_real_visible}
                        toggleVisibility={() => {
                            toggleVisibility('real_dmt5');
                        }}
                    >
                        {props.is_loading_mt5 ? (
                            <div className='acc-switcher__accounts--is-loading'>
                                <AccountsItemLoader speed={3} />
                            </div>
                        ) : (
                            <React.Fragment>
                                {!!getRealMT5().length && (
                                    <div className='acc-switcher__accounts'>
                                        {getRealMT5().map(account => (
                                            <AccountList
                                                key={account.login}
                                                market_type={account.market_type}
                                                sub_account_type={account.sub_account_type}
                                                balance={account.balance}
                                                currency={account.currency}
                                                currency_icon={`IcMt5-${getMT5Account(
                                                    account.market_type,
                                                    account.sub_account_type
                                                )}`}
                                                has_balance={'balance' in account}
                                                loginid={account.display_login}
                                                onClickAccount={redirectToMt5Real}
                                            />
                                        ))}
                                    </div>
                                )}
                                {getRemainingRealMT5().map(account => (
                                    <div
                                        key={account.title}
                                        className={classNames('acc-switcher__new-account', {
                                            'acc-switcher__new-account--disabled': props.mt5_login_list_error,
                                        })}
                                    >
                                        <Icon icon={`IcMt5-${account.icon}`} size={24} />
                                        <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                            {account.title}
                                        </Text>
                                        <Button
                                            onClick={() => openMt5RealAccount(account.type)}
                                            className='acc-switcher__new-account-btn'
                                            secondary
                                            small
                                            is_disabled={
                                                (!props.is_eu && !props.has_any_real_account) ||
                                                (account.type === 'financial_stp' &&
                                                    (props.is_pending_authentication || !!props.mt5_login_list_error))
                                            }
                                        >
                                            {localize('Add')}
                                        </Button>
                                    </div>
                                ))}
                            </React.Fragment>
                        )}
                    </AccountWrapper>
                </React.Fragment>
            )}
        </div>
    );

    return (
        <div className='acc-switcher__list' ref={wrapper_ref}>
            <Tabs
                active_index={active_tab_index}
                className='acc-switcher__list-tabs'
                onTabItemClick={index => setActiveTabIndex(index)}
                top
            >
                {/* TODO: De-couple and refactor demo and real accounts groups
                        into a single reusable AccountListItem component */}
                <div label={localize('Real')}>
                    <DesktopWrapper>
                        <ThemedScrollbars height='354px'>{real_accounts}</ThemedScrollbars>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='acc-switcher__list-container' max_autoheight_offset='234px'>
                            {real_accounts}
                        </Div100vhContainer>
                    </MobileWrapper>
                </div>
                <div label={localize('Demo')}>
                    <DesktopWrapper>
                        <ThemedScrollbars height='354px'>{demo_accounts}</ThemedScrollbars>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='acc-switcher__list-container' max_autoheight_offset='234px'>
                            {demo_accounts}
                        </Div100vhContainer>
                    </MobileWrapper>
                </div>
            </Tabs>
            <div
                className={classNames('acc-switcher__separator', {
                    'acc-switcher__separator--auto-margin': props.is_mobile,
                })}
            />
            <div className='acc-switcher__total'>
                <Text line_height='s' size='xs' weight='bold' color='prominent'>
                    <Localize i18n_default_text='Total assets' />
                </Text>
                <Text size='xs' color='prominent' className='acc-switcher__balance'>
                    <Money
                        currency={isRealAccountTab ? props.obj_total_balance.currency : 'USD'}
                        amount={formatMoney(
                            isRealAccountTab ? props.obj_total_balance.currency : 'USD',
                            isRealAccountTab ? getTotalRealAssets() : getTotalDemoAssets(),
                            true
                        )}
                        show_currency
                        should_format={false}
                    />
                </Text>
            </div>
            <Text color='less-prominent' line_height='xs' size='xxxs' className='acc-switcher__total-subtitle'>
                {total_assets_message}
            </Text>
            <div className='acc-switcher__separator' />
            <div className='acc-switcher__footer'>
                {props.is_uk && props.has_any_real_account && (
                    <Button
                        className='acc-switcher__compare'
                        type='button'
                        has_effect
                        onClick={showAccountTypesModal}
                        text={localize('Compare')}
                        secondary
                    />
                )}
                <div id='dt_logout_button' className='acc-switcher__logout' onClick={handleLogout}>
                    <Text color='prominent' size='xs' align='left' className='acc-switcher__logout-text'>
                        {localize('Log out')}
                    </Text>
                    <Icon icon='IcLogout' className='acc-switcher__logout-icon drawer__icon' onClick={handleLogout} />
                </div>
            </div>
        </div>
    );
};

AccountSwitcher.propTypes = {
    available_crypto_currencies: PropTypes.array,
    account_list: PropTypes.array,
    account_loginid: PropTypes.string,
    accounts: PropTypes.object,
    can_change_fiat_currency: PropTypes.bool,
    can_upgrade_to: PropTypes.string,
    has_fiat: PropTypes.bool,
    has_any_real_account: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_fully_authenticated: PropTypes.bool,
    is_loading_mt5: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_pending_authentication: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_uk: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
    logoutClient: PropTypes.func,
    mt5_login_list: PropTypes.array,
    obj_total_balance: PropTypes.object,
    openRealAccountSignup: PropTypes.func,
    switchAccount: PropTypes.func,
    resetVirtualBalance: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
    toggleAccountTypesModal: PropTypes.func,
    togglePositionsDrawer: PropTypes.func,
    toggleSetCurrencyModal: PropTypes.func,
    updateMt5LoginList: PropTypes.func,
};

const account_switcher = withRouter(
    connect(({ client, common, ui }) => ({
        available_crypto_currencies: client.available_crypto_currencies,
        account_loginid: client.loginid,
        accounts: client.accounts,
        account_settings: client.account_settings,
        can_change_fiat_currency: client.can_change_fiat_currency,
        account_list: client.account_list,
        can_upgrade_to: client.can_upgrade_to,
        client_residence: client.residence,
        is_eu: client.is_eu,
        is_fully_authenticated: client.is_fully_authenticated,
        is_loading_mt5: client.is_populating_mt5_account_list,
        is_logged_in: client.is_logged_in,
        is_mt5_allowed: client.is_mt5_allowed,
        is_pending_authentication: client.is_pending_authentication,
        is_uk: client.is_uk,
        is_virtual: client.is_virtual,
        has_fiat: client.has_fiat,
        has_any_real_account: client.has_any_real_account,
        landing_company_shortcode: client.landing_company_shortcode,
        mt5_login_list: client.mt5_login_list,
        mt5_login_list_error: client.mt5_login_list_error,
        obj_total_balance: client.obj_total_balance,
        switchAccount: client.switchAccount,
        resetVirtualBalance: client.resetVirtualBalance,
        has_malta_account: client.has_malta_account,
        has_maltainvest_account: client.has_maltainvest_account,
        openAccountNeededModal: ui.openAccountNeededModal,
        logoutClient: client.logout,
        landing_companies: client.landing_companies,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
        updateMt5LoginList: client.updateMt5LoginList,
        routeBackInApp: common.routeBackInApp,
        standpoint: client.standpoint,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        openRealAccountSignup: ui.openRealAccountSignup,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        toggleAccountTypesModal: ui.toggleAccountTypesModal,
        togglePositionsDrawer: ui.togglePositionsDrawer,
        toggleSetCurrencyModal: ui.toggleSetCurrencyModal,
        should_show_real_accounts_list: ui.should_show_real_accounts_list,
        toggleShouldShowRealAccountsList: ui.toggleShouldShowRealAccountsList,
    }))(AccountSwitcher)
);

export { account_switcher as AccountSwitcher };
