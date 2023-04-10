import { useStore } from '@deriv/stores';

/**
 * we can use this hook to get the platform demo account.
 * it loops through the all of user's accounts, finds and returns demo account
 * @example const platform_demo_account = usePlatformDemoAccount();
 * @returns { balance: 100, currency: 'USD' }
 */

const usePlatformDemoAccount = () => {
    const { client } = useStore();
    const { accounts } = client;
    const account_list = Object.keys(accounts).map(loginid => accounts[loginid]);

    const platform_demo_account = account_list.find(account => account.is_virtual);

    return platform_demo_account;
};

export default usePlatformDemoAccount;
