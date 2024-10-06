import {
    addComma,
    CONTRACT_TYPES,
    formatMoney,
    formatResetDuration,
    getCardLabelsV2,
    getDurationPeriod,
    getDurationTime,
    getDurationUnitText,
    getGrowthRatePercentage,
    getStartTime,
    getUnitMap,
    hasForwardContractStarted,
    isAccumulatorContract,
    isForwardStarting,
    isResetContract,
    isUserCancelled,
    TContractInfo,
} from '@deriv/shared';
import { getBarrierValue } from 'App/Components/Elements/PositionsDrawer/helpers';
import { isCancellationExpired } from 'Stores/Modules/Trading/Helpers/logic';
import { Localize } from '@deriv/translations';
import React from 'react';

const CARD_LABELS = getCardLabelsV2();

const formatTimestampToDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    const formattedDate = `${date.getUTCDate().toString().padStart(2, '0')} ${date.toLocaleString('en-GB', {
        month: 'short',
        timeZone: 'UTC',
    })} ${date.getUTCFullYear()}`;

    const formattedTime = `${date.getUTCHours().toString().padStart(2, '0')}:${date
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')} GMT`;

    return [formattedDate, formattedTime];
};

const getDealCancelFee = (data: TContractInfo) => {
    if (!data.cancellation?.ask_price || !data.currency) return undefined;

    let status;
    if (isUserCancelled(data)) {
        status = CARD_LABELS.EXECUTED;
    } else if (isCancellationExpired(data)) {
        status = CARD_LABELS.EXPIRED;
    } else {
        status = CARD_LABELS.ACTIVE;
    }

    return [`${formatMoney(data.currency, data.cancellation.ask_price, true)} ${data.currency}`, `(${status})`];
};

// Contains all key values that are used more than once in different transform objects
const getCommonFields = (data: TContractInfo) => {
    const { tick_count, tick_passed, contract_type } = data;
    const ticks_label = Number(tick_count) < 2 ? CARD_LABELS.TICK : CARD_LABELS.TICKS;
    const ticks_duration_text = isAccumulatorContract(contract_type)
        ? `${tick_passed}/${tick_count} ${CARD_LABELS.TICKS}`
        : `${tick_count} ${ticks_label}`;

    return {
        [CARD_LABELS.REFERENCE_ID]: [
            data.transaction_ids?.buy ? `${data.transaction_ids.buy} (Buy)` : '',
            data.transaction_ids?.sell ? `${data.transaction_ids.sell} (Sell)` : '',
        ],
        [CARD_LABELS.STAKE]:
            data.buy_price && data.currency
                ? `${formatMoney(data.currency, data.buy_price, true)} ${data.currency}`
                : '',
        [CARD_LABELS.DURATION]:
            Number(tick_count) > 0
                ? ticks_duration_text
                : `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [CARD_LABELS.PAYOUT_PER_POINT]: data.display_number_of_contracts ?? '',
        [CARD_LABELS.POTENTIAL_PAYOUT]: data.payout,
    };
};
// For Multiplier
const transformMultiplierData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    const dealCancelFee = getDealCancelFee(data);

    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.MULTIPLIER]: data.multiplier ? `x${data.multiplier}` : '',
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.COMMISSION]: data.commission
            ? `${formatMoney(data.currency as string, data.commission, true)} ${data.currency}`
            : '',
        ...(dealCancelFee && { [CARD_LABELS.DEAL_CANCEL_FEE]: dealCancelFee }),
        [CARD_LABELS.TAKE_PROFIT]:
            data.limit_order?.take_profit?.order_amount && data.currency
                ? `${formatMoney(data.currency, data.limit_order.take_profit.order_amount, true)} ${data.currency}`
                : CARD_LABELS.NOT_SET,
        [CARD_LABELS.STOP_LOSS]:
            data.limit_order?.stop_loss?.order_amount && data.currency
                ? `${formatMoney(data.currency, data.limit_order.stop_loss.order_amount, true)} ${data.currency}`
                : CARD_LABELS.NOT_SET,
        [CARD_LABELS.STOP_OUT_LEVEL]:
            data.limit_order?.stop_out?.order_amount && data.currency
                ? `${formatMoney(data.currency, data.limit_order.stop_out.order_amount, true)} ${data.currency}`
                : '',
    };
};

// For Rise
const transformCallPutData = (data: TContractInfo) => {
    const { barrier, purchase_time, shortcode } = data;
    const is_forward_starting = isForwardStarting(shortcode ?? '', purchase_time);
    const start_time = getStartTime(shortcode ?? '');
    const has_forward_contract_started = hasForwardContractStarted(shortcode ?? '');
    const show_barrier_placeholder = is_forward_starting && !!start_time && !has_forward_contract_started;

    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
        [CARD_LABELS.BARRIER]: (show_barrier_placeholder ? 'TBD' : barrier) ?? '',
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.POTENTIAL_PAYOUT]: commonFields[CARD_LABELS.POTENTIAL_PAYOUT],
    };
};

// For Turbos
const transformTurbosData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
        [CARD_LABELS.BARRIER]: data.barrier ?? '',
        [CARD_LABELS.PAYOUT_PER_POINT]: `${commonFields[CARD_LABELS.PAYOUT_PER_POINT]} ${data.currency}`,
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.TAKE_PROFIT]:
            data.limit_order?.take_profit?.order_amount && data.currency
                ? `${formatMoney(data.currency, data.limit_order.take_profit.order_amount, true)} ${data.currency}`
                : CARD_LABELS.NOT_SET,
    };
};

// For Digits
const transformDigitsData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    const duration_time = getDurationTime(data) ?? '';
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: `${duration_time} ${
            +duration_time > 1 ? getUnitMap().t.name_plural : getUnitMap().t.name_singular
        }`,
        [CARD_LABELS.TARGET]: getBarrierValue(data),
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.POTENTIAL_PAYOUT]: commonFields[CARD_LABELS.POTENTIAL_PAYOUT],
    };
};

// For Accumulators
const transformAccumulatorData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        ...{
            ...((data.is_expired || data.is_sold) && {
                [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
            }),
        },
        [CARD_LABELS.GROWTH_RATE]: data.growth_rate ? `${getGrowthRatePercentage(data.growth_rate)}%` : '',
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        ...{
            ...(data.limit_order?.take_profit && {
                [CARD_LABELS.TAKE_PROFIT]:
                    data.limit_order?.take_profit?.order_amount && data.currency
                        ? `${formatMoney(data.currency, data.limit_order.take_profit.order_amount, true)} ${
                              data.currency
                          }`
                        : CARD_LABELS.NOT_SET,
            }),
        },
    };
};

// For Vanillas
const transformVanillaData = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[`${CARD_LABELS.REFERENCE_ID}`],
        [CARD_LABELS.DURATION]: `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [CARD_LABELS.STRIKE_PRICE]:
            (isResetContract(data.contract_type) ? addComma(data.entry_spot_display_value) : getBarrierValue(data)) ||
            ' - ',
        [CARD_LABELS.PAYOUT_PER_POINT]: `${commonFields[CARD_LABELS.PAYOUT_PER_POINT]} ${data.currency}`,
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
    };
};

