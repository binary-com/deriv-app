/* eslint-disable camelcase */
import type { AuthorizeResponse } from '@deriv/api-types';

type TLocalStorageAccount = {
    accepted_bch: number;
    landing_company_shortcode: string;
    residence: string;
    session_start: number;
    token: string;
};

type TLocalStorageAccountsList = {
    [k: string]: NonNullable<NonNullable<NonNullable<AuthorizeResponse['authorize']>['account_list']>>[number] &
        TLocalStorageAccount;
};

/**
 * Gets the current user `accounts` list from the `localStorage`.
 */
/**
 * @deprecated Please use 'LocalStorageUtils.getValue' from '@deriv-com/utils' instead of this.
 */
export const getAccountsFromLocalStorage = () => {
    const data = localStorage.getItem('client.accounts');

    // If there is no accounts list, return undefined.
    if (!data) return;

    // Cast parsed JSON data to infer return type
    return JSON.parse(data) as TLocalStorageAccountsList;
};
