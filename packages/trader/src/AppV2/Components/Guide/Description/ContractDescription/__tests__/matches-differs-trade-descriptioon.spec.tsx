import React from 'react';
import { render, screen } from '@testing-library/react';
import MatchesDiffersTradeDescription from '../matches-differs-trade-description';

describe('MatchesDiffersTradeDescription', () => {
    it('should render a proper content', () => {
        render(<MatchesDiffersTradeDescription />);

        expect(
            screen.getByText(
                /you will win the payout if the last digit of the last tick is not the same as your prediction/i
            )
        ).toBeInTheDocument();
    });
});
