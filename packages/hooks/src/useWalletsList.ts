import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useWalletList = () => {
    const { client } = useStore();
    const { accounts, loginid, is_crypto } = client;
    const { data, ...reset } = useFetch('authorize', {
        payload: { authorize: accounts[loginid || ''].token },
        options: { enabled: Boolean(loginid) },
    });
    const { data: balance_data } = useFetch('balance', { payload: { account: 'all' } });

    const sortedWallets = useMemo(() => {
        // @ts-expect-error Need to update @deriv/api-types to fix the TS error
        // Filter out accounts which has account_category as wallet
        const wallets = data?.authorize?.account_list?.filter(account => account.account_category === 'wallet');

        // Modify the wallets to include the missing balance from the API response
        // Should remove this once the API is fixed
        const modified_wallets = wallets?.map(wallet => ({
            ...wallet,
            /** Indicating whether the wallet is the currently selected wallet. */
            is_selected: wallet.loginid === loginid,
            /** Indicating whether the wallet is a virtual-money wallet. */
            is_demo: wallet.is_virtual === 1,
            /** Wallet balance */
            balance: balance_data?.balance?.accounts?.[wallet.loginid || '']?.balance || 0,
            /** Landing company shortcode the account belongs to. */
            landing_company_name: wallet.landing_company_name === 'maltainvest' ? 'malta' : wallet.landing_company_name,
            /** @deprecated should use `landing_company_name` instead */
            landing_company_shortcode:
                wallet.landing_company_name === 'maltainvest' ? 'malta' : wallet.landing_company_name,
            is_malta_wallet: wallet.landing_company_name === 'malta',
        }));

        // Sort the wallets alphabetically by fiat, crypto, then virtual
        return modified_wallets?.sort((a, b) => {
            if (a.is_virtual !== b.is_virtual) {
                return a.is_virtual ? 1 : -1;
            } else if (is_crypto(a.currency) !== is_crypto(b.currency)) {
                return is_crypto(a.currency) ? 1 : -1;
            }

            return (a.currency || 'USD').localeCompare(b.currency || 'USD');
        });
    }, [balance_data?.balance?.accounts, data?.authorize?.account_list, is_crypto, loginid]);

    return {
        ...reset,
        data: sortedWallets,
    };
};

export default useWalletList;
