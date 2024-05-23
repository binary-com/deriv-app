import { useCallback } from 'react';
import moment from 'moment';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { useActiveAccount, useCreateNewRealAccount, useCreateWallet, useSettings } from '@deriv/api-v2';
import { getAccountsFromLocalStorage } from '@deriv/utils';

type TNewWalletAccount = NonNullable<ReturnType<typeof useCreateWallet>['data']>;
type TNewTradingAccount = NonNullable<ReturnType<typeof useCreateNewRealAccount>['data']>;

const useSyncLocalStorageClientAccounts = () => {
    const { data } = useActiveAccount();
    const { data: settingsData } = useSettings();
    const [, setLocalStorageClientAccounts] = useLocalStorage(
        'client.accounts',
        useReadLocalStorage('client.accounts') ?? {}
    );

    const addWalletAccountToLocalStorage = useCallback(
        (newAccount: TNewWalletAccount) => {
            if (newAccount && data) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: data.account_category,
                    account_type: data.account_type,
                    balance: 0,
                    created_at: data.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: data.excluded_until,
                    is_disabled: Number(data.is_disabled),
                    is_virtual: Number(data.is_virtual),
                    landing_company_name: data.landing_company_name,
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    linked_to: data.linked_to,
                    residence: settingsData.citizen || settingsData.country_code,
                    session_start: moment().utc().valueOf() / 1000,
                    token: newAccount.oauth_token,
                };

                const clientAccounts = getAccountsFromLocalStorage() ?? {};
                const localStorageData = { ...clientAccounts, [newAccount.client_id]: dataToStore };
                setLocalStorageClientAccounts(localStorageData);
            }
        },
        [data, setLocalStorageClientAccounts, settingsData]
    );

    const addTradingAccountToLocalStorage = useCallback(
        (newAccount: TNewTradingAccount) => {
            if (newAccount && data) {
                const dataToStore = {
                    accepted_bch: 0,
                    account_category: 'trading',
                    account_type: 'standard',
                    balance: 0,
                    created_at: data.created_at,
                    currency: newAccount.currency,
                    email: settingsData.email,
                    excluded_until: data.excluded_until,
                    is_disabled: Number(data.is_disabled),
                    is_virtual: Number(data.is_virtual),
                    landing_company_name: newAccount.landing_company_shortcode,
                    landing_company_shortcode: newAccount.landing_company_shortcode,
                    linked_to: [],
                    residence: settingsData.citizen || settingsData.country_code,
                    session_start: moment().utc().valueOf() / 1000,
                    token: newAccount.oauth_token,
                };

                const clientAccounts = getAccountsFromLocalStorage() ?? {};
                const localStorageData = {
                    ...clientAccounts,
                    [newAccount.client_id]: dataToStore,
                    [data.loginid]: {
                        ...clientAccounts[data.loginid],
                        linked_to: [{ loginid: newAccount.client_id, platform: 'dtrade' }],
                    },
                };
                setLocalStorageClientAccounts(localStorageData);
            }
        },
        [data, setLocalStorageClientAccounts, settingsData]
    );

    return { addTradingAccountToLocalStorage, addWalletAccountToLocalStorage };
};

export default useSyncLocalStorageClientAccounts;
