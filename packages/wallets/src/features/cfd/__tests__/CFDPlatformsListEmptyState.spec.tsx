import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CFDPlatformsListEmptyState from '../CFDPlatformsListEmptyState';

const cryptoCurrency = 'BTC';
const fiatCurrency = 'USD';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            currency: 'BTC',
        },
    })),
    useWalletAccountsList: jest.fn(() => ({
        data: [
            { account_type: 'doughflow', wallet_currency_type: fiatCurrency },
            { account_type: 'crypto', wallet_currency_type: cryptoCurrency },
        ],
    })),
}));

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({ push: mockPush })),
}));

describe('CFDPlatformsListEmptyState', () => {
    it('renders proper content', () => {
        render(<CFDPlatformsListEmptyState />);

        expect(
            screen.getByText(
                `To trade CFDs, you'll need to use your ${fiatCurrency} Wallet. Click Transfer to move your ${cryptoCurrency} to your ${fiatCurrency} Wallet.`
            )
        ).toBeInTheDocument();
    });

    it('redirects to `wallet/account-transfer` route if the user is clicking on `Transfer` button', async () => {
        render(<CFDPlatformsListEmptyState />);

        const transferBtn = screen.getByRole('button', { name: 'Transfer' });
        await userEvent.click(transferBtn);

        expect(mockPush).toHaveBeenCalledWith('/wallet/account-transfer', { shouldSelectDefaultWallet: true });
    });
});
