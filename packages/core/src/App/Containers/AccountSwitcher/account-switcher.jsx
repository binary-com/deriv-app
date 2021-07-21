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
import { routes, formatMoney, getCFDAccount, getAccountTypeFields, CFD_PLATFORMS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { getAccountTitle } from 'App/Containers/RealAccountSignup/helpers/constants';
import { connect } from 'Stores/connect';
import { AccountsItemLoader } from 'App/Components/Layout/Header/Components/Preloader';
import AccountList from './account-switcher-account-list.jsx';
import AccountWrapper from './account-switcher-account-wrapper.jsx';
import { getSortedAccountList, getSortedCFDList, isDemo, getCFDConfig } from './helpers';

const AccountSwitcher = props => {
    const [active_tab_index, setActiveTabIndex] = React.useState(
        !props.is_virtual || props.should_show_real_accounts_list ? 0 : 1
    );
    const [is_deriv_demo_visible, setDerivDemoVisible] = React.useState(true);
    const [is_deriv_real_visible, setDerivRealVisible] = React.useState(true);
    const [is_dmt5_demo_visible, setDmt5DemoVisible] = React.useState(true);
    const [is_dmt5_real_visible, setDmt5RealVisible] = React.useState(true);
    const [is_dxtrade_demo_visible, setDxtradeDemoVisible] = React.useState(true);
    const [is_dxtrade_real_visible, setDxtradeRealVisible] = React.useState(true);

    const wrapper_ref = React.useRef();
    const scroll_ref = React.useRef(null);

    React.useEffect(() => {
        if (getMaxAccountsDisplayed()) {
            setDmt5RealVisible(false);
        }
    }, []);

    React.useEffect(() => {
        if (scroll_ref.current && (is_dmt5_real_visible || is_dxtrade_real_visible)) {
            scroll_ref.current.scrollIntoView({
                behavior: 'smooth',
                block: getMaxAccountsDisplayed() ? 'end' : 'start',
                inline: 'nearest',
            });
        }
    }, [is_dmt5_real_visible, is_dxtrade_real_visible]);

    const toggleVisibility = section => {
        switch (section) {
            case 'demo_deriv':
                return setDerivDemoVisible(!is_deriv_demo_visible);
            case 'demo_dmt5':
                return setDmt5DemoVisible(!is_dmt5_demo_visible);
            case 'demo_dxtrade':
                return setDxtradeDemoVisible(!is_dxtrade_demo_visible);
            case 'real_deriv':
                return setDerivRealVisible(!is_deriv_real_visible);
            case 'real_dmt5':
                return setDmt5RealVisible(!is_dmt5_real_visible);
            case 'real_dxtrade':
                return setDxtradeRealVisible(!is_dxtrade_real_visible);
            default:
                return false;
        }
    };

    const getMaxAccountsDisplayed = () => {
        return props?.account_list?.length > 4;
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

    const redirectToMt5 = async account_type => {
        closeAccountsDialog();
        await props.history.push(routes.mt5);
        window.location.hash = account_type;
    };

    const redirectToDXTrade = async account_type => {
        closeAccountsDialog();
        await props.history.push(routes.dxtrade);
        window.location.hash = account_type;
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
                sessionStorage.setItem('open_cfd_account_type', `real.${account_type}.set_password`);
            else sessionStorage.setItem('open_cfd_account_type', `real.${account_type}`);
            redirectToMt5Real();
        }
    };

    const redirectToMt5Real = market_type => {
        redirectToMt5(`real-${market_type}`);
    };

    // TODO: Uncomment when real account is launched
    // const redirectToDXTradeReal = () => {
    //     redirectToDXTrade('real');
    // };

    const openMt5DemoAccount = account_type => {
        sessionStorage.setItem('open_cfd_account_type', `demo.${account_type}`);
        redirectToMt5Demo();
    };

    const openDXTradeDemoAccount = account_type => {
        sessionStorage.setItem('open_cfd_account_type', `demo.${account_type}`);
        redirectToDXTradeDemo();
    };

    // TODO: Uncomment when real account is launched
    // const openDXTradeRealAccount = account_type => {
    //     sessionStorage.setItem('open_cfd_account_type', `real.${account_type}`);
    //     redirectToDXTradeReal();
    // };

    const redirectToMt5Demo = market_type => {
        redirectToMt5(`demo-${market_type}`);
    };

    const redirectToDXTradeDemo = market_type => {
        redirectToDXTrade(`demo-${market_type}`);
    };

    const setAccountCurrency = () => {
        closeAccountsDialog();
        props.toggleSetCurrencyModal();
    };

    const showAccountTypesModal = () => {
        closeAccountsDialog();
        props.toggleAccountTypesModal(true);
    };

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
    const getRemainingAccounts = (existing_cfd_accounts, platform) => {
        const gaming_config = getCFDConfig(
            'gaming',
            platform === CFD_PLATFORMS.MT5
                ? props.landing_companies?.mt_gaming_company
                : props.landing_companies?.dxtrade_gaming_company,
            existing_cfd_accounts,
            props.trading_servers,
            platform
        );
        const financial_config = getCFDConfig(
            'financial',
            platform === CFD_PLATFORMS.MT5
                ? props.landing_companies?.mt_financial_company
                : props.landing_companies?.dxtrade_financial_company,
            existing_cfd_accounts,
            props.trading_servers,
            platform
        );

        return [...gaming_config, ...financial_config];
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

    const getDemoMT5 = () => {
        return getSortedCFDList(props.mt5_login_list).filter(isDemo);
    };

    const getDemoDXTrade = () => {
        return getSortedCFDList(props.dxtrade_accounts_list).filter(isDemo);
    };

    const getRemainingDemoMT5 = () => {
        return getRemainingAccounts(getDemoMT5(), CFD_PLATFORMS.MT5);
    };

    const getRemainingDemoDXTrade = () => {
        return getRemainingAccounts(getDemoDXTrade(), CFD_PLATFORMS.DXTRADE);
    };

    const getRealMT5 = () => {
        return getSortedCFDList(props.mt5_login_list).filter(account => !isDemo(account));
    };

    // TODO: Uncomment when real account is launched
    // const getRealDXTrade = () => {
    //     return getSortedCFDList(props.dxtrade_accounts_list).filter(account => !isDemo(account));
    // };

    const findServerForAccount = acc => {
        const server_name = acc.error ? acc.error.details.server : acc.server;
        return props.mt5_login_list.length > 1
            ? props.mt5_login_list.find(server => server.server === server_name)
            : null;
    };

    const getRemainingRealMT5 = () => {
        return getRemainingAccounts(getRealMT5(), CFD_PLATFORMS.MT5);
    };

    // TODO: Uncomment when real account is launched
    // const getRemainingRealDXTrade = () => {
    //     return getRemainingAccounts(getRealDXTrade(), CFD_PLATFORMS.DXTRADE);
    // };

    const canOpenMulti = () => {
        if (props.available_crypto_currencies.length < 1 && !props.has_fiat) return true;
        return !props.is_virtual;
    };

    const is_regulated_able_to_change_currency =
        props.is_eu &&
        (props.landing_company_shortcode === 'malta' ||
            (props.landing_company_shortcode === 'iom' && props.upgradeable_landing_companies.length !== 0));

    // SVG clients can't upgrade.
    const getRemainingRealAccounts = () => {
        if (props.is_eu || props.is_virtual || !canOpenMulti() || is_regulated_able_to_change_currency) {
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

    const getTotalBalance = (accounts, is_demo = true) => {
        return accounts
            .filter(account => (is_demo ? isDemo(account) : !isDemo(account)))
            .reduce(
                (total, account) => {
                    total.balance += account.balance;
                    return total;
                },
                { balance: 0 }
            );
    };

    const getTotalDemoAssets = () => {
        const vrtc_loginid = props.account_list.find(account => account.is_virtual).loginid;
        const vrtc_balance = props.accounts[vrtc_loginid] ? props.accounts[vrtc_loginid].balance : 0;
        const mt5_demo_total = getTotalBalance(props.mt5_login_list);
        const dxtrade_demo_total = getTotalBalance(props.dxtrade_accounts_list);

        let total = vrtc_balance;

        if (Array.isArray(props.mt5_login_list)) {
            total += mt5_demo_total.balance;
        }
        if (Array.isArray(props.dxtrade_accounts_list)) {
            total += dxtrade_demo_total.balance;
        }

        return total;
    };

    const getTotalRealAssets = () => {
        // props.obj_total_balance.amount_mt5 is returning 0 regarding performance issues so we have to calculate
        // the total MT5 accounts balance from props.mt5_login_list.
        // You can remove this part if WS sends obj_total_balance.amount_mt5 correctly.
        const mt5_total = getTotalBalance(props.mt5_login_list, false);
        const dxtrade_total = getTotalBalance(props.dxtrade_accounts_list, false);

        let total = props.obj_total_balance.amount_real;

        total += props.obj_total_balance.amount_mt5 > 0 ? props.obj_total_balance.amount_mt5 : mt5_total.balance;
        total +=
            props.obj_total_balance.amount_dxtrade > 0 ? props.obj_total_balance.amount_dxtrade : dxtrade_total.balance;

        return total;
    };

    const isRealMT5AddDisabled = sub_account_type => {
        if (props.is_eu) {
            const account = getAccountTypeFields({ category: 'real', type: sub_account_type });
            return props.isAccountOfTypeDisabled(account?.account_type);
        }

        return !props.has_active_real_account;
    };

    // TODO: Uncomment when real account is launched
    // const isRealDXTradeAddDisabled = sub_account_type => {
    //     if (props.is_eu) {
    //         const account = getAccountTypeFields({ category: 'real', type: sub_account_type });
    //         return props.isAccountOfTypeDisabled(account?.account_type);
    //     }

    //     return !props.has_active_real_account;
    // };

    if (!props.is_logged_in) return false;

    const total_assets_message_demo = () => {
        if (props.is_mt5_allowed && props.is_dxtrade_allowed) {
            return localize('Total assets in your Deriv, DMT5 and Deriv X demo accounts.');
        } else if (props.is_mt5_allowed && !props.is_dxtrade_allowed) {
            return localize('Total assets in your Deriv and DMT5 demo accounts.');
        } else if (!props.is_mt5_allowed && props.is_dxtrade_allowed) {
            return localize('Total assets in your Deriv and Deriv X demo accounts.');
        }
        return localize('Total assets in your Deriv demo accounts.');
    };

    const total_assets_message_real = () => {
        if (props.is_mt5_allowed && props.is_dxtrade_allowed) {
            return localize('Total assets in your Deriv and DMT5 real accounts.');
            // TODO: uncomment after enabling real accounts
            // return localize('Total assets in your Deriv, DMT5 and Deriv X real accounts.');
        } else if (props.is_mt5_allowed && !props.is_dxtrade_allowed) {
            return localize('Total assets in your Deriv and DMT5 real accounts.');
        } else if (!props.is_mt5_allowed && props.is_dxtrade_allowed) {
            return localize('Total assets in your Deriv and Deriv X real accounts.');
        }
        return localize('Total assets in your Deriv real accounts.');
    };

    const total_assets_message = isRealAccountTab ? total_assets_message_real() : total_assets_message_demo();

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
                    {getSortedAccountList(props.account_list, props.accounts)
                        .filter(account => account.is_virtual)
                        .map(account => (
                            <AccountList
                                is_dark_mode_on={props.is_dark_mode_on}
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
                                redirectAccount={account.is_disabled ? undefined : () => doSwitch(account.loginid)}
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
                                                is_dark_mode_on={props.is_dark_mode_on}
                                                key={account.login}
                                                market_type={account.market_type}
                                                sub_account_type={account.sub_account_type}
                                                balance={account.balance}
                                                currency={account.currency}
                                                currency_icon={`IcMt5-${getCFDAccount({
                                                    market_type: account.market_type,
                                                    sub_account_type: account.sub_account_type,
                                                    platform: CFD_PLATFORMS.MT5,
                                                })}`}
                                                has_balance={'balance' in account}
                                                has_error={account.has_error}
                                                loginid={account.display_login}
                                                redirectAccount={() => redirectToMt5Demo(account.market_type)}
                                                platform={CFD_PLATFORMS.MT5}
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
                                            is_disabled={props.mt5_disabled_signup_types.demo}
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
            {props.is_dxtrade_allowed && (
                <AccountWrapper
                    header={localize('Deriv X Accounts')}
                    is_visible={is_dxtrade_demo_visible}
                    toggleVisibility={() => {
                        toggleVisibility('demo_dxtrade');
                    }}
                >
                    <React.Fragment>
                        {!!getDemoDXTrade().length && (
                            <div className='acc-switcher__accounts'>
                                {getDemoDXTrade().map(account => (
                                    <AccountList
                                        is_dark_mode_on={props.is_dark_mode_on}
                                        key={account.account_id}
                                        market_type={account.market_type}
                                        balance={account.balance}
                                        currency={account.currency}
                                        currency_icon={`IcDxtrade-${getCFDAccount({
                                            market_type: account.market_type,
                                            platform: CFD_PLATFORMS.DXTRADE,
                                        })}`}
                                        has_balance={'balance' in account}
                                        loginid={account.display_login}
                                        redirectAccount={() => redirectToDXTradeDemo(account.market_type)}
                                        platform={CFD_PLATFORMS.DXTRADE}
                                    />
                                ))}
                            </div>
                        )}
                        {getRemainingDemoDXTrade().map(account => (
                            <div key={account.title} className='acc-switcher__new-account'>
                                <Icon icon={`IcDxtrade-${account.icon}`} size={24} />
                                <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                    {account.title}
                                </Text>
                                <Button
                                    onClick={() => openDXTradeDemoAccount(account.type)}
                                    className='acc-switcher__new-account-btn'
                                    secondary
                                    small
                                    is_disabled={
                                        props.dxtrade_disabled_signup_types.demo || !!props.dxtrade_accounts_list_error
                                    }
                                >
                                    {localize('Add')}
                                </Button>
                            </div>
                        ))}
                    </React.Fragment>
                </AccountWrapper>
            )}
        </div>
    );

    const real_accounts = (
        <div ref={scroll_ref} className='acc-switcher__list-wrapper'>
            <React.Fragment>
                <AccountWrapper
                    header={localize('Deriv Accounts')}
                    is_visible={is_deriv_real_visible}
                    toggleVisibility={() => {
                        toggleVisibility('real_deriv');
                    }}
                >
                    <div className='acc-switcher__accounts'>
                        {getSortedAccountList(props.account_list, props.accounts)
                            .filter(account => !account.is_virtual)
                            .map(account => {
                                return (
                                    <AccountList
                                        is_dark_mode_on={props.is_dark_mode_on}
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
                                        redirectAccount={
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
                                id='dt_core_account-switcher_add-new-account'
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
                    {!canUpgrade() &&
                        canOpenMulti() &&
                        (!props.is_eu || (props.is_eu && props.can_change_fiat_currency)) && (
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
                                                is_dark_mode_on={props.is_dark_mode_on}
                                                key={account.login}
                                                market_type={account.market_type}
                                                sub_account_type={account.sub_account_type}
                                                balance={account.balance}
                                                currency={account.currency}
                                                currency_icon={`IcMt5-${getCFDAccount({
                                                    market_type: account.market_type,
                                                    sub_account_type: account.sub_account_type,
                                                    platform: CFD_PLATFORMS.MT5,
                                                })}`}
                                                has_balance={'balance' in account}
                                                has_error={account.has_error}
                                                loginid={account.display_login}
                                                redirectAccount={() => redirectToMt5Real(account.market_type)}
                                                server={findServerForAccount(account)}
                                                platform={CFD_PLATFORMS.MT5}
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
                                                props.mt5_disabled_signup_types.real ||
                                                isRealMT5AddDisabled(account.type) ||
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
            {/* TODO: Uncomment when real account is launched */}
            {/* {props.is_dxtrade_allowed && (
                <React.Fragment>
                    <div className='acc-switcher__separator acc-switcher__separator--no-padding' />
                    <AccountWrapper
                        header={localize('Deriv X Accounts')}
                        is_visible={is_dxtrade_real_visible}
                        toggleVisibility={() => {
                            toggleVisibility('real_dxtrade');
                        }}
                    >
                        {props.is_loading_dxtrade ? (
                            <div className='acc-switcher__accounts--is-loading'>
                                <AccountsItemLoader speed={3} />
                            </div>
                        ) : (
                            <React.Fragment>
                                {!!getRealDXTrade().length && (
                                    <div className='acc-switcher__accounts'>
                                        {getRealDXTrade().map(account => (
                                            <AccountList
                                                is_dark_mode_on={props.is_dark_mode_on}
                                                key={account.account_id}
                                                market_type={account.market_type}
                                                balance={account.balance}
                                                currency={account.currency}
                                                currency_icon={`IcDxtrade-${getCFDAccount({
                                                    market_type: account.market_type,
                                                    platform: CFD_PLATFORMS.DXTRADE,
                                                })}`}
                                                has_balance={'balance' in account}
                                                has_error={account.has_error}
                                                loginid={account.display_login}
                                                redirectAccount={() => redirectToDXTradeReal(account.market_type}
                                                platform={CFD_PLATFORMS.DXTRADE}
                                            />
                                        ))}
                                    </div>
                                )}
                                {getRemainingRealDXTrade().map(account => (
                                    <div
                                        key={account.title}
                                        className={classNames('acc-switcher__new-account', {
                                            'acc-switcher__new-account--disabled': props.dxtrade_accounts_list_error,
                                        })}
                                    >
                                        <Icon icon={`IcDxtrade-${account.icon}`} size={24} />
                                        <Text size='xs' color='general' className='acc-switcher__new-account-text'>
                                            {account.title}
                                        </Text>
                                        <Button
                                            onClick={() => openDXTradeRealAccount(account.type)}
                                            className='acc-switcher__new-account-btn'
                                            secondary
                                            small
                                            is_disabled={
                                                props.dxtrade_disabled_signup_types.real ||
                                                isRealDXTradeAddDisabled(account.type) ||
                                                !!props.dxtrade_accounts_list_error
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
            )} */}
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
                <div label={localize('Real')} id='real_account_tab'>
                    <DesktopWrapper>
                        <ThemedScrollbars height='354px'>{real_accounts}</ThemedScrollbars>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Div100vhContainer className='acc-switcher__list-container' max_autoheight_offset='234px'>
                            {real_accounts}
                        </Div100vhContainer>
                    </MobileWrapper>
                </div>
                <div label={localize('Demo')} id='dt_core_account-switcher_demo-tab'>
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
    has_active_real_account: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_fully_authenticated: PropTypes.bool,
    is_loading_mt5: PropTypes.bool,
    is_loading_dxtrade: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_pending_authentication: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_uk: PropTypes.bool,
    is_virtual: PropTypes.bool,
    is_visible: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
    logoutClient: PropTypes.func,
    mt5_disabled_signup_types: PropTypes.object,
    mt5_login_list: PropTypes.array,
    dxtrade_disabled_signup_types: PropTypes.object,
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
        is_dark_mode_on: ui.is_dark_mode_on,
        is_eu: client.is_eu,
        is_fully_authenticated: client.is_fully_authenticated,
        is_loading_mt5: client.is_populating_mt5_account_list,
        is_loading_dxtrade: client.is_populating_dxtrade_account_list,
        is_logged_in: client.is_logged_in,
        is_dxtrade_allowed: client.is_dxtrade_allowed,
        is_mt5_allowed: client.is_mt5_allowed,
        is_pending_authentication: client.is_pending_authentication,
        is_uk: client.is_uk,
        is_virtual: client.is_virtual,
        has_fiat: client.has_fiat,
        has_any_real_account: client.has_any_real_account,
        landing_company_shortcode: client.landing_company_shortcode,
        mt5_disabled_signup_types: client.mt5_disabled_signup_types,
        mt5_login_list: client.mt5_login_list,
        mt5_login_list_error: client.mt5_login_list_error,
        dxtrade_accounts_list: client.dxtrade_accounts_list,
        dxtrade_accounts_list_error: client.dxtrade_accounts_list_error,
        dxtrade_disabled_signup_types: client.dxtrade_disabled_signup_types,
        obj_total_balance: client.obj_total_balance,
        switchAccount: client.switchAccount,
        resetVirtualBalance: client.resetVirtualBalance,
        isAccountOfTypeDisabled: client.isAccountOfTypeDisabled,
        has_malta_account: client.has_malta_account,
        has_maltainvest_account: client.has_maltainvest_account,
        has_active_real_account: client.has_active_real_account,
        openAccountNeededModal: ui.openAccountNeededModal,
        logoutClient: client.logout,
        landing_companies: client.landing_companies,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
        updateMt5LoginList: client.updateMt5LoginList,
        routeBackInApp: common.routeBackInApp,
        standpoint: client.standpoint,
        is_positions_drawer_on: ui.is_positions_drawer_on,
        openRealAccountSignup: ui.openRealAccountSignup,
        trading_servers: client.trading_servers,
        toggleAccountsDialog: ui.toggleAccountsDialog,
        toggleAccountTypesModal: ui.toggleAccountTypesModal,
        togglePositionsDrawer: ui.togglePositionsDrawer,
        toggleSetCurrencyModal: ui.toggleSetCurrencyModal,
        should_show_real_accounts_list: ui.should_show_real_accounts_list,
        toggleShouldShowRealAccountsList: ui.toggleShouldShowRealAccountsList,
    }))(AccountSwitcher)
);

export { account_switcher as AccountSwitcher };
