import React from 'react';
import { render, screen } from '@testing-library/react';
import DidntGetTheCodeModal from '../didnt-get-the-code-modal';
import userEvent from '@testing-library/user-event';
import { VERIFICATION_SERVICES } from '@deriv/shared';

describe('DidntGetTheCodeModal', () => {
    const mockClearOtpValue = jest.fn();
    const mockSetShouldShowDidntGetTheCodeModal = jest.fn();
    const mockSetOtpVerification = jest.fn();
    const mockReInitializeGetSettings = jest.fn();
    const mockSetIsButtonDisabled = jest.fn();
    const mockRequestOnWhatsApp = jest.fn();
    const mockRequestOnSms = jest.fn();
    const resend_code_text = /Resend code/;

    const renderComponent = (phone_verification_type: string) => {
        render(
            <DidntGetTheCodeModal
                clearOtpValue={mockClearOtpValue}
                setIsButtonDisabled={mockSetIsButtonDisabled}
                reInitializeGetSettings={mockReInitializeGetSettings}
                should_show_didnt_get_the_code_modal={true}
                phone_verification_type={phone_verification_type}
                setShouldShowDidntGetTheCodeModal={mockSetShouldShowDidntGetTheCodeModal}
                setOtpVerification={mockSetOtpVerification}
                requestOnWhatsApp={mockRequestOnWhatsApp}
                requestOnSMS={mockRequestOnSms}
                email_otp_error={null}
                is_email_verified={false}
            />
        );
    };

    beforeEach(() => {
        mockSetShouldShowDidntGetTheCodeModal.mockClear();
        mockSetOtpVerification.mockClear();
        mockRequestOnSms.mockClear();
        mockRequestOnWhatsApp.mockClear();
    });

    it('should render DidntGetTheCodeModal', () => {
        renderComponent(VERIFICATION_SERVICES.SMS);
        expect(screen.getByText(/Didn't receive a code/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: resend_code_text })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send code via WhatsApp/ })).toBeInTheDocument();
    });

    it('should show Send code via SMS if phone_verification_type is whatsapp', () => {
        renderComponent(VERIFICATION_SERVICES.WHATSAPP);
        expect(screen.getByRole('button', { name: /Send code via SMS/ })).toBeInTheDocument();
    });

    it('should render setShouldShowDidintGetTheCodeModal when Resend code is clicked', () => {
        renderComponent(VERIFICATION_SERVICES.SMS);
        const resend_code_button = screen.getByRole('button', { name: resend_code_text });
        userEvent.click(resend_code_button);
        expect(mockSetShouldShowDidntGetTheCodeModal).toHaveBeenCalledTimes(1);
    });

    it('should render mockRequestOnSMS and setOtpVerification with phone_verification_type: sms when Resend code is clicked, phone_verification_type is sms', () => {
        renderComponent(VERIFICATION_SERVICES.SMS);
        const resend_code_button = screen.getByRole('button', { name: resend_code_text });
        userEvent.click(resend_code_button);
        expect(mockRequestOnSms).toHaveBeenCalledTimes(1);
        expect(mockSetOtpVerification).toBeCalledWith({
            show_otp_verification: true,
            phone_verification_type: VERIFICATION_SERVICES.SMS,
        });
    });

    it('should render mockRequestOnWhatsapp and setOtpVerification with phone_verification_type: whatsapp when Resend code is clicked, phone_verification_type is whatsapp', () => {
        renderComponent(VERIFICATION_SERVICES.WHATSAPP);
        const resend_code_button = screen.getByRole('button', { name: resend_code_text });
        userEvent.click(resend_code_button);
        expect(mockRequestOnWhatsApp).toHaveBeenCalledTimes(1);
        expect(mockSetOtpVerification).toBeCalledWith({
            show_otp_verification: true,
            phone_verification_type: VERIFICATION_SERVICES.WHATSAPP,
        });
    });

    it('should render mockRequestOnSMS and setOtpVerification with phone_verification_type: sms when Send code via SMS is clicked, phone_verification_type is whatsapp', () => {
        renderComponent(VERIFICATION_SERVICES.WHATSAPP);
        const resend_code_button = screen.getByRole('button', { name: /Send code via SMS/ });
        userEvent.click(resend_code_button);
        expect(mockRequestOnSms).toHaveBeenCalledTimes(1);
        expect(mockSetOtpVerification).toBeCalledWith({
            show_otp_verification: true,
            phone_verification_type: VERIFICATION_SERVICES.SMS,
        });
    });

    it('should render mockRequestOnWhatsApp and setOtpVerification with phone_verification_type: whatsapp when Send code via WhatsApp is clicked, phone_verification_type is whatsapp', () => {
        renderComponent(VERIFICATION_SERVICES.SMS);
        const resend_code_button = screen.getByRole('button', { name: /Send code via WhatsApp/ });
        userEvent.click(resend_code_button);
        expect(mockRequestOnWhatsApp).toHaveBeenCalledTimes(1);
        expect(mockSetOtpVerification).toBeCalledWith({
            show_otp_verification: true,
            phone_verification_type: VERIFICATION_SERVICES.WHATSAPP,
        });
    });
});
