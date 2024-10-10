import getAccountsFromLocalStorage from './getAccountsFromLocalStorage';

/**
 * Gets account list with only those accounts that have a token or accounts that are disabled.
 */
const getAccountListWithAuthToken = <T extends Array<T[number]>>(accountList?: T) => {
    const storedAccounts = getAccountsFromLocalStorage();

    return accountList?.filter(account => {
        if (typeof account === 'object' && account !== null && 'loginid' in account && 'is_disabled' in account) {
            return Boolean(storedAccounts?.[account.loginid as string]?.token) || Boolean(account.is_disabled);
        }
    });
};

export default getAccountListWithAuthToken;
