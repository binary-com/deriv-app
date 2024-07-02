import React from 'react';
import { render, screen } from '@testing-library/react';
import OverUnderTradeDescription from '../over-under-trade-description';

describe('OverUnderTradeDescription', () => {
    it('should render a proper content', () => {
        render(<OverUnderTradeDescription />);

        expect(
            screen.getByText(
                /you will win the payout if the last digit of the last tick is greater than your prediction/i
            )
        ).toBeInTheDocument();
    });
});
