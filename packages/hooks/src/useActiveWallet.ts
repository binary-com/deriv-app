import { useMemo } from 'react';
import useWalletAccountsList from './useWalletAccountsList';

/** A custom hook that returns the wallet object for the current active wallet. */
/** @deprecated Use `useActiveWalletAccount` instead. */
const useActiveWallet = () => {
    const { data } = useWalletAccountsList();
    const active_wallet = useMemo(() => data?.find(wallet => wallet.is_active), [data]);

    /** User's current active wallet. */
    return active_wallet;
};

export default useActiveWallet;
