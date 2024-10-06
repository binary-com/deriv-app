import React, { ReactElement, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import {
    addUnit,
    focusAndOpenKeyboard,
    getTradeParams,
    getTradeTypeTabsList,
    getSnackBarText,
    isDigitContractWinning,
    isSmallScreen,
    getOptionPerUnit,
} from '../trade-params-utils';

describe('getTradeParams', () => {
    it('should return correct object with keys for Rise/Fall', () => {
        expect(getTradeParams()[TRADE_TYPES.RISE_FALL]).toEqual({
            duration: true,
            stake: true,
            allow_equals: true,
        });
    });

    it('should return correct object with keys for Multipliers if symbol does not start with "cry"', () => {
        expect(getTradeParams()[TRADE_TYPES.MULTIPLIER]).toEqual({
            multiplier: true,
            stake: true,
            risk_management: true,
        });
    });

    it('should return correct object with keys for Multipliers if symbol starts with "cry"', () => {
        expect(getTradeParams('crypto')[TRADE_TYPES.MULTIPLIER]).toEqual({
            multiplier: true,
            stake: true,
            risk_management: true,
            expiration: true,
        });
    });
});

describe('isDigitContractWinning', () => {
    it('should return false if contract_type is not defined', () => {
        expect(isDigitContractWinning(undefined, null, null)).toBeFalsy();
    });

    it('should return false if contract_type is not digit type', () => {
        expect(isDigitContractWinning(CONTRACT_TYPES.TURBOS.LONG, null, null)).toBeFalsy();
    });

    it('should return true for Matches if current_digit === selected_digit and false if they are not equal', () => {
        expect(isDigitContractWinning(CONTRACT_TYPES.MATCH_DIFF.MATCH, 1, 1)).toBeTruthy();
        expect(isDigitContractWinning(CONTRACT_TYPES.MATCH_DIFF.MATCH, 1, 2)).toBeFalsy();
    });

    it('should return true for Differs if current_digit !== selected_digit and false if they are equal', () => {
        expect(isDigitContractWinning(CONTRACT_TYPES.MATCH_DIFF.DIFF, 1, 1)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.MATCH_DIFF.DIFF, 1, 2)).toBeTruthy();
    });

    it('should return true for Over if current_digit and selected_digit are not null and current_digit > selected_digit. In the rest cases should return false', () => {
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.OVER, 1, 2)).toBeTruthy();
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.OVER, null, null)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.OVER, 0, 0)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.OVER, 2, 1)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.OVER, 2, 2)).toBeFalsy();
    });

    it('should return true for Under if current_digit and selected_digit are not null and current_digit < selected_digit. In the rest cases should return false', () => {
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.UNDER, 2, 1)).toBeTruthy();
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.UNDER, null, null)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.UNDER, 0, 0)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.UNDER, 1, 2)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.OVER_UNDER.UNDER, 2, 2)).toBeFalsy();
    });

    it('should return true for Odd if current_digit is not null and it has an odd value', () => {
        expect(isDigitContractWinning(CONTRACT_TYPES.EVEN_ODD.ODD, null, 1)).toBeTruthy();
        expect(isDigitContractWinning(CONTRACT_TYPES.EVEN_ODD.ODD, null, null)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.EVEN_ODD.ODD, null, 2)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.EVEN_ODD.ODD, null, 0)).toBeFalsy();
    });

    it('should return true for Even if current_digit is not null and it has an even value or 0', () => {
        expect(isDigitContractWinning(CONTRACT_TYPES.EVEN_ODD.EVEN, null, 2)).toBeTruthy();
        expect(isDigitContractWinning(CONTRACT_TYPES.EVEN_ODD.EVEN, null, 0)).toBeTruthy();
        expect(isDigitContractWinning(CONTRACT_TYPES.EVEN_ODD.EVEN, null, null)).toBeFalsy();
        expect(isDigitContractWinning(CONTRACT_TYPES.EVEN_ODD.EVEN, null, 1)).toBeFalsy();
    });
});

