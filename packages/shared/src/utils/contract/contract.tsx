import moment from 'moment';
import React from 'react';
import { Localize } from '@deriv/translations';
import { unique } from '../object';
import { capitalizeFirstLetter } from '../string/string_util';
import { TContractInfo, TContractStore, TDigitsInfo, TLimitOrder, TTickItem } from './contract-types';
import { isForwardStarting } from '../shortcode';

type TGetAccuBarriersDTraderTimeout = (params: {
    barriers_update_timestamp: number;
    has_default_timeout: boolean;
    tick_update_timestamp: number | null;
    underlying: string;
}) => number;

// Trade types that are considered as vanilla financials
export const VANILLA_FX_SYMBOLS = [
    'frxAUDUSD',
    'frxEURUSD',
    'frxGBPUSD',
    'frxUSDCAD',
    'frxUSDJPY',
    'frxXAUUSD',
    'frxXAGUSD',
] as const;

// animation correction time is an interval in ms between ticks receival from API and their actual visual update on the chart
export const ANIMATION_CORRECTION_TIME = 200;
export const DELAY_TIME_1S_SYMBOL = 500;
// generation_interval will be provided via API later to help us distinguish between 1-second and 2-second symbols
export const symbols_2s = ['R_10', 'R_25', 'R_50', 'R_75', 'R_100'];

export const CONTRACT_TYPES = {
    ACCUMULATOR: 'ACCU',
    ASIAN: { UP: 'ASIANU', DOWN: 'ASIAND' },
    CALL: 'CALL',
    CALLE: 'CALLE',
    CALL_BARRIER: 'CALL_BARRIER',
    CALL_PUT_SPREAD: { CALL: 'CALLSPREAD', PUT: 'PUTSPREAD' },
    END: { IN: 'EXPIRYRANGE', OUT: 'EXPIRYMISS' },
    EVEN_ODD: { ODD: 'DIGITODD', EVEN: 'DIGITEVEN' },
    EXPIRYRANGEE: 'EXPIRYRANGEE',
    FALL: 'FALL',
    HIGHER: 'HIGHER',
    LB_HIGH_LOW: 'LBHIGHLOW',
    LB_CALL: 'LBFLOATCALL',
    LB_PUT: 'LBFLOATPUT',
    LOWER: 'LOWER',
    MATCH_DIFF: { MATCH: 'DIGITMATCH', DIFF: 'DIGITDIFF' },
    MULTIPLIER: {
        UP: 'MULTUP',
        DOWN: 'MULTDOWN',
    },
    OVER_UNDER: { OVER: 'DIGITOVER', UNDER: 'DIGITUNDER' },
    PUT: 'PUT',
    PUTE: 'PUTE',
    PUT_BARRIER: 'PUT_BARRIER',
    RESET: { CALL: 'RESETCALL', PUT: 'RESETPUT' },
    RISE: 'RISE',
    RUN_HIGH_LOW: { HIGH: 'RUNHIGH', LOW: 'RUNLOW' },
    STAY: { IN: 'RANGE', OUT: 'UPORDOWN' },
    TICK_HIGH_LOW: { HIGH: 'TICKHIGH', LOW: 'TICKLOW' },
    TOUCH: { ONE_TOUCH: 'ONETOUCH', NO_TOUCH: 'NOTOUCH' },
    TURBOS: {
        LONG: 'TURBOSLONG',
        SHORT: 'TURBOSSHORT',
    },
    VANILLA: {
        CALL: 'VANILLALONGCALL',
        PUT: 'VANILLALONGPUT',
    },
} as const;
export const TRADE_TYPES = {
    ACCUMULATOR: 'accumulator',
    ASIAN: 'asian',
    CALL_PUT_SPREAD: 'callputspread',
    END: 'end',
    EVEN_ODD: 'even_odd',
    HIGH_LOW: 'high_low',
    LB_HIGH_LOW: 'lb_high_low',
    LB_CALL: 'lb_call',
    LB_PUT: 'lb_put',
    MATCH_DIFF: 'match_diff',
    MULTIPLIER: 'multiplier',
    OVER_UNDER: 'over_under',
    RESET: 'reset',
    RISE_FALL: 'rise_fall',
    RISE_FALL_EQUAL: 'rise_fall_equal',
    RUN_HIGH_LOW: 'run_high_low',
    STAY: 'stay',
    TICK_HIGH_LOW: 'tick_high_low',
    TOUCH: 'touch',
    TURBOS: {
        LONG: CONTRACT_TYPES.TURBOS.LONG.toLowerCase(),
        SHORT: CONTRACT_TYPES.TURBOS.SHORT.toLowerCase(),
    },
    VANILLA: {
        CALL: CONTRACT_TYPES.VANILLA.CALL.toLowerCase(),
        PUT: CONTRACT_TYPES.VANILLA.PUT.toLowerCase(),
        FX: 'vanilla_fx',
    },
} as const;

