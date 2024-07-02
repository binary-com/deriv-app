import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TERM } from 'AppV2/Utils/trade-types-utils';
import VanillasTradeDescription from '../vanillas-trade-description';

describe('VanillasTradeDescription', () => {
    it('should render a proper content', () => {
        render(<VanillasTradeDescription onTermClick={jest.fn()} />);

        expect(screen.getByText(/Vanilla options allow you to predict an upward/i)).toBeInTheDocument();
    });

    it('should call onTermClick if user clicks on term "payout"', () => {
        const onTermClick = jest.fn();
        render(<VanillasTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.PAYOUT.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "final price"', () => {
        const onTermClick = jest.fn();
        render(<VanillasTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.FINAL_PRICE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "strike price"', () => {
        const onTermClick = jest.fn();
        render(<VanillasTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.STRIKE_PRICE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "expiry"', () => {
        const onTermClick = jest.fn();
        render(<VanillasTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.EXPIRY.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "payout per point"', () => {
        const onTermClick = jest.fn();
        render(<VanillasTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.PAYOUT_PER_POINT.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });

    it('should call onTermClick if user clicks on term "contract value"', () => {
        const onTermClick = jest.fn();
        render(<VanillasTradeDescription onTermClick={onTermClick} />);

        userEvent.click(screen.getByRole('button', { name: TERM.CONTRACT_VALUE.toLowerCase() }));

        expect(onTermClick).toHaveBeenCalled();
    });
});
