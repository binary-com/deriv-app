import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletsAppLinkedWithWalletIcon from '../WalletsAppLinkedWithWalletIcon';

describe('<WalletsAppLinkedWithWalletIcon/>', () => {
    it('renders', () => {
        render(<WalletsAppLinkedWithWalletIcon appIcon='IcWalletOptionsLight' currency='LTC' size='large' />);

        const divElement = screen.getByTestId('wallets-app-linked-with-wallet-icon');

        expect(divElement).toBeInTheDocument();
    });

    it('renders both icons', () => {
        render(<WalletsAppLinkedWithWalletIcon appIcon='IcWalletOptionsLight' currency='LTC' size='large' />);

        const divElement = screen.getByTestId('wallets-app-linked-with-wallet-icon');

        // eslint-disable-next-line testing-library/no-node-access
        const mockAppIconSvgElement = divElement.querySelector(
            '.wallets-app-linked-with-wallet-icon__app-icon file-mock-stub'
        );
        // eslint-disable-next-line testing-library/no-node-access
        const mockWalletIconSvgElement = screen.getByTestId('dt_wallet_currency_icon');

        expect(mockAppIconSvgElement).not.toBeNull();
        expect(mockWalletIconSvgElement).toBeInTheDocument();
    });

    it('applies correct size', () => {
        render(<WalletsAppLinkedWithWalletIcon appIcon='IcWalletOptionsLight' currency='LTC' size='large' />);

        const divElement = screen.getByTestId('wallets-app-linked-with-wallet-icon');

        expect(divElement).toHaveClass('wallets-app-linked-with-wallet-icon--large');
    });

    it('displays proper gradient inside wallet icon', () => {
        render(<WalletsAppLinkedWithWalletIcon appIcon='IcWalletOptionsLight' currency='LTC' size='large' />);

        const gradientElement = screen.getByTestId('dt_wallet_gradient_background');

        expect(gradientElement).toBeInTheDocument();
        expect(gradientElement).toHaveClass('wallets-gradient--LTC-desktop-card-light');
    });
});
