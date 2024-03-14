import { useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { getMarketType } from '../../../helpers';
import { THooks } from '../../../hooks/types';

type TGetCurrencyConfig = ReturnType<typeof useCurrencyConfig>['getConfig'];

const sortedMT5Accounts = (accounts: THooks.TransferAccount, getConfig: TGetCurrencyConfig) => {
    return [
        ...accounts
            .filter(account => account.account_type === 'mt5' && getMarketType(account.mt5_group) === 'synthetic')
            .map(account => ({
                ...account,
                currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
            })),
        ...accounts
            .filter(account => account.account_type === 'mt5' && getMarketType(account.mt5_group) === 'financial')
            .map(account => ({
                ...account,
                currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
            })),
        ...accounts
            .filter(account => account.account_type === 'mt5' && getMarketType(account.mt5_group) === 'all')
            .map(account => ({
                ...account,
                currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
            })),
    ];
};

const derivCTrader = (accounts: THooks.TransferAccount, getConfig: TGetCurrencyConfig) => {
    return accounts
        .filter(account => account.account_type === 'ctrader')
        .map(account => ({
            ...account,
            currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
        }));
};

const derivXAccount = (accounts: THooks.TransferAccount, getConfig: TGetCurrencyConfig) =>
    accounts
        .filter(account => account.account_type === 'dxtrade')
        .map(account => ({
            ...account,
            currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
        }));

const fiatDerivAccounts = (accounts: THooks.TransferAccount, getConfig: TGetCurrencyConfig) => {
    return accounts
        .filter(
            account => account.account_type === 'binary' && account.currency && getConfig(account.currency)?.is_fiat
        )
        .map(account => ({
            ...account,
            currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
        }));
};

const sortedCryptoDerivAccounts = (accounts: THooks.TransferAccount, getConfig: TGetCurrencyConfig) => {
    return accounts
        .filter(
            account => account.account_type === 'binary' && account.currency && getConfig(account.currency)?.is_crypto
        )
        .map(account => ({
            ...account,
            currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
        }))
        .sort((prev, next) => {
            if (prev.currency && next.currency) return prev.currency.localeCompare(next.currency);
        });
};

/**
    A hook which modifies the accounts received from `transfer_between_accounts` response as follows
    - appends `currency_config` data for each account
    - sorts the mt5 accounts based on group type
    - sorts the crypto accounts alphabetically
*/
const useExtendedTransferBetweenAccounts = (accounts: THooks.TransferAccount) => {
    // console.log('=> hook - accounts', accounts);
    const { data: activeAccount, isLoading: isActiveAccountLoading } = useActiveAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = !accounts || isActiveAccountLoading || isCurrencyConfigLoading;

    const extendedTransferableAccounts = !isLoading
        ? [
              ...sortedMT5Accounts(accounts, getConfig),
              ...derivCTrader(accounts, getConfig),
              ...derivXAccount(accounts, getConfig),
              ...fiatDerivAccounts(accounts, getConfig),
              ...sortedCryptoDerivAccounts(accounts, getConfig),
          ]
        : [];

    const transferableActiveAccount =
        !!extendedTransferableAccounts || !isLoading
            ? extendedTransferableAccounts?.find((account: typeof extendedTransferableAccounts[number]) => {
                  if (account.loginid === activeAccount?.loginid) {
                      return {
                          ...activeAccount,
                          currencyConfig: activeAccount?.currency ? getConfig(activeAccount.currency) : undefined,
                      };
                  }
              })
            : undefined;

    return {
        accounts: extendedTransferableAccounts,
        activeAccount: transferableActiveAccount,
        isLoading: isLoading || !extendedTransferableAccounts.length || !transferableActiveAccount,
    };
};

export default useExtendedTransferBetweenAccounts;
