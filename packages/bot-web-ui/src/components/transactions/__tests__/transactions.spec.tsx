import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { transaction_elements } from 'Constants/transactions';
import { mock_ws } from 'Utils/mock';
import { mock_contract } from 'Utils/mock/contract';
import RootStore from 'Stores/root-store';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import Transactions from '../transactions';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

jest.mock('Utils/session-storage', () => ({
    ...jest.requireActual('Utils/session-storage'),
    getStoredItemsByUser: jest.fn(() => [
        {
            type: 'contract',
            data: {
                ...mock_contract,
            },
        },
        {
            type: 'divider',
        },
    ]),
}));

Object.defineProperties(window.HTMLElement.prototype, {
    offsetHeight: {
        get() {
            return 100;
        },
    },
    offsetWidth: {
        get() {
            return 100;
        },
    },
});

describe('Transactions', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeEach(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the Transaction component', () => {
        const { container } = render(<Transactions is_drawer_open />, { wrapper });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('There are no transactions to display')).toBeInTheDocument();
        expect(screen.getByText('The bot is not running')).toBeInTheDocument();
    });

    it('should render the Transaction component while bot is starting', () => {
        mock_DBot_store?.run_panel?.setContractStage(1);

        render(<Transactions is_drawer_open />, { wrapper });
        expect(screen.getByText('Entry/Exit spot')).toBeInTheDocument();
    });

    it('should render toggle transaction details modal on view details click', () => {
        mock_DBot_store?.transactions?.transactions.push({
            type: 'contract',
            data: {
                ...mock_contract,
            },
        });

        render(<Transactions is_drawer_open />, { wrapper });

        const detail = screen.getByRole('button', { name: /View Detail/i });
        userEvent.click(detail);

        expect(mock_DBot_store?.transactions?.toggleTransactionDetailsModal).toBeTruthy();
    });

    it('should render transactions with contract rows', () => {
        mock_store.client.is_logged_in = true;
        mock_store.client.loginid = 'cr1';
        if (mock_DBot_store)
            mock_DBot_store.transactions.elements = {
                cr1: [
                    {
                        type: transaction_elements.CONTRACT,
                        data: {
                            contract_id: 22,
                            ...mock_contract,
                        },
                    },
                    {
                        type: transaction_elements.DIVIDER,
                    },
                ],
            };

        render(<Transactions is_drawer_open />, { wrapper });
        expect(screen.getByText('1.2345')).toBeInTheDocument();
    });

    it('should render transactions component with transaction element type null', () => {
        if (mock_DBot_store)
            mock_DBot_store.transactions.elements = {
                cr1: [
                    {
                        type: transaction_elements.CONTRACT,
                        data: {
                            contract_id: 22,
                            ...mock_contract,
                        },
                    },
                ],
            };

        render(<Transactions is_drawer_open />, { wrapper });
        expect(screen.getByText('Buy price and P/L')).toBeInTheDocument();
    });

    it('should render transactions component on mobile', () => {
        mock_store.ui.is_desktop = false;
        render(<Transactions is_drawer_open />, { wrapper });

        expect(screen.getByText('There are no transactions to display')).toBeInTheDocument();
    });
});
