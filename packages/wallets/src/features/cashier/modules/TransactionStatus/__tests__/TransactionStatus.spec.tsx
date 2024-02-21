import React from 'react';
import { useActiveWalletAccount, useCryptoTransactions } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import TransactionStatus from '../TransactionStatus';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(() => ({
        data: null,
        error: null,
        isLoading: false,
        refetch: jest.fn(),
    })),
    useCryptoTransactions: jest.fn(() => ({
        data: null,
        error: null,
        isLoading: false,
        resetData: jest.fn(),
        subscribe: jest.fn(),
        unsubscribeAll: jest.fn(),
    })),
}));

describe('TransactionStatus component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render default component correctly', async () => {
        render(<TransactionStatus />);

        expect(screen.getByText('Transaction status')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_wallets_loader')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Refresh' })).not.toBeInTheDocument();
    });

    it('should render success state correctly when wallet data exists', async () => {
        (useActiveWalletAccount as jest.Mock).mockImplementation(() => ({
            data: [],
            error: null,
            isLoading: false,
            refetch: jest.fn(),
        }));
        render(<TransactionStatus />);

        expect(screen.getByText('Transaction status')).toBeInTheDocument();
        expect(screen.getByText('No recent transactions.')).toBeInTheDocument();
    });

    it('should render loading state correctly for useActiveWalletAccount', async () => {
        (useActiveWalletAccount as jest.Mock).mockImplementation(() => ({
            data: null,
            error: null,
            isLoading: true,
            refetch: jest.fn(),
        }));

        render(<TransactionStatus />);
        expect(screen.getByText('Transaction status')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
    });

    it('should render loading state correctly for useCryptoTransactions', async () => {
        (useCryptoTransactions as jest.Mock).mockImplementation(() => ({
            data: [],
            error: null,
            isLoading: true,
            resetData: jest.fn(),
            subscribe: jest.fn(),
            unsubscribeAll: jest.fn(),
        }));

        render(<TransactionStatus />);
        expect(screen.getByText('Transaction status')).toBeInTheDocument();
        expect(screen.getByTestId('dt_wallets_loader')).toBeInTheDocument();
    });

    it('should render error state correctly for useActiveWalletAccount', async () => {
        const mockError = new Error('Test error');

        (useActiveWalletAccount as jest.Mock).mockImplementation(() => ({
            data: null,
            error: mockError,
            isLoading: false,
            refetch: jest.fn(),
        }));

        render(<TransactionStatus />);
        expect(screen.getByText('Transaction status')).toBeInTheDocument();
        expect(screen.getByText('Unfortunately, we cannot retrieve the information at this time.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
    });

    it('should render error state correctly for useCryptoTransactions', async () => {
        const mockError = new Error('Test error');

        (useCryptoTransactions as jest.Mock).mockImplementation(() => ({
            data: [],
            error: mockError,
            isLoading: false,
            resetData: jest.fn(),
            subscribe: jest.fn(),
            unsubscribeAll: jest.fn(),
        }));

        render(<TransactionStatus />);
        expect(screen.getByText('Transaction status')).toBeInTheDocument();
        expect(screen.getByText('Unfortunately, we cannot retrieve the information at this time.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
    });

    it('should trigger resfresh events on click of the refresh button in error state', async () => {
        const mockError = new Error('Test error');
        const mockRefetch = jest.fn();
        const mockResetData = jest.fn();
        const mockSubscribe = jest.fn();
        const mockUnsubscribeAll = jest.fn();

        (useActiveWalletAccount as jest.Mock).mockImplementation(() => ({
            data: null,
            error: mockError,
            isLoading: false,
            refetch: mockRefetch,
        }));

        (useCryptoTransactions as jest.Mock).mockImplementation(() => ({
            data: [],
            error: mockError,
            isLoading: false,
            resetData: mockResetData,
            subscribe: mockSubscribe,
            unsubscribeAll: mockUnsubscribeAll,
        }));

        render(<TransactionStatus />);
        expect(screen.getByText('Transaction status')).toBeInTheDocument();
        expect(screen.getByText('Unfortunately, we cannot retrieve the information at this time.')).toBeInTheDocument();

        const refreshButton = screen.getByRole('button', { name: 'Refresh' });
        expect(refreshButton).toBeInTheDocument();
        fireEvent.click(refreshButton);
        expect(mockRefetch).toHaveBeenCalled();
        expect(mockResetData).toHaveBeenCalled();
        expect(mockSubscribe).toHaveBeenCalled();
        expect(mockUnsubscribeAll).toHaveBeenCalled();
    });
});
