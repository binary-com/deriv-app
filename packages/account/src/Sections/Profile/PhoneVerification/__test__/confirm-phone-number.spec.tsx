import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePhoneNumberVerificationSetTimer, useRequestPhoneNumberOTP, useSettings } from '@deriv/hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import ConfirmPhoneNumber from '../confirm-phone-number';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useRequestPhoneNumberOTP: jest.fn(() => ({
        error_message: '',
        requestOnWhatsApp: jest.fn(),
        requestOnSMS: jest.fn(),
        setErrorMessage: jest.fn(),
        setUsersPhoneNumber: jest.fn(),
        setIsDisabledRequestButton: jest.fn(),
    })),
    useSettings: jest.fn(() => ({
        data: {},
        invalidate: jest.fn(),
    })),
    usePhoneNumberVerificationSetTimer: jest.fn(() => ({
        next_phone_otp_request_timer: undefined,
        is_phone_otp_timer_loading: false,
    })),
}));

describe('ConfirmPhoneNumber', () => {
    const store = mockStore({
        ui: {
            setShouldShowPhoneNumberOTP: jest.fn(),
        },
    });

    const mockSetOtp = jest.fn();
    const whatsapp_button_text = 'Get code via WhatsApp';
    const sms_button_text = 'Get code via SMS';

    it('should render ConfirmPhoneNumber', () => {
        (useSettings as jest.Mock).mockReturnValue({
            data: { phone: '+0123456789' },
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const phone_number_textfield = screen.getByRole('textbox', { name: 'Phone number' });
        expect(screen.getByText('Step 2 of 3: Confirm your phone number')).toBeInTheDocument();
        expect(phone_number_textfield).toBeInTheDocument();
        expect(phone_number_textfield).toHaveValue('0123456789');
        expect(screen.getByRole('button', { name: sms_button_text })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: whatsapp_button_text })).toBeInTheDocument();
    });

    it('should call setErrorMessage when the user presses a key', async () => {
        const mock_set_error_message = jest.fn();
        const mock_set_is_disabled_request_button = jest.fn();
        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            setErrorMessage: mock_set_error_message,
            setIsDisabledRequestButton: mock_set_is_disabled_request_button,
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const phone_number_textfield = screen.getByRole('textbox', { name: 'Phone number' });
        expect(screen.getByText('Step 2 of 3: Confirm your phone number')).toBeInTheDocument();
        expect(phone_number_textfield).toBeInTheDocument();
        userEvent.clear(phone_number_textfield);
        userEvent.type(phone_number_textfield, '+01293291291');
        await waitFor(() => {
            expect(mock_set_error_message).toHaveBeenCalled();
            expect(mock_set_is_disabled_request_button).toHaveBeenCalled();
        });
    });

    it('should display given error message', () => {
        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            error_message: 'This is an error message',
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        expect(screen.getByText(/This is an error message/)).toBeInTheDocument();
    });

    it('should render handleError function when WS returns error promises', async () => {
        const mock_handle_error = jest.fn().mockResolvedValue({ error: null });
        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            requestOnWhatsApp: jest.fn(),
            setUsersPhoneNumber: mock_handle_error,
        });

        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const whatsapp_btn = screen.getByRole('button', { name: whatsapp_button_text });
        userEvent.click(whatsapp_btn);
        await waitFor(() => {
            expect(mock_handle_error).toBeCalledTimes(1);
        });
    });

    it('should call requestOnWhatsApp when Whatsapp button is clicked', async () => {
        const mockWhatsappButtonClick = jest.fn();

        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            requestOnWhatsApp: mockWhatsappButtonClick,
            setUsersPhoneNumber: jest.fn().mockResolvedValue({ error: null }),
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const whatsapp_btn = screen.getByRole('button', { name: whatsapp_button_text });
        userEvent.click(whatsapp_btn);
        await waitFor(() => {
            expect(mockWhatsappButtonClick).toHaveBeenCalled();
        });
    });

    it('should call requestOnSMS when SMS button is clicked', async () => {
        const mockSmsButtonClick = jest.fn();

        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            requestOnSMS: mockSmsButtonClick,
            setUsersPhoneNumber: jest.fn().mockResolvedValue({ error: null }),
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const sms_btn = screen.getByRole('button', { name: sms_button_text });
        userEvent.click(sms_btn);
        await waitFor(() => {
            expect(mockSmsButtonClick).toHaveBeenCalled();
        });
    });

    it('should make both buttons disabled if next_otp_request text is provided', async () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_phone_otp_request_timer: 60 });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const sms_btn = screen.getByRole('button', { name: sms_button_text });
        const whatsapp_btn = screen.getByRole('button', { name: whatsapp_button_text });
        expect(sms_btn).toBeDisabled();
        expect(whatsapp_btn).toBeDisabled();
    });

    it('should get snackbar text when next_otp_request text is provided', async () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_phone_otp_request_timer: 60 });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        expect(screen.getByText(/Request new code in 1 minute./));
    });
});
