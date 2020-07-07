import { unique } from '../object';
import moment from 'moment';

export const getFinalPrice = contract_info => +(contract_info.sell_price || contract_info.bid_price);

export const getIndicativePrice = contract_info =>
    getFinalPrice(contract_info) && isEnded(contract_info)
        ? getFinalPrice(contract_info)
        : +contract_info.bid_price || null;

export const getCancellationPrice = contract_info => {
    const { cancellation: { ask_price: cancellation_price = 0 } = {} } = contract_info;
    return cancellation_price;
};

export const isEnded = contract_info =>
    !!(
        (contract_info.status && contract_info.status !== 'open') ||
        contract_info.is_expired ||
        contract_info.is_settleable
    );

export const isUserSold = contract_info => contract_info.status === 'sold';

export const isValidToCancel = contract_info => !!contract_info.is_valid_to_cancel;

export const isValidToSell = contract_info =>
    !isEnded(contract_info) && !isUserSold(contract_info) && +contract_info.is_valid_to_sell === 1;

export const isMultiplierContract = contract_type => /MULT/i.test(contract_type);

export const getCurrentTick = contract_info => {
    const tick_stream = unique(contract_info.tick_stream, 'epoch');
    const current_tick = isDigitContract(contract_info.contract_type) ? tick_stream.length : tick_stream.length - 1;
    return !current_tick || current_tick < 0 ? 0 : current_tick;
};

export const getLastTickFromTickStream = (tick_stream = []) => tick_stream[tick_stream.length - 1] || {};

export const isDigitContract = contract_type => /digit/i.test(contract_type);

export const getDigitInfo = (digits_info, contract_info) => {
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

const createDigitInfo = (spot, spot_time) => {
    const digit = +`${spot}`.slice(-1);

    return {
        [+spot_time]: {
            digit,
            spot,
        },
    };
};

export const getLimitOrderAmount = limit_order => {
    const {
        stop_loss: { order_amount: stop_loss_order_amount } = {},
        take_profit: { order_amount: take_profit_order_amount } = {},
    } = limit_order;

    return {
        stop_loss: stop_loss_order_amount,
        take_profit: take_profit_order_amount,
    };
};

export const getTimePercentage = (server_time, start_time, expiry_time) => {
    const duration_from_purchase = moment.duration(moment.unix(expiry_time).diff(moment.unix(start_time)));
    const duration_from_now = moment.duration(moment.unix(expiry_time).diff(server_time));
    let percentage = (duration_from_now.asMilliseconds() / duration_from_purchase.asMilliseconds()) * 100;

    if (percentage < 0.5) {
        percentage = 0;
    } else if (percentage > 100) {
        percentage = 100;
    }

    return Math.round(percentage);
};

export const getDisplayStatus = contract_info => {
    let status = 'purchased';
    if (isEnded(contract_info)) {
        status = contract_info.profit >= 0 ? 'won' : 'lost';
    }
    return status;
};
