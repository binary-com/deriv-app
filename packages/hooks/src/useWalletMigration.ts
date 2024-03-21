import { useStore } from '@deriv/stores';

/** A custom hook to get the status of wallet_migration API and to start/reset the migration process
 * This hook is for the legacy WS connection (appstore and core packages)
 * This hook should be used in the component wrapped by observer
 */
const useWalletMigration = () => {
    const { client } = useStore();
    const { wallet_migration_state, startWalletMigration, resetWalletMigration } = client;

    return {
        /** The status of the wallet_migration API */
        state: wallet_migration_state,
        /** A boolean to check if the status is not_eligible */
        is_ineligible: wallet_migration_state === 'ineligible',
        /** A boolean to check if the status is eligible */
        is_eligible: wallet_migration_state === 'eligible',
        /** A boolean to check if the status is in_progress */
        is_in_progress: wallet_migration_state === 'in_progress',
        /** A boolean to check if the status is completed */
        is_migrated: wallet_migration_state === 'migrated',
        /** A boolean to check if the status is failed */
        is_failed: wallet_migration_state === 'failed',
        /** Sends a request to wallet_migration API to start the migration process */
        start_migration: startWalletMigration,
        /** Sends a request to wallet_migration API to reset the migration process */
        reset_migration: resetWalletMigration,
    };
};

export default useWalletMigration;
