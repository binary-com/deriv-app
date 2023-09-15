import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Icon, WalletIcon, Text, AppLinkedWithWalletIcon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { formatMoney } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import {
    useActiveAccount,
    useActiveWalletAccount,
    useLinkedWalletsAccounts,
    useWalletAccountsList,
} from '@deriv/hooks';
import { AccountSwitcherWallet, AccountSwitcherWalletMobile } from 'App/Containers/AccountSwitcherWallet';
import { AccountsInfoLoader } from '../Components/Preloader';
import AccountInfoWrapper from '../account-info-wrapper';
import WalletBadge from './wallet-badge';

type TAccountInfoWallets = {
    toggleDialog: () => void;
    is_dialog_on: boolean;
};

type TDropdownArrow = {
    is_disabled?: boolean;
};

type TBalanceLabel = {
    balance: number;
    currency: string;
    is_virtual: boolean;
    display_code: string;
};

type TDesktopInfoIcons = {
    wallet_account: ReturnType<typeof useWalletAccountsList>['data'][number];
};

type TMobileInfoIcons = {
    wallet_account: ReturnType<typeof useWalletAccountsList>['data'][number];
};

const DropdownArrow = ({ is_disabled = false }: TDropdownArrow) =>
    is_disabled ? (
        <Icon data_testid='dt_lock_icon' icon='IcLock' />
    ) : (
        <Icon data_testid='dt_select_arrow' icon='IcChevronDownBold' className='acc-info__select-arrow' />
    );

const BalanceLabel = ({ balance, currency, is_virtual, display_code }: Partial<TBalanceLabel>) =>
    typeof balance !== 'undefined' || !currency ? (
        <div className='acc-info__wallets-account-type-and-balance'>
            <Text
                as='p'
                data-testid='dt_balance'
                className={classNames('acc-info__balance acc-info__wallets-balance', {
                    'acc-info__balance--no-currency': !currency && !is_virtual,
                })}
            >
                {!currency ? (
                    <Localize i18n_default_text='No currency assigned' />
                ) : (
                    `${formatMoney(currency, balance ?? 0, true)} ${display_code}`
                )}
            </Text>
        </div>
    ) : null;

const DesktopInfoIcons = observer(({ wallet_account }: TDesktopInfoIcons) => {
    const { ui } = useStore();
    const { is_dark_mode_on } = ui;

    return (
        <div className='acc-info__wallets-container'>
            <Icon
                icon={is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight'}
                size={24}
                data_testid='dt_ic_wallet_options'
            />
            <WalletIcon
                icon={is_dark_mode_on ? wallet_account?.icons.dark : wallet_account?.icons.light}
                type={wallet_account?.is_virtual ? 'demo' : wallet_account?.currency_config?.type}
                gradient_class={
                    is_dark_mode_on ? wallet_account?.gradients.card.dark : wallet_account?.gradients.card.light
                }
                size={'small'}
                has_bg
                hide_watermark
            />
        </div>
    );
});

const MobileInfoIcons = observer(({ wallet_account }: TMobileInfoIcons) => {
    const {
        ui: { is_dark_mode_on },
    } = useStore();

    const { gradients, icons, is_virtual, currency_config } = wallet_account;
    const theme = is_dark_mode_on ? 'dark' : 'light';
    const app_icon = is_dark_mode_on ? 'IcWalletOptionsDark' : 'IcWalletOptionsLight';
    const icon_type = is_virtual ? 'demo' : currency_config?.type;

    return (
        <div className='acc-info__wallets-container'>
            <AppLinkedWithWalletIcon
                app_icon={app_icon}
                gradient_class={gradients.card[theme]}
                size='small'
                type={icon_type}
                wallet_icon={icons[theme]}
                hide_watermark
            />
        </div>
    );
});

const AccountInfoWallets = observer(({ is_dialog_on, toggleDialog }: TAccountInfoWallets) => {
    const { client, ui } = useStore();
    const { switchAccount, is_logged_in } = client;
    const { is_mobile, account_switcher_disabled_message } = ui;

    const active_account = useActiveAccount();
    const active_wallet = useActiveWalletAccount();
    const { data: wallets_list } = useWalletAccountsList();
    const { data: linked_accounts } = useLinkedWalletsAccounts();

    let linked_dtrade_trading_account_loginind = active_account?.loginid;

    if (active_wallet) {
        // get 'dtrade' loginid account linked to the current wallet
        linked_dtrade_trading_account_loginind = active_wallet.dtrade_loginid || linked_accounts.dtrade?.[0]?.loginid;

        // switch to dtrade account
        if (
            linked_dtrade_trading_account_loginind &&
            linked_dtrade_trading_account_loginind !== active_account?.loginid
        ) {
            switchAccount(linked_dtrade_trading_account_loginind);
        }
    }

    const linked_wallet = wallets_list?.find(
        wallet => wallet.dtrade_loginid === linked_dtrade_trading_account_loginind
    );

    if (!linked_wallet) return <AccountsInfoLoader is_logged_in={is_logged_in} is_mobile={is_mobile} speed={3} />;

    const show_badge = linked_wallet.is_malta_wallet || linked_wallet.is_virtual;

    return (
        <div className='acc-info__wrapper'>
            <div className='acc-info__separator' />
            <AccountInfoWrapper
                is_disabled={active_account?.is_disabled}
                disabled_message={account_switcher_disabled_message}
            >
                <div
                    data-testid='dt_acc_info'
                    id='dt_core_account-info_acc-info'
                    className={classNames('acc-info acc-info__wallets', {
                        'acc-info--show': is_dialog_on,
                        'acc-info--is-disabled': active_account?.is_disabled,
                    })}
                    onClick={active_account?.is_disabled ? undefined : () => toggleDialog()}
                >
                    {is_mobile ? (
                        <MobileInfoIcons wallet_account={linked_wallet} />
                    ) : (
                        <DesktopInfoIcons wallet_account={linked_wallet} />
                    )}
                    <BalanceLabel
                        balance={active_account?.balance}
                        currency={active_account?.currency}
                        is_virtual={active_account?.is_virtual}
                        display_code={active_account?.currency_config?.display_code}
                    />
                    {show_badge && (
                        <WalletBadge is_demo={linked_wallet?.is_virtual} label={linked_wallet?.landing_company_name} />
                    )}
                    <DropdownArrow is_disabled={active_account?.is_disabled} />
                </div>
            </AccountInfoWrapper>
            {is_mobile ? (
                <AccountSwitcherWalletMobile is_visible={is_dialog_on} toggle={toggleDialog} />
            ) : (
                <CSSTransition
                    in={is_dialog_on}
                    timeout={200}
                    classNames={{
                        enter: 'acc-switcher__wrapper--enter',
                        enterDone: 'acc-switcher__wrapper--enter-done',
                        exit: 'acc-switcher__wrapper--exit',
                    }}
                    unmountOnExit
                >
                    <div className='acc-switcher__wrapper'>
                        <AccountSwitcherWallet is_visible={is_dialog_on} toggle={toggleDialog} />
                    </div>
                </CSSTransition>
            )}
        </div>
    );
});

export default AccountInfoWallets;
