import {
    CONTRACT_TYPES,
    isTouchContract,
    isTurbosContract,
    isVanillaContract,
    shouldShowExpiration,
    TRADE_TYPES,
} from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import React, { ReactNode } from 'react';
import { createProposalRequestForContract } from 'Stores/Modules/Trading/Helpers/proposal';
import { TTradeStore } from 'Types';

export const getTradeParams = (symbol?: string, has_cancellation?: boolean) => ({
    [TRADE_TYPES.RISE_FALL]: {
        duration: true,
        stake: true,
        allow_equals: true,
    },
    [TRADE_TYPES.RISE_FALL_EQUAL]: {
        duration: true,
        stake: true,
        allow_equals: true,
    },
    [TRADE_TYPES.HIGH_LOW]: {
        trade_type_tabs: true,
        duration: true,
        barrier: true,
        stake: true,
        payout: true,
    },
    [TRADE_TYPES.TOUCH]: {
        trade_type_tabs: true,
        duration: true,
        barrier: true,
        stake: true,
        payout: true,
    },
    [TRADE_TYPES.MATCH_DIFF]: {
        last_digit: true,
        duration: true,
        stake: true,
    },
    [TRADE_TYPES.EVEN_ODD]: {
        duration: true,
        stake: true,
    },
    [TRADE_TYPES.OVER_UNDER]: {
        last_digit: true,
        duration: true,
        stake: true,
    },
    [TRADE_TYPES.ACCUMULATOR]: {
        growth_rate: true,
        stake: true,
        take_profit: true,
        accu_info_display: true,
    },
    [TRADE_TYPES.MULTIPLIER]: {
        multiplier: true,
        stake: true,
        risk_management: true,
        ...(has_cancellation ? { mult_info_display: true } : {}),
        ...(shouldShowExpiration(symbol) ? { expiration: true } : {}),
    },
    [TRADE_TYPES.TURBOS.LONG]: {
        trade_type_tabs: true,
        duration: true,
        payout_per_point: true,
        stake: true,
        take_profit: true,
        barrier_info: true,
    },
    [TRADE_TYPES.TURBOS.SHORT]: {
        trade_type_tabs: true,
        duration: true,
        payout_per_point: true,
        stake: true,
        take_profit: true,
        barrier_info: true,
    },
    [TRADE_TYPES.VANILLA.CALL]: {
        trade_type_tabs: true,
        duration: true,
        strike: true,
        stake: true,
        payout_per_point_info: true,
    },
    [TRADE_TYPES.VANILLA.PUT]: {
        trade_type_tabs: true,
        duration: true,
        strike: true,
        stake: true,
        payout_per_point_info: true,
    },
});

export const isDigitContractWinning = (
    contract_type: string | undefined,
    selected_digit: number | null,
    current_digit: number | null
) => {
    const win_conditions = {
        [CONTRACT_TYPES.MATCH_DIFF.MATCH]: current_digit === selected_digit,
        [CONTRACT_TYPES.MATCH_DIFF.DIFF]: current_digit !== selected_digit,
        [CONTRACT_TYPES.OVER_UNDER.OVER]:
            !!((current_digit || current_digit === 0) && (selected_digit || selected_digit === 0)) &&
            current_digit > selected_digit,
        [CONTRACT_TYPES.OVER_UNDER.UNDER]:
            !!((current_digit || current_digit === 0) && (selected_digit || selected_digit === 0)) &&
            current_digit < selected_digit,
        [CONTRACT_TYPES.EVEN_ODD.ODD]: !!current_digit && Boolean(current_digit % 2),
        [CONTRACT_TYPES.EVEN_ODD.EVEN]: (!!current_digit && !(current_digit % 2)) || current_digit === 0,
    } as { [key: string]: boolean };
    if (!contract_type || !win_conditions[contract_type]) return false;
    return win_conditions[contract_type];
};

export const focusAndOpenKeyboard = (focused_input?: HTMLInputElement | null, main_input?: HTMLInputElement | null) => {
    if (main_input && focused_input) {
        // Reveal a temporary input element and put focus on it
        focused_input.style.display = 'block';
        focused_input.focus({ preventScroll: true });

        // The keyboard is open, so now adding a delayed focus on the target element and hide the temporary input element
        return setTimeout(() => {
            main_input.focus();
            main_input.click();
            focused_input.style.display = 'none';
        }, 300);
    }
};

