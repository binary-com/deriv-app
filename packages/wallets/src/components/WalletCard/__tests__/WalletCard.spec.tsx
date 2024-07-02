import React, { ComponentProps } from 'react';
import { APIProvider, useBalance } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import WalletCard from '../WalletCard';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useBalance: jest.fn(() => ({
        ...jest.requireActual('@deriv/api-v2').useBalance(),
        isLoading: false,
    })),
}));

describe('WalletCard', () => {
    let mockProps: ComponentProps<typeof WalletCard> = {
        balance: '100 USD',
        currency: 'USD',
        iconSize: 'lg',
    };
    beforeEach(() => {
        jest.clearAllMocks();
        mockProps = {
            balance: '100 USD',
            currency: 'USD',
            iconSize: 'lg',
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    it('should render the correct wallet card and gradient background for USD wallet', () => {
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <WalletCard {...mockProps} />
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        const gradient = screen.getByTestId('dt_wallet_gradient_background');
        expect(gradient).toHaveClass('wallets-gradient--USD-mobile-card-light');
    });

    it('should render the correct wallet card and gradient background for BTC wallet', () => {
        mockProps = {
            balance: '100 BTC',
            currency: 'BTC',
        };
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <WalletCard {...mockProps} />
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();
        const gradient = screen.getByTestId('dt_wallet_gradient_background');
        expect(gradient).toHaveClass('wallets-gradient--BTC-mobile-card-light');
    });

    it('should render the correct wallet card and gradient background for BTC wallet in carousel content', () => {
        mockProps = {
            balance: '100 BTC',
            currency: 'BTC',
            isCarouselContent: true,
        };
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <WalletCard {...mockProps} />
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('BTC Wallet')).toBeInTheDocument();
        const gradient = screen.getByTestId('dt_wallet_gradient_background');
        expect(gradient).toHaveClass('wallets-gradient--BTC-mobile-card-light');
        const details = screen.getByTestId('dt_wallet_card_details');
        expect(details).toHaveClass('wallets-card__carousel-content-details');
    });

    it('should render the correct wallet card and gradient background for demo wallet', () => {
        mockProps = {
            balance: '100 USD',
            currency: 'USD',
            isDemo: true,
        };
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <WalletCard isCarouselContent {...mockProps} />
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('USD Demo Wallet')).toBeInTheDocument();
        const gradient = screen.getByTestId('dt_wallet_gradient_background');
        expect(gradient).toHaveClass('wallets-gradient--demo-mobile-card-light');
    });

    it('should show balance loader when balance is loading', () => {
        (useBalance as jest.Mock).mockImplementation(() => ({
            ...jest.requireActual('@deriv/api-v2').useBalance(),
            isLoading: true,
        }));
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <WalletCard {...mockProps} />
                </WalletsAuthProvider>
            </APIProvider>
        );
        const balanceLoader = screen.getByTestId('dt_wallet_card_balance_loader');
        expect(balanceLoader).toBeInTheDocument();
    });

    it('should show balance when balance is loaded', () => {
        (useBalance as jest.Mock).mockImplementation(() => ({
            ...jest.requireActual('@deriv/api-v2').useBalance(),
            isLoading: false,
        }));
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <WalletCard {...mockProps} />
                </WalletsAuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('100 USD')).toBeInTheDocument();
    });

    it('should show the icon with the correct size', () => {
        mockProps = {
            ...mockProps,
            iconSize: 'xs',
        };
        render(
            <APIProvider>
                <WalletsAuthProvider>
                    <WalletCard {...mockProps} />
                </WalletsAuthProvider>
            </APIProvider>
        );
        const icon = screen.getByTestId('dt_wallet_currency_icon');
        expect(icon).toHaveAttribute('width', '16');
    });
});
