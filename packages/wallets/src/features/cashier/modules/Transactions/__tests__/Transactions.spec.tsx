import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import useDevice from '../../../../../hooks/useDevice';
import Transactions from '../Transactions';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
    useCurrencyConfig: jest.fn(),
}));

jest.mock('../../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isMobile: true,
    })),
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({
        location: {
            pathname: '',
            state: {
                showPending: false,
            },
        },
    })),
}));

jest.mock('../components', () => ({
    TransactionsCompleted: () => <div>Transactions Completed</div>,
    TransactionsCompletedDemoResetBalance: () => <div>Transactions Completed Demo Reset Balance</div>,
    TransactionsPending: () => <div>Transactions Pending</div>,
}));

describe('Transactions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render default content correctly', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({});
        (useCurrencyConfig as jest.Mock).mockReturnValue({ isLoading: false });
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });

        render(<Transactions />);

        expect(screen.getByText('Transactions Completed')).toBeInTheDocument();
    });

    it('should switch to pending transactions when toggle is clicked', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_crypto: true, is_virtual: false },
        });
        (useCurrencyConfig as jest.Mock).mockReturnValue({ isLoading: false });
        (useHistory as jest.Mock).mockReturnValue({
            location: { pathname: '/wallets/cashier/transactions' },
        });
        render(<Transactions />);

        expect(screen.getByText('Transactions Completed')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_wallets_toggle_switch'));
        expect(screen.getByText('Transactions Pending')).toBeInTheDocument();
    });

    it('should switch to pending transactions when toggle is clicked with an initial pending state', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_crypto: true, is_virtual: false },
        });
        (useCurrencyConfig as jest.Mock).mockReturnValue({ isLoading: false });
        (useHistory as jest.Mock).mockReturnValue({
            location: { pathname: '/wallets/cashier/transactions', state: { showPending: true } },
        });
        render(<Transactions />);

        expect(screen.getByText('Transactions Pending')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_wallets_toggle_switch'));
        expect(screen.getByText('Transactions Completed')).toBeInTheDocument();
    });

    it('should show reset balance for virtual accounts selecting deposit', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_crypto: false, is_virtual: true },
        });
        (useCurrencyConfig as jest.Mock).mockReturnValue({ isLoading: false });
        render(<Transactions />);

        expect(screen.getByText('Transactions Completed')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_wallets_textfield_icon_right'));
        fireEvent.click(screen.getByText('Reset balance'));
        expect(screen.getByRole('combobox')).toHaveValue('Reset balance');
        expect(screen.getByText('Transactions Completed Demo Reset Balance')).toBeInTheDocument();
    });

    it('should change filter when a new option is selected from the dropdown', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_crypto: false, is_virtual: false },
        });
        (useCurrencyConfig as jest.Mock).mockReturnValue({ isLoading: false });
        render(<Transactions />);

        fireEvent.click(screen.getByTestId('dt_wallets_textfield_icon_right'));
        fireEvent.click(screen.getByText('Deposit'));

        expect(screen.getByRole('combobox')).toHaveValue('Deposit');
        fireEvent.click(screen.getByTestId('dt_wallets_textfield_icon_right'));
        fireEvent.click(screen.getByText('Withdrawal'));

        expect(screen.getByRole('combobox')).toHaveValue('Withdrawal');
        fireEvent.click(screen.getByTestId('dt_wallets_textfield_icon_right'));
        fireEvent.click(screen.getByText('Transfer'));

        expect(screen.getByRole('combobox')).toHaveValue('Transfer');
        fireEvent.click(screen.getByTestId('dt_wallets_textfield_icon_right'));
        fireEvent.click(screen.getByText('All'));

        expect(screen.getByRole('combobox')).toHaveValue('All');
    });

    it('should set filter value to all if pending and filter value is invalid for pending filters', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_crypto: true, is_virtual: false },
        });
        (useCurrencyConfig as jest.Mock).mockReturnValue({ isLoading: false });
        (useHistory as jest.Mock).mockReturnValue({
            location: {
                pathname: '/wallets/cashier/transactions',
                state: { showPending: true, transactionType: 'invalidFilter' },
            },
        });

        render(<Transactions />);

        expect(screen.getByText('Transactions Pending')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_wallets_textfield_icon_right'));
        fireEvent.click(screen.getByText('All'));

        expect(screen.getByRole('combobox')).toHaveValue('All');
    });

    it('should set filter value to all if not pending and filter value is invalid for completed filters', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({
            data: { is_crypto: true, is_virtual: false },
        });
        (useCurrencyConfig as jest.Mock).mockReturnValue({ isLoading: false });
        (useHistory as jest.Mock).mockReturnValue({
            location: {
                pathname: '/wallets/cashier/transactions',
                state: { showPending: false, transactionType: 'invalidFilter' },
            },
        });

        render(<Transactions />);

        expect(screen.getByText('Transactions Completed')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('dt_wallets_textfield_icon_right'));
        fireEvent.click(screen.getByText('All'));

        expect(screen.getByRole('combobox')).toHaveValue('All');
    });
});
