import React from 'react';
import { RouteComponentProps, useHistory, withRouter } from 'react-router-dom';
import { Icon, Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { routes, ContentFlag } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { useHasSetCurrency } from '@deriv/hooks';
import { TActiveAccount } from '@deriv/stores/types';
import { LabelPairedChevronRightSmRegularIcon } from '@deriv/quill-icons';
import { Button, Text } from '@deriv-com/quill-ui';
import { getAccountTitle } from 'App/Containers/RealAccountSignup/helpers/constants';
import { BinaryLink } from 'App/Components/Routes';
import AccountListDTraderV2 from './account-switcher-account-list-dtrader-v2';
import AccountGroupWrapper from './account-group-warpper-dtrader-v2';
import { getSortedAccountList, getSortedCFDList, isDemo } from '../../../../Containers/AccountSwitcher/helpers';

type TAccountSwitcherDTraderV2 = RouteComponentProps & {
    history?: ReturnType<typeof useHistory>;
};

const AccountSwitcherDTraderV2 = observer(({ history }: TAccountSwitcherDTraderV2) => {
    const [is_closing, setIsClosing] = React.useState(false);

    const { client, ui, traders_hub } = useStore();
    const {
        available_crypto_currencies,
        accounts,
        account_list,
        currency,
        has_fiat,
        has_active_real_account,
        has_any_real_account,
        has_maltainvest_account,
        is_eu,
        is_landing_company_loaded,
        is_low_risk,
        is_high_risk,
        is_logged_in,
        is_virtual,
        loginid: account_loginid,
        mt5_login_list,
        switchAccount,
        resetVirtualBalance,
        upgradeable_landing_companies,
        real_account_creation_unlock_date,
    } = client;
    const { content_flag, show_eu_related_content, selectRegion, setTogglePlatformType } = traders_hub;
    const { openRealAccountSignup, setShouldShowCooldownModal, toggleAccountsDialog, toggleSetCurrencyModal } = ui;

    const vrtc_loginid = account_list.find(account => account.is_virtual)?.loginid ?? '';
    const has_user_set_currency = useHasSetCurrency();
    // all: 1 in mt5_status response means that server is suspended
    const has_cr_account = account_list.find(acc => acc.loginid?.startsWith('CR'))?.loginid;
    // TODO: refactor
    const show_separator =
        (is_low_risk && has_maltainvest_account) ||
        ((!is_high_risk || is_eu) && has_maltainvest_account && is_low_risk);

    // TODO: Check unused css

    const closeAccountsDialog = () => {
        toggleAccountsDialog(false);
    };

    const setAccountCurrency = () => {
        closeAccountsDialog();
        toggleSetCurrencyModal();
    };

    const handleSwitchAccount = async (loginid?: string) => {
        setIsClosing(true);
        closeAccountsDialog();

        if (account_loginid === loginid) {
            setIsClosing(false);
            return;
        }

        await switchAccount(loginid);
        setIsClosing(false);
    };

    const resetBalance = async () => {
        closeAccountsDialog();
        resetVirtualBalance();
    };

    const getRealMT5 = (): typeof mt5_login_list | [] => {
        if (is_landing_company_loaded) {
            const low_risk_non_eu = content_flag === ContentFlag.LOW_RISK_CR_NON_EU;
            if (low_risk_non_eu) {
                return getSortedCFDList(mt5_login_list).filter(
                    account => !isDemo(account) && account.landing_company_short !== 'maltainvest'
                );
            }

            return getSortedCFDList(mt5_login_list).filter(account => !isDemo(account));
        }
        return [];
    };

    const canOpenMultiple = () => {
        if (available_crypto_currencies.length < 1 && !has_fiat) return true;
        return !is_virtual;
    };

    const getRemainingRealAccounts = (): string[] | [] => {
        if (show_eu_related_content || is_virtual || !canOpenMultiple() || is_low_risk) {
            return upgradeable_landing_companies;
        }
        return [];
    };

    const ableToResetBalance = (account: TActiveAccount) => {
        const account_init_balance = 10000;
        return !!account?.is_virtual && account?.balance !== account_init_balance;
    };

    const checkMultipleSvgAcc = () => {
        const all_svg_acc: typeof mt5_login_list = [];
        getRealMT5().map(acc => {
            if (acc.landing_company_short === 'svg' && acc.market_type === 'synthetic') {
                if (all_svg_acc.length) {
                    all_svg_acc.forEach(svg_acc => {
                        if (svg_acc.server !== acc.server) all_svg_acc.push(acc);
                        return all_svg_acc;
                    });
                } else {
                    all_svg_acc.push(acc);
                }
            }
        });
        return all_svg_acc.length > 1;
    };

    const checkIfUserHaveMoreAccount = (type?: string) =>
        getSortedAccountList(account_list, accounts).filter(
            account => !account.is_virtual && account.loginid.startsWith(type)
        ).length > 1;

    const handleRedirect = () => {
        // TODO: temporary unused?
        // const first_real_login_id = account_list?.find(account => /^(CR|MF)/.test(account.loginid ?? ''))?.loginid;
        // if (!is_virtual) {
        //     await switchAccount(virtual_account_loginid);
        // } else if (is_virtual) {
        //     await switchAccount(first_real_login_id);
        // }
        toggleAccountsDialog(false);
        history.push(routes.traders_hub);
        setTogglePlatformType('cfd');
    };

    const handleManageAccounts =
        has_any_real_account && (!has_user_set_currency || !currency)
            ? setAccountCurrency
            : () => openRealAccountSignup('manage');

    const getAccountItem = (item: typeof account_list[0], is_demo?: boolean) => {
        return is_demo ? (
            <AccountListDTraderV2
                key={item.loginid}
                balance={accounts[item?.loginid ?? '']?.balance}
                currency={accounts[item?.loginid ?? '']?.currency}
                display_type='currency'
                has_balance={'balance' in accounts[item?.loginid ?? '']}
                has_reset_balance={ableToResetBalance(accounts[account_loginid ?? ''])}
                is_disabled={item?.is_disabled}
                is_virtual={item.is_virtual}
                loginid={item.loginid}
                redirectAccount={item.is_disabled ? undefined : () => handleSwitchAccount(item.loginid)}
                onClickResetVirtualBalance={resetBalance}
                selected_loginid={account_loginid}
            />
        ) : (
            <AccountListDTraderV2
                key={item.loginid}
                balance={accounts[item?.loginid ?? '']?.balance}
                currency={accounts[item?.loginid ?? '']?.currency}
                display_type='currency'
                has_balance={'balance' in accounts[item?.loginid ?? '']}
                is_disabled={item.is_disabled}
                is_virtual={item.is_virtual}
                is_eu={is_eu}
                loginid={item.loginid}
                redirectAccount={item.is_disabled ? undefined : () => handleSwitchAccount(item.loginid)}
                selected_loginid={account_loginid}
                should_show_server_name={checkMultipleSvgAcc()}
            />
        );
    };

    const getAddAccountButton = (account: string, is_eu?: boolean) => (
        <div key={account} className='acc-switcher__new-account'>
            <Icon icon='IcDeriv' size={24} />
            <Text size='sm'>{getAccountTitle(account)}</Text>
            <Button
                onClick={() => {
                    if (real_account_creation_unlock_date) {
                        closeAccountsDialog();
                        setShouldShowCooldownModal(true);
                    } else {
                        selectRegion(is_eu ? 'EU' : 'Non-EU');
                        openRealAccountSignup(is_eu ? 'maltainvest' : 'svg');
                    }
                }}
                color='black'
                label={<Localize i18n_default_text='Add' />}
                type='button'
                variant='secondary'
                size='sm'
            />
        </div>
    );

    const demo_account = (
        <React.Fragment>
            {!!vrtc_loginid && (
                <AccountGroupWrapper
                    separator_text={show_separator ? <Localize i18n_default_text='Demo account' /> : ''}
                >
                    {(getSortedAccountList(account_list, accounts) as typeof account_list)
                        .filter(account => account.is_virtual)
                        .map(account => getAccountItem(account, true))}
                </AccountGroupWrapper>
            )}
        </React.Fragment>
    );

    const real_accounts = (
        <React.Fragment>
            {(!is_eu || is_low_risk) && (
                <AccountGroupWrapper
                    separator_text={
                        is_low_risk &&
                        has_maltainvest_account &&
                        localize(`Non-EU Deriv ${checkIfUserHaveMoreAccount('CR') ? 'accounts' : 'account'}`)
                    }
                >
                    {/* {is_low_risk && has_maltainvest_account
                        ? localize(`Non-EU Deriv ${checkIfUserHaveMoreAccount('CR') ? 'accounts' : 'account'}`)
                        : localize(`Deriv ${checkIfUserHaveMoreAccount('CR') ? 'accounts' : 'account'}`)} */}
                    {(getSortedAccountList(account_list, accounts) as typeof account_list)
                        .filter(account => !account.is_virtual && account?.loginid?.startsWith('CR'))
                        .map(account => getAccountItem(account))}
                    {!has_cr_account &&
                        getRemainingRealAccounts()
                            .filter(account => account === 'svg')
                            .map(account => getAddAccountButton(account))}
                </AccountGroupWrapper>
            )}
            {(!is_high_risk || is_eu) && has_maltainvest_account && (
                <AccountGroupWrapper
                    separator_text={
                        is_low_risk && localize(`EU Deriv ${checkIfUserHaveMoreAccount('MF') ? 'accounts' : 'account'}`)
                    }
                >
                    {/* {is_low_risk && has_maltainvest_account
                        ? localize(`EU Deriv ${checkIfUserHaveMoreAccount('MF') ? 'accounts' : 'account'}`)
                        : localize(`Deriv ${checkIfUserHaveMoreAccount('MF') ? 'accounts' : 'account'}`)} */}
                    {(getSortedAccountList(account_list, accounts) as typeof account_list)
                        .filter(account => !account.is_virtual && account?.loginid?.startsWith('MF'))
                        .map(account => getAccountItem(account))}
                    {getRemainingRealAccounts()
                        .filter(account => account === 'maltainvest')
                        .map(account => getAddAccountButton(account, true))}
                </AccountGroupWrapper>
            )}
        </React.Fragment>
    );

    if (!is_logged_in) return null;

    return (
        <div className='acc-switcher-dtrader__wrapper'>
            {is_landing_company_loaded ? (
                <React.Fragment>
                    <div className='acc-switcher-dtrader__accounts-list'>
                        {real_accounts}
                        {demo_account}
                    </div>
                    <BinaryLink onClick={handleRedirect} className='acc-switcher-dtrader__traders-hub'>
                        <Text size='sm'>
                            <Localize i18n_default_text="Looking for CFD accounts? Go to Trader's Hub" />
                        </Text>
                        <LabelPairedChevronRightSmRegularIcon />
                    </BinaryLink>
                    {has_active_real_account && !is_virtual && !is_closing && (
                        <Button
                            color='black'
                            label={<Localize i18n_default_text='Manage accounts' />}
                            onClick={handleManageAccounts}
                            size='lg'
                            type='button'
                            variant='secondary'
                            fullWidth
                        />
                    )}
                </React.Fragment>
            ) : (
                // TODO: it's old Loader from current production. Add new?
                <Loading is_fullscreen={false} />
            )}
        </div>
    );
});

export default withRouter(AccountSwitcherDTraderV2);