export const getContractStatus = ({ contract_type, exit_tick_time, profit, status }: TContractInfo) => {
    const closed_contract_status = profit && profit < 0 && exit_tick_time ? 'lost' : 'won';
    return isAccumulatorContract(contract_type)
        ? (status === 'open' && !exit_tick_time && 'open') || closed_contract_status
        : status;
};

export const getFinalPrice = (contract_info: TContractInfo) => contract_info.sell_price || contract_info.bid_price;

export const getIndicativePrice = (contract_info: TContractInfo) =>
    getFinalPrice(contract_info) && isEnded(contract_info)
        ? getFinalPrice(contract_info)
        : Number(contract_info.bid_price);

export const getCancellationPrice = (contract_info: TContractInfo) => {
    const { cancellation: { ask_price: cancellation_price = 0 } = {} } = contract_info;
    return cancellation_price;
};

export const isEnded = (contract_info?: TContractInfo) =>
    !!(
        (contract_info?.status && contract_info.status !== 'open') ||
        contract_info?.is_expired ||
        contract_info?.is_settleable
    );

export const isOpen = (contract_info: TContractInfo) => getContractStatus(contract_info) === 'open';

export const isUserSold = (contract_info?: TContractInfo) => contract_info?.status === 'sold';

export const isValidToCancel = (contract_info?: TContractInfo) => !!contract_info?.is_valid_to_cancel;

export const isValidToSell = (contract_info?: TContractInfo) =>
    !isEnded(contract_info) && !isUserSold(contract_info) && !!contract_info?.is_valid_to_sell;

export const hasContractEntered = (contract_info?: TContractInfo) => !!contract_info?.entry_spot;

export const hasBarrier = (contract_type = '') => /VANILLA|TURBOS|HIGH_LOW|TOUCH/i.test(contract_type);

export const hasTwoBarriers = (contract_type = '') => /EXPIRY|RANGE|UPORDOWN/i.test(contract_type);

export const isAccumulatorContract = (contract_type = '') => /ACCU/i.test(contract_type);

export const isAccumulatorContractOpen = (contract_info: TContractInfo = {}) => {
    return isAccumulatorContract(contract_info.contract_type) && getContractStatus(contract_info) === 'open';
};

export const isMultiplierContract = (contract_type = '') => /MULT/i.test(contract_type);

export const isRiseFallContract = (contract_type = '') => /RISE_FALL/i.test(contract_type);

export const isTouchContract = (contract_type: string) => /TOUCH/i.test(contract_type);

export const isTurbosContract = (contract_type = '') => /TURBOS/i.test(contract_type);

export const isVanillaContract = (contract_type = '') => /VANILLA/i.test(contract_type);

export const isVanillaFxContract = (contract_type = '', symbol = '') =>
    isVanillaContract(contract_type) && VANILLA_FX_SYMBOLS.includes(symbol as typeof VANILLA_FX_SYMBOLS[number]);

