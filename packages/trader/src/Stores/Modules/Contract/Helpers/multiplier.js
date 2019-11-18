export const isMultiplierContract = (contract_type) => /MULT/i.test(contract_type);

export const getCommission = ({ commission, amount, multiplier }) => {
    return (commission * amount * multiplier) / 100;
};

/**
 * Parse take_profit and stop_loss order amount from proposal_open_contract response
 * @param {object} contract_info - proposal_open_contract response
 */
export const getOrderAmount = (contract_info) => {
    const {
        limit_order: {
            stop_loss: {
                order_amount: stop_loss_order_amount,
            } = {},
            take_profit: {
                order_amount: take_profit_order_amount,
            } = {},
        } = {},
    } = contract_info;

    return {
        stop_loss  : stop_loss_order_amount,
        take_profit: take_profit_order_amount,
    };
};

/**
 * Set contract_update initial inital values
 * @param {object} store - trade store
 * @param {object} contract_info - proposal_open_contract response
 */
export const getMultiplierContractUpdate = (store, contract_info) => {
    const { stop_loss, take_profit } = getOrderAmount(contract_info);

    return {
        // convert stop_loss, take_profit value to string for validation to work
        stop_loss      : stop_loss ? Math.abs(stop_loss).toString() : '',
        take_profit    : take_profit ? take_profit.toString() : '',
        has_stop_loss  : !!stop_loss,
        has_take_profit: !!take_profit,
    };
};

/**
 * Get limit_order from input for contract_update API
 * @param {object} contract_update - contract_update input & checkbox values
 */
export const getMultiplierLimitOrder = (contract_update) => {
    const {
        has_stop_loss,
        has_take_profit,
        stop_loss,
        take_profit,
    } = contract_update;

    const has_limit_order = take_profit > 0 || stop_loss > 0;

    if (!has_limit_order) {
        return null;
    }

    const limit_order = {};

    if (take_profit > 0) {
        // send positive take_profit to update or null cancel
        limit_order.take_profit = has_take_profit ? +take_profit : null;
    }

    if (stop_loss > 0) {
        // send negative stop_loss to update or null to cancel
        limit_order.stop_loss = has_stop_loss ? -stop_loss : null;
    }

    return limit_order;
};

/**
 * Set contract_update values from input
 * @param {object} store - trade store
 * @param {object} contract_update - old contract_update values
 * @param {object} new_contract_update_values - new contract_update values
 */
export const setMultiplierContractUpdate = (store, contract_update, new_contract_update_values) => {
    const { stop_loss, take_profit, has_stop_loss, has_take_profit } = new_contract_update_values;

    if (stop_loss !== undefined) {
        contract_update.stop_loss = stop_loss;
        store.contract_update_stop_loss = stop_loss;
    }
    if (take_profit !== undefined) {
        contract_update.take_profit = take_profit;
        store.contract_update_take_profit = take_profit;
    }
    if (has_stop_loss !== undefined) {
        contract_update.has_stop_loss = has_stop_loss;
        if (!has_stop_loss) {
            store.validation_errors.contract_update_stop_loss = [];
        }
    }
    if (has_take_profit !== undefined) {
        contract_update.has_take_profit = has_take_profit;
        if (!has_take_profit) {
            store.validation_errors.contract_update_take_profit = [];
        }
    }
};

export const LIMIT_ORDER_TYPES = {
    TAKE_PROFIT: 'take_profit',
    STOP_LOSS  : 'stop_loss',
    STOP_OUT   : 'stop_out',
};
