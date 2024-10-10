import React from 'react';
import { render, screen } from '@testing-library/react';
import SessionTimeoutModal from '../session-timeout-modal';
import { mockStore, StoreProvider } from '@deriv/stores';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';

const mock_push = jest.fn();

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    usePhoneNumberVerificationSessionTimer: jest.fn(() => ({
        should_show_session_timeout_modal: true,
    })),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mock_push,
    }),
}));

describe('SessionTimeoutModal', () => {
    const mock_store = mockStore({});
    const renderComponent = () => {
        render(
            <StoreProvider store={mock_store}>
                <SessionTimeoutModal is_at_otp_verification />
            </StoreProvider>
        );
    };

    it('should show SessionTimeoutModal content', () => {
        renderComponent();
        expect(screen.getByText(/Session expired/)).toBeInTheDocument();
        expect(screen.getByText(/Restart your phone number verification./)).toBeInTheDocument();
        const ok_button = screen.getByRole('button', { name: 'OK' });
        expect(ok_button).toBeInTheDocument();
    });

    it('should redirect user back to Personal Details Settings on OK button', () => {
        renderComponent();
        const ok_button = screen.getByRole('button', { name: 'OK' });
        userEvent.click(ok_button);
        expect(mock_push).lastCalledWith(routes.personal_details);
    });
});
