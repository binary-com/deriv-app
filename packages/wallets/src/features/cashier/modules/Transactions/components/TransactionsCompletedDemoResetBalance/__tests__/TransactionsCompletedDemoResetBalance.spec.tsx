import React from 'react';
import { useActiveWalletAccount, useAllAccountsList, useTransactions } from '@deriv/api-v2';
import { act, render, screen } from '@testing-library/react';
import TransactionsCompletedDemoResetBalance from '../TransactionsCompletedDemoResetBalance';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
    useAllAccountsList: jest.fn(),
    useTransactions: jest.fn(() => ({
        data: [],
        isLoading: false,
        setFilter: jest.fn(),
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('../../TransactionsCompletedRow', () => ({
    TransactionsCompletedRow: jest.fn(() => <div>Transaction Row</div>),
}));

jest.mock('../../TransactionsNoDataState', () => ({
    TransactionsNoDataState: jest.fn(() => <div>No Data</div>),
}));

describe('TransactionsCompletedDemoResetBalance', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state when data is loading', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: null, isLoading: true });
        (useAllAccountsList as jest.Mock).mockReturnValueOnce({ data: null, isLoading: true });

        await act(async () => {
            render(<TransactionsCompletedDemoResetBalance />);
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render loading state when transactions are loading', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: {}, isLoading: false });
        (useAllAccountsList as jest.Mock).mockReturnValueOnce({ data: [], isLoading: false });
        (useTransactions as jest.Mock).mockReturnValueOnce({ data: null, isLoading: true, setFilter: jest.fn() });

        await act(async () => {
            render(<TransactionsCompletedDemoResetBalance />);
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render transactions and group them by date', async () => {
        const depositTransactions = [
            { transaction_time: 1643798400 }, // Date: 02 Feb 2022
        ];
        const withdrawalTransactions = [
            { transaction_time: 1643712000 }, // Date: 01 Feb 2022
        ];

        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: {}, isLoading: false });
        (useAllAccountsList as jest.Mock).mockReturnValueOnce({ data: [], isLoading: false });
        (useTransactions as jest.Mock).mockReturnValueOnce({
            data: depositTransactions,
            isLoading: false,
            setFilter: jest.fn(() => 'deposit'),
        });
        (useTransactions as jest.Mock).mockReturnValueOnce({
            data: withdrawalTransactions,
            isLoading: false,
            setFilter: jest.fn(() => 'withdrawal'),
        });

        await act(async () => {
            render(<TransactionsCompletedDemoResetBalance />);
        });

        expect(screen.getByText('01 Feb 2022')).toBeInTheDocument();
        expect(screen.getByText('02 Feb 2022')).toBeInTheDocument();
    });

    it('should render no data state when resetBalanceTransactions is empty', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValueOnce({ data: {}, isLoading: false });
        (useAllAccountsList as jest.Mock).mockReturnValueOnce({ data: [], isLoading: false });
        (useTransactions as jest.Mock).mockReturnValueOnce({
            data: [],
            isLoading: false,
            setFilter: jest.fn(),
        });

        await act(async () => {
            render(<TransactionsCompletedDemoResetBalance />);
        });

        expect(screen.getByText('No Data')).toBeInTheDocument();
    });
});
