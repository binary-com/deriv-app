import React from 'react';
import { APIProvider, useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsAuthProvider from '../../../../../AuthProvider';
import useAllBalanceSubscription from '../../../../../hooks/useAllBalanceSubscription';
import WalletCashierHeader from '../WalletCashierHeader';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ push: mockPush }),
    useLocation: () => ({ pathname: '/' }),
}));

jest.mock('../../../../../hooks/useAllBalanceSubscription', () => jest.fn());

const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <APIProvider>
        <WalletsAuthProvider>{children}</WalletsAuthProvider>
    </APIProvider>
);

describe('<WalletCashierHeader/>', () => {
    beforeEach(() => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                loginid: 'CR1',
            },
        });
        (useAllBalanceSubscription as jest.Mock).mockReturnValue({
            data: {
                CR1: {
                    balance: 10,
                },
            },
        });
    });

    it('should render header', () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        const divElement = screen.getByTestId('dt_wallet_gradient_background');
        expect(divElement).toBeInTheDocument();
    });

    it('should display correct balance', () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        const balanceElement = screen.getByText('10.00 USD');
        expect(balanceElement).toBeInTheDocument();
    });

    it('should display default content with badge for demo', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                is_virtual: true,
                loginid: 'CR1',
            },
        });

        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        expect(screen.getByText('USD Wallet')).toBeInTheDocument();
        expect(screen.getByText('10.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Demo')).toBeInTheDocument();
    });

    it('should display real transfer tabs - Deposit, Withdraw, Transfer, Transaction', () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        expect(screen.getByText('Deposit')).toBeInTheDocument();
        expect(screen.getByText('Withdraw')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
    });

    it('should display demo transfer tabs - Reset Balance, Transfer, Transaction', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: {
                currency: 'USD',
                is_virtual: true,
                loginid: 'CR1',
            },
        });

        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        expect(screen.getByText('Reset Balance')).toBeInTheDocument();
        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
    });

    it('redirects to the root route with `accountsActiveTabIndex` history state, when the user closes cashier overlay', async () => {
        render(<WalletCashierHeader hideWalletDetails={false} />, { wrapper });

        const closeBtn = screen.getByTestId('dt_close_btn');
        await userEvent.click(closeBtn);

        expect(mockPush).toHaveBeenCalledWith('/', { accountsActiveTabIndex: 0 });
    });
});
