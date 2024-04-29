import { useMemo } from 'react';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { THooks } from '../../../hooks/types';

type TModifiedAccounts = ReturnType<typeof getModifiedAccounts>;

const getModifiedAccounts = (accounts: THooks.TransferAccounts, getConfig: THooks.GetCurrencyConfig) => {
    return accounts.map(account => {
        const currencyConfig = account?.currency ? getConfig(account.currency) : undefined;
        return {
            ...account,
            currencyConfig,
            displayBalance: displayMoney(Number(account.balance), account.currency ?? '', {
                fractional_digits: currencyConfig?.fractional_digits,
            }),
        };
    });
};

const sortedMT5Accounts = (accounts: TModifiedAccounts) => {
    return accounts.filter(account => account.account_type === 'mt5');
};

const derivCTrader = (accounts: TModifiedAccounts) => {
    return accounts.filter(account => account.account_type === 'ctrader');
};

const derivXAccount = (accounts: TModifiedAccounts) => accounts.filter(account => account.account_type === 'dxtrade');

const fiatDerivAccounts = (accounts: TModifiedAccounts) => {
    return accounts.filter(account => account.account_type === 'binary' && account.currencyConfig?.is_fiat);
};

const sortedCryptoDerivAccounts = (accounts: TModifiedAccounts) => {
    return accounts
        .filter(account => account.account_type === 'binary' && account.currencyConfig?.is_crypto)
        .sort((prev, next) => {
            return prev.currency && next.currency ? prev.currency.localeCompare(next.currency) : 0;
        });
};

/**
    A hook which modifies the accounts received from `transfer_between_accounts` response as follows
    - appends `currency_config` data for each account
    - sorts the mt5 accounts based on group type
    - sorts the crypto accounts alphabetically
*/

const useExtendedTransferAccounts = (
    activeAccount: THooks.ActiveAccount,
    getConfig: THooks.GetCurrencyConfig,
    accounts: THooks.TransferAccounts = []
) => {
    const modifiedAccounts = getModifiedAccounts(accounts, getConfig);

    const sortedTransferableAccounts = useMemo(() => {
        return [
            ...sortedMT5Accounts(modifiedAccounts),
            ...derivCTrader(modifiedAccounts),
            ...derivXAccount(modifiedAccounts),
            ...fiatDerivAccounts(modifiedAccounts),
            ...sortedCryptoDerivAccounts(modifiedAccounts),
        ];
    }, [modifiedAccounts]);

    const transferableActiveAccount = modifiedAccounts.find(account => account.loginid === activeAccount.loginid);

    return {
        accounts: sortedTransferableAccounts,
        activeAccount: transferableActiveAccount,
    };
};

export default useExtendedTransferAccounts;
