import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import CashierOnboardingSideNotes from '../cashier-onboarding-side-notes';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    USD: { type: 'fiat', name: 'US Dollar' },
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                },
            },
        },
    })),
}));

describe('CashierOnboardingSideNotes', () => {
    test('should render CashierOnboardingSideNoteFiat on mobile if is_crypto is false', () => {
        const mock = mockStore({
            ui: { is_mobile_or_tablet: true },
            client: { currency: 'USD' },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CashierOnboardingSideNotes />, { wrapper });

        expect(screen.getByText(/If you want to change your account currency/i)).toBeInTheDocument();
    });

    test('should render CashierOnboardingSideNoteCrypto on mobile on mobile if is_crypto is true', async () => {
        const mock = mockStore({
            ui: { is_mobile_or_tablet: true },
            client: { currency: 'BTC' },
            modules: {
                cashier: {
                    general_store: {
                        setDepositTarget: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CashierOnboardingSideNotes />, { wrapper });

        expect(screen.getByText(/You can open another cryptocurrency account/i)).toBeInTheDocument();
    });
});
