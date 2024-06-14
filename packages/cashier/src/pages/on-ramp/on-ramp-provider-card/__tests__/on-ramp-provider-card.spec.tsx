import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OnRampProviderCard from '../on-ramp-provider-card';
import { mockStore } from '@deriv/stores';
import CashierProviders from '../../../../cashier-providers';

describe('<OnRampProviderCard />', () => {
    const provider = {
        name: 'Banxa',
        icon: {
            dark: 'IcCashierBanxaDark',
            light: 'IcCashierBanxaLight',
        },
        getDescription: jest.fn(
            () =>
                'A fast and secure fiat-to-crypto payment service. Deposit cryptocurrencies from anywhere in the world using your credit/debit cards and bank transfers.'
        ),
        getPaymentIcons: jest.fn(() => [{ dark: 'IcCashierFlexepinDark', light: 'IcCashierFlexepinLight' }]),
        getAllowedResidencies: jest.fn(() => []),
        getScriptDependencies: jest.fn(() => []),
        getDefaultFromCurrency: jest.fn(() => ''),
        getFromCurrencies: jest.fn(() => []),
        getToCurrencies: jest.fn(() => []),
        getWidgetHtml: jest.fn(() => Promise.resolve()),
        onMountWidgetContainer: jest.fn(),
        should_show_deposit_address: false,
    };

    it('should show proper messages and button', () => {
        const mock_root_store = mockStore({
            ui: {
                is_dark_mode_on: false,
                is_mobile_or_tablet: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        setSelectedProvider: jest.fn(),
                    },
                },
            },
        });

        render(<OnRampProviderCard provider={provider} />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByText('Banxa')).toBeInTheDocument();
        expect(
            screen.getByText(
                'A fast and secure fiat-to-crypto payment service. Deposit cryptocurrencies from anywhere in the world using your credit/debit cards and bank transfers.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
    });

    it('should show proper icons in dark_mode', () => {
        const mock_root_store = mockStore({
            ui: {
                is_dark_mode_on: true,
                is_mobile_or_tablet: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        setSelectedProvider: jest.fn(),
                    },
                },
            },
        });

        render(<OnRampProviderCard provider={provider} />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        expect(screen.getByTestId('dt_provider_icon_dark')).toBeInTheDocument();
        expect(screen.getByTestId('dt_payment_icon_dark')).toBeInTheDocument();
    });

    it('should trigger onClick callback, when "Select" button is clicked', () => {
        const mock_root_store = mockStore({
            ui: {
                is_dark_mode_on: false,
                is_mobile_or_tablet: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        setSelectedProvider: jest.fn(),
                    },
                },
            },
        });

        render(<OnRampProviderCard provider={provider} />, {
            wrapper: ({ children }) => <CashierProviders store={mock_root_store}>{children}</CashierProviders>,
        });

        const btn = screen.getByRole('button', { name: 'Select' });
        fireEvent.click(btn);

        expect(mock_root_store.modules.cashier.onramp.setSelectedProvider).toHaveBeenCalledTimes(1);
    });
});
