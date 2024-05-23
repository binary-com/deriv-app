import { useMemo } from 'react';
import useAuthorizedQuery from '../useAuthorizedQuery';

/** A custom hook that gets the list of available wallets. */
const useAvailableWallets = () => {
    // pretty much stale data, unless user creates a new wallet
    const { data, ...rest } = useAuthorizedQuery(
        'available_accounts',
        {
            categories: ['wallet'],
        },
        {
            staleTime: Infinity,
        },
        false
    );

    const modifiedData = useMemo(() => {
        if (!data?.available_accounts?.wallets) return;

        return data.available_accounts.wallets;
    }, [data]);

    return {
        /** List of available wallet accounts to create */
        data: modifiedData,
        ...rest,
    };
};

export default useAvailableWallets;
