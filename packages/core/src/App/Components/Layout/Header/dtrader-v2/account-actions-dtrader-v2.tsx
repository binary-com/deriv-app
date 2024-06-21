import React from 'react';
import 'Sass/app/_common/components/account-switcher-dtrader-v2.scss';
import { LabelPairedBellLgRegularIcon } from '@deriv/quill-icons';
import { formatMoney, moduleLoader } from '@deriv/shared';
import { Badge } from '@deriv-com/quill-ui';

type TAccountActionsDTraderV2 = {
    acc_switcher_disabled_message?: string;
    account_type?: string;
    balance?: number | string;
    currency: string;
    is_acc_switcher_disabled?: boolean;
    is_eu?: boolean;
    is_acc_switcher_on?: boolean;
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
    is_disabled?: boolean;
    toggleDialog: (value?: boolean | undefined) => void;
};
const AccountInfoDTraderV2 = React.lazy(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "account-info-dtrader-v2", webpackPreload: true */ 'App/Components/Layout/Header/dtrader-v2/account-info-dtrader-v2'
                )
        ) as Promise<{
            default: React.ComponentType<TAccountInfoDTraderV2>;
        }>
);

const AccountActionsDTraderV2 = ({
    acc_switcher_disabled_message,
    account_switcher_title,
    account_type,
    balance,
    currency,
    is_acc_switcher_on,
    is_acc_switcher_disabled,
    is_eu,
    is_virtual,
    notifications_count,
    toggleAccountsDialog,
}: TAccountActionsDTraderV2) => (
    <React.Suspense fallback={<div />}>
        <AccountInfoDTraderV2
            acc_switcher_disabled_message={acc_switcher_disabled_message}
            account_switcher_title={account_switcher_title}
            account_type={account_type}
            balance={typeof balance === 'undefined' ? balance : formatMoney(currency, balance, true)}
            currency={currency}
            is_disabled={is_acc_switcher_disabled}
            is_eu={is_eu}
            is_virtual={is_virtual}
            is_dialog_on={is_acc_switcher_on}
            toggleDialog={toggleAccountsDialog}
        />
        <div className='notifications__wrapper'>
            {notifications_count ? (
                <Badge
                    color='danger'
                    contentSize='sm'
                    label={notifications_count.toString()}
                    position='top-right'
                    size='sm'
                    variant='notification'
                >
                    <LabelPairedBellLgRegularIcon className='notifications__icon' />
                </Badge>
            ) : (
                <LabelPairedBellLgRegularIcon className='notifications__icon' />
            )}
        </div>
    </React.Suspense>
);

export default AccountActionsDTraderV2;