const transformEndsBetween = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[`${CARD_LABELS.REFERENCE_ID}`],
        [CARD_LABELS.DURATION]: `${getDurationTime(data) ?? ''} ${getDurationUnitText(getDurationPeriod(data)) ?? ''}`,
        [CARD_LABELS.HIGH_BARRIER]: data.high_barrier,
        [CARD_LABELS.LOW_BARRIER]: data.low_barrier,
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.POTENTIAL_PAYOUT]:
            data.payout && data.currency ? `${formatMoney(data.currency, data.payout, true)} ${data.currency}` : '',
    };
};

const transformAsian = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
        [CARD_LABELS.BARRIER]: data.barrier ?? '',
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.POTENTIAL_PAYOUT]:
            data.payout && data.currency ? `${formatMoney(data.currency, data.payout, true)} ${data.currency}` : '',
    };
};

const transformLooksback = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    const is_call_contract = data.contract_type == CONTRACT_TYPES.LB_CALL;
    let spot_key;

    if (data.transaction_ids?.sell) {
        spot_key = is_call_contract ? CARD_LABELS.LOW_SPOT : CARD_LABELS.HIGH_SPOT;
    } else {
        spot_key = is_call_contract ? CARD_LABELS.INDICATIVE_LOW_SPOT : CARD_LABELS.INDICATIVE_HIGH_SPOT;
    }

    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
        [CARD_LABELS.MULTIPLIER]: data.multiplier ?? '',
        [spot_key]: data.barrier ?? '',
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
    };
};

const transformHighLowLookback = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
        [CARD_LABELS.MULTIPLIER]: data.multiplier ?? '',
        ...{
            [data.transaction_ids?.sell ? CARD_LABELS.HIGH_SPOT : CARD_LABELS.INDICATIVE_HIGH_SPOT]:
                data.high_barrier ?? '',
            [data.transaction_ids?.sell ? CARD_LABELS.LOW_SPOT : CARD_LABELS.INDICATIVE_LOW_SPOT]:
                data.low_barrier ?? '',
        },
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
    };
};

const transformReset = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);

    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: [
            commonFields[CARD_LABELS.DURATION],
            {
                caption: React.createElement(Localize, {
                    key: 'reset_time',
                    i18n_default_text: 'The reset time is {{ reset_time }}',
                    values: {
                        reset_time:
                            data.tick_count !== undefined
                                ? `${Math.floor(Number(data.tick_count) / 2)} ${
                                      Number(data.tick_count) < 2 ? CARD_LABELS.TICK : CARD_LABELS.TICKS
                                  }`
                                : formatResetDuration(data),
                    },
                }),
            },
        ],
        [CARD_LABELS.BARRIER]: data.barrier ?? '',
        ...(data.reset_barrier ? { [CARD_LABELS.RESET_BARRIER]: data.reset_barrier } : {}),
        ...(data.reset_time ? { [CARD_LABELS.RESET_TIME]: formatTimestampToDateTime(data.reset_time) ?? '' } : {}),
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.POTENTIAL_PAYOUT]:
            data.payout && data.currency ? `${formatMoney(data.currency, data.payout, true)} ${data.currency}` : '',
    };
};

