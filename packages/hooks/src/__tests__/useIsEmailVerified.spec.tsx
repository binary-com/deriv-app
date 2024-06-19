import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import useIsEmailVerified from '../useIsEmailVerified';

describe('useIsEmailVerified', () => {
    it('should return true when the status is not present', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    status: [],
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsEmailVerified(), { wrapper });

        expect(result.current).toBeTruthy();
    });

    it('should return false when the status is present', () => {
        const mock = mockStore({
            client: {
                account_status: {
                    status: ['email_not_verified'],
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );

        const { result } = renderHook(() => useIsEmailVerified(), { wrapper });

        expect(result.current).toBeFalsy();
    });
});
