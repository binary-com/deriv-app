import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import ReportsProviders from '../../reports-providers';
import IndicativeCell from '../indicative-cell';

const customStore = mockStore({
    portfolio: {
        onClickSell: jest.fn(),
    },
});

const mockProps = {
    amount: 100.01,
    contract_info: { id: '123' },
    currency: 'USD',
    is_footer: false,
    is_sell_requested: false,
    profit: '5.23',
};

describe('IndicativeCell component', () => {
    it('should render the amount and arrow indicator', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} />
            </ReportsProviders>
        );

        const amountElement = screen.getByText(Math.abs(mockProps.amount).toString());
        const arrow = screen.getByTestId('dt_arrow_indicator');

        expect(amountElement).toBeInTheDocument();
        expect(arrow).toBeInTheDocument();
    });

    it('should render the profit amount with a profit class', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} />
            </ReportsProviders>
        );

        const amountContainer = screen.getByTestId('dt_amount_container');

        expect(amountContainer).toHaveClass('dc-contract-card--profit');
    });

    it('should render the loss amount with a loss class', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} profit='-2.35' />
            </ReportsProviders>
        );

        const amountContainer = screen.getByTestId('dt_amount_container');

        expect(amountContainer).toHaveClass('dc-contract-card--loss');
    });

    it('should not render the ContractCard.Sell component for footer cells', () => {
        render(
            <ReportsProviders store={customStore}>
                <IndicativeCell {...mockProps} is_footer={true} />
            </ReportsProviders>
        );

        const sellButton = screen.queryByTestId('dt_contract_card_sell');

        expect(sellButton).not.toBeInTheDocument();
    });
});
