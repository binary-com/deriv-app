import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailVerificationEmptyState from '../email-verification-empty-state';
import { mockStore } from '@deriv/stores';
import { APIProvider } from '@deriv/api';
import CashierProviders from '../../../cashier-providers';

const mock_store = mockStore({
    client: {
        email: 'john@company.com',
    },
});

describe('EmailVerificationEmptyState', () => {
    test('should disable resend button after sending the request', () => {
        render(<EmailVerificationEmptyState type='reset_password' />, {
            wrapper: ({ children }) => (
                <APIProvider>
                    <CashierProviders store={mock_store}>{children}</CashierProviders>
                </APIProvider>
            ),
        });

        expect(screen.queryByTestId('dt_empty_state_action')).toBeInTheDocument();

        screen.queryByTestId('dt_empty_state_action')?.click();

        expect(screen.queryByTestId('dt_empty_state_action')).toBeDisabled();
    });

    // TODO: Add more test cases.
});
