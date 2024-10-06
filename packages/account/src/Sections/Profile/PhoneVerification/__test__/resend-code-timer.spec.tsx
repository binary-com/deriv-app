import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePhoneNumberVerificationSetTimer, useVerifyEmail } from '@deriv/hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import ResendCodeTimer from '../resend-code-timer';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useVerifyEmail: jest.fn(() => ({
        sendPhoneNumberVerifyEmail: jest.fn(),
        WS: {
            isSuccess: false,
        },
    })),
    useSettings: jest.fn(() => ({
        data: {
            phone_number_verification: {
                next_email_attempt: null,
                next_attempt: null,
            },
        },
    })),
    usePhoneNumberVerificationSetTimer: jest.fn(() => ({
        next_phone_otp_request_timer: '',
        next_email_otp_request_timer: '',
    })),
}));

describe('ConfirmPhoneNumber', () => {
    beforeEach(() => {
        (useVerifyEmail as jest.Mock).mockReturnValue({
            sendPhoneNumberVerifyEmail: jest.fn(),
            WS: { isSuccess: false },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({
            next_phone_otp_request_timer: '',
            next_email_otp_request_timer: '',
        });
    });

    const mockSetShouldShowDidntGetTheCodeModal = jest.fn();
    const mockSetIsButtonDisabled = jest.fn();
    const mockReInitializeGetSettings = jest.fn();
    const mockClearOtpValue = jest.fn();

    const renderComponent = (is_button_disabled = false, should_show_resend_code_button = true) => {
        render(
            <StoreProvider store={mock_store}>
                <ResendCodeTimer
                    clearOtpValue={mockClearOtpValue}
                    is_button_disabled={is_button_disabled}
                    reInitializeGetSettings={mockReInitializeGetSettings}
                    setIsButtonDisabled={mockSetIsButtonDisabled}
                    should_show_resend_code_button={should_show_resend_code_button}
                    setShouldShowDidntGetTheCodeModal={mockSetShouldShowDidntGetTheCodeModal}
                />
            </StoreProvider>
        );
    };

    const mock_store = mockStore({});
    it('should enable button if usePhoneNumberVerificationSetTimer did not return next_otp_request', async () => {
        renderComponent();

        expect(screen.queryByRole('button', { name: 'Resend code' })).toBeEnabled;
    });

    it('should disable button if usePhoneNumberVerificationSetTimer returns next_otp_request', async () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_email_otp_request_timer: 59 });
        renderComponent();

        expect(screen.queryByRole('button', { name: 'Resend code in 59s' })).toBeDisabled;
    });

    it('should trigger mockSend when send button is clicked', () => {
        const mockSend = jest.fn();
        (useVerifyEmail as jest.Mock).mockReturnValue({
            sendPhoneNumberVerifyEmail: mockSend,
            WS: { isSuccess: false },
        });
        renderComponent();
        const resend_button = screen.getByRole('button', { name: 'Resend code' });
        expect(resend_button).toBeEnabled();

        userEvent.click(resend_button);
        expect(mockSend).toBeCalled();
    });

    it('should display Didn’t get the code? should_show_resend_code_button is false', () => {
        renderComponent(false, false);
        const resend_button = screen.getByRole('button', { name: "Didn't get the code?" });
        expect(resend_button).toBeInTheDocument();
    });

    it('should display Didn’t get the code? (60s) when usePhoneNumberSetTimer returns (60s)', () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_phone_otp_request_timer: 60 });
        renderComponent(false, false);
        const resend_button = screen.getByRole('button', { name: "Didn't get the code? (1m)" });
        expect(resend_button).toBeInTheDocument();
    });

    it('should trigger setShouldShowDidntGetTheCodeModal when Didn`t get the code is clicked', () => {
        renderComponent(false, false);
        const resend_button_after = screen.getByRole('button', { name: "Didn't get the code?" });
        userEvent.click(resend_button_after);
        expect(mockSetShouldShowDidntGetTheCodeModal).toHaveBeenCalled();
    });
});
