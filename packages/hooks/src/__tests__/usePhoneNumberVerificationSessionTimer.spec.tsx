import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import usePhoneNumberVerificationSessionTimer from '../usePhoneNumberVerificationSessionTimer';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn().mockResolvedValue({ time: 1620000000 }),
    },
}));

const mock_store = mockStore({
    client: {
        account_settings: {
            phone_number_verification: {
                session_timestamp: undefined,
            },
        },
    },
});

describe('usePhoneNumberVerificationSetTimer', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should set should_show_session_timeout_modal to true if session_timestap is same with WS response time', async () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.session_timestamp = 1620000000;

        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSessionTimer(), { wrapper });

        expect(result.current.should_show_session_timeout_modal).toBe(false);

        await waitForNextUpdate();

        expect(result.current.should_show_session_timeout_modal).toBe(true);
    });

    it('should set should_show_session_timeout_modal to false if session_timestap more than WS response time', async () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.session_timestamp = 1620000003;

        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSessionTimer(), { wrapper });

        expect(result.current.should_show_session_timeout_modal).toBe(false);

        await waitForNextUpdate();

        expect(result.current.should_show_session_timeout_modal).toBe(false);
    });

    it('should set formatted_time value to be 00:00 if the session_timestamp has no difference', async () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.session_timestamp = 1620000000;

        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSessionTimer(), { wrapper });

        await waitForNextUpdate();

        expect(result.current.formatted_time).toBe('00:00');
    });

    it('should set formatted_time value if the session_timestamp has any value', async () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.session_timestamp = 1620000003;

        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSessionTimer(), { wrapper });

        await waitForNextUpdate();

        expect(result.current.formatted_time).toBe('00:03');
    });
});
