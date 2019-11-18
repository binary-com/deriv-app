import React             from 'react';
import PropTypes         from 'prop-types';
import { Button }        from 'deriv-components';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';
import { localize }      from 'App/i18n';
import { connect }       from 'Stores/connect';

const ContractUpdateForm = ({
    contract_id,
    getContractById,
    toggleDialog,
    validation_errors = {},
}) => {
    const {
        currency,
        has_stop_loss,
        has_take_profit,
        onClickContractUpdate,
        onChangeContractUpdate,
        stop_loss,
        take_profit,
    } = getContractById(contract_id).contract_update;

    const onChange = (e) => {
        const { name, value } = e.target;
        
        const limit_order = {};
        if (name === 'contract_update_take_profit') {
            limit_order.take_profit = value;
        }
        if (name === 'contract_update_stop_loss') {
            limit_order.stop_loss = value;
        }
        if (name === 'has_contract_update_take_profit') {
            limit_order.has_take_profit = value;
        }
        if (name === 'has_contract_update_stop_loss') {
            limit_order.has_stop_loss = value;
        }

        onChangeContractUpdate(limit_order, contract_id);
    };

    const onClick = () => {
        onClickContractUpdate(contract_id);
        toggleDialog();
    };

    const is_disabled = !(stop_loss > 0 || take_profit > 0);

    const {
        contract_update_stop_loss  : stop_loss_error_messages,
        contract_update_take_profit: take_profit_error_messages,
    } = validation_errors;

    return (
        <React.Fragment>
            <div className='positions-drawer-dialog__input'>
                <InputWithCheckbox
                    classNameInlinePrefix='trade-container__currency'
                    currency={currency}
                    error_messages={has_take_profit ? take_profit_error_messages : undefined}
                    is_single_currency={true}
                    is_negative_disabled={true}
                    defaultChecked={has_take_profit}
                    label={localize('Take profit')}
                    name='contract_update_take_profit'
                    onChange={onChange}
                    value={take_profit}
                />
            </div>
            <div className='positions-drawer-dialog__input'>
                <InputWithCheckbox
                    classNameInlinePrefix='trade-container__currency'
                    currency={currency}
                    defaultChecked={has_stop_loss}
                    error_messages={has_stop_loss ? stop_loss_error_messages : undefined}
                    is_single_currency={true}
                    is_negative_disabled={true}
                    label={localize('Stop loss')}
                    name='contract_update_stop_loss'
                    onChange={onChange}
                    value={stop_loss}
                />
            </div>
            <div className='positions-drawer-dialog__button'>
                <Button
                    text={localize('Apply')}
                    onClick={onClick}
                    primary
                    is_disabled={is_disabled}
                />
            </div>
        </React.Fragment>
    );
};

ContractUpdateForm.propTypes = {
    contract_id           : PropTypes.number,
    currency              : PropTypes.string,
    has_stop_loss         : PropTypes.bool,
    has_take_profit       : PropTypes.bool,
    onChangeContractUpdate: PropTypes.func,
    onClickContractUpdate : PropTypes.func,
    stop_loss             : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    take_profit           : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    validation_errors     : PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        getContractById  : modules.contract_replay.getContractById,
        validation_errors: modules.trade.validation_errors,
    })
)(ContractUpdateForm);
