import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import {
    getTradeParams,
    getTradeTypeTabsList,
    isDigitContractWinning,
    focusAndOpenKeyboard,
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

describe('getOptionPerUnit', () => {
    test('should return options for minutes when unit is "m"', () => {
        const result = getOptionPerUnit('m');
        expect(result).toHaveLength(1);
        expect(result[0][0]).toEqual({ value: 1, label: '1 min' });
        expect(result[0][result[0].length - 1]).toEqual({ value: 59, label: '59 min' });
    });

    test('should return options for seconds when unit is "s"', () => {
        const result = getOptionPerUnit('s');
        expect(result).toHaveLength(1);
        expect(result[0][0]).toEqual({ value: 15, label: '15 sec' });
        expect(result[0][result[0].length - 1]).toEqual({ value: 59, label: '59 sec' });
    });

    test('should return options for days when unit is "d"', () => {
        const result = getOptionPerUnit('d');
        expect(result).toHaveLength(1);
        expect(result[0][0]).toEqual({ value: 1, label: '1 days' });
        expect(result[0][result[0].length - 1]).toEqual({ value: 365, label: '365 days' });
    });

    test('should return options for ticks when unit is "t"', () => {
        const result = getOptionPerUnit('t');
        expect(result).toHaveLength(1);
        expect(result[0][0]).toEqual({ value: 1, label: '1 tick' });
        expect(result[0][result[0].length - 1]).toEqual({ value: 10, label: '10 tick' });
    });

    test('should return options for hours and minutes when unit is "h"', () => {
        const result = getOptionPerUnit('h');
        expect(result).toHaveLength(2);
        expect(result[0][0]).toEqual({ value: 1, label: '1 h' });
        expect(result[0][result[0].length - 1]).toEqual({ value: 23, label: '23 h' });
        expect(result[1][0]).toEqual({ value: 1, label: '1 min' });
        expect(result[1][result[1].length - 1]).toEqual({ value: 59, label: '59 min' });
    });

    test('should return an empty array for unknown units', () => {
        const result = getOptionPerUnit('unknown');
        expect(result).toEqual([[]]);
    });
});
