import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { AccountActionsDTraderV2 } from 'App/Components/Layout/Header';

const HeaderAccountActionsDTraderV2 = observer(() => {
    const { client, ui, notifications } = useStore();
    const { account_type, balance, currency, has_any_real_account, is_eu, is_logged_in, is_virtual } = client;
    const {
        account_switcher_disabled_message,
        disableApp,
        enableApp,
        is_account_switcher_disabled,
        is_accounts_switcher_on,
        openRealAccountSignup,
        toggleAccountsDialog,
        toggleReadyToDepositModal,
    } = ui;
    const { is_notifications_visible, notifications: notifications_array, toggleNotificationsModal } = notifications;

    const history = useHistory();

    const onClickDeposit = () => {
        if (!has_any_real_account && is_virtual) {
            toggleReadyToDepositModal();
        } else {
            history.push(routes.cashier_deposit);
        }
    };

    return (
        <div className='header-v2__acc-info__container'>
            <AccountActionsDTraderV2
                acc_switcher_disabled_message={account_switcher_disabled_message}
                account_type={account_type}
                balance={balance}
                currency={currency}
                disableApp={disableApp}
                enableApp={enableApp}
                is_acc_switcher_on={is_accounts_switcher_on}
                is_acc_switcher_disabled={is_account_switcher_disabled}
                is_eu={is_eu}
                is_notifications_visible={is_notifications_visible}
                is_logged_in={is_logged_in}
                is_virtual={is_virtual}
                onClickDeposit={onClickDeposit}
                notifications_count={notifications_array.length}
                toggleAccountsDialog={toggleAccountsDialog}
                toggleNotifications={toggleNotificationsModal}
                openRealAccountSignup={openRealAccountSignup}
            />
        </div>
    );
});

export default HeaderAccountActionsDTraderV2;
