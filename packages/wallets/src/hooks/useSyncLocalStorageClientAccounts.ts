import { useCallback } from 'react';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useCreateNewRealAccount, useCreateWallet, useMutation, useSettings } from '@deriv/api-v2';
import { getAccountsFromLocalStorage } from '@deriv/utils';

type TNewWalletAccount = NonNullable<ReturnType<typeof useCreateWallet>['data']>;
type TNewTradingAccount = NonNullable<ReturnType<typeof useCreateNewRealAccount>['data']>;

const useSyncLocalStorageClientAccounts = () => {
    const { mutateAsync } = useMutation('account_list');
    const { data: settingsData } = useSettings();
    const [, setLocalStorageClientAccounts] = useLocalStorage(
        'client.accounts',
        useReadLocalStorage('client.accounts') ?? {}
    );

    const addWalletAccountToLocalStorage = useCallback(
        async (newAccount: TNewWalletAccount) => {
            if (!newAccount) return;

            const data = await mutateAsync();
            const account = data?.account_list?.find(acc => acc.loginid === newAccount.client_id);

            if (!account) return;

            if (newAccount && account) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: account.account_category,
                    account_type: account.account_type,
                    balance: 0,
                    created_at: account.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: account.excluded_until,
                    is_disabled: Number(account.is_disabled),
                    is_virtual: Number(account.is_virtual),
                    landing_company_name: account.landing_company_name?.replace('maltainvest', 'malta'),
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    linked_to: account.linked_to,
                    residence: settingsData.citizen || settingsData.country_code,
                    session_start: Math.floor(Date.now() / 1000),
                    token: newAccount.oauth_token,
                };

                const clientAccounts = getAccountsFromLocalStorage() ?? {};
                const localStorageData = { ...clientAccounts, [newAccount.client_id]: dataToStore };
                setLocalStorageClientAccounts(localStorageData);
            }
        },
        [mutateAsync, setLocalStorageClientAccounts, settingsData]
    );

    const addTradingAccountToLocalStorage = useCallback(
        async (newAccount: TNewTradingAccount) => {
            if (!newAccount) return;

            const data = await mutateAsync();
            const account = data?.account_list?.find(acc => acc.loginid === newAccount.client_id);

            if (!account || !account.loginid) return;

            if (newAccount) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: 'trading',
                    account_type: 'standard',
                    balance: 0,
                    created_at: account.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: account.excluded_until,
                    is_disabled: Number(account.is_disabled),
                    is_virtual: Number(account.is_virtual),
                    landing_company_name: newAccount.landing_company_shortcode,
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    linked_to: account.linked_to,
                    residence: settingsData.citizen || settingsData.country_code,
                    session_start: Math.floor(Date.now() / 1000),
                    token: newAccount.oauth_token,
                };

                const clientAccounts = getAccountsFromLocalStorage() ?? {};

                const localStorageData = {
                    ...clientAccounts,
                    [newAccount.client_id]: dataToStore,
                };

                const linkedWallet = account.linked_to.find(acc => acc.platform === 'dwallet');
                const linkedWalletLoginId = linkedWallet?.loginid;

                if (linkedWalletLoginId) {
                    localStorageData[linkedWalletLoginId].linked_to = [
                        {
                            loginid: newAccount.client_id,
                            platform: 'dtrade',
                        },
                    ];
                }

                setLocalStorageClientAccounts(localStorageData);
            }
        },
        [mutateAsync, setLocalStorageClientAccounts, settingsData]
    );

    return { addTradingAccountToLocalStorage, addWalletAccountToLocalStorage };
};

export default useSyncLocalStorageClientAccounts;
