import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, useHistory, useLocation } from 'react-router-dom';
import DTraderContractDetailsHeader from '../dtrader-v2-contract-detail-header';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv-com/quill-ui', () => ({
    Text: () => <div>Contract Details</div>,
    IconButton: ({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) => (
        <button onClick={onClick}>{icon}</button>
    ),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn().mockReturnValue({ pathname: '' }),
    useHistory: jest.fn().mockReturnValue({
        goBack: jest.fn(),
    }),
}));

describe('DTraderV2Header', () => {
    const mock_store = mockStore({
        contract_replay: {
            onClickCancel: jest.fn(),
            onClickSell: jest.fn(),
            is_sell_requested: false,
        },
        common: {
            routeBackInApp: jest.fn(),
        },
    });
    test('renders the header with localized text and an icon', () => {
        render(
            <StoreProvider store={mock_store}>
                <BrowserRouter>
                    <DTraderContractDetailsHeader />
                </BrowserRouter>
            </StoreProvider>
        );

        expect(screen.getByText('Contract Details')).toBeInTheDocument();
        const icon = screen.getByTestId('arrow');
        expect(icon).toBeInTheDocument();
    });

    test('clicking the back arrow calls routeBackInApp from DTrader page', () => {
        render(
            <StoreProvider store={mock_store}>
                <BrowserRouter>
                    <DTraderContractDetailsHeader />
                </BrowserRouter>
            </StoreProvider>
        );

        userEvent.click(screen.getByTestId('arrow'));

        expect(mock_store.common.routeBackInApp).toHaveBeenCalled();
    });

    test('clicking the back arrow calls history go back from Reports page', () => {
        const historyMock = {
            goBack: jest.fn(),
        };
        (useLocation as jest.Mock).mockReturnValue({
            pathname: '',
            state: { from_table_row: true },
        });
        (useHistory as jest.Mock).mockReturnValue(historyMock);
        render(
            <StoreProvider store={mock_store}>
                <BrowserRouter>
                    <DTraderContractDetailsHeader />
                </BrowserRouter>
            </StoreProvider>
        );

        userEvent.click(screen.getByTestId('arrow'));

        expect(historyMock.goBack).toHaveBeenCalled();
    });
});
