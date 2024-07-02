import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useDxtradeAccountsList } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../../../../../components/ModalProvider';
import AddedDxtradeAccountsList from '../AddedDxtradeAccountsList';

jest.mock('@deriv/api-v2', () => ({
    useDxtradeAccountsList: jest.fn(),
}));

jest.mock('../../../../../modals/MT5TradeModal', () => ({
    MT5TradeModal: () => <div>Mocked MT5 Trade Modal</div>,
}));

describe('AddedDxtradeAccountsList', () => {
    let $modalContainer: HTMLDivElement;
    const history = createMemoryHistory();
    const mockAccounts = [
        { display_balance: '1000', login: '123' },
        { display_balance: '2000', login: '456' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        $modalContainer = document.createElement('div');
        $modalContainer.id = 'wallets_modal_root';
        document.body.appendChild($modalContainer);
        (useDxtradeAccountsList as jest.Mock).mockReturnValue({
            data: mockAccounts,
        });
    });

    afterEach(() => {
        document.body.removeChild($modalContainer);
    });

    it('renders TradingAccountCard with DxTrade accounts.', () => {
        render(
            <Router history={history}>
                <ModalProvider>
                    <AddedDxtradeAccountsList />
                </ModalProvider>
            </Router>
        );

        mockAccounts.forEach(account => {
            expect(screen.getByText(account.login)).toBeInTheDocument();
            expect(screen.getByText(account.display_balance)).toBeInTheDocument();
        });
    });

    it('shows MT5TradeModal component when clicking on AddedDxtradeAccountsList within the TradingAccountCard component.', () => {
        render(
            <Router history={history}>
                <ModalProvider>
                    <AddedDxtradeAccountsList />
                </ModalProvider>
            </Router>
        );

        fireEvent.click(screen.getAllByTestId('dt_wallets_trading_account_card')[0]);
        expect(screen.getByText('Mocked MT5 Trade Modal')).toBeInTheDocument();
    });
});
