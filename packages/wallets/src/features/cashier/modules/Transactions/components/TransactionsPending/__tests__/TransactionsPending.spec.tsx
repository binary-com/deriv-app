import React from 'react';
import { useCryptoTransactions } from '@deriv/api-v2';
import { act, render, screen } from '@testing-library/react';
import TransactionsPending from '../TransactionsPending';

jest.mock('@deriv/api-v2', () => ({
    useCryptoTransactions: jest.fn(() => ({
        data: [
            {
                submit_date: 1644288000,
            },
        ],
        isLoading: false,
        isSubscribed: true,
        resetData: jest.fn(),
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    Loader: jest.fn(() => <div>Loading...</div>),
}));

jest.mock('../../TransactionsNoDataState', () => ({
    TransactionsNoDataState: jest.fn(() => <div>No Data</div>),
}));

jest.mock('../../TransactionsPendingRow', () => ({
    TransactionsPendingRow: jest.fn(() => <div>Transactions Pending Row</div>),
}));

describe('TransactionsPending', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component with containing data', async () => {
        await act(async () => {
            render(<TransactionsPending />);
        });

        expect(screen.getByText('08 Feb 2022')).toBeInTheDocument();
        expect(screen.getByText('Transactions Pending Row')).toBeInTheDocument();
    });

    it('should render loader while data is loading', async () => {
        (useCryptoTransactions as jest.Mock).mockImplementation(() => ({
            data: null,
            isLoading: true,
            isSubscribed: false,
            resetData: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        }));

        await act(async () => {
            render(<TransactionsPending />);
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render no data state when there are no transactions', async () => {
        (useCryptoTransactions as jest.Mock).mockImplementation(() => ({
            data: null,
            isLoading: false,
            isSubscribed: true,
            resetData: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        }));

        await act(async () => {
            render(<TransactionsPending />);
        });

        expect(screen.getByText('No Data')).toBeInTheDocument();
    });
});
