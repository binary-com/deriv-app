import CurrencyUtils from '@deriv/shared/utils/currency';
import ObjectUtils from '@deriv/shared/utils/object';
import { isVisible } from '_common/common_functions';
import { convertToUnix, toMoment } from 'Utils/Date';

const map_error_field = {
    barrier: 'barrier_1',
    barrier2: 'barrier_2',
    date_expiry: 'expiry_date',
};

export const getProposalErrorField = response => {
    const error_field = ObjectUtils.getPropertyValue(response, ['error', 'details', 'field']);
    if (!error_field) {
        return null;
    }
    const error_id = map_error_field[error_field] || error_field;
    const el_error = document.getElementsByName(error_id)[0];
    return el_error && isVisible(el_error) ? error_id : null;
};

export const getProposalInfo = (store, response, obj_prev_contract_basis) => {
    const proposal = response.proposal || {};
    const profit = proposal.payout - proposal.ask_price || 0;
    const returns = (profit * 100) / (proposal.ask_price || 1);
    const stake = proposal.display_value;
    const basis_list = store.basis_list;

    const contract_basis = basis_list.find(o => o.value !== store.basis) || {};
    const is_stake = contract_basis.text === 'Stake';
    const price = is_stake ? stake : proposal[contract_basis.value];
    let has_increased = price > obj_prev_contract_basis.value;

    if (!obj_prev_contract_basis.value || price === obj_prev_contract_basis.value) {
        has_increased = null;
    }

    const obj_contract_basis = {
        text: contract_basis.text || '',
        value: price || '',
    };

    const commission = proposal.commission;
    const cancellation = proposal.cancellation;

    return {
        commission,
        cancellation,
        id: proposal.id || '',
        has_error: !!response.error,
        has_error_details: !!getProposalErrorField(response),
        has_increased,
        limit_order: proposal.limit_order,
        message: proposal.longcode || response.error.message,
        obj_contract_basis,
        payout: proposal.payout,
        profit: profit.toFixed(CurrencyUtils.getDecimalPlaces(store.currency)),
        returns: `${returns.toFixed(2)}%`,
        stake,
    };
};

export const createProposalRequests = store => {
    const requests = {};

    Object.keys(store.trade_types).forEach(type => {
        const new_req = createProposalRequestForContract(store, type);
        requests[type] = new_req;
    });

    return requests;
};

const setProposalMultiplier = (store, obj_multiplier) => {
    obj_multiplier.multiplier = store.multiplier;
    // TODO: add support for different cancellation time once API is ready
    obj_multiplier.cancellation = store.has_cancellation ? '1h' : 0;

    obj_multiplier.limit_order = {};

    if (store.has_take_profit) {
        obj_multiplier.limit_order.take_profit = +store.take_profit; // send positive take_profit to API
    }

    if (store.has_stop_loss) {
        obj_multiplier.limit_order.stop_loss = +store.stop_loss; // send positive stop_loss to API
    }
};

const createProposalRequestForContract = (store, type_of_contract) => {
    const obj_expiry = {};
    const obj_multiplier = {};

    if (store.expiry_type === 'endtime') {
        const expiry_date = toMoment(store.expiry_date);
        obj_expiry.date_expiry = convertToUnix(expiry_date.unix(), store.expiry_time);
    }

    if (store.is_multiplier) {
        setProposalMultiplier(store, obj_multiplier);
    }

    return {
        proposal: 1,
        subscribe: 1,
        amount: parseFloat(store.amount),
        basis: store.basis,
        contract_type: type_of_contract,
        currency: store.root_store.client.currency,
        symbol: store.symbol,
        ...(store.start_date && { date_start: convertToUnix(store.start_date, store.start_time) }),
        ...(store.expiry_type === 'duration'
            ? {
                  duration: parseInt(store.duration),
                  duration_unit: store.duration_unit,
              }
            : obj_expiry),
        ...((store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) && {
            barrier: store.barrier_1 || store.last_digit,
        }),
        ...(store.barrier_count === 2 && { barrier2: store.barrier_2 }),
        ...obj_multiplier,
    };
};
