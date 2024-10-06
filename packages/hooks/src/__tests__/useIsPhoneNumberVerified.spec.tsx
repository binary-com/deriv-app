import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import useIsPhoneNumberVerified from '../useIsPhoneNumberVerified';

describe('useIsPhoneNumberVerified', () => {
    const mock_store = mockStore({
        client: {
            account_settings: {
                phone_number_verification: {
                    verified: 1,
                },
            },
        },
    });
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );

    it('should return the correct value for is_phone_number_verified', () => {
        const { result } = renderHook(() => useIsPhoneNumberVerified(), { wrapper });

        expect(result.current.is_phone_number_verified).toBe(true);
    });

    it('should return false if phone_number_verification is not available', () => {
        if (mock_store.client.account_settings.phone_number_verification?.verified)
            mock_store.client.account_settings.phone_number_verification.verified = 0;
        const { result } = renderHook(() => useIsPhoneNumberVerified(), { wrapper });

        expect(result.current.is_phone_number_verified).toBe(false);
    });
});