describe('focusAndOpenKeyboard', () => {
    it('should apply focus to the passed ReactElement', () => {
        jest.useFakeTimers();

        const MockComponent = () => {
            const input_ref = React.useRef<HTMLInputElement>(null);
            const focused_input_ref = React.useRef<HTMLInputElement>(null);

            return (
                <React.Fragment>
                    <input type='number' ref={input_ref} />
                    <button onClick={() => focusAndOpenKeyboard(focused_input_ref.current, input_ref.current)}>
                        Focus
                    </button>
                    <input ref={focused_input_ref} style={{ height: 0, opacity: 0, display: 'none' }} />
                </React.Fragment>
            );
        };

        render(<MockComponent />);

        const input = screen.getByRole('spinbutton');
        expect(input).not.toHaveFocus();

        userEvent.click(screen.getByText('Focus'));

        jest.runAllTimers();

        expect(input).toHaveFocus();
    });
});

describe('getTradeTypeTabsList', () => {
    it('should return correct tabs list for Turbos', () => {
        expect(getTradeTypeTabsList(TRADE_TYPES.TURBOS.SHORT)).toEqual([
            {
                label: 'Up',
                value: TRADE_TYPES.TURBOS.LONG,
                contract_type: CONTRACT_TYPES.TURBOS.LONG,
                is_displayed: true,
            },
            {
                label: 'Down',
                value: TRADE_TYPES.TURBOS.SHORT,
                contract_type: CONTRACT_TYPES.TURBOS.SHORT,
                is_displayed: true,
            },
        ]);
    });

    it('should return correct tabs list for Vanillas', () => {
        expect(getTradeTypeTabsList(TRADE_TYPES.VANILLA.CALL)).toEqual([
            {
                label: 'Call',
                value: TRADE_TYPES.VANILLA.CALL,
                contract_type: CONTRACT_TYPES.VANILLA.CALL,
                is_displayed: true,
            },
            {
                label: 'Put',
                value: TRADE_TYPES.VANILLA.PUT,
                contract_type: CONTRACT_TYPES.VANILLA.PUT,
                is_displayed: true,
            },
        ]);
    });

    it('should return correct tabs list for Higher/Lower', () => {
        expect(getTradeTypeTabsList(TRADE_TYPES.HIGH_LOW)).toEqual([
            {
                label: 'Higher',
                value: TRADE_TYPES.HIGH_LOW,
                contract_type: CONTRACT_TYPES.CALL,
                is_displayed: true,
            },
            {
                label: 'Lower',
                value: TRADE_TYPES.HIGH_LOW,
                contract_type: CONTRACT_TYPES.PUT,
                is_displayed: true,
            },
        ]);
    });

    it('should return correct tabs list for Touch/No Touch', () => {
        expect(getTradeTypeTabsList(TRADE_TYPES.TOUCH)).toEqual([
            {
                label: 'Touch',
                value: TRADE_TYPES.TOUCH,
                contract_type: CONTRACT_TYPES.TOUCH.ONE_TOUCH,
                is_displayed: true,
            },
            {
                label: 'No Touch',
                value: TRADE_TYPES.TOUCH,
                contract_type: CONTRACT_TYPES.TOUCH.NO_TOUCH,
                is_displayed: true,
            },
        ]);
    });
});

describe('isSmallScreen', () => {
    const original_height = window.innerHeight;

    it('should return true if window.innerHeight is less or equal to 640', () => {
        window.innerHeight = 640;
        expect(isSmallScreen()).toBe(true);
    });

    it('should return false if window.innerHeight is more than 640', () => {
        window.innerHeight = 700;
        expect(isSmallScreen()).toBe(false);
    });

    window.innerHeight = original_height;
});

describe('addUnit', () => {
    it('should return correct string', () => {
        expect(addUnit({ value: 30 })).toBe('30 min');
        expect(addUnit({ value: '15' })).toBe('15 min');
        expect(addUnit({ value: '15', unit: 'minutes' })).toBe('15 minutes');
        expect(addUnit({ value: '15', unit: 'm', should_add_space: false })).toBe('15m');
    });
});

