import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';
import useCurrencyConfig from './useCurrencyConfig';
import { displayMoney } from '../utils';
import useTradingAccountsList from './useTradingAccountsList';
import useExchangeRates from './useExchangeRates';

/** A custom hook that gets the list of created Deriv X accounts. */
const useDxtradeAccountsList = () => {
    const { isSuccess } = useAuthorize();
    const { data: dxtrade_accounts, ...rest } = useQuery('trading_platform_accounts', {
        payload: { platform: 'dxtrade' },
        options: { enabled: isSuccess },
    });
    const { getConfig } = useCurrencyConfig();
    const { getExchangeRate } = useExchangeRates();
    const { fiat_account } = useTradingAccountsList();

    /** Adding necessary properties to Deriv X accounts */
    const modified_dxtrade_accounts = useMemo(
        () =>
            dxtrade_accounts?.trading_platform_accounts?.map(account => {
                const balance = account.balance ?? 0;
                return {
                    ...account,
                    /** Account's currency config information */
                    currency_config: account.currency ? getConfig(account.currency) : undefined,
                    /** The balance of the account in currency format. */
                    display_balance: displayMoney(account?.balance || 0, account?.currency || 'USD'),
                    /** indicating whether the account is a virtual-money account. */
                    is_virtual: account.account_type === 'demo',
                    /** Landing company shortcode the account belongs to. */
                    landing_company_name: account.landing_company_short,
                    /** The login id of the Deriv X account */
                    loginid: account.account_id,
                    /** The platform of the account */
                    platform: 'dxtrade' as const,
                    /** Converted balance from the exchange rate */
                    converted_balance: getExchangeRate(fiat_account, account.currency ?? 'USD') * balance,
                };
            }),
        [dxtrade_accounts?.trading_platform_accounts, fiat_account, getConfig, getExchangeRate]
    );

    return {
        /** List of all created Deriv X accounts */
        data: modified_dxtrade_accounts,
        ...rest,
    };
};

export default useDxtradeAccountsList;
