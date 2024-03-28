import { useMemo } from 'react';
import { useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { THooks } from '../../../hooks/types';

type TModifiedAccounts = ReturnType<typeof getModifiedAccounts>;

const getModifiedAccounts = (
    accounts: THooks.TransferAccounts,
    getConfig: ReturnType<typeof useCurrencyConfig>['getConfig']
) => {
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
const useExtendedTransferAccounts = (accounts: THooks.TransferAccounts) => {
    const { data: activeAccount, isLoading: isActiveAccountLoading } = useActiveAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = !accounts || isActiveAccountLoading || isCurrencyConfigLoading;

    const modifiedAccounts = getModifiedAccounts(accounts, getConfig);

    const extendedTransferableAccounts = useMemo(() => {
        return [
            ...sortedMT5Accounts(modifiedAccounts),
            ...derivCTrader(modifiedAccounts),
            ...derivXAccount(modifiedAccounts),
            ...fiatDerivAccounts(modifiedAccounts),
            ...sortedCryptoDerivAccounts(modifiedAccounts),
        ];
    }, [modifiedAccounts]);

    const transferableActiveAccount = useMemo(() => {
        if (!extendedTransferableAccounts) return undefined;

        return extendedTransferableAccounts.find(account => account.loginid === activeAccount?.loginid);
    }, [activeAccount, extendedTransferableAccounts]);

    return {
        accounts: extendedTransferableAccounts,
        activeAccount: transferableActiveAccount,
        isLoading: isLoading || !extendedTransferableAccounts || !transferableActiveAccount,
    };
};

export default useExtendedTransferAccounts;
