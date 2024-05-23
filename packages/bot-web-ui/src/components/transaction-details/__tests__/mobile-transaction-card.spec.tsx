import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileTransactionCards from '../mobile-transaction-card';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({
    saveRecentWorkspace: jest.fn(),
    unHighlightAllBlocks: jest.fn(),
}));

const mock_transaction_data = {
    barrier: '8641.67',
    buy_price: 11,
    contract_id: 211133945828,
    contract_type: 'CALL',
    currency: 'USD',
    date_start: '2023-6-21 06:10:20 GMT',
    display_name: 'Volatility 10 (1s) Index',
    entry_tick: '8641.67',
    entry_tick_time: '2023-6-21 06:10:21 GMT',
    exit_tick: '8641.36',
    exit_tick_time: '2023-6-21 06:10:22 GMT',
    is_completed: true,
    payout: 1.95,
    profit: -2,
    run_id: 'run-1687327817157',
    shortcode: 'CALL_1HZ10V_1.95_1687327820_1T_S0P_0',
    tick_count: 1,
    transaction_ids: {
        buy: 421306672788,
        sell: 421306674448,
    },
    underlying: '1HZ10V',
};

describe('MobileTransactionCards', () => {
    it('should render MobileTransactionCards', () => {
        render(<MobileTransactionCards transaction={mock_transaction_data} />);
        expect(screen.getByTestId('dt_mobile_transaction_card')).toBeInTheDocument();
    });

    it('should display transaction details', () => {
        render(<MobileTransactionCards transaction={mock_transaction_data} />);
        expect(screen.getByText('421306672788')).toBeInTheDocument();
        expect(screen.getByText('2023-06-21 06:10:20 GMT')).toBeInTheDocument();
        expect(screen.getByText('8641.67')).toBeInTheDocument();
        expect(screen.getByText('11.00')).toBeInTheDocument();
        expect(screen.getByText('2.00')).toBeInTheDocument();
    });
});
