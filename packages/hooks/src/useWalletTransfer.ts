import { useEffect, useMemo, useState } from 'react';
import useTransferBetweenAccounts from './useTransferBetweenAccounts';

const useWalletTransfer = () => {
    const { active_wallet, transfer_accounts, isSuccess: is_accounts_loaded } = useTransferBetweenAccounts();

    const [from_account, setFromAccount] = useState<typeof active_wallet>();
    const [to_account, setToAccount] = useState<typeof active_wallet>();
    const [is_from_account_loading, setIsFromAccountLoading] = useState(true);

    const to_account_list = useMemo(() => {
        if (from_account?.loginid === active_wallet?.loginid) {
            setToAccount(undefined);
            return {
                accounts: transfer_accounts.accounts,
                wallets: transfer_accounts.wallets?.filter(account => account.loginid !== active_wallet?.loginid),
            };
        }
        setToAccount(active_wallet);
        return { accounts: [], wallets: [active_wallet] };
    }, [active_wallet, from_account?.loginid, transfer_accounts]);

    useEffect(() => {
        if (active_wallet) {
            setFromAccount(active_wallet);
            setIsFromAccountLoading(false);
        }
    }, [active_wallet]);

    return {
        active_wallet,
        is_loading: is_from_account_loading || !is_accounts_loaded,
        from_account,
        to_account,
        to_account_list,
        transfer_accounts,
        setFromAccount,
        setToAccount,
    };
};

export default useWalletTransfer;
