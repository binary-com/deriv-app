import { useCallback } from 'react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api-v2';

const useWalletAccountSwitcher = () => {
    const { data: authorizeData, switchAccount: _switchAccount } = useAuthorize();
    const { data: walletAccounts } = useWalletAccountsList();

    const switchWalletAccount = useCallback(
        async (loginid: string) => {
            const dtradeAccount = walletAccounts
                ?.find(account => account.loginid === loginid)
                ?.linked_to?.find(linkedAccount => linkedAccount.platform === 'dtrade');

            await _switchAccount(loginid);
            const linkedAccountDetails = authorizeData.account_list?.find(
                account => account.loginid === dtradeAccount?.loginid
            );

            if (dtradeAccount?.loginid && !linkedAccountDetails?.is_disabled)
                localStorage.setItem('active_loginid', dtradeAccount.loginid);
        },
        [_switchAccount, authorizeData.account_list, walletAccounts]
    );

    return switchWalletAccount;
};

export default useWalletAccountSwitcher;
