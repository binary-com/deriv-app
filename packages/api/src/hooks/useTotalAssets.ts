import useActiveTradingAccount from './useActiveTradingAccount';
import useCFDAccountsList from './useCFDAccountsList';
import useTradingAccountsList from './useTradingAccountsList';
import { displayMoney } from '../utils';
import useAuthorize from './useAuthorize';
import useExchangeRates from './useExchangeRates';
import { useEffect } from 'react';
import useCurrencyConfig from './useCurrencyConfig';

/**
 * @description Get total balance of all accounts
 * @returns data - Total balance of all accounts
 */
const useTotalAssets = () => {
    const { data: tradingAccount, isSuccess: isTradingAccountSuccess } = useTradingAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();
    const { data: cfdAccount, isSuccess: isCFDAccountSuccess } = useCFDAccountsList();
    const { data: authorize_data, isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data, subscribe: multiSubscribe, unsubscribe } = useExchangeRates();
    const { getConfig } = useCurrencyConfig();

    const exchangeRateConverter = (base: string, target: string) => {
        if (data?.exchange_rates?.rates) {
            return data?.exchange_rates?.rates[base]?.[target] ?? 1;
        }
        return 1;
    };

    const mt5Accountbalance =
        cfdAccount?.mt5.reduce((a, b) => {
            const exchangeRate = exchangeRateConverter(b.currency ?? '', 'USD');
            return a + (b.balance ?? 0) / exchangeRate;
        }, 0) ?? 0;

    const dxtradeAccountsBalance =
        cfdAccount?.dxtrade.reduce((a, b) => {
            const exchangeRate = exchangeRateConverter(b.currency ?? '', 'USD');
            return a + (b.balance ?? 0) / exchangeRate;
        }, 0) ?? 0;

    const ctraderAccountsBalance =
        cfdAccount?.ctrader.reduce((a, b) => {
            const exchangeRate = exchangeRateConverter(b.currency ?? '', 'USD');
            return a + (b.balance ?? 0) / exchangeRate;
        }, 0) ?? 0;

    const demoAccount = tradingAccount?.find(account => account.is_virtual);
    const realAccounts = tradingAccount?.filter(account => !account.is_virtual);

    const fiat_account =
        realAccounts?.find(account => getConfig(account.currency ?? '')?.is_fiat)?.currency ?? undefined;

    useEffect(() => {
        if (isTradingAccountSuccess && fiat_account !== undefined) {
            multiSubscribe({
                base_currency: fiat_account,
                target_currencies: realAccounts?.map(account => account.currency ?? 'USD') ?? [],
            });
        }
    }, [data, fiat_account, isTradingAccountSuccess, multiSubscribe, realAccounts, unsubscribe]);

    const totalRealBalance =
        realAccounts?.reduce((total, account) => {
            const exchangeRate = exchangeRateConverter(account.currency ?? '', 'USD');
            return total + (account.balance ?? 0) / exchangeRate;
        }, 0) ?? 0;

    const demoAccountBalance = demoAccount?.balance ?? 0;

    const totalCFDBalance = mt5Accountbalance + dxtradeAccountsBalance + ctraderAccountsBalance;

    const demoTotalBalance = demoAccountBalance + totalCFDBalance;

    const realTotalBalance = totalRealBalance + totalCFDBalance;

    const totalBalance = activeTradingAccount?.is_virtual ? demoTotalBalance : realTotalBalance;

    const formattedTotalBalance = displayMoney(totalBalance, fiat_account, {
        fractional_digits: 2,
        preferred_language: authorize_data?.preferred_language,
    });

    return {
        //Returns the total balance of all accounts
        data: formattedTotalBalance,
        //Returns true if all the requests are successful
        isSuccess: isTradingAccountSuccess && isCFDAccountSuccess && isAuthorizeSuccess,
        realAccounts,
    };
};

export default useTotalAssets;
