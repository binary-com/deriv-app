import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePhoneNumberVerificationSetTimer, useVerifyEmail } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { StoreProvider, mockStore } from '@deriv/stores';
import { VerifyButton } from '../verify-button';
import { GetSettings, ResidenceList, StatesList } from '@deriv/api-types';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    usePhoneNumberVerificationSetTimer: jest.fn(),
    useVerifyEmail: jest.fn(() => ({
        sendPhoneNumberVerifyEmail: jest.fn(),
        WS: {},
        error: null,
    })),
    useSettings: jest.fn(() => ({
        refetch: jest.fn(),
        mutation: {
            mutateAsync: jest.fn(() => Promise.resolve()),
            isLoading: false,
        },
    })),
}));

const mockAccountSettings: GetSettings = {
    immutable_fields: ['place_of_birth'],
    place_of_birth: 'UK',
    tax_residence: 'UK',
    tax_identification_number: '12345',
    account_opening_reason: 'Hedging',
};

const mockResidenceList: ResidenceList = [
    { value: 'UK', text: 'United Kingdom' },
    { value: 'US', text: 'United States' },
];

const mockStatesList: StatesList = [];

describe('VerifyButton', () => {
    beforeEach(() => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_otp_request: '' });
    });
    const history = createBrowserHistory();
    const mock_store = mockStore({
        client: {
            account_settings: {
                phone_number_verification: {
                    verified: 0,
                },
            },
        },
    });
    let mock_next_email_otp_request_timer = 0;
    const mock_set_status = jest.fn();

    const renderWithRouter = () => {
        return render(
            <Router history={history}>
                <StoreProvider store={mock_store}>
                    <VerifyButton
                        is_verify_button_disabled={false}
                        next_email_otp_request_timer={mock_next_email_otp_request_timer}
                        values={mockAccountSettings}
                        residence_list={mockResidenceList}
                        states_list={mockStatesList}
                        setStatus={mock_set_status}
                    />
                </StoreProvider>
            </Router>
        );
    };

    beforeEach(() => {
        mock_next_email_otp_request_timer = 0;
    });

    it('should render Verify Button', () => {
        renderWithRouter();
        expect(screen.getByText('Verify')).toBeInTheDocument();
    });

    it('should redirect user to phone-verification page when clicked on Verify Button', () => {
        (useVerifyEmail as jest.Mock).mockReturnValue({
            sendPhoneNumberVerifyEmail: jest.fn(),
            WS: {
                isSuccess: true,
            },
        });
        renderWithRouter();
        const verifyButton = screen.getByText('Verify');
        userEvent.click(verifyButton);
        expect(history.location.pathname).toBe(routes.phone_verification);
    });

    it('should setStatus with error returned by WS', () => {
        (useVerifyEmail as jest.Mock).mockReturnValue({
            sendPhoneNumberVerifyEmail: jest.fn(),
            WS: {
                isSuccess: false,
            },
            error: {
                message: 'Phone Taken',
                code: 'PhoneNumberTaken',
            },
        });
        renderWithRouter();
        const verifyButton = screen.getByText('Verify');
        userEvent.click(verifyButton);
        expect(mock_set_status).toBeCalledWith({ msg: 'Phone Taken', code: 'PhoneNumberTaken' });
    });

    it('should render Verify Button with timer if next_otp_request has value', () => {
        mock_next_email_otp_request_timer = 2;
        renderWithRouter();
        expect(screen.getByText('Verify in 2s')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Verify in 2s' })).toBeDisabled();
    });

    it('should render Verified text', () => {
        if (mock_store.client.account_settings.phone_number_verification)
            mock_store.client.account_settings.phone_number_verification.verified = 1;
        renderWithRouter();
        expect(screen.getByText('Verified')).toBeInTheDocument();
    });
});