export const getTradeTypeTabsList = (contract_type = '') => {
    const is_turbos = isTurbosContract(contract_type);
    const is_vanilla = isVanillaContract(contract_type);
    const is_high_low = contract_type === TRADE_TYPES.HIGH_LOW;
    const is_touch = isTouchContract(contract_type);
    const tab_list = [
        {
            label: 'Up',
            value: TRADE_TYPES.TURBOS.LONG,
            contract_type: CONTRACT_TYPES.TURBOS.LONG,
            is_displayed: is_turbos,
        },
        {
            label: 'Down',
            value: TRADE_TYPES.TURBOS.SHORT,
            contract_type: CONTRACT_TYPES.TURBOS.SHORT,
            is_displayed: is_turbos,
        },
        {
            label: 'Call',
            value: TRADE_TYPES.VANILLA.CALL,
            contract_type: CONTRACT_TYPES.VANILLA.CALL,
            is_displayed: is_vanilla,
        },
        {
            label: 'Put',
            value: TRADE_TYPES.VANILLA.PUT,
            contract_type: CONTRACT_TYPES.VANILLA.PUT,
            is_displayed: is_vanilla,
        },
        { label: 'Higher', value: TRADE_TYPES.HIGH_LOW, contract_type: CONTRACT_TYPES.CALL, is_displayed: is_high_low },
        { label: 'Lower', value: TRADE_TYPES.HIGH_LOW, contract_type: CONTRACT_TYPES.PUT, is_displayed: is_high_low },
        {
            label: 'Touch',
            value: TRADE_TYPES.TOUCH,
            contract_type: CONTRACT_TYPES.TOUCH.ONE_TOUCH,
            is_displayed: is_touch,
        },
        {
            label: 'No Touch',
            value: TRADE_TYPES.TOUCH,
            contract_type: CONTRACT_TYPES.TOUCH.NO_TOUCH,
            is_displayed: is_touch,
        },
    ];
    return tab_list.filter(({ is_displayed }) => is_displayed);
};

export const isSmallScreen = () => window.innerHeight <= 640;

export const addUnit = ({
    value,
    unit = localize('min'),
    should_add_space = true,
}: {
    value: string | number;
    unit?: string;
    should_add_space?: boolean;
}) => `${typeof value === 'number' ? value : parseInt(value)}${should_add_space ? ' ' : ''}${unit}`;

export const getSnackBarText = ({
    has_cancellation,
    has_take_profit,
    has_stop_loss,
    switching_cancellation,
    switching_tp_sl,
}: {
    has_cancellation?: boolean;
    has_take_profit?: boolean;
    has_stop_loss?: boolean;
    switching_cancellation?: boolean;
    switching_tp_sl?: boolean;
}) => {
    if (switching_cancellation && has_cancellation) {
        if (has_take_profit && has_stop_loss) return <Localize i18n_default_text='TP and SL have been turned off.' />;
        if (has_take_profit) return <Localize i18n_default_text='TP has been turned off.' />;
        if (has_stop_loss) return <Localize i18n_default_text='SL has been turned off.' />;
    }
    if (switching_tp_sl && (has_take_profit || has_stop_loss) && has_cancellation)
        return <Localize i18n_default_text='DC has been turned off.' />;
};

export const getOptionPerUnit = (unit: string, show_tick_from_5: boolean): { value: number; label: ReactNode }[][] => {
    const unitConfig: Record<
        string,
        { start: number; end: number; label: ReactNode } | (() => { value: number; label: ReactNode }[][])
    > = {
        m: { start: 1, end: 59, label: <Localize i18n_default_text='min' /> },
        s: { start: 15, end: 59, label: <Localize i18n_default_text='sec' /> },
        d: { start: 1, end: 365, label: <Localize i18n_default_text='days' /> },
        t: { start: show_tick_from_5 ? 5 : 1, end: 10, label: <Localize i18n_default_text='tick' /> },
        h: () => {
            const hour_options = generateOptions(1, 24, 'h');
            const minute_options = generateOptions(0, 59, 'min');
            return [hour_options, minute_options];
        },
    };

    const generateOptions = (start: number, end: number, label: ReactNode) => {
        return Array.from({ length: end - start + 1 }, (_, i) => ({
            value: start + i,
            label: (
                <React.Fragment key={start + i}>
                    {start + i} {label}
                </React.Fragment>
            ),
        }));
    };

    const config = unitConfig[unit];

    if (typeof config === 'function') {
        return config();
    }

    if (config) {
        const { start, end, label } = config;
        return [generateOptions(start, end, label)];
    }

    return [[]];
};

export const getProposalRequestObject = ({
    new_values = {},
    should_subscribe = false,
    trade_store,
    trade_type,
}: {
    new_values: Record<string, unknown>;
    should_subscribe?: boolean;
    trade_store: TTradeStore;
    trade_type: string;
}) => {
    const store = {
        ...trade_store,
        ...new_values,
    };

    const request = createProposalRequestForContract(
        store as Parameters<typeof createProposalRequestForContract>[0],
        trade_type
    ) as Omit<ReturnType<typeof createProposalRequestForContract>, 'subscribe'> & { subscribe?: number };

    if (!should_subscribe) delete request.subscribe;

    return request;
};
