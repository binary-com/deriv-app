import { useEffect, useState } from 'react';
import { useBalanceSubscription } from '@deriv/api-v2';
import Observable from '../utils/observable';

type TBalance = ReturnType<typeof useBalanceSubscription>['data']['accounts'];

const balanceStore = new Observable<TBalance | undefined>(undefined);

/**
 * Custom hook that manages subscription to balance changes from `balanceStore`.
 * Retrieves initial balance and subscribes to future updates.
 * @returns An object containing the current balance and a function to update it.
 * @example const { data: balanceData, setBalanceData } = useSubscribedBalance();
 */
const useSubscribedBalance = () => {
    const [balance, setBalance] = useState(balanceStore.get());
    useEffect(() => {
        return balanceStore.subscribe(setBalance); // subscribe setBalance to the balance store and return the cleanup function
    }, []);

    return {
        data: balance,
        isLoading: !balance,
        setBalanceData: (data: TBalance) => {
            balanceStore.set(data);
        },
    };
};

export default useSubscribedBalance;
