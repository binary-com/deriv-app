/* eslint-disable sort-keys */

import { Context } from '@deriv/integration/src/utils/mocks/mocks';

export const DEFAULT_WALLET_ACCOUNTS = [
    {
        id: 'CR90000243',
        balance: 11.11,
        currency: 'USD',
        token: 'a1-x0000000000000000000000000001',
    },

    {
        id: 'CR90000256',
        balance: 10.1,
        currency: 'BTC',
        token: 'a1-x0000000000000000000000000002',
    },

    {
        id: 'CRW1003',
        balance: 9.09,
        currency: 'USD',
        token: 'a1-x0000000000000000000000000003',
    },

    {
        id: 'CRW1017',
        balance: 8.08,
        currency: 'BTC',
        token: 'a1-x0000000000000000000000000004',
    },

    {
        id: 'CRW1036',
        balance: 7.07,
        currency: 'ETH',
        token: 'a1-x0000000000000000000000000005',
    },

    {
        id: 'VRTC90000115',
        balance: 6.06,
        currency: 'USD',
        token: 'a1-x0000000000000000000000000006',
    },

    {
        id: 'VRW1004',
        balance: 5.05,
        currency: 'USD',
        token: 'a1-x0000000000000000000000000007',
    },
];

export const ACCOUNTS_LIST = [
    {
        account_category: 'trading',
        account_type: 'standard',
        created_at: 1699327778,
        currency: 'USD',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [],
        loginid: 'CR90000243',
    },
    {
        account_category: 'wallet',
        account_type: 'doughflow',
        created_at: 1699327778,
        currency: 'USD',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [
            {
                loginid: 'CR90000243',
                platform: 'dtrade',
            },
            {
                loginid: 'MTR40022727',
                platform: 'mt5',
            },
            {
                loginid: 'DXR1000',
                platform: 'dxtrade',
            },
            {
                loginid: 'MTR1073881',
                platform: 'mt5',
            },
            {
                loginid: 'MTR40022743',
                platform: 'mt5',
            },
            {
                loginid: 'MTR1073884',
                platform: 'mt5',
            },
            {
                loginid: 'MTR1073911',
                platform: 'mt5',
            },
            {
                loginid: 'MTR1073957',
                platform: 'mt5',
            },
        ],
        loginid: 'CRW1003',
    },
    {
        account_category: 'trading',
        account_type: 'standard',
        created_at: 1699375431,
        currency: 'BTC',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [],
        loginid: 'CR90000256',
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        created_at: 1699355169,
        currency: 'BTC',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [
            {
                loginid: 'CR90000256',
                platform: 'dtrade',
            },
        ],
        loginid: 'CRW1017',
    },
    {
        account_category: 'wallet',
        account_type: 'crypto',
        created_at: 1699499564,
        currency: 'ETH',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [],
        loginid: 'CRW1036',
    },
    {
        account_category: 'trading',
        account_type: 'binary',
        created_at: 1699327778,
        currency: 'USD',
        is_disabled: 0,
        is_virtual: 1,
        landing_company_name: 'virtual',
        linked_to: [],
        loginid: 'VRTC90000115',
    },
    {
        account_category: 'wallet',
        account_type: 'virtual',
        created_at: 1699327778,
        currency: 'USD',
        is_disabled: 0,
        is_virtual: 1,
        landing_company_name: 'virtual',
        linked_to: [
            {
                loginid: 'VRTC90000115',
                platform: 'dtrade',
            },
            {
                loginid: 'MTD30105819',
                platform: 'mt5',
            },
            {
                loginid: 'DXD1001',
                platform: 'dxtrade',
            },
        ],
        loginid: 'VRW1004',
    },
];

export default function mockWalletsAuthorize(context: Context) {
    if ('authorize' in context.request) {
        if (!context.response) {
            throw new Error('authorize has not been prepopulated');
        }

        context.state.currentToken = context.request.authorize || context.state.currentToken;
        const currentAccount = context.state.accounts.find(account => account.token === context.state.currentToken);

        context.response.authorize.account_list = ACCOUNTS_LIST;
        context.response.authorize.loginid = currentAccount?.id;
        context.response.authorize.currency = currentAccount?.currency;
    }
}
