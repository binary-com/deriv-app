import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyTradeHistoryMessage from '../empty-trade-history-message';

const mockProps = {
    component_icon: 'calendar',
    has_selected_date: false,
    localized_message: 'No trades in your history yet.',
    localized_period_message: 'No trades for the selected period.',
};

describe('EmptyTradeHistoryMessage component', () => {
    it('should render the message without a selected date', () => {
        render(<EmptyTradeHistoryMessage {...mockProps} />);

        const icon = screen.getByTestId('dt_empty_trade_history_icon');
        const text = screen.getByText(mockProps.localized_message);

        expect(icon).toBeInTheDocument();
        expect(text).toBeInTheDocument();
    });

    it('should render the message for a selected date', () => {
        render(<EmptyTradeHistoryMessage {...mockProps} has_selected_date={true} />);

        const text = screen.getByText(mockProps.localized_period_message);

        expect(text).toBeInTheDocument();
    });
});
