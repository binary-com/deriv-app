import React from 'react';
import { render, screen } from '@testing-library/react';
import HigherLowerTradeDescription from '../higher-lower-trade-description';

describe('HigherLowerTradeDescription', () => {
    it('should render a proper content', () => {
        render(<HigherLowerTradeDescription />);

        expect(
            screen.getByText(/you win the payout if the exit spot is strictly higher than the barrier/i)
        ).toBeInTheDocument();
    });
});
