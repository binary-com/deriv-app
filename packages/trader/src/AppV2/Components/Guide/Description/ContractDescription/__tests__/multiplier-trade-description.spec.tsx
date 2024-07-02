import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TERM } from 'AppV2/Utils/trade-types-utils';
import MultipliersTradeDescription from '../multipliers-trade-description';

describe('MultipliersTradeDescription', () => {
    it('should render a proper content', () => {
        render(<MultipliersTradeDescription onTermClick={jest.fn()} />);

        expect(
            screen.getByText(/your total profit\/loss will be the percentage increase in the underlying asset price/i)
        ).toBeInTheDocument();
    });

    it('should call onTermClick if user clicks on term "stop out level"', () => {
        const onTermClick = jest.fn();
        render(<MultipliersTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.STOP_OUT_LEVEL.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "Take profit"', () => {
        const onTermClick = jest.fn();
        render(<MultipliersTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.TAKE_PROFIT }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "Stop loss"', () => {
        const onTermClick = jest.fn();
        render(<MultipliersTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.STOP_LOSS }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "Deal cancellation"', () => {
        const onTermClick = jest.fn();
        render(<MultipliersTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.DEAL_CANCELLATION }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "slippage risk"', () => {
        const onTermClick = jest.fn();
        render(<MultipliersTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.SLIPPAGE_RISK.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });
});
