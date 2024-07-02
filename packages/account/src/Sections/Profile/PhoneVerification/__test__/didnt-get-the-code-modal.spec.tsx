import React from 'react';
import { render, screen } from '@testing-library/react';
import DidntGetTheCodeModal from '../didnt-get-the-code-modal';
import { StoreProvider, mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';
import { useRequestPhoneNumberOTP } from '@deriv/hooks';
import { VERIFICATION_SERVICES } from '@deriv/shared';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useRequestPhoneNumberOTP: jest.fn(() => ({
        requestOnWhatsApp: jest.fn(),
        requestOnSMS: jest.fn(),
        email_otp_error: null,
    })),
}));

describe('DidntGetTheCodeModal', () => {
    const mock_store = mockStore({});
    const mockSetShouldShowDidntGetTheCodeModal = jest.fn();
    const mockSetOtpVerification = jest.fn();
    const mockReInitializeGetSettings = jest.fn();
    const mockSetIsButtonDisabled = jest.fn();
    const resend_code_text = /Resend code/;

    const renderComponent = (phone_verification_type: string) => {
        render(
            <StoreProvider store={mock_store}>
                <DidntGetTheCodeModal
                    setIsButtonDisabled={mockSetIsButtonDisabled}
                    reInitializeGetSettings={mockReInitializeGetSettings}
                    should_show_didnt_get_the_code_modal={true}
                    phone_verification_type={phone_verification_type}
                    setShouldShowDidntGetTheCodeModal={mockSetShouldShowDidntGetTheCodeModal}
                    setOtpVerification={mockSetOtpVerification}
                />
            </StoreProvider>
        );
    };

    beforeEach(() => {
        mockSetShouldShowDidntGetTheCodeModal.mockClear();
        mockSetOtpVerification.mockClear();
    });

    it('should render DidntGetTheCodeModal', () => {
        renderComponent(VERIFICATION_SERVICES.SMS);
        expect(screen.getByText(/Get a new code/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: resend_code_text })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send code via WhatsApp/ })).toBeInTheDocument();
        expect(screen.getByText(/or/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Change phone number/ })).toBeInTheDocument();
    });

    it('should show Send code via SMS if phone_verification_type is whatsapp', () => {
        renderComponent(VERIFICATION_SERVICES.WHATSAPP);
        expect(screen.getByRole('button', { name: /Send code via SMS/ })).toBeInTheDocument();
    });

    it('should render setOtpVerification and setShouldShowDidintGetTheCodeModal when Change phone number is clicked, should not render mockSetTimer', () => {
        renderComponent(VERIFICATION_SERVICES.SMS);
        const change_phone_number_button = screen.getByRole('button', { name: /Change phone number/ });
        userEvent.click(change_phone_number_button);
        expect(mockSetShouldShowDidntGetTheCodeModal).toHaveBeenCalledTimes(1);
        expect(mockSetOtpVerification).toHaveBeenCalledTimes(1);
    });

    it('should render setShouldShowDidintGetTheCodeModal when Resend code is clicked', () => {
        renderComponent(VERIFICATION_SERVICES.SMS);
        const resend_code_button = screen.getByRole('button', { name: resend_code_text });
        userEvent.click(resend_code_button);
        expect(mockSetShouldShowDidntGetTheCodeModal).toHaveBeenCalledTimes(1);
    });

    it('should render mockRequestOnSMS and setOtpVerification with phone_verification_type: sms when Resend code is clicked, phone_verification_type is sms', () => {
        const mockRequestOnSMS = jest.fn();

        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValueOnce({
            requestOnSMS: mockRequestOnSMS,
        });
        renderComponent(VERIFICATION_SERVICES.SMS);
        const resend_code_button = screen.getByRole('button', { name: resend_code_text });
        userEvent.click(resend_code_button);
        expect(mockRequestOnSMS).toHaveBeenCalledTimes(1);
        expect(mockSetOtpVerification).toBeCalledWith({
            show_otp_verification: true,
            phone_verification_type: VERIFICATION_SERVICES.SMS,
        });
    });

    it('should render mockRequestOnWhatsapp and setOtpVerification with phone_verification_type: whatsapp when Resend code is clicked, phone_verification_type is whatsapp', () => {
        const mockRequestOnWhatsapp = jest.fn();

        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValueOnce({
            requestOnWhatsApp: mockRequestOnWhatsapp,
        });
        renderComponent(VERIFICATION_SERVICES.WHATSAPP);
        const resend_code_button = screen.getByRole('button', { name: resend_code_text });
        userEvent.click(resend_code_button);
        expect(mockRequestOnWhatsapp).toHaveBeenCalledTimes(1);
        expect(mockSetOtpVerification).toBeCalledWith({
            show_otp_verification: true,
            phone_verification_type: VERIFICATION_SERVICES.WHATSAPP,
        });
    });

    it('should render mockRequestOnSMS and setOtpVerification with phone_verification_type: sms when Send code via SMS is clicked, phone_verification_type is whatsapp', () => {
        const mockRequestOnSMS = jest.fn();

        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValueOnce({
            requestOnSMS: mockRequestOnSMS,
        });
        renderComponent(VERIFICATION_SERVICES.WHATSAPP);
        const resend_code_button = screen.getByRole('button', { name: /Send code via SMS/ });
        userEvent.click(resend_code_button);
        expect(mockRequestOnSMS).toHaveBeenCalledTimes(1);
        expect(mockSetOtpVerification).toBeCalledWith({
            show_otp_verification: true,
            phone_verification_type: VERIFICATION_SERVICES.SMS,
        });
    });

    it('should render mockRequestOnWhatsApp and setOtpVerification with phone_verification_type: whatsapp when Send code via WhatsApp is clicked, phone_verification_type is whatsapp', () => {
        const mockRequestOnWhatsapp = jest.fn();

        (useRequestPhoneNumberOTP as jest.Mock).mockReturnValueOnce({
            requestOnWhatsApp: mockRequestOnWhatsapp,
        });
        renderComponent(VERIFICATION_SERVICES.SMS);
        const resend_code_button = screen.getByRole('button', { name: /Send code via WhatsApp/ });
        userEvent.click(resend_code_button);
        expect(mockRequestOnWhatsapp).toHaveBeenCalledTimes(1);
        expect(mockSetOtpVerification).toBeCalledWith({
            show_otp_verification: true,
            phone_verification_type: VERIFICATION_SERVICES.WHATSAPP,
        });
    });
});
