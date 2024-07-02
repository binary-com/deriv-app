import React from 'react';
import { render, screen } from '@testing-library/react';
import RiseFallTradeDescription from '../rise-fall-trade-description';

describe('RiseFallTradeDescription', () => {
    it('should render a proper content', () => {
        render(<RiseFallTradeDescription />);

        expect(screen.getByText(/you win the payout if exit spot is higher than/i)).toBeInTheDocument();
    });
});
