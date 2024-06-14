import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import { ModalProvider } from '../../../../../../components/ModalProvider';
import AddedCTraderAccountsList from '../AddedCTraderAccountsList';

jest.mock('../../../../../../hooks/useDevice', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isDesktop: true,
        isTablet: false,
        isMobile: false,
    })),
}));

jest.mock('@deriv/api-v2', () => ({
    useCtraderAccountsList: jest.fn(),
}));

jest.mock('../../../../modals', () => ({
    MT5TradeModal: () => <div>Mocked MT5 Trade Modal</div>,
}));

describe('AddedCTraderAccountsList', () => {
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
        (useCtraderAccountsList as jest.Mock).mockReturnValue({
            data: mockAccounts,
        });
    });

    afterEach(() => {
        document.body.removeChild($modalContainer);
    });

    it('renders TradingAccountCard with cTraderAccounts', () => {
        render(
            <Router history={history}>
                <ModalProvider>
                    <AddedCTraderAccountsList />
                </ModalProvider>
            </Router>
        );

        mockAccounts.forEach(account => {
            expect(screen.getByText(account.login)).toBeInTheDocument();
            expect(screen.getByText(account.display_balance)).toBeInTheDocument();
        });
    });

    it('should show modal on click of cTrader account', () => {
        render(
            <Router history={history}>
                <ModalProvider>
                    <AddedCTraderAccountsList />
                </ModalProvider>
            </Router>
        );

        fireEvent.click(screen.getAllByTestId('dt_wallets_trading_account_card')[0]);
        expect(screen.getByText('Mocked MT5 Trade Modal')).toBeInTheDocument();
    });
});
