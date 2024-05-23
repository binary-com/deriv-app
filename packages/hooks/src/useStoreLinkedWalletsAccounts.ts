import { useMemo } from 'react';
import useStoreWalletAccountsList from './useStoreWalletAccountsList';

type TLinkedAccount = {
    loginid?: string;
    platform?: Exclude<'ctrader' | 'derivez' | 'dtrade' | 'dxtrade' | 'mt5', 'dwallet'>;
};

type TReturnObjectType = {
    [key in Exclude<TLinkedAccount['platform'], undefined>]: TLinkedAccount[];
};

/** A custom hook to get the list of linked accounts of all wallets */
const useStoreLinkedWalletsAccounts = () => {
    const { data: wallets_list } = useStoreWalletAccountsList();

    // define object with accounts
    const linked_trading_accounts = useMemo(() => {
        const linked_accounts: TReturnObjectType = {
            ctrader: [],
            derivez: [],
            dtrade: [],
            dxtrade: [],
            mt5: [],
        };

        wallets_list?.forEach(account => {
            const linked = account.linked_to as TLinkedAccount[];

            linked?.forEach(linked_to_account => {
                if (linked_to_account?.platform && linked_to_account?.loginid)
                    linked_accounts[linked_to_account.platform].push(linked_to_account);
            });
        });

        return linked_accounts;
    }, [wallets_list]);

    /** List of wallets for current user. */
    return linked_trading_accounts;
};

export default useStoreLinkedWalletsAccounts;
