import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import usePhoneNumberVerificationSetTimer from '../usePhoneNumberVerificationSetTimer';
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
                next_email_attempt: undefined,
                next_attempt: undefined,
            },
        },
    },
    ui: {
        should_show_phone_number_otp: false,
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
        mock_store.ui.should_show_phone_number_otp = false;
    });

    it('should set timer when next_email_attempt is available', async () => {
        if (mock_store.client?.account_settings?.phone_number_verification?.next_email_attempt)
            mock_store.client.account_settings.phone_number_verification.next_email_attempt = 1620000003;
        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSetTimer(), { wrapper });

        await waitForNextUpdate();

        if (typeof result.current.next_email_otp_request_timer === 'number') {
            expect(result.current.next_email_otp_request_timer).toBe(3);
        }
        expect(result.current.is_request_button_disabled).toBe(false);
    });

    it('should set timer when next_attempt is available', async () => {
        if (mock_store.client?.account_settings?.phone_number_verification?.next_attempt)
            mock_store.client.account_settings.phone_number_verification.next_attempt = 1620000005;
        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSetTimer(), { wrapper });

        await waitForNextUpdate();

        if (typeof result.current.next_phone_otp_request_timer === 'number') {
            expect(result.current.next_phone_otp_request_timer).toBe(5);
        }
        expect(result.current.is_request_button_disabled).toBe(false);
    });

    it('should disable request button while fetching server time', async () => {
        const { result, waitForNextUpdate } = renderHook(() => usePhoneNumberVerificationSetTimer(), { wrapper });

        expect(result.current.is_request_button_disabled).toBe(true);

        await waitForNextUpdate();

        expect(result.current.is_request_button_disabled).toBe(false);
    });
});
