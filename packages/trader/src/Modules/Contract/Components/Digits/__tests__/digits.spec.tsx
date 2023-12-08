import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isDesktop, isMobile, mockContractInfo, TRADE_TYPES } from '@deriv/shared';
import Digits from '../digits';

const tick_information_text = /Tick/i;
const mocked_digit_spot = 'DigitSpot';
const mocked_last_digit_prediction = 'LastDigitPrediction';

jest.mock('App/Components/Animations', () => ({
    ...jest.requireActual('App/Components/Animations'),
    Bounce: jest.fn(({ children }) => <div>{children}</div>),
    SlideIn: jest.fn(({ children, is_visible }) => (is_visible ? <div>{children}</div> : null)),
}));
jest.mock('../../LastDigitPrediction', () => ({
    ...jest.requireActual('../../LastDigitPrediction'),
    DigitSpot: jest.fn(() => <div>{mocked_digit_spot}</div>),
    LastDigitPrediction: jest.fn(() => <div>{mocked_last_digit_prediction}</div>),
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    useIsMounted: jest.fn(() => () => true),
}));

describe('<Digits />', () => {
    let mocked_props: React.ComponentProps<typeof Digits>;
    beforeEach(() => {
        mocked_props = {
            contract_info: mockContractInfo(),
            digits_array: [90, 107, 105, 94, 100, 96, 96, 101, 105, 97],
            digits_info: {},
            display_status: undefined,
            is_digit_contract: undefined,
            is_ended: undefined,
            is_trade_page: true,
            onDigitChange: jest.fn(),
            selected_digit: 0,
            tick: {
                ask: 2098.19,
                bid: 2097.59,
                epoch: 1702018845,
                id: '3f5bbd16-2a03-1eb7-c872-1aac45ef25ff',
                pip_size: 2,
                quote: 2097.89,
                symbol: '1HZ100V',
            },
            trade_type: TRADE_TYPES.MATCH_DIFF,
            underlying: '1HZ100V',
        };
    });

    it('should render <LastDigitPrediction /> with tooltip with text for desktop if is_trade_page === true', () => {
        render(<Digits {...mocked_props} />);

        expect(screen.getByText(mocked_last_digit_prediction)).toBeInTheDocument();

        const popover = screen.getByTestId('dt_popover_wrapper');
        expect(popover).toBeInTheDocument();

        userEvent.hover(popover);
        expect(
            screen.getByText('Last digit stats for latest 1000 ticks for Volatility 100 (1s) Index')
        ).toBeInTheDocument();
    });
    it('should render <LastDigitPrediction /> without tooltip for desktop if is_trade_page === false', () => {
        mocked_props.is_trade_page = false;
        render(<Digits {...mocked_props} />);

        expect(screen.getByText(mocked_last_digit_prediction)).toBeInTheDocument();
        expect(screen.queryByTestId('dt_popover_wrapper')).not.toBeInTheDocument();
    });
    it('should not render anything for desktop if digits_array and is_digit_contract are falsy', () => {
        mocked_props.digits_array = undefined;
        render(<Digits {...mocked_props} />);

        expect(screen.queryByText(mocked_last_digit_prediction)).not.toBeInTheDocument();
        expect(screen.queryByTestId('dt_popover_wrapper')).not.toBeInTheDocument();
    });
    it('should render tick information text, <DigitSpot/> and <LastDigitPrediction /> for mobile if is_trade_page === true', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(<Digits {...mocked_props} />);

        expect(screen.getByText(tick_information_text)).toBeInTheDocument();
        expect(screen.getByText(mocked_digit_spot)).toBeInTheDocument();
        expect(screen.getByText(mocked_last_digit_prediction)).toBeInTheDocument();
    });
});
