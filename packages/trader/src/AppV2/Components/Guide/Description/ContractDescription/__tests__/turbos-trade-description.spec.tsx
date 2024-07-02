import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TERM } from 'AppV2/Utils/trade-types-utils';
import TurbosTradeDescription from '../turbos-trade-description';

describe('TurbosTradeDescription', () => {
    it('should render a proper content', () => {
        render(<TurbosTradeDescription onTermClick={jest.fn()} />);

        expect(screen.getByText(/You may sell the contract up to 15 seconds before expiry/i)).toBeInTheDocument();
    });

    it('should call onTermClick if user clicks on term "payout"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.PAYOUT.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "expiry"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.EXPIRY.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "barrier"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.BARRIER.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "payout per point"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.PAYOUT_PER_POINT.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "final price"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.FINAL_PRICE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "contract value"', () => {
        const onTermClick = jest.fn();
        render(<TurbosTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.CONTRACT_VALUE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });
});
