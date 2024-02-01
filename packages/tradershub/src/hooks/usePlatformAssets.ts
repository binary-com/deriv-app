import { useEffect } from 'react';
import { useExchangeRates, useTradingAccountsList } from '@deriv/api';

/**
 * @description This hook is used to get the total demo and real balance of the user
 * @param regulation  - Regulation of the user
 */
const usePlatformAssets = (regulation?: string) => {
    const {
        data: tradingAccount,
        fiat_account: fiatAccount,
        isSuccess: isTradingAccountSuccess,
    } = useTradingAccountsList();
    const { data, getExchangeRate, subscribe: multiSubscribe, unsubscribe } = useExchangeRates();

    const isEURegulation = regulation === 'EU';

    const fiatCurrency = isEURegulation
        ? tradingAccount?.find(account => account.broker === 'MF')?.currency
        : fiatAccount;

    const demoAccount = tradingAccount?.find(account => account.is_virtual);
    const realAccounts = tradingAccount?.filter(account => !account.is_virtual);

    const regionRealAccounts = realAccounts?.filter(account => {
        if (isEURegulation) {
            return account.broker === 'MF';
        }

        return account.broker === 'CR';
    });

    useEffect(() => {
        if (isTradingAccountSuccess && fiatCurrency !== undefined) {
            multiSubscribe({
                base_currency: fiatCurrency,
                target_currencies: realAccounts?.map(account => account.currency ?? 'USD') ?? [],
            });
        }
    }, [data, fiatCurrency, isTradingAccountSuccess, multiSubscribe, realAccounts, unsubscribe]);

    const totalRealPlatformBalance =
        regionRealAccounts?.reduce((total, account) => {
            const exchangeRate = getExchangeRate(fiatCurrency ?? 'USD', account.currency ?? 'USD');
            return total + (account.balance ?? 0) / exchangeRate;
        }, 0) ?? 0;

    const demoAccountBalance = demoAccount?.balance ?? 0;

    return {
        demoAccountBalance,
        fiatCurrency,
        isSuccess: isTradingAccountSuccess,
        realAccounts,
        totalRealPlatformBalance,
    };
};

export default usePlatformAssets;