export const isSmartTraderContract = (contract_type = '') =>
    /RUN|EXPIRY|RANGE|UPORDOWN|ASIAN|RESET|TICK|LB/i.test(contract_type);

export const isAsiansContract = (contract_type = '') => /ASIAN/i.test(contract_type);

export const isLookBacksContract = (contract_type = '') => /LB/i.test(contract_type);

export const isTicksContract = (contract_type = '') => /TICK/i.test(contract_type);

export const isResetContract = (contract_type = '') => /RESET/i.test(contract_type);

export const isCryptoContract = (underlying = '') => underlying.startsWith('cry');

export const getAccuBarriersDefaultTimeout = (symbol: string) => {
    return symbols_2s.includes(symbol) ? DELAY_TIME_1S_SYMBOL * 2 : DELAY_TIME_1S_SYMBOL;
};

export const getAccuBarriersDTraderTimeout: TGetAccuBarriersDTraderTimeout = ({
    barriers_update_timestamp,
    has_default_timeout,
    tick_update_timestamp,
    underlying,
}) => {
    if (has_default_timeout || !tick_update_timestamp) return getAccuBarriersDefaultTimeout(underlying);
    const target_update_time =
        tick_update_timestamp + getAccuBarriersDefaultTimeout(underlying) + ANIMATION_CORRECTION_TIME;
    const difference = target_update_time - barriers_update_timestamp;
    return difference < 0 ? 0 : difference;
};

export const getAccuBarriersForContractDetails = (contract_info: TContractInfo) => {
    if (!isAccumulatorContract(contract_info.contract_type)) return {};
    const is_contract_open = isOpen(contract_info);
    const { current_spot_high_barrier, current_spot_low_barrier, high_barrier, low_barrier } = contract_info || {};
    const accu_high_barrier = is_contract_open ? current_spot_high_barrier : high_barrier;
    const accu_low_barrier = is_contract_open ? current_spot_low_barrier : low_barrier;
    return { accu_high_barrier, accu_low_barrier };
};

export const getCurrentTick = (contract_info: TContractInfo) => {
    const tick_stream = unique(contract_info.tick_stream || [], 'epoch');
    const current_tick =
        isDigitContract(contract_info.contract_type) || isAsiansContract(contract_info.contract_type)
            ? tick_stream.length
            : contract_info.tick_passed ?? tick_stream.length - 1;
    return !current_tick || current_tick < 0 ? 0 : current_tick;
};

export const getLastContractMarkerIndex = (markers: TContractStore[] = []) => {
    const sorted_markers = [...markers].sort(
        (a, b) => Number(b.contract_info.date_start) - Number(a.contract_info.date_start)
    );
    const index = sorted_markers[0].contract_info.date_start ? markers.indexOf(sorted_markers[0]) : -1;
    return index >= 0 ? index : markers.length - 1;
};

export const getLastTickFromTickStream = (tick_stream: TTickItem[] = []) => tick_stream[tick_stream.length - 1] || {};

export const isDigitContract = (contract_type = '') => /digit/i.test(contract_type);

export const getDigitInfo = (digits_info: TDigitsInfo, contract_info: TContractInfo) => {
    const { tick_stream } = contract_info;
    const { tick_display_value, epoch } = getLastTickFromTickStream(tick_stream);

    if (!tick_display_value || !epoch) return {}; // filter out empty responses

    const current =
        epoch in digits_info
            ? {} // filter out duplicated responses
            : createDigitInfo(tick_display_value, epoch);

    return {
        ...current,
    };
};

export const getTotalProfit = (contract_info: TContractInfo) =>
    Number(contract_info.bid_price) - Number(contract_info.buy_price);

const createDigitInfo = (spot: string, spot_time: number) => {
    const digit = +`${spot}`.slice(-1);

    return {
        [+spot_time]: {
            digit,
            spot,
        },
    };
};

