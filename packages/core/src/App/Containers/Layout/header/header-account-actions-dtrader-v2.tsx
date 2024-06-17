import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { AccountActionsDTraderV2 } from 'App/Components/Layout/Header';
import { getCurrencyName } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const HeaderAccountActionsDTraderV2 = observer(() => {
    const { client, ui, notifications } = useStore();
    const { account_type, balance, currency, is_eu, is_logged_in, is_virtual, loginid } = client;
    const {
        account_switcher_disabled_message,
        is_account_switcher_disabled,
        is_accounts_switcher_on,
        toggleAccountsDialog,
    } = ui;
    const { notifications: notifications_array } = notifications;
    //TODO: move to helper (together with the duplicates)
    const currencyDisplay = ({
        currency,
        loginid,
        is_virtual,
    }: {
        currency?: string;
        loginid?: string;
        is_virtual?: boolean;
    }) => {
        const account_type = loginid?.replace(/\d/g, '');

        if (account_type === 'MF') {
            return <Localize i18n_default_text='Multipliers' />;
        }

        if (is_virtual) {
            return <Localize i18n_default_text='Demo' />;
        }

        if (!currency) {
            return <Localize i18n_default_text='No currency assigned' />;
        }

        return getCurrencyName(currency);
    };

    return (
        <div className='header-v2__acc-info__container'>
            <AccountActionsDTraderV2
                account_switcher_title={currencyDisplay({ currency, loginid, is_virtual })}
                acc_switcher_disabled_message={account_switcher_disabled_message}
                account_type={account_type}
                balance={balance}
                currency={currency}
                is_acc_switcher_on={is_accounts_switcher_on}
                is_acc_switcher_disabled={is_account_switcher_disabled}
                is_eu={is_eu}
                is_logged_in={is_logged_in}
                is_virtual={is_virtual}
                notifications_count={notifications_array.length}
                toggleAccountsDialog={toggleAccountsDialog}
            />
        </div>
    );
});

export default HeaderAccountActionsDTraderV2;
