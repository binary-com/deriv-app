import { renderHook, act } from '@testing-library/react-hooks';
import { useMutation } from '@deriv/api';
import useSendOTPVerificationCode from '../useSendOTPVerificationCode';
import useRequestPhoneNumberOTP from '../useRequestPhoneNumberOTP';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(),
}));

jest.mock('../useRequestPhoneNumberOTP');

type TMockResponse = {
    data: null;
    mutate: () => void;
    error?: object;
    isSuccess: boolean;
};

describe('useSendOTPVerificationCode', () => {
    const mockMutate = jest.fn();
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
    };

    beforeEach(() => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue(mock_request_phone_number_otp_response);
    });

    afterEach(() => {
        jest.clearAllMocks();
        mock_response.error = undefined;
    });

    it('should return initial state correctly', () => {
        const { result } = renderHook(() => useSendOTPVerificationCode());

        expect(result.current.data).toBe(null);
        expect(result.current.phone_otp_error).toBe(undefined);
        expect(result.current.phone_otp_error_message).toBe(undefined);
        expect(result.current.is_phone_number_verified).toBe(false);
    });

    it('should handle successful OTP submission', () => {
        mock_response.isSuccess = true;

        const { result } = renderHook(() => useSendOTPVerificationCode());

        act(() => {
            result.current.sendPhoneOTPVerification('123456');
        });

        expect(mockMutate).toHaveBeenCalledWith({ payload: { otp: '123456' } });

        expect(result.current.is_phone_number_verified).toBe(true);
    });

    it('should handle ExpiredCode for phone_otp_error', () => {
        mock_response.error = { code: 'ExpiredCode', message: 'Code expired.' };

        const { result } = renderHook(() => useSendOTPVerificationCode());

        expect(result.current.phone_otp_error_message).toBe('Code expired. Please get a new one.');
    });

    it('should handle InvalidOTP for phone_otp_error', () => {
        mock_response.error = { code: 'InvalidOTP', message: 'Invalid code.' };

        const { result } = renderHook(() => useSendOTPVerificationCode());

        expect(result.current.phone_otp_error_message).toBe('Invalid code. Please try again.');
    });

    it('should handle NoAttemptsLeft for phone_otp_error', () => {
        mock_response.error = { code: 'NoAttemptsLeft', message: 'OTP limit reached.' };

        const { result } = renderHook(() => useSendOTPVerificationCode());

        expect(result.current.phone_otp_error_message).toBe('Invalid code. OTP limit reached.');
    });

    it('should handle ExpiredCode for email_otp_error', () => {
        mock_request_phone_number_otp_response.email_otp_error = { code: 'ExpiredCode', message: 'ExpiredCode' };

        const { result } = renderHook(() => useSendOTPVerificationCode());

        expect(result.current.phone_otp_error_message).toBe('Code expired.');
    });

    it('should handle InvalidOTP for email_top_error', () => {
        mock_request_phone_number_otp_response.email_otp_error = { code: 'InvalidToken', message: 'InvalidToken' };

        const { result } = renderHook(() => useSendOTPVerificationCode());

        expect(result.current.phone_otp_error_message).toBe('Invalid code. Press the link below to get a new code.');
    });

    it('should handle NoAttemptsLeft for email_top_error', () => {
        mock_request_phone_number_otp_response.email_otp_error = { code: 'NoAttemptsLeft', message: 'NoAttemptsLeft' };

        const { result } = renderHook(() => useSendOTPVerificationCode());

        expect(result.current.phone_otp_error_message).toBe('Invalid code. OTP limit reached.');
    });
});