export const getLimitOrderAmount = (limit_order?: TLimitOrder) => {
    if (!limit_order) return { stop_loss: null, take_profit: null };
    const {
        stop_loss: { order_amount: stop_loss_order_amount } = {},
        take_profit: { order_amount: take_profit_order_amount } = {},
    } = limit_order;

    return {
        stop_loss: stop_loss_order_amount,
        take_profit: take_profit_order_amount,
    };
};

export const getTimePercentage = (server_time: moment.Moment, start_time: number, expiry_time: number) => {
    const duration_from_purchase = moment.duration(moment.unix(expiry_time).diff(moment.unix(start_time)));
    const duration_from_now = moment.duration(moment.unix(expiry_time).diff(server_time));
    let percentage = (duration_from_now.asMilliseconds() / duration_from_purchase.asMilliseconds()) * 100;

    if (percentage < 0.5) {
        percentage = 0;
    } else if (percentage > 100) {
        percentage = 100;
    }

    if (isNaN(percentage)) {
        percentage = 0;
    }

    return Math.round(percentage);
};

export const getGrowthRatePercentage = (growth_rate: number) => growth_rate * 100;

export const getDisplayStatus = (contract_info: TContractInfo) => {
    let status = 'purchased';
    if (isEnded(contract_info)) {
        status = getTotalProfit(contract_info) >= 0 ? 'won' : 'lost';
    }
    return status;
};

/**
 * Set contract update form initial values
 * @param {object} contract_update - contract_update response
 * @param {object} limit_order - proposal_open_contract.limit_order response
 */

export const getContractUpdateConfig = ({ contract_update, limit_order }: TContractInfo) => {
    const { stop_loss, take_profit } = getLimitOrderAmount(limit_order || contract_update);

    return {
        // convert stop_loss, take_profit value to string for validation to work
        contract_update_stop_loss: stop_loss ? Math.abs(stop_loss).toString() : '',
        contract_update_take_profit: take_profit ? take_profit.toString() : '',
        has_contract_update_stop_loss: !!stop_loss,
        has_contract_update_take_profit: !!take_profit,
    };
};

export const shouldShowExpiration = (symbol = '') => symbol.startsWith('cry');

export const shouldShowCancellation = (symbol = '') => !/^(cry|CRASH|BOOM|stpRNG|WLD|JD)/.test(symbol);

export const getContractSubtype = (type = '') =>
    /(VANILLALONG|TURBOS)/i.test(type)
        ? capitalizeFirstLetter(type.replace(/(VANILLALONG|TURBOS)/i, '').toLowerCase())
        : '';

export const getLocalizedTurbosSubtype = (contract_type = '') => {
    if (!isTurbosContract(contract_type)) return '';
    return getContractSubtype(contract_type) === 'Long' ? (
        <Localize i18n_default_text='Up' />
    ) : (
        <Localize i18n_default_text='Down' />
    );
};

export const clickAndKeyEventHandler = (
    callback?: () => void,
    e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
) => {
    if (e) {
        e.preventDefault();
        if (e.type !== 'keydown' || (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter')) {
            callback?.();
        }
    } else {
        callback?.();
    }
};

export const getSortedTradeTypes = (array: string[] = []) => {
    if (array.includes(TRADE_TYPES.ACCUMULATOR)) {
        return [TRADE_TYPES.ACCUMULATOR, ...array.filter(type => type !== TRADE_TYPES.ACCUMULATOR)];
    }
    if (array.includes(TRADE_TYPES.MULTIPLIER)) {
        return [TRADE_TYPES.MULTIPLIER, ...array.filter(type => type !== TRADE_TYPES.MULTIPLIER)];
    }
    return array;
};

export const isForwardStartingBuyTransaction = (transactionType: string, shortcode: string, transactionTime: number) =>
    transactionType === 'buy' && !!isForwardStarting(shortcode, transactionTime);
