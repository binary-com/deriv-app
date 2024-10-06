import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhoneVerificationPage from '../phone-verification-page';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useGrowthbookGetFeatureValue, useSendOTPVerificationCode } from '@deriv/hooks';

jest.mock('../otp-verification.tsx', () => jest.fn(() => <div>Confirm Your Email</div>));
jest.mock('../confirm-phone-number.tsx', () => jest.fn(() => <div>Confirm Phone Number</div>));
jest.mock('../cancel-phone-verification-modal', () => jest.fn(() => <div>Cancel Phone Verification Modal</div>));
jest.mock('../verification-link-expired-modal', () => jest.fn(() => <div>Verification Link Expired Modal</div>));
jest.mock('../session-timeout-modal.tsx', () => jest.fn(() => <div>Session Timeout Modal</div>));
jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useSendOTPVerificationCode: jest.fn(() => ({
        email_otp_error: undefined,
        is_email_verified: false,
        sendEmailOTPVerification: jest.fn(),
    })),
    useGrowthbookGetFeatureValue: jest.fn(),
    usePhoneNumberVerificationSessionTimer: jest.fn(() => ({
        formatted_time: '00:00',
    })),
}));
jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Loading: jest.fn(() => 'mockedLoading'),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

describe('ConfirmPhoneNumber', () => {
    let mock_store_data = mockStore({});
    const renderComponent = () => {
        render(
            <StoreProvider store={mock_store_data}>
                <PhoneVerificationPage />
            </StoreProvider>
        );
    };
    beforeEach(() => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true, true]);
        mock_store_data = mockStore({
            client: {
                verification_code: {
                    phone_number_verification: '',
                },
            },
            ui: {
                is_redirected_from_email: false,
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render ConfirmPhoneNumber', () => {
        renderComponent();
        expect(screen.getByText(/Back to personal details/)).toBeInTheDocument();
        expect(screen.getByText(/Confirm Your Email/)).toBeInTheDocument();
    });

    it('should display cancel phone verification modal when back button is clicked', () => {
        renderComponent();
        const backButton = screen.getByTestId('dt_phone_verification_back_btn');
        userEvent.click(backButton);
        expect(screen.getByText(/Cancel Phone Verification Modal/)).toBeInTheDocument();
    });

    it('should display mockedLoading and render sendEmailOTPVerification when phone_number_verification has value', () => {
        const mockSendEmailOTPVerification = jest.fn();
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            sendEmailOTPVerification: mockSendEmailOTPVerification,
        });
        mock_store_data.client.verification_code.phone_number_verification = '123456';
        mock_store_data.client.is_authorize = true;
        mock_store_data.ui.is_redirected_from_email = true;
        renderComponent();
        expect(screen.getByText(/mockedLoading/)).toBeInTheDocument();
        expect(mockSendEmailOTPVerification).toBeCalledTimes(1);
    });

    it('should display Verification Link Expired Modal when hook returns error', async () => {
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            email_otp_error: { code: 'InvalidToken', message: '' },
            sendEmailOTPVerification: jest.fn(),
        });
        renderComponent();
        expect(screen.getByText(/Verification Link Expired Modal/)).toBeInTheDocument();
    });

    it('should display Confirm Phone Number when is_email_verified is true', async () => {
        (useSendOTPVerificationCode as jest.Mock).mockReturnValue({
            is_email_verified: true,
        });
        mock_store_data.ui.is_redirected_from_email = true;
        renderComponent();
        expect(screen.getByText(/Confirm Phone Number/)).toBeInTheDocument();
    });
});
