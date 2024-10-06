import React from 'react';
import { render, screen } from '@testing-library/react';
import { getCardLabels, toMoment } from '@deriv/shared';
import { ContractCardStatusTimer } from '../contract-card-status-timer';

const mockedNow = Math.floor(Date.now() / 1000);

describe('ContractCardStatusTimer', () => {
    const mockProps = { date_expiry: mockedNow + 1000 };
    it('should render Closed status if date_expiry is not passed', () => {
        render(<ContractCardStatusTimer />);

        expect(screen.getByText(getCardLabels().CLOSED)).toBeInTheDocument();
    });
    it('should not render the component if date_expiry is passed without serverTime and no other props are passed', () => {
        const { container } = render(<ContractCardStatusTimer {...mockProps} />);

        expect(container).toBeEmptyDOMElement();
    });
    it('should render remaining time if date_expiry and serverTime are passed', () => {
        render(<ContractCardStatusTimer {...mockProps} serverTime={toMoment(mockedNow)} />);

        expect(screen.getByText('00:16:40')).toBeInTheDocument();
    });
    it('should render ticks progress if currentTick and tick_count are passed', () => {
        render(<ContractCardStatusTimer {...mockProps} currentTick={2} tick_count={10} />);

        expect(screen.getByText('2/10 ticks')).toBeInTheDocument();
    });
    it('should render Closed status if isSold === true', () => {
        render(<ContractCardStatusTimer {...mockProps} isSold />);

        expect(screen.getByText(getCardLabels().CLOSED)).toBeInTheDocument();
    });
});
