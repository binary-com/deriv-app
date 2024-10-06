import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';
import useCurrencyConfig from './useCurrencyConfig';
import { displayMoney } from '../utils';
import useTradingAccountsList from './useTradingAccountsList';
import useExchangeRates from './useExchangeRates';

/** A custom hook that gets the list created MT5 accounts of the user. */
const useMT5AccountsList = () => {
    const { isSuccess } = useAuthorize();
    const { getConfig } = useCurrencyConfig();
    const { fiat_account } = useTradingAccountsList();
    const { getExchangeRate } = useExchangeRates();

    const { data: mt5_accounts, ...mt5_accounts_rest } = useQuery('mt5_login_list', {
        options: { enabled: isSuccess },
    });

    /**
     * @description The list of created MT5 accounts
     */
    const modified_mt5_accounts = useMemo(() => {
        return mt5_accounts?.mt5_login_list?.map(account => {
            const balance = account.balance ?? 0;
            return {
                ...account,
                /** Account's currency config information */
                currency_config: account.currency ? getConfig(account.currency) : undefined,
                /** The formatted display login of the account */
                display_login: account.login?.replace(/^(MT[DR]?)/, ''),
                /** Landing company shortcode the account belongs to. */
                landing_company_name: account.landing_company_short,
                /** The id of the account */
                loginid: account.login,
                /** The balance of the account in currency format. */
                display_balance: displayMoney(account.balance || 0, account.currency || 'USD'),
                /** indicating whether the account is a virtual-money account. */
                is_virtual: account.account_type === 'demo',
                /** The platform of the account */
                platform: 'mt5' as const,
                /** Converted balance from the exchange rate */
                converted_balance: getExchangeRate(fiat_account, account.currency ?? 'USD') * balance,
            };
        });
    }, [fiat_account, getConfig, getExchangeRate, mt5_accounts?.mt5_login_list]);

    return {
        /** The list of created MT5 accounts */
        data: modified_mt5_accounts,
        ...mt5_accounts_rest,
    };
};

export default useMT5AccountsList;
