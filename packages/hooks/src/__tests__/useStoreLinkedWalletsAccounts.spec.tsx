import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useStoreLinkedWalletsAccounts from '../useStoreLinkedWalletsAccounts';

describe('useStoreLinkedWalletsAccounts', () => {
    test('should return object with linked accounts for all wallets', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    CRW909900: {
                        account_category: 'wallet',
                        currency: 'USD',
                        is_virtual: 1,
                        linked_to: [
                            { loginid: 'CR123', platform: 'mt5' },
                            { loginid: 'CR456', platform: 'dtrade' },
                        ],
                    },
                    CRW909901: {
                        account_category: 'wallet',
                        currency: 'UST',
                        is_virtual: 0,
                        linked_to: [{ loginid: 'CR777', platform: 'derivez' }],
                    },
                    CRW909902: {
                        account_category: 'wallet',
                        currency: 'BTC',
                        is_virtual: 0,
                        linked_to: [],
                    },
                },
                loginid: 'CRW909900',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useStoreLinkedWalletsAccounts(), { wrapper });

        expect(result.current).toMatchObject({
            ctrader: [],
            derivez: [{ loginid: 'CR777', platform: 'derivez' }],
            dtrade: [{ loginid: 'CR456', platform: 'dtrade' }],
            dxtrade: [],
            mt5: [{ loginid: 'CR123', platform: 'mt5' }],
        });
    });
});
