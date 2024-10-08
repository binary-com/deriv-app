import { useStore } from '@deriv/stores';

/**
 * A custom hook to check whether the current account has deposited based on statement from the client store
 * This hook should be used in the component wrapped by observer
 */
const useStoreHasAccountDeposited = () => {
    const { client } = useStore();
    const { statement } = client;

    const count = statement?.count ?? 0;
    const transactions = statement?.transactions ?? [];
    const hasDeposited = transactions.some(tx => tx.action_type === 'deposit');
    const hasTransferred = transactions.some(tx => tx.action_type === 'transfer' && tx.amount && tx.amount > 0);
    const isLoaded = statement?.count !== undefined && statement?.transactions !== undefined;

    return { count, transactions, hasDeposited, hasTransferred, isLoaded };
};

export default useStoreHasAccountDeposited;
