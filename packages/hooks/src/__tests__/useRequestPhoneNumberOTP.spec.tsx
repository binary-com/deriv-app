import { act, renderHook } from '@testing-library/react-hooks';
import { useMutation } from '@deriv/api';
import useRequestPhoneNumberOTP from '../useRequestPhoneNumberOTP';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import React from 'react';
import useSettings from '../useSettings';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(),
}));

jest.mock('../useSettings');

const mockUseMutationMutate = jest.fn();

const mock_response = {
    data: {
        phone_number_challenge: 1,
    },
    mutate: mockUseMutationMutate,
    isSuccess: true,
};

const mock_set_settings_response = {
    data: {},
    mutate: jest.fn(),
    isSuccess: true,
};

const mock_store_data = mockStore({
    client: { verification_code: { phone_number_verification: '' } },
});

const mock_set_settings = jest.fn().mockResolvedValue(mock_set_settings_response);

describe('useRequestPhoneNumberOTP', () => {
    beforeEach(() => {
        (useSettings as jest.Mock).mockReturnValue({
            mutation: { mutateAsync: mock_set_settings },
        });
    });
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store_data}>{children}</StoreProvider>
    );

    it('should call mutate with correct payload for SMS request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        result.current.requestOnSMS();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(mockUseMutationMutate).toHaveBeenCalledWith({
            payload: { carrier: VERIFICATION_SERVICES.SMS, email_code: '' },
        });
    });

    it('should call mutate with correct payload for WhatsApp request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        result.current.requestOnWhatsApp();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(mockUseMutationMutate).toHaveBeenCalledWith({
            payload: { carrier: VERIFICATION_SERVICES.WHATSAPP, email_code: '' },
        });
    });

    it('should call mutate with code given in phone_number_verification for SMS request and return correct response', () => {
        mock_store_data.client.verification_code.phone_number_verification = '121212';
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        result.current.requestOnSMS();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(mockUseMutationMutate).toHaveBeenCalledWith({
            payload: { carrier: VERIFICATION_SERVICES.SMS, email_code: '121212' },
        });
    });

    it('should call mutate with code given in phone_number_verification for WhatsApp request and return correct response', () => {
        mock_store_data.client.verification_code.phone_number_verification = '121212';
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        result.current.requestOnWhatsApp();

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(mockUseMutationMutate).toHaveBeenCalledWith({
            payload: { carrier: VERIFICATION_SERVICES.WHATSAPP, email_code: '121212' },
        });
    });

    it('should call mutate with correct payload for sendEmailOTPVerification request and return correct response', () => {
        (useMutation as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        result.current.sendEmailOTPVerification('123456');

        expect(useMutation).toHaveBeenCalledWith('phone_number_challenge');
        expect(result.current.mutate).toHaveBeenCalledWith({
            payload: { email_code: '123456' },
        });
        expect(result.current.data).toEqual(1);
    });

    it('should return Localized error message when PhoneNumberTaken error code is passed inside', () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        act(() => {
            result.current.formatError({ code: 'PhoneNumberTaken', message: '' });
        });

        if (result.current?.error_message && React.isValidElement(result.current?.error_message))
            expect(result.current?.error_message?.props.i18n_default_text).toBe(
                'Number already exists in our system. Enter a new one or contact us via <0>live chat</0> for help.'
            );
    });

    it('should return Localized error message when PhoneNumberVerificationSuspended error code is passed inside', () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        act(() => {
            result.current.formatError({ code: 'PhoneNumberVerificationSuspended', message: '' });
        });

        if (result.current?.error_message && React.isValidElement(result.current?.error_message))
            expect(result.current?.error_message?.props.i18n_default_text).toBe(
                "We're unable to send codes via {{ current_carrier }} right now. Get your code by {{other_carriers}}."
            );
    });

    it('should render getOtherCarrier which will return the opposite value of selected carrier', () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        act(() => {
            result.current.setCarrier(VERIFICATION_SERVICES.SMS);
        });
        expect(result.current.getOtherCarrier()).toEqual('WhatsApp');

        act(() => {
            result.current.setCarrier(VERIFICATION_SERVICES.WHATSAPP);
        });
        expect(result.current.getOtherCarrier()).toEqual('SMS');
    });

    it('should render getCurrentCarrier which will return the current value of selected carrier', () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        act(() => {
            result.current.setCarrier(VERIFICATION_SERVICES.WHATSAPP);
        });
        expect(result.current.getCurrentCarrier()).toEqual('WhatsApp');

        act(() => {
            result.current.setCarrier(VERIFICATION_SERVICES.SMS);
        });
        expect(result.current.getCurrentCarrier()).toEqual('SMS');
    });

    it('should return given error message when Other error code is passed inside', () => {
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        act(() => {
            result.current.formatError({ code: 'OtherError', message: 'This is an error message' });
        });

        if (result.current?.error_message) expect(result.current?.error_message).toBe('This is an error message');
    });

    it('should call setSettings with correct payload and handle success response', async () => {
        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        await act(async () => {
            const response = await result.current.setUsersPhoneNumber({ phone: '+1234567890' });
            expect(response.error).toBe(undefined);
        });

        expect(mock_set_settings).toHaveBeenCalledWith({ payload: { phone: '+1234567890' } });
    });

    it('should handle error response from setSettings', async () => {
        (useMutation as jest.Mock).mockReturnValue(mock_response);
        const mock_set_settings_error_response = {
            error: { code: 'SomeError', message: 'An error occurred' },
        };
        (useSettings as jest.Mock).mockReturnValueOnce({
            mutation: { mutateAsync: jest.fn().mockRejectedValue(mock_set_settings_error_response) },
        });

        const { result } = renderHook(() => useRequestPhoneNumberOTP(), { wrapper });

        await act(async () => {
            const response = await result.current.setUsersPhoneNumber({ phone: '+1234567890' });
            expect(response.error).toEqual(mock_set_settings_error_response);
        });
    });
});
