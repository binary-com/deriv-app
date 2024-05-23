import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletsAppLinkedWithWalletIcon from '../WalletsAppLinkedWithWalletIcon';

describe('<WalletsAppLinkedWithWalletIcon/>', () => {
    it('renders', () => {
        render(
            <WalletsAppLinkedWithWalletIcon appIcon='IcWalletOptionsLight' currency='USD' isDemo size={undefined} />
        );

        const divElement = screen.getByTestId('dt_wallets_app_linked_with_wallet_icon');

        expect(divElement).toBeInTheDocument();
    });

    it('renders both icons', () => {
        render(<WalletsAppLinkedWithWalletIcon appIcon='IcWalletOptionsLight' currency='LTC' size='large' />);
        const mockAppIconSvgElement = screen.getByTestId('dt_wallet_icon');

        // eslint-disable-next-line testing-library/no-node-access
        const mockWalletIconSvgElement = screen.getByTestId('dt_wallet_currency_icon');

        expect(mockAppIconSvgElement).toBeInTheDocument();
        expect(mockWalletIconSvgElement).toBeInTheDocument();
    });

    it('applies correct size', () => {
        render(<WalletsAppLinkedWithWalletIcon appIcon='IcWalletOptionsLight' currency='LTC' size='large' />);

        const divElement = screen.getByTestId('dt_wallets_app_linked_with_wallet_icon');

        expect(divElement).toHaveClass('wallets-app-linked-with-wallet-icon--large');
    });

    it('displays proper gradient inside wallet icon', () => {
        render(<WalletsAppLinkedWithWalletIcon appIcon='IcWalletOptionsLight' currency='LTC' size='large' />);

        const gradientElement = screen.getByTestId('dt_wallet_gradient_background');

        expect(gradientElement).toBeInTheDocument();
        expect(gradientElement).toHaveClass('wallets-gradient--LTC-desktop-card-light');
    });
});
