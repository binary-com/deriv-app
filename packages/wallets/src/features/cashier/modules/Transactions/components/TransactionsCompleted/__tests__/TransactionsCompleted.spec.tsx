import React from 'react';
import { useActiveWalletAccount, useAllAccountsList, useInfiniteTransactions } from '@deriv/api-v2';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { CashierScrollContext } from '../../../../../context/CashierScrollContext';
import TransactionsCompleted from '../TransactionsCompleted';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
    useAllAccountsList: jest.fn(),
    useInfiniteTransactions: jest.fn(() => ({
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

let reference: ((arg0: unknown) => void) | null = null;

const setOnCashierScroll = jest.fn(fn => {
    reference = fn?.();
});

const onCashierScroll = (el: unknown) => {
    if (reference) {
        reference(el);
    }
};

describe('TransactionsCompleted', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state when data is loading', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: null, isLoading: true });
        (useAllAccountsList as jest.Mock).mockReturnValue({ data: null, isLoading: true });
        (useInfiniteTransactions as jest.Mock).mockReturnValue({ data: null, isLoading: true, setFilter: jest.fn() });

        await act(async () => {
            render(
                <CashierScrollContext.Provider value={{ onCashierScroll, setOnCashierScroll }}>
                    <TransactionsCompleted />
                </CashierScrollContext.Provider>
            );
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render loading state when transactions are loading', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: {}, isLoading: false });
        (useAllAccountsList as jest.Mock).mockReturnValue({ data: [], isLoading: false });
        (useInfiniteTransactions as jest.Mock).mockReturnValue({ data: null, isLoading: true, setFilter: jest.fn() });

        await act(async () => {
            render(
                <CashierScrollContext.Provider value={{ onCashierScroll, setOnCashierScroll }}>
                    <TransactionsCompleted />
                </CashierScrollContext.Provider>
            );
        });

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render no data state when there are no transactions', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: {}, isLoading: false });
        (useAllAccountsList as jest.Mock).mockReturnValue({ data: [], isLoading: false });
        (useInfiniteTransactions as jest.Mock).mockReturnValue({ data: null, isLoading: false, setFilter: jest.fn() });

        await act(async () => {
            render(
                <CashierScrollContext.Provider value={{ onCashierScroll, setOnCashierScroll }}>
                    <TransactionsCompleted />
                </CashierScrollContext.Provider>
            );
        });

        expect(screen.getByText('No Data')).toBeInTheDocument();
    });

    it('should render transactions and group them by date', async () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: {}, isLoading: false });
        (useAllAccountsList as jest.Mock).mockReturnValue({ data: [], isLoading: false });
        (useInfiniteTransactions as jest.Mock).mockReturnValue({
            data: [
                { transaction_time: 1643798400 }, // Date: 02 Feb 2022
                { transaction_time: 1643712000 }, // Date: 01 Feb 2022
            ],
            isLoading: false,
            setFilter: jest.fn(),
        });

        await act(async () => {
            render(
                <CashierScrollContext.Provider value={{ onCashierScroll, setOnCashierScroll }}>
                    <TransactionsCompleted />
                </CashierScrollContext.Provider>
            );
        });

        expect(screen.getByText('01 Feb 2022')).toBeInTheDocument();
        expect(screen.getByText('02 Feb 2022')).toBeInTheDocument();
        expect(screen.getAllByText('Transaction Row')).toHaveLength(2);
    });

    it('should fetch more transactions when bottom is reached', async () => {
        const mockFetchNextPage = jest.fn();

        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: {}, isLoading: false });
        (useAllAccountsList as jest.Mock).mockReturnValue({ data: [], isLoading: false });
        (useInfiniteTransactions as jest.Mock).mockReturnValue({
            data: [{ transaction_time: 1643798400 }],
            fetchNextPage: mockFetchNextPage,
            isFetching: false,
            isLoading: false,
            setFilter: jest.fn(),
        });

        await act(async () => {
            render(
                <CashierScrollContext.Provider value={{ onCashierScroll, setOnCashierScroll }}>
                    <div
                        data-testid='dt_transactions_completed'
                        onScroll={onCashierScroll}
                        style={{
                            height: '300px',
                            width: '1920px',
                        }}
                    >
                        <TransactionsCompleted />
                    </div>
                </CashierScrollContext.Provider>
            );
        });

        const el = screen.getByTestId('dt_transactions_completed');

        act(() => {
            fireEvent.scroll(el, { target: { scrollY: 100 } });
        });

        expect(mockFetchNextPage).toBeCalled();
    });

    it('should not fetch more transactions when data is still fetching', async () => {
        const mockFetchNextPage = jest.fn();

        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: {}, isLoading: false });
        (useAllAccountsList as jest.Mock).mockReturnValue({ data: [], isLoading: false });
        (useInfiniteTransactions as jest.Mock).mockReturnValue({
            data: [{ transaction_time: 1643798400 }],
            fetchNextPage: mockFetchNextPage,
            isFetching: true,
            isLoading: false,
            setFilter: jest.fn(),
        });

        await act(async () => {
            render(
                <CashierScrollContext.Provider value={{ onCashierScroll, setOnCashierScroll }}>
                    <div
                        data-testid='dt_transactions_completed'
                        onScroll={onCashierScroll}
                        style={{
                            height: '300px',
                            width: '1920px',
                        }}
                    >
                        <TransactionsCompleted />
                    </div>
                </CashierScrollContext.Provider>
            );
        });

        const el = screen.getByTestId('dt_transactions_completed');

        act(() => {
            fireEvent.scroll(el, { target: { scrollY: 100 } });
        });

        expect(mockFetchNextPage).not.toBeCalled();
    });
});
