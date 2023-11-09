import { useMemo } from 'react';
import useQuery from '../useQuery';

/** A custom hook that gets the list of available wallets. */
const useAvailableWallets = () => {
    const { data, ...rest } = useQuery('available_accounts', {
        payload: {
            categories: ['wallet'],
        },
    });

    const modified_data = useMemo(() => {
        if (!data?.available_accounts?.wallets) return;

        return data.available_accounts.wallets;
    }, [data]);

    return {
        /** List of available wallet accounts to create */
        data: modified_data,
        ...rest,
    };
};

export default useAvailableWallets;
