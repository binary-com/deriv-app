import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import { mock_contract } from 'Utils/mock/contract';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TransactionDetailsMobile from '../transaction-details-mobile';

jest.mock('../../../utils/session-storage', () => ({
    ...jest.requireActual('../../../utils/session-storage'),
    getStoredItemsByUser: jest.fn(() => ({
        '001': [
            {
                type: 'contract',
                data: {
                    ...mock_contract,
                    transaction_ids: {
                        buy: 421306672718,
                        sell: 421306674448,
                    },
                },
            },
            {
                type: 'divider',
            },
        ],
    })),
}));

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

const mock_ws = {
    authorized: {
        subscribeProposalOpenContract: jest.fn(),
        send: jest.fn(),
    },
    storage: {
        send: jest.fn(),
    },
    contractUpdate: jest.fn(),
    subscribeTicksHistory: jest.fn(),
    forgetStream: jest.fn(),
    activeSymbols: jest.fn(),
    send: jest.fn(),
};
jest.mock('@deriv/deriv-charts', () => ({
    setSmartChartsPublicPath: jest.fn(),
}));

describe('TransactionDetailsMobile', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeAll(() => {
        const mock_store = mockStore({
            client: { loginid: '001' },
        });
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });
    it('should render TransactionDetailsMobile', () => {
        const { container } = render(<TransactionDetailsMobile />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
    });

    it('should open TransactionDetailsMobile modal', () => {
        mock_DBot_store?.transactions.toggleTransactionDetailsModal(true);
        render(<TransactionDetailsMobile />, {
            wrapper,
        });
        expect(screen.getByTestId('transaction_details_cards')).toBeInTheDocument();
    });

    it('should close TransactionDetailsMobile modal', () => {
        mock_DBot_store?.transactions.toggleTransactionDetailsModal(true);
        render(<TransactionDetailsMobile />, {
            wrapper,
        });
        const close_btn = screen.getByTestId('dt_page_overlay_header_close');
        fireEvent.click(close_btn);
        expect(mock_DBot_store?.transactions.is_transaction_details_modal_open).toBeFalsy();
    });

    it('should render TransactionDetailsMobile with loader', () => {
        mock_store.client.is_logged_in = true;
        mock_store.client.loginid = 'cr1';
        if (mock_DBot_store) {
            mock_DBot_store.transactions.toggleTransactionDetailsModal(true);
            mock_DBot_store.transactions.onBotContractEvent({
                ...mock_contract,
                is_completed: false,
                exit_tick: undefined,
                entry_tick_time: undefined,
                exit_tick_time: undefined,
            });
        }
        render(<TransactionDetailsMobile />, {
            wrapper,
        });
        const loaderElements = screen.getAllByTestId('transaction_details_card_cell_loader');
        expect(loaderElements.length).toBeGreaterThan(0);
    });
});
