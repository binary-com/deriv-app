import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import WalletModalBody from '../wallet-modal-body';
import { mockStore, StoreProvider } from '@deriv/stores';

jest.mock('Components/wallet-transfer', () => jest.fn(() => <div>WalletTransfer</div>));
jest.mock('Components/fiat-transaction-list', () => jest.fn(() => <div>Transactions</div>));

describe('WalletModalBody', () => {
    let mocked_props: React.ComponentProps<typeof WalletModalBody>;

    beforeEach(() => {
        mocked_props = {
            contentScrollHandler: jest.fn(),
            is_dark: false,
            is_demo: true,
            is_mobile: false,
            setIsWalletNameVisible: jest.fn(),
            is_wallet_name_visible: true,
            wallet_type: 'demo',
        };
    });

    const renderWithRouter = (component: JSX.Element) => {
        render(<BrowserRouter>{component}</BrowserRouter>);
    };

    it('Should render proper tabs for demo wallet', () => {
        const mocked_store = mockStore({
            traders_hub: {
                active_modal_tab: 'Transfer',
            },
        });
        renderWithRouter(
            <StoreProvider store={mocked_store}>
                <WalletModalBody {...mocked_props} />
            </StoreProvider>
        );

        expect(screen.getByText('Transfer')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
        expect(screen.getByText('Reset balance')).toBeInTheDocument();
    });

    it('Should render proper content under the Transfer tab', () => {
        mocked_props.wallet_type = 'real';
        const mocked_store = mockStore({
            traders_hub: {
                active_modal_tab: 'Withdraw',
            },
        });
        renderWithRouter(
            <StoreProvider store={mocked_store}>
                <WalletModalBody {...mocked_props} />
            </StoreProvider>
        );

        const el_transfer_tab = screen.getByText('Transfer');
        userEvent.click(el_transfer_tab);

        expect(screen.getByText('Transfer')).toBeInTheDocument();
    });

    it('Should trigger setWalletModalActiveTab callback when the user clicked on the tab', () => {
        const mocked_store = mockStore({
            traders_hub: {
                active_modal_tab: 'Deposit',
            },
        });
        renderWithRouter(
            <StoreProvider store={mocked_store}>
                <WalletModalBody {...mocked_props} />
            </StoreProvider>
        );

        const el_transactions_tab = screen.getByText('Transactions');
        userEvent.click(el_transactions_tab);

        expect(mocked_store.traders_hub.setWalletModalActiveTab).toHaveBeenCalledTimes(1);
    });

    it('Should trigger contentScrollHandler callback when the user scrolls the content', () => {
        const mocked_store = mockStore({
            traders_hub: {
                active_modal_tab: 'Deposit',
            },
        });
        renderWithRouter(
            <StoreProvider store={mocked_store}>
                <WalletModalBody {...mocked_props} />
            </StoreProvider>
        );

        const el_themed_scrollbars = screen.getByTestId('dt_themed_scrollbars');
        fireEvent.scroll(el_themed_scrollbars);

        expect(mocked_props.contentScrollHandler).toHaveBeenCalledTimes(1);
    });
});
