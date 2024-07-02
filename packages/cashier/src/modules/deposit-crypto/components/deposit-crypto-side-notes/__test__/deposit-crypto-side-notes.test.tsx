import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import DepositCryptoSideNotes from '../deposit-crypto-side-notes';
import { APIProvider } from '@deriv/api';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                    UST: { type: 'crypto', name: 'Tether' },
                    eUSDT: { type: 'crypto', name: 'Tether' },
                },
            },
        },
    })),
}));

describe('DepositCryptoSideNotes', () => {
    test('should show correct side note for UST', () => {
        const mock = mockStore({
            client: { currency: 'UST' },
            modules: { cashier: { transaction_history: { setIsTransactionsCryptoVisible: jest.fn() } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <CashierProviders store={mock}>{children}</CashierProviders>
            </APIProvider>
        );
        render(<DepositCryptoSideNotes />, { wrapper });

        expect(screen.getByText(/About Tether \(Omni\)/)).toBeInTheDocument();
    });

    test('should show correct side note for eUSDT', () => {
        const mock = mockStore({
            client: { currency: 'eUSDT' },
            modules: { cashier: { transaction_history: { setIsTransactionsCryptoVisible: jest.fn() } } },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <APIProvider>
                <CashierProviders store={mock}>{children}</CashierProviders>
            </APIProvider>
        );
        render(<DepositCryptoSideNotes />, { wrapper });

        expect(screen.getByText(/About Tether \(Ethereum\)/)).toBeInTheDocument();
    });
});