const transformRunHigh = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.POTENTIAL_PAYOUT]:
            data.payout && data.currency ? `${formatMoney(data.currency, data.payout, true)} ${data.currency}` : '',
    };
};
const transformHighLow = (data: TContractInfo) => {
    const commonFields = getCommonFields(data);
    return {
        [CARD_LABELS.REFERENCE_ID]: commonFields[CARD_LABELS.REFERENCE_ID],
        [CARD_LABELS.DURATION]: commonFields[CARD_LABELS.DURATION],
        [CARD_LABELS.SELECTED_TICK]: [data.selected_tick ?? '', { caption: data.barrier ?? '' }],
        [CARD_LABELS.STAKE]: commonFields[CARD_LABELS.STAKE],
        [CARD_LABELS.POTENTIAL_PAYOUT]:
            data.payout && data.currency ? `${formatMoney(data.currency, data.payout, true)} ${data.currency}` : '',
    };
};

// Map of contract types to their respective transform functions
const transformFunctionMap: Record<string, (data: TContractInfo) => Record<string, any>> = {
    [CONTRACT_TYPES.TURBOS.LONG]: transformTurbosData,
    [CONTRACT_TYPES.TURBOS.SHORT]: transformTurbosData,
    [CONTRACT_TYPES.MULTIPLIER.DOWN]: transformMultiplierData,
    [CONTRACT_TYPES.MULTIPLIER.UP]: transformMultiplierData,
    [CONTRACT_TYPES.MATCH_DIFF.MATCH]: transformDigitsData,
    [CONTRACT_TYPES.MATCH_DIFF.DIFF]: transformDigitsData,
    [CONTRACT_TYPES.EVEN_ODD.EVEN]: transformDigitsData,
    [CONTRACT_TYPES.EVEN_ODD.ODD]: transformDigitsData,
    [CONTRACT_TYPES.OVER_UNDER.OVER]: transformDigitsData,
    [CONTRACT_TYPES.OVER_UNDER.UNDER]: transformDigitsData,
    [CONTRACT_TYPES.PUT]: transformCallPutData,
    [CONTRACT_TYPES.PUTE]: transformCallPutData,
    [CONTRACT_TYPES.CALLE]: transformCallPutData,
    [CONTRACT_TYPES.CALL]: transformCallPutData,
    [CONTRACT_TYPES.TOUCH.ONE_TOUCH]: transformCallPutData,
    [CONTRACT_TYPES.TOUCH.NO_TOUCH]: transformCallPutData,
    [CONTRACT_TYPES.ACCUMULATOR]: transformAccumulatorData,
    [CONTRACT_TYPES.VANILLA.CALL]: transformVanillaData,
    [CONTRACT_TYPES.VANILLA.PUT]: transformVanillaData,
    //SMARTTRADER CONCTRACTS
    [CONTRACT_TYPES.END.IN]: transformEndsBetween,
    [CONTRACT_TYPES.END.OUT]: transformEndsBetween,
    [CONTRACT_TYPES.STAY.IN]: transformEndsBetween,
    [CONTRACT_TYPES.STAY.OUT]: transformEndsBetween,
    [CONTRACT_TYPES.ASIAN.UP]: transformAsian,
    [CONTRACT_TYPES.ASIAN.DOWN]: transformAsian,
    [CONTRACT_TYPES.LB_HIGH_LOW]: transformHighLowLookback,
    [CONTRACT_TYPES.LB_CALL]: transformLooksback,
    [CONTRACT_TYPES.LB_PUT]: transformLooksback,
    [CONTRACT_TYPES.RESET.CALL]: transformReset,
    [CONTRACT_TYPES.RESET.PUT]: transformReset,
    [CONTRACT_TYPES.TICK_HIGH_LOW.HIGH]: transformHighLow,
    [CONTRACT_TYPES.TICK_HIGH_LOW.LOW]: transformHighLow,
    [CONTRACT_TYPES.FALL]: transformEndsBetween,
    [CONTRACT_TYPES.RUN_HIGH_LOW.HIGH]: transformRunHigh,
    [CONTRACT_TYPES.RUN_HIGH_LOW.LOW]: transformRunHigh,
};

const useOrderDetails = (contract_info: TContractInfo) => {
    const contractInfo = contract_info;
    if (!contractInfo.contract_type) return;
    const transformFunction = transformFunctionMap[contractInfo.contract_type];
    const details = transformFunction ? transformFunction(contractInfo) : {};
    return {
        details,
    };
};

export default useOrderDetails;
