import { useEffect } from 'react';
import useAuthorize from './useAuthorize';
import useSubscription from '../useSubscription';
import { displayMoney } from '../utils';
import useActiveWalletAccount from './useActiveWalletAccount';

/**
 * Hook to display live, subscribed balance.
 * Use when you have only one wallet on screen.
 */
const useActiveWalletBalance = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: account } = useAuthorize();

    const { subscribe, data: balanceData, ...rest } = useSubscription('balance');

    const balance = balanceData?.balance?.balance || 0;
    const currencyCode = balanceData?.balance?.currency || 'USD';

    useEffect(() => {
        const unsubscribe = subscribe();

        return () => unsubscribe?.();
    }, [subscribe]);

    const displayBalance = displayMoney(balance, currencyCode, {
        fractional_digits: activeWallet?.currency_config?.fractional_digits,
        preferred_language: account?.preferred_language,
    });

    return {
        data: balanceData,
        displayBalance,
        ...rest,
    };
};

export default useActiveWalletBalance;
