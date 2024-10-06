import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useMutation } from '@deriv/api';
import useSendOTPVerificationCode from '../useSendOTPVerificationCode';
import useRequestPhoneNumberOTP from '../useRequestPhoneNumberOTP';
import { mockStore, StoreProvider } from '@deriv/stores';
import useSettings from '../useSettings';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(),
}));

jest.mock('../useRequestPhoneNumberOTP');
jest.mock('../useSettings');

type TMockResponse = {
    data: null;
    mutate: () => void;
    error?: object;
    isSuccess: boolean;
};

describe('useSendOTPVerificationCode', () => {
    const mockMutate = jest.fn();
    const mock_store = mockStore({});
    const mock_response: TMockResponse = {
        data: null,
        mutate: mockMutate,
        error: undefined,
        isSuccess: false,
    };

    const mock_request_phone_number_otp_response = {
        sendEmailOTPVerification: jest.fn(),
        email_otp_error: {},
        is_email_verified: false,
        getCurrentCarrier: jest.fn(),
        getOtherCarrier: jest.fn(),
    };

    const mock_use_settings_value = {
        refetch: jest.fn(),
    };

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );

    beforeEach(() => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue(mock_request_phone_number_otp_response);
        (useSettings as jest.Mock).mockReturnValue(mock_use_settings_value);
    });

    afterEach(() => {
        jest.clearAllMocks();
        mock_response.error = undefined;
    });

    it('should return initial state correctly', () => {
        const { result } = renderHook(() => useSendOTPVerificationCode(), { wrapper });

        expect(result.current.data).toBe(null);
        expect(result.current.phone_otp_error).toBe(undefined);
        expect(result.current.phone_otp_error_message).toBe(undefined);
        expect(result.current.is_phone_number_verified).toBe(false);
    });

    it('should handle successful OTP submission', () => {
        mock_response.isSuccess = true;

        const { result } = renderHook(() => useSendOTPVerificationCode(), { wrapper });

        act(() => {
            result.current.sendPhoneOTPVerification('123456');
        });

        expect(mockMutate).toHaveBeenCalledWith({ payload: { otp: '123456' } });

        expect(result.current.is_phone_number_verified).toBe(true);
    });

    it('should handle PhoneCodeExpired for phone_otp_error', () => {
        mock_response.error = { code: 'PhoneCodeExpired', message: 'Code expired.' };

        const { result } = renderHook(() => useSendOTPVerificationCode(), { wrapper });

        if (React.isValidElement(result.current?.phone_otp_error_message))
            expect(result.current.phone_otp_error_message.props.i18n_default_text).toBe('Code expired. Get a new one.');
    });

    it('should handle InvalidOTP for phone_otp_error', () => {
        mock_response.error = { code: 'InvalidOTP', message: 'Invalid code.' };

        const { result } = renderHook(() => useSendOTPVerificationCode(), { wrapper });

        if (React.isValidElement(result.current?.phone_otp_error_message))
            expect(result.current.phone_otp_error_message.props.i18n_default_text).toBe('Invalid code. Try again.');
    });

    it('should handle NoAttemptsLeft for phone_otp_error', () => {
        mock_response.error = { code: 'NoAttemptsLeft', message: 'OTP limit reached.' };

        const { result } = renderHook(() => useSendOTPVerificationCode(), { wrapper });

        expect(result.current.show_cool_down_period_modal).toBe(true);
    });

    it('should handle EmailCodeExpired for email_otp_error', () => {
        mock_request_phone_number_otp_response.email_otp_error = {
            code: 'EmailCodeExpired',
            message: 'Code expired.',
        };

        const { result } = renderHook(() => useSendOTPVerificationCode(), { wrapper });

        if (React.isValidElement(result.current?.phone_otp_error_message))
            expect(result.current.phone_otp_error_message.props.i18n_default_text).toBe(
                'Code expired. Get a new code.'
            );
    });

    it('should handle InvalidToken for email_top_error', () => {
        mock_request_phone_number_otp_response.email_otp_error = { code: 'InvalidToken', message: 'InvalidToken' };

        const { result } = renderHook(() => useSendOTPVerificationCode(), { wrapper });

        if (React.isValidElement(result.current?.phone_otp_error_message))
            expect(result.current.phone_otp_error_message.props.i18n_default_text).toBe(
                'Invalid code. Try again or get a new code.'
            );
    });

    it('should handle PhoneNumberVerificationSuspended for email_top_error', () => {
        mock_request_phone_number_otp_response.email_otp_error = {
            code: 'PhoneNumberVerificationSuspended',
            message: 'PhoneNumberVerificationSuspended',
        };

        const { result } = renderHook(() => useSendOTPVerificationCode(), { wrapper });

        if (React.isValidElement(result.current?.phone_otp_error_message))
            expect(result.current.phone_otp_error_message.props.i18n_default_text).toBe(
                "We're unable to send codes via {{ current_carrier }} right now. Get your code by {{other_carriers}}."
            );
    });

    it('should handle NoAttemptsLeft for email_top_error', () => {
        mock_request_phone_number_otp_response.email_otp_error = { code: 'NoAttemptsLeft', message: 'NoAttemptsLeft' };

        const { result } = renderHook(() => useSendOTPVerificationCode(), { wrapper });

        expect(result.current.show_cool_down_period_modal).toBe(true);
    });
});
