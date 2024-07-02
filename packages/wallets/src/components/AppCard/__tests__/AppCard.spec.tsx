/* eslint-disable react/display-name */
import React from 'react';
import { render, screen } from '@testing-library/react';
import AppCard from '../AppCard';

jest.mock('../../WalletGradientBackground', () => ({
    WalletGradientBackground: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../AppCardBadge', () => ({
    AppCardBadge: () => <div>AppCardBadge</div>,
}));

describe('AppCard', () => {
    let mockProps: React.ComponentProps<typeof AppCard>;

    beforeEach(() => {
        mockProps = {
            activeWalletCurrency: 'USD',
            appName: 'MT5 Financial',
            balance: '+10.00 USD',
            cardSize: 'md',
            device: 'desktop',
            isDemoWallet: false,
            marketType: 'financial',
            platform: 'mt5',
            walletName: 'USD Wallet',
        };
    });

    it('should render `AppCard` component', () => {
        render(<AppCard {...mockProps} />);

        expect(screen.getByTestId('dt_wallets_app_card')).toBeInTheDocument();
        expect(screen.getByText('AppCardBadge')).toBeInTheDocument();
        expect(screen.getByText('MT5 Financial')).toBeInTheDocument();
        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('+10.00 USD')).toBeInTheDocument();
    });

    it('should not render `appBadge, appName, walletName and balance`, when cardSize equals to `sm`', () => {
        mockProps.cardSize = 'sm';
        render(<AppCard {...mockProps} />);

        expect(screen.getByTestId('dt_wallets_app_card')).toBeInTheDocument();
        expect(screen.queryByText('AppCardBadge')).not.toBeInTheDocument();
        expect(screen.queryByText('MT5 Financial')).not.toBeInTheDocument();
        expect(screen.queryByText('USD Wallet')).not.toBeInTheDocument();
        expect(screen.queryByText('+10.00 USD')).not.toBeInTheDocument();
    });
});
