import React from 'react';
import { observer, useStore } from '@deriv/stores';
import AccountActionsDTraderV2 from './account-actions-dtrader-v2';
import { getAccountTitle } from './Utils/account-switcher-dtrader-v2-utils';

type THeaderAccountActionsDTraderV2Props = {
    has_notifications_icon?: boolean;
};

const HeaderAccountActionsDTraderV2 = observer(({ has_notifications_icon }: THeaderAccountActionsDTraderV2Props) => {
    const { client, ui, notifications } = useStore();
    const { account_type, balance, currency, is_eu, is_virtual, loginid } = client;
    const {
        account_switcher_disabled_message,
        is_account_switcher_disabled,
        is_accounts_switcher_on,
        toggleAccountsDialog,
    } = ui;
    const { notifications: notifications_array } = notifications;

    return (
        <div className='header-v2__acc-info__container'>
            <AccountActionsDTraderV2
                account_switcher_title={getAccountTitle({ currency, loginid, is_virtual })}
                acc_switcher_disabled_message={account_switcher_disabled_message}
                account_type={account_type}
                balance={balance}
                currency={currency}
                has_notifications_icon={has_notifications_icon}
                is_acc_switcher_on={is_accounts_switcher_on}
                is_acc_switcher_disabled={is_account_switcher_disabled}
                is_eu={is_eu}
                is_virtual={is_virtual}
                notifications_count={notifications_array.length}
                toggleAccountsDialog={toggleAccountsDialog}
            />
        </div>
    );
});

export default HeaderAccountActionsDTraderV2;
