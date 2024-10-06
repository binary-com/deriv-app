import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TakeProfitHistory from '../take-profit-history';
import { formatDate, formatMoney, formatTime, TContractStore } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    formatDate: jest.fn(),
    formatTime: jest.fn(),
    formatMoney: jest.fn(),
}));

describe('TakeProfitHistory component', () => {
    const mockHistory: TContractStore['contract_update_history'] = [
        { order_date: 1672531200, display_name: 'Test Item 1', order_amount: '100', order_type: 'take_profit' }, // 2023-01-01
        { order_date: 1672617600, display_name: 'Test Item 2', order_amount: '200', order_type: 'take_profit' }, // 2023-01-02
        { order_date: 1672704000, display_name: 'Test Item 3', order_amount: '300', order_type: 'take_profit' }, // 2023-01-03
        { order_date: 1672790400, display_name: 'Test Item 4', order_amount: '400', order_type: 'stop_loss' }, // 2023-01-04
        { order_date: 1672876800, display_name: 'Test Item 5', order_amount: '500', order_type: 'take_profit' }, // 2023-01-05
    ];

    beforeEach(() => {
        (formatDate as jest.Mock).mockImplementation(date => new Date(date * 1000).toDateString());
        (formatTime as jest.Mock).mockImplementation(time => new Date(time * 1000).toLocaleTimeString());
        (formatMoney as jest.Mock).mockImplementation((currency, amount) => `${amount}`);
    });

    it('renders without crashing', () => {
        const { container } = render(<TakeProfitHistory />);
        expect(container).not.toBeEmptyDOMElement();
    });

    it('renders correct History title for both TP and Sl', () => {
        render(<TakeProfitHistory history={mockHistory.slice(0, 4)} />);
        expect(screen.getByText('TP & SL history')).toBeInTheDocument();
    });

    it('renders correct History title for TP', () => {
        render(<TakeProfitHistory history={mockHistory.slice(0, 3)} />);
        expect(screen.getByText('TP history')).toBeInTheDocument();
    });

    it('renders correct History title for SL', () => {
        render(<TakeProfitHistory history={[mockHistory[3]]} />);
        expect(screen.getByText('SL history')).toBeInTheDocument();
    });

    it('renders the correct number of history items', () => {
        render(<TakeProfitHistory history={mockHistory.slice(0, 4)} currency='USD' />);
        expect(screen.getAllByText(/Test Item/)).toHaveLength(4);
    });

    it('renders pagination when history items exceed items per page', () => {
        render(<TakeProfitHistory history={mockHistory} currency='USD' />);
        expect(screen.getByRole('button', { name: /2/ })).toBeInTheDocument();
    });

    it('changes page when pagination is clicked', () => {
        render(<TakeProfitHistory history={mockHistory} currency='USD' />);
        fireEvent.click(screen.getByRole('button', { name: /2/ }));
        expect(screen.getByText('Test Item 5')).toBeInTheDocument();
    });

    it('formats date and time correctly', () => {
        render(<TakeProfitHistory history={mockHistory.slice(0, 1)} currency='USD' />);
        expect(formatDate).toHaveBeenCalledWith(1672531200, 'DD MMM YYYY');
        expect(formatTime).toHaveBeenCalledWith(1672531200);
    });

    it('formats money correctly', () => {
        render(<TakeProfitHistory history={mockHistory.slice(0, 1)} currency='USD' />);
        expect(formatMoney).toHaveBeenCalledWith('USD', '100', true);
        expect(screen.getByText('100 USD')).toBeInTheDocument();
    });
});
