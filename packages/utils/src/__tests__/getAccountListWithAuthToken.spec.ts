import getAccountListWithAuthToken from '../getAccountListWithAuthToken';
import { AuthorizeResponse } from '@deriv/api-types';

type TAccount = NonNullable<NonNullable<AuthorizeResponse['authorize']>['account_list']>[number];

describe('getAccountListWithAuthToken', () => {
    let accounts: TAccount[];

    const usdAccount: TAccount = {
        account_category: 'wallet',
        account_type: 'doughflow',
        broker: 'CRW',
        created_at: 1714662434,
        currency: 'USD',
        currency_type: 'fiat',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [],
    };

    const btcAccount: TAccount = {
        account_category: 'wallet',
        account_type: 'crypto',
        broker: 'CRW',
        created_at: 1714662788,
        currency: 'BTC',
        currency_type: 'crypto',
        is_disabled: 0,
        is_virtual: 0,
        landing_company_name: 'svg',
        linked_to: [],
    };

    const demoAccount: TAccount = {
        account_category: 'wallet',
        account_type: 'virtual',
        broker: 'VRW',
        created_at: 1714662434,
        currency: 'USD',
        currency_type: 'fiat',
        is_disabled: 0,
        is_virtual: 1,
        landing_company_name: 'virtual',
        linked_to: [],
    };

    beforeEach(() => {
        localStorage.setItem(
            'client.accounts',
            JSON.stringify({
                CRW1121: {
                    ...usdAccount,
                    token: 'xob1xob1xob1xob1xob1xob1xob1',
                    email: 'ge4@binary.com',
                    session_start: 1714715763,
                    excluded_until: '',
                    landing_company_name: 'svg',
                    balance: 10000,
                    accepted_bch: 0,
                    residence: 'aq',
                },
                CRW1122: {
                    ...btcAccount,
                    token: 'xob1xob1xob1xob1xob1xob1xob1',
                    excluded_until: '',
                    landing_company_name: 'svg',
                    balance: 0,
                },
                VRW1069: {
                    ...demoAccount,
                    token: 'xob1xob1xob1xob1xob1xob1xob1',
                    excluded_until: '',
                    landing_company_name: 'virtual',
                    balance: 10000,
                },
            })
        );

        accounts = [
            { ...usdAccount, loginid: 'CRW1121' },
            {
                ...btcAccount,
                loginid: 'CRW1122',
            },
            {
                ...demoAccount,
                loginid: 'VRW1069',
            },
        ];
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should return all accounts that have a token', () => {
        const accountsWithToken = getAccountListWithAuthToken(accounts);

        expect(accountsWithToken).toHaveLength(Number(accounts?.length));
    });

    it('should return undefined if no accounts provided', () => {
        const accountsWithToken = getAccountListWithAuthToken();

        expect(accountsWithToken).not.toBeDefined();
    });

    it('should return and empty array if it was provided as accounts', () => {
        const accountsWithToken = getAccountListWithAuthToken([]);

        expect(accountsWithToken).toBeInstanceOf(Array);
        expect(accountsWithToken).toHaveLength(0);
    });

    it('should return proper list of accounts with token when we are adding new account', () => {
        accounts?.push({
            account_category: 'wallet',
            account_type: 'crypto',
            broker: 'CRW',
            created_at: 1714716793,
            currency: 'ETH',
            currency_type: 'crypto',
            is_disabled: 0,
            is_virtual: 0,
            landing_company_name: 'svg',
            linked_to: [],
            loginid: 'CRW1170',
        });

        const accountsWithToken = getAccountListWithAuthToken(accounts);

        expect(accounts).toHaveLength(4);
        expect(accountsWithToken).toHaveLength(3);
    });
});
