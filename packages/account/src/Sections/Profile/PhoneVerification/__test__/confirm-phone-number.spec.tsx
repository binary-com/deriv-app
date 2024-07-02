import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useRequestPhoneNumberOTP, useSettings } from '@deriv/hooks';
import ConfirmPhoneNumber from '../confirm-phone-number';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useRequestPhoneNumberOTP: jest.fn(() => ({
        error_message: '',
        requestOnWhatsApp: jest.fn(),
        requestOnSMS: jest.fn(),
        setErrorMessage: jest.fn(),
        setUsersPhoneNumber: jest.fn(),
    })),
    useSettings: jest.fn(() => ({
        data: {},
    })),
}));

describe('ConfirmPhoneNumber', () => {
    const store = mockStore({
        ui: {
            setShouldShowPhoneNumberOTP: jest.fn(),
        },
    });

    const mockSetOtp = jest.fn();

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
        expect(screen.getByText('Confirm your phone number')).toBeInTheDocument();
        expect(phone_number_textfield).toBeInTheDocument();
        expect(phone_number_textfield).toHaveValue('+0123456789');
        expect(screen.getByRole('button', { name: 'Get code via SMS' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Get code via WhatsApp' })).toBeInTheDocument();
    });

    it('should call setErrorMessage when the user presses a key', async () => {
        const mock_set_error_message = jest.fn();
        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValue({
            setErrorMessage: mock_set_error_message,
        });
        render(
            <StoreProvider store={store}>
                <ConfirmPhoneNumber setOtpVerification={mockSetOtp} />
            </StoreProvider>
        );
        const phone_number_textfield = screen.getByRole('textbox', { name: 'Phone number' });
        expect(screen.getByText('Confirm your phone number')).toBeInTheDocument();
        expect(phone_number_textfield).toBeInTheDocument();
        userEvent.clear(phone_number_textfield);
        await act(async () => userEvent.type(phone_number_textfield, '+01293291291'));
        expect(mock_set_error_message).toHaveBeenCalled();
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
        const whatsapp_btn = screen.getByRole('button', { name: 'Get code via WhatsApp' });
        await userEvent.click(whatsapp_btn);
        expect(mock_handle_error).toBeCalledTimes(1);
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
        const whatsapp_btn = screen.getByRole('button', { name: 'Get code via WhatsApp' });
        await act(async () => userEvent.click(whatsapp_btn));
        expect(mockWhatsappButtonClick).toHaveBeenCalled();
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
        const sms_btn = screen.getByRole('button', { name: 'Get code via SMS' });
        await act(async () => userEvent.click(sms_btn));
        expect(mockSmsButtonClick).toHaveBeenCalled();
    });
});