describe('getSnackBarText', () => {
    it('should return correct string if switching_cancellation, has_cancellation, has_take_profit and has_stop_loss are true', () => {
        render(
            <div>
                {getSnackBarText({
                    has_cancellation: true,
                    has_take_profit: true,
                    has_stop_loss: true,
                    switching_cancellation: true,
                })}
            </div>
        );

        expect(screen.getByText('TP and SL have been turned off.')).toBeInTheDocument();
    });

    it('should return correct string if switching_cancellation === true, has_cancellation === true, has_take_profit === true and has_stop_loss === false', () => {
        render(
            <div>
                {getSnackBarText({
                    has_cancellation: true,
                    has_take_profit: true,
                    has_stop_loss: false,
                    switching_cancellation: true,
                })}
            </div>
        );

        expect(screen.getByText('TP has been turned off.')).toBeInTheDocument();
    });

    it('should return correct string if switching_cancellation === true, has_cancellation === true, has_take_profit === false and has_stop_loss === true', () => {
        render(
            <div>
                {getSnackBarText({
                    has_cancellation: true,
                    has_take_profit: false,
                    has_stop_loss: true,
                    switching_cancellation: true,
                })}
            </div>
        );

        expect(screen.getByText('SL has been turned off.')).toBeInTheDocument();
    });

    it('should return correct string if switching_tp_sl === true, has_cancellation === true, has_take_profit === true and has_stop_loss === false', () => {
        render(
            <div>
                {getSnackBarText({
                    has_cancellation: true,
                    has_take_profit: true,
                    has_stop_loss: false,
                    switching_tp_sl: true,
                })}
            </div>
        );

        expect(screen.getByText('DC has been turned off.')).toBeInTheDocument();
    });

    it('should return correct string if switching_tp_sl === true, has_cancellation === true, has_take_profit === false and has_stop_loss === true', () => {
        render(
            <div>
                {getSnackBarText({
                    has_cancellation: true,
                    has_take_profit: false,
                    has_stop_loss: true,
                    switching_tp_sl: true,
                })}
            </div>
        );

        expect(screen.getByText('DC has been turned off.')).toBeInTheDocument();
    });
});

describe('getOptionPerUnit', () => {
    const renderOptions = (options: { value: number; label: ReactNode }[]) => {
        return options.map(option => {
            if (React.isValidElement(option.label)) {
                const { container } = render(option.label as ReactElement);
                return container.textContent;
            }
            return '';
        });
    };

    test('returns correct options for minutes (m)', () => {
        const result = getOptionPerUnit('m', false);
        const view = renderOptions(result[0]);
        expect(result).toHaveLength(1);
        expect(view).toEqual([...Array(59)].map((_, i) => `${i + 1} min`));
    });

    test('returns correct options for seconds (s)', () => {
        const result = getOptionPerUnit('s', false);
        const view = renderOptions(result[0]);
        expect(result).toHaveLength(1);
        expect(view).toEqual([...Array(45)].map((_, i) => `${i + 15} sec`));
    });

    test('returns correct options for days (d)', () => {
        const result = getOptionPerUnit('d', false);
        const view = renderOptions(result[0]);
        expect(result).toHaveLength(1);
        expect(view).toEqual([...Array(365)].map((_, i) => `${i + 1} days`));
    });

    test('returns correct options for ticks (t)', () => {
        const result = getOptionPerUnit('t', false);
        const view = renderOptions(result[0]);

        expect(result).toHaveLength(1);
        expect(view).toEqual([...Array(10)].map((_, i) => `${i + 1} tick`));
    });

    test('returns correct options for ticks (t) when 5 ticks are required', () => {
        const result = getOptionPerUnit('t', true);
        const view = renderOptions(result[0]);
        expect(result).toHaveLength(1);
        expect(view).toEqual([...Array(6)].map((_, i) => `${i + 5} tick`));
    });

    test('returns correct options for hours (h)', () => {
        const result = getOptionPerUnit('h', false);
        // eslint-disable-next-line testing-library/render-result-naming-convention
        const hourView = renderOptions(result[0]);
        // eslint-disable-next-line testing-library/render-result-naming-convention
        const minuteView = renderOptions(result[1]);

        expect(result).toHaveLength(2);
        expect(hourView).toEqual([...Array(24)].map((_, i) => `${i + 1} h`));
        expect(minuteView).toEqual([...Array(60)].map((_, i) => `${i} min`));
    });

    test('returns empty array for invalid unit', () => {
        const result = getOptionPerUnit('invalid', false);
        expect(result).toEqual([[]]);
    });
});
