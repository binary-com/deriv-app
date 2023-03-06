import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useAccountPlatformDetails from '../useAccountPlatformDetails';

describe('useAccountPlatformDetails', () => {
    test('should return the account info of the current loginid', async () => {
        const mockRootStore = mockStore({
            client: {
                account_list: [
                    {
                        account: {
                            balance: 10000,
                            currency: 'USD',
                            disabled: false,
                            is_crypto: false,
                        },
                        icon: 'icon',
                        is_dark_mode_on: false,
                        loginid: 'loginid',
                        title: 'title',
                    },
                ],
                loginid: 'loginid',
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useAccountPlatformDetails(), { wrapper });

        expect(result.current).toStrictEqual({
            account: {
                balance: 10000,
                currency: 'USD',
                disabled: false,
                is_crypto: false,
            },
            icon: 'icon',
            is_dark_mode_on: false,
            loginid: 'loginid',
            title: 'title',
        });
    });
});
