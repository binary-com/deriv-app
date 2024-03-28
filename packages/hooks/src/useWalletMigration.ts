import { useCallback } from 'react';
import { useQuery, useInvalidateQuery, useMutation } from '@deriv/api';
import useAuthorize from './useAuthorize';

/** A custom hook to get the status of wallet_migration API and to start/reset the migration process */
const useWalletMigration = () => {
    const { isSuccess } = useAuthorize();
    const invalidate = useInvalidateQuery();

    /** Make a request to wallet_migration API and onSuccess it will invalidate the cached data  */
    const { mutate } = useMutation('wallet_migration', { onSuccess: () => invalidate('wallet_migration') });

    /** Fetch the wallet_migration API and refetch it every second if the status is in_progress */
    const { data } = useQuery('wallet_migration', {
        payload: { wallet_migration: 'state' },
        options: {
            refetchInterval: response => (response?.wallet_migration?.state === 'in_progress' ? 500 : false),
            enabled: isSuccess,
        },
    });

    const startMigration = useCallback(() => mutate({ payload: { wallet_migration: 'start' } }), [mutate]);

    const resetMigration = useCallback(() => mutate({ payload: { wallet_migration: 'reset' } }), [mutate]);

    const state = data?.wallet_migration?.state;

    return {
        /** The status of the wallet_migration API */
        state,
        /** A boolean to check if the status is not_eligible */
        is_ineligible: state === 'ineligible',
        /** A boolean to check if the status is eligible */
        is_eligible: state === 'eligible',
        /** A boolean to check if the status is in_progress */
        is_in_progress: state === 'in_progress',
        /** A boolean to check if the status is completed */
        is_migrated: state === 'migrated',
        /** A boolean to check if the status is failed */
        is_failed: state === 'failed',
        /** Sends a request to wallet_migration API to start the migration process */
        startMigration,
        /** Sends a request to wallet_migration API to reset the migration process */
        resetMigration,
    };
};

export default useWalletMigration;
