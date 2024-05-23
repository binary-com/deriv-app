import React from 'react';
import { render, screen } from '@testing-library/react';
import TransactionsNoDataState from '../TransactionsNoDataState';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

describe('TransactionsNoDataState', () => {
    test('should render contents of component correctly', () => {
        render(<TransactionsNoDataState />);

        expect(screen.getByText('No transactions found')).toBeInTheDocument();
    });
});
