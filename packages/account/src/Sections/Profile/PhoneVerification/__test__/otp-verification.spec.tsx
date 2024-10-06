import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import OTPVerification from '../otp-verification';
import { useSendOTPVerificationCode, useSettings } from '@deriv/hooks';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useSettings: jest.fn(),
    useSendOTPVerificationCode: jest.fn(),
    usePhoneNumberVerificationSetTimer: jest.fn(() => ({
        setNextEmailOtpRequestTimer: jest.fn(),
        setNextPhoneOtpRequestTimer: jest.fn(),
        is_email_otp_timer_loading: false,
        is_phone_otp_timer_loading: false,
    })),
}));

jest.mock('../phone-number-verified-modal', () => jest.fn(() => <div>Phone Number Verified Modal</div>));
jest.mock('../resend-code-timer', () => jest.fn(() => <div>Resend Code Timer</div>));
jest.mock('../cool-down-period-modal', () => jest.fn(() => <div>Cooldown Period Modal</div>));

describe('OTPVerification', () => {
    const store = mockStore({
        client: {
            email: 'johndoe@regentmarkets.com',
        },
        ui: {
            should_show_phone_number_otp: false,
        },
    });
    let phone_verification_type = 'sms';
    const mockSetOtpVerification = jest.fn();
    const mockSendPhoneOTPVerification = jest.fn();
    const mockSetPhoneOtpErrorMessage = jest.fn();
    const renderComponent = () => {
        render(
            <StoreProvider store={store}>
                <OTPVerification
                    phone_verification_type={phone_verification_type}
                    setOtpVerification={mockSetOtpVerification}
                />
            </StoreProvider>
        );
    };

    beforeEach(() => {
        (useSettings as jest.Mock).mockReturnValue({
            data: {
                email: 'johndoe@regentmarkets.com',
            },
            invalidate: jest.fn(() => Promise.resolve()),
        });
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            sendPhoneOTPVerification: jest.fn(),
        });
    });

    it('should render ConfirmYourEmail in OTP Verification', () => {
        renderComponent();
        expect(screen.getByText('Step 1 of 3: Email verification needed')).toBeInTheDocument();
        expect(screen.getByText(/We've sent a verification code to/)).toBeInTheDocument();
        expect(screen.getByText('johndoe@regentmarkets.com')).toBeInTheDocument();
        expect(screen.getByText(/Enter the code below to verify it's you/)).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /Verification code/ })).toBeInTheDocument();
        expect(screen.getByText(/Resend Code Timer/)).toBeInTheDocument();
    });

    it('should render Verify your number in OTP Verification', () => {
        store.ui.should_show_phone_number_otp = true;
        renderComponent();
        expect(screen.getByText('Step 3 of 3: Verify your number')).toBeInTheDocument();
        expect(screen.getByText(/Enter the 6-digit code sent to you via SMS at ./)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Edit number/ })).toBeInTheDocument();
    });

    it('should render whatsapp when phone_verification_type is whatsapp', () => {
        store.ui.should_show_phone_number_otp = true;
        phone_verification_type = 'whatsapp';
        renderComponent();
        expect(screen.getByText(/WhatsApp/)).toBeInTheDocument();
    });

    it('should not enabled Verify button when otp does not have 6 characters', () => {
        store.ui.should_show_phone_number_otp = true;
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            sendPhoneOTPVerification: jest.fn(),
            setPhoneOtpErrorMessage: jest.fn(),
        });
        renderComponent();
        const otp_textfield = screen.getByRole('textbox');
        const verify_button = screen.getByRole('button', { name: 'Verify' });
        userEvent.type(otp_textfield, '12345');
        expect(verify_button).toBeDisabled();
    });

    it('should contain value of 123456 for otp textfield component', () => {
        store.ui.should_show_phone_number_otp = true;
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            sendPhoneOTPVerification: jest.fn(),
            setPhoneOtpErrorMessage: jest.fn(),
        });
        renderComponent();
        const otp_textfield = screen.getByRole('textbox');
        userEvent.type(otp_textfield, '123456');
        expect(otp_textfield).toHaveValue('123456');
    });

    it('should render mockSendPhoneOTPVerification when Verify button is clicked', () => {
        store.ui.should_show_phone_number_otp = true;
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            sendPhoneOTPVerification: mockSendPhoneOTPVerification,
            setPhoneOtpErrorMessage: jest.fn(),
        });
        renderComponent();
        const otp_textfield = screen.getByRole('textbox');
        const verify_button = screen.getByRole('button', { name: 'Verify' });
        userEvent.type(otp_textfield, '123456');
        expect(verify_button).toBeEnabled();
        userEvent.click(verify_button);
        expect(mockSendPhoneOTPVerification).toBeCalledTimes(1);
    });

    it('should show error message when API returns error', () => {
        store.ui.should_show_phone_number_otp = true;
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            sendPhoneOTPVerification: mockSendPhoneOTPVerification,
            phone_otp_error_message: 'Error Message',
        });
        renderComponent();
        expect(screen.getByText(/Error Message/)).toBeInTheDocument();
    });

    it('should render mockSetPhoneOtpErrorMessage to be empty when users retype inside textfield', () => {
        store.ui.should_show_phone_number_otp = true;
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            sendPhoneOTPVerification: mockSendPhoneOTPVerification,
            phone_otp_error_message: 'Error Message',
            setPhoneOtpErrorMessage: mockSetPhoneOtpErrorMessage,
        });
        renderComponent();
        expect(screen.getByText(/Error Message/)).toBeInTheDocument();
        const otp_textfield = screen.getByRole('textbox');
        userEvent.type(otp_textfield, '123456');
        expect(mockSetPhoneOtpErrorMessage).toBeCalled();
    });

    it('should display Phone Number Verified Modal when API returns phone_number_verified is true', () => {
        store.ui.should_show_phone_number_otp = true;
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            sendPhoneOTPVerification: mockSendPhoneOTPVerification,
            is_phone_number_verified: true,
        });
        renderComponent();
        expect(screen.getByText(/Phone Number Verified Modal/)).toBeInTheDocument();
    });

    it('should render sendEmailOTPVerification when should_show_phone_number_otp is false', () => {
        const mockSendEmailOTPVerification = jest.fn();
        store.ui.should_show_phone_number_otp = false;
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            sendEmailOTPVerification: mockSendEmailOTPVerification,
            setPhoneOtpErrorMessage: jest.fn(),
        });
        renderComponent();
        const otp_textfield = screen.getByRole('textbox');
        const verify_button = screen.getByRole('button', { name: 'Verify' });
        userEvent.type(otp_textfield, '123456');
        expect(verify_button).toBeEnabled();
        userEvent.click(verify_button);
        expect(mockSendEmailOTPVerification).toBeCalledTimes(1);
    });

    it('should render setOtpVerification and setVerificationCode when is_email_verified is true', () => {
        store.ui.should_show_phone_number_otp = false;
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            is_email_verified: true,
            sendEmailOTPVerification: jest.fn(),
            setPhoneOtpErrorMessage: jest.fn(),
        });
        renderComponent();
        const otp_textfield = screen.getByRole('textbox');
        const verify_button = screen.getByRole('button', { name: 'Verify' });
        userEvent.type(otp_textfield, '123456');
        expect(verify_button).toBeEnabled();
        userEvent.click(verify_button);
        expect(store.client.setVerificationCode).toBeCalled();
        expect(mockSetOtpVerification).toBeCalledWith({ phone_verification_type: '', show_otp_verification: false });
    });

    it('should display cooldown period modal when show_cool_down_period_modal is true', () => {
        store.ui.should_show_phone_number_otp = false;
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            show_cool_down_period_modal: true,
        });
        renderComponent();
        expect(screen.getByText(/Cooldown Period Modal/)).toBeInTheDocument();
    });
});
