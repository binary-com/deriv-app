import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletListCardDetails from '../WalletListCardDetails';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({
        data: {
            is_virtual: false,
        },
        isLoading: false,
    })),
}));

jest.mock('../../WalletListCardActions/WalletListCardActions', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardActions</div>),
}));

jest.mock('../../WalletListCardBalance/WalletListCardBalance', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardBalance</div>),
}));

jest.mock('../../WalletListCardDropdown/WalletListCardDropdown', () => ({
    __esModule: true,
    default: jest.fn(() => <div>Mocked WalletListCardDropdown</div>),
}));

describe('WalletListCardDetails', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with default components correctly for real account', () => {
        render(<WalletListCardDetails />);

        expect(screen.getByText('Mocked WalletListCardActions')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardBalance')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardDropdown')).toBeInTheDocument();
    });

    it('should render with default components correctly for demo account', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                is_virtual: true,
            },
        });
        render(<WalletListCardDetails />);

        expect(screen.getByText('Mocked WalletListCardActions')).toBeInTheDocument();
        expect(screen.getByText('Mocked WalletListCardBalance')).toBeInTheDocument();
        expect(screen.getByText('USD Demo Wallet')).toBeInTheDocument();
    });
});
