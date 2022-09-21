import { isCryptocurrency } from '@deriv/shared';

type Taccount_props = {
    a_currency: string;
    b_currency: string;
    a_is_crypto?: boolean;
    b_is_crypto?: boolean;
    a_is_fiat?: boolean;
    b_is_fiat?: boolean;
    loginid: number;
    is_virtual?: boolean;
    icon?: string;
    is_disabled?: boolean;
}[];
type Taccounts = {
    currency: string;
}[];
export const getSortedAccountList = (account_list: Taccount_props, accounts: Taccounts) => {
    // sort accounts as follows:
    // top is fiat, then crypto (each alphabetically by currency), then demo
    return [...account_list].sort((a, b) => {
        const a_currency = accounts[a.loginid].currency;
        const b_currency = accounts[b.loginid].currency;
        const a_is_crypto = isCryptocurrency(a_currency);
        const b_is_crypto = isCryptocurrency(b_currency);
        const a_is_fiat = !a_is_crypto;
        const b_is_fiat = !b_is_crypto;
        if (a.is_virtual || b.is_virtual) {
            return a.is_virtual ? 1 : -1;
        } else if ((a_is_crypto && b_is_crypto) || (a_is_fiat && b_is_fiat)) {
            return a_currency < b_currency ? -1 : 1;
        } else if (a_is_fiat && b_is_crypto) {
            return -1;
        }
        return 1;
    });
};
