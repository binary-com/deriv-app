import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import OnRampProviderCard from '../on-ramp-provider-card';
import { TRootStore } from 'Types';
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
        getFromCurrencies: jest.fn(() => ''),
        getToCurrencies: jest.fn(() => ''),
        getWidgetHtml: jest.fn(() => Promise.resolve()),
        onMountWidgetContainer: jest.fn(),
        should_show_deposit_address: false,
    };

    it('should show proper messages and button', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: false,
                is_mobile: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        setSelectedProvider: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderCard provider={provider} />, {
            wrapper: ({ children }) => (
                <CashierProviders store={mockRootStore as TRootStore}>{children}</CashierProviders>
            ),
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
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: true,
                is_mobile: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        setSelectedProvider: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderCard provider={provider} />, {
            wrapper: ({ children }) => (
                <CashierProviders store={mockRootStore as TRootStore}>{children}</CashierProviders>
            ),
        });

        expect(screen.getByTestId('dti_provider_icon_dark')).toBeInTheDocument();
        expect(screen.getByTestId('dti_payment_icon_dark')).toBeInTheDocument();
    });

    it('should trigger onClick callback, when "Select" button is clicked', () => {
        const mockRootStore: DeepPartial<TRootStore> = {
            ui: {
                is_dark_mode_on: false,
                is_mobile: false,
            },
            modules: {
                cashier: {
                    onramp: {
                        setSelectedProvider: jest.fn(),
                    },
                },
            },
        };

        render(<OnRampProviderCard provider={provider} />, {
            wrapper: ({ children }) => (
                <CashierProviders store={mockRootStore as TRootStore}>{children}</CashierProviders>
            ),
        });

        const btn = screen.getByRole('button', { name: 'Select' });
        fireEvent.click(btn);

        expect(mockRootStore.modules!.cashier!.onramp!.setSelectedProvider).toHaveBeenCalledTimes(1);
    });
});
