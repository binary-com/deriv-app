import { useMemo } from 'react';
import useAuthorize from './useAuthorize';
import useBalance from './useBalance';
import useCurrencyConfig from './useCurrencyConfig';
import { displayMoney } from '../utils';
import useAuthorizedQuery from '../useAuthorizedQuery';
import { getAccountListWithAuthToken } from '@deriv/utils';

/** A custom hook that returns the list of accounts for the current user. */
const useDerivAccountsList = () => {
    const { data: authorize_data } = useAuthorize();

    // its pretty much stale data, so never refresh, unless user creates a new account
    const { data: account_list_data, ...rest } = useAuthorizedQuery(
        'account_list',
        {},
        {
            staleTime: Infinity,
        }
    );

    const { data: balance_data } = useBalance();
    const { getConfig } = useCurrencyConfig();

    // Add additional information to the authorize response.
    const modified_accounts = useMemo(() => {
        return getAccountListWithAuthToken(account_list_data?.account_list)?.map(account => {
            return {
                ...account,
                /** Creation time of the account. */
                created_at: account.created_at ? new Date(account.created_at) : undefined,
                /** Account's currency config information */
                currency_config: account.currency ? getConfig(account.currency) : undefined,
                /** Date till client has excluded him/herself from the website, only present if client is self excluded. */
                excluded_until: account.excluded_until ? new Date(account.excluded_until) : undefined,
                /** Indicating whether the wallet is the currently active account. */
                is_active: account.loginid === authorize_data?.loginid,
                /** Indicating whether any linked account is active */
                is_linked_account_active: account.linked_to?.some(
                    account => account.loginid === authorize_data?.loginid
                ),
                /** indicating whether the account is marked as disabled or not. */
                is_disabled: Boolean(account.is_disabled),
                /** indicating whether the account is a trading account. */
                is_trading: account.account_category === 'trading',
                /** indicating whether the account is a virtual-money account. */
                is_virtual: Boolean(account.is_virtual),
                /** indicating whether the account is a wallet account. */
                is_wallet: account.account_category === 'wallet',
                /** The account ID of specified account. */
                loginid: `${account.loginid}`,
                /** The platform of the account */
                platform: 'deriv' as const,
                /** To indicate whether the account is MF or not */
                is_mf: account.loginid?.startsWith('MF'),
            } as const;
        });
    }, [account_list_data?.account_list, authorize_data?.loginid, getConfig]);

    // Add balance to each account
    const modified_accounts_with_balance = useMemo(
        () =>
            modified_accounts?.map(account => {
                const balance = balance_data?.accounts?.[account.loginid]?.balance || 0;

                return {
                    ...account,
                    /** The balance of the account. */
                    balance,
                    /** The balance of the account in currency format. */
                    display_balance: displayMoney(balance, account.currency_config?.display_code || 'USD', {
                        fractional_digits: account.currency_config?.fractional_digits,
                        preferred_language: authorize_data?.preferred_language,
                    }),
                };
            }),
        [balance_data?.accounts, modified_accounts, authorize_data?.preferred_language]
    );

    return {
        /** The list of accounts for the current user. */
        data: modified_accounts_with_balance,
        ...rest,
    };
};

export default useDerivAccountsList;
