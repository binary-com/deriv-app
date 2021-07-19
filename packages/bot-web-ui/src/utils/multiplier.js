import { getLimitOrderAmount } from '@deriv/shared';
import { connect } from 'Stores/connect';

export const getBuyPrice = contract_store => {
    return contract_store.contract_info.buy_price;
};

/**
 * Set contract update form initial values
 * @param {object} contract_update - contract_update response
 * @param {object} limit_order - proposal_open_contract.limit_order response
 */
export const getContractUpdateConfig = ({ contract_update, limit_order }) => {
    const { stop_loss, take_profit } = getLimitOrderAmount(limit_order || contract_update);

    return {
        // convert stop_loss, take_profit value to string for validation to work
        contract_update_stop_loss: stop_loss ? Math.abs(stop_loss).toString() : '',
        contract_update_take_profit: take_profit ? take_profit.toString() : '',
        has_contract_update_stop_loss: !!stop_loss,
        has_contract_update_take_profit: !!take_profit,
    };
};

// eslint-disable-next-line no-empty-pattern
export const connectWithContractUpdate = connect(({}, { contract = {} }) => {
    return {
        validation_errors: contract.validation_errors,
        contract_update_take_profit: contract.contract_update_take_profit,
        contract_update_stop_loss: contract.contract_update_stop_loss,
        has_contract_update_take_profit: contract.has_contract_update_take_profit,
        has_contract_update_stop_loss: contract.has_contract_update_stop_loss,
    };
});
