import React from 'react';
import { LabelPairedBellLgRegularIcon } from '@deriv/quill-icons';
import { formatMoney, moduleLoader } from '@deriv/shared';
import { LoginButton } from './login-button.jsx';
import { SignupButton } from './signup-button.jsx';
import { Badge } from '@deriv-com/quill-ui';
import 'Sass/app/_common/components/account-switcher-dtrader-v2.scss';

type TAccountActionsDTraderV2 = {
    acc_switcher_disabled_message?: string;
    account_type?: string;
    balance?: number | string;
    currency: string;
    is_acc_switcher_disabled?: boolean;
    is_eu?: boolean;
    is_acc_switcher_on?: boolean;
    is_logged_in?: boolean;
    is_virtual?: boolean;
    notifications_count?: number;
    toggleAccountsDialog: (value?: boolean | undefined) => void;
    account_switcher_title?: React.ReactNode;
};

export type TAccountInfoDTraderV2 = Omit<
    TAccountActionsDTraderV2,
    'toggleAccountsDialog' | 'is_acc_switcher_disabled' | 'is_acc_switcher_on'
> & {
    is_dialog_on?: boolean;
    toggleDialog: (value?: boolean | undefined) => void;
    is_disabled?: boolean;
};
const AccountInfoDTraderV2 = React.lazy(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "account-info-dtrader-v2", webpackPreload: true */ 'App/Components/Layout/Header/account-info-dtrader-v2'
                )
        ) as Promise<{
            default: React.ComponentType<TAccountInfoDTraderV2>;
        }>
);

const AccountActionsDTraderV2 = React.memo(
    ({
        acc_switcher_disabled_message,
        account_type,
        balance,
        currency,
        is_acc_switcher_on,
        is_acc_switcher_disabled,
        is_eu,
        is_logged_in,
        is_virtual,
        notifications_count,
        toggleAccountsDialog,
        account_switcher_title,
    }: TAccountActionsDTraderV2) => {
        if (is_logged_in) {
            return (
                <React.Fragment>
                    <AccountInfoDTraderV2
                        acc_switcher_disabled_message={acc_switcher_disabled_message}
                        account_type={account_type}
                        balance={typeof balance === 'undefined' ? balance : formatMoney(currency, balance, true)}
                        is_disabled={is_acc_switcher_disabled}
                        is_eu={is_eu}
                        is_virtual={is_virtual}
                        currency={currency}
                        is_dialog_on={is_acc_switcher_on}
                        toggleDialog={toggleAccountsDialog}
                        account_switcher_title={account_switcher_title}
                    />
                    {/* TODO: old functionality was in <ToggleNotifications />. Current version is just placeholder without functionality*/}
                    <div className='notifications__wrapper'>
                        {notifications_count ? (
                            <Badge
                                variant='notification'
                                position='top-right'
                                label={notifications_count.toString()}
                                color='danger'
                                size='sm'
                                contentSize='sm'
                            >
                                <LabelPairedBellLgRegularIcon className='notifications__icon' />
                            </Badge>
                        ) : (
                            <LabelPairedBellLgRegularIcon className='notifications__icon' />
                        )}
                    </div>
                </React.Fragment>
            );
        }
        // TODO: remove Login/out after
        return (
            <React.Fragment>
                <LoginButton className='acc-info__button' />
                <SignupButton className='acc-info__button' />
            </React.Fragment>
        );
    }
);

AccountActionsDTraderV2.displayName = 'AccountActionsDTraderV2';

export { AccountActionsDTraderV2 };
