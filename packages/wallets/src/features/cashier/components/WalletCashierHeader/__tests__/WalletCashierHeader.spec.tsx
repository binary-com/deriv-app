import React from 'react';
import { APIProvider, useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../../../AuthProvider';
import useSubscribedBalance from '../../../../../hooks/useSubscribedBalance';
import WalletCashierHeader from '../WalletCashierHeader';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useBalanceSubscription: jest.fn(),
}));

jest.mock('../../../../../hooks/useSubscribedBalance', () => jest.fn());

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({ history: {} }),
    useLocation: () => ({ pathname: '/' }),
}));

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
        (useSubscribedBalance as jest.Mock).mockReturnValue({
            data: {
                CR1: {
                    balance: 10,
                },
            },
            setBalanceData: jest.fn(),
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
});
