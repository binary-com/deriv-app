import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {
    getCancellationPrice,
    getContractUpdateConfig,
    getLimitOrderAmount,
    isCryptocurrency,
    isDeepEqual,
    pick,
    getTotalProfit,
} from '@deriv/shared';
import Button from '../../button';
import Icon from '../../icon';
import MobileWrapper from '../../mobile-wrapper';
import Money from '../../money';
import InputWithCheckbox from '../../input-wth-checkbox';

const ContractUpdateForm = props => {
    const {
        addToast,
        contract,
        current_focus,
        error_message_alignment,
        getCardLabels,
        onMouseLeave,
        removeToast,
        setCurrentFocus,
        status,
        toggleDialog,
    } = props;

    React.useEffect(() => {
        return () => contract.clearContractUpdateConfigValues();
    }, []);

    const {
        contract_info,
        contract_update_take_profit,
        has_contract_update_take_profit,
        contract_update_stop_loss,
        has_contract_update_stop_loss,
        updateLimitOrder,
        validation_errors,
    } = contract;

    const { buy_price, currency, is_valid_to_cancel, is_sold } = contract_info;
    const { stop_loss, take_profit } = getLimitOrderAmount(contract_info.limit_order);
    const {
        contract_update_stop_loss: stop_loss_error,
        contract_update_take_profit: take_profit_error,
    } = validation_errors;
    const error_messages = {
        take_profit: has_contract_update_take_profit ? take_profit_error : undefined,
        stop_loss: has_contract_update_stop_loss ? stop_loss_error : undefined,
    };
    const has_validation_errors = Object.keys(error_messages).some(field => error_messages[field]?.length);

    const isValid = val => !(val === undefined || val === null);

    const is_take_profit_valid = has_contract_update_take_profit ? contract_update_take_profit > 0 : isValid(stop_loss);
    const is_stop_loss_valid = has_contract_update_stop_loss ? contract_update_stop_loss > 0 : isValid(take_profit);
    const is_valid_contract_update = is_valid_to_cancel ? false : !!(is_take_profit_valid || is_stop_loss_valid);

    const getStateToCompare = _state => {
        const props_to_pick = [
            'has_contract_update_take_profit',
            'has_contract_update_stop_loss',
            _state.has_contract_update_take_profit && 'contract_update_take_profit',
            _state.has_contract_update_stop_loss && 'contract_update_stop_loss',
        ];

        return pick(_state, props_to_pick);
    };

    const isStateUnchanged = () => {
        return isDeepEqual(getStateToCompare(getContractUpdateConfig(contract_info)), getStateToCompare(props));
    };

    const onChange = e => {
        const { name, value } = e.target;

        if (typeof contract.onChange === 'function') {
            contract.onChange({
                name,
                value,
            });
        }
    };

    const onClick = e => {
        updateLimitOrder();
        toggleDialog(e);
        onMouseLeave?.();
    };

    const take_profit_input = (
        <InputWithCheckbox
            addToast={addToast}
            removeToast={removeToast}
            current_focus={current_focus}
            classNameInlinePrefix='dc-contract-card-dialog__input--currency'
            currency={currency}
            error_messages={error_messages.take_profit}
            is_single_currency={true}
            is_negative_disabled={true}
            defaultChecked={has_contract_update_take_profit}
            label={getCardLabels().TAKE_PROFIT}
            name='contract_update_take_profit'
            onChange={onChange}
            error_message_alignment={error_message_alignment || 'right'}
            value={contract_update_take_profit}
            is_disabled={!!is_valid_to_cancel}
            setCurrentFocus={setCurrentFocus}
        />
    );

    const stop_loss_input = (
        <InputWithCheckbox
            addToast={addToast}
            removeToast={removeToast}
            current_focus={current_focus}
            classNameInlinePrefix='dc-contract-card-dialog__input--currency'
            currency={currency}
            defaultChecked={has_contract_update_stop_loss}
            error_messages={error_messages.stop_loss}
            is_single_currency={true}
            is_negative_disabled={true}
            label={getCardLabels().STOP_LOSS}
            max_value={buy_price - cancellation_price}
            name='contract_update_stop_loss'
            onChange={onChange}
            error_message_alignment={error_message_alignment || 'right'}
            value={contract_update_stop_loss}
            is_disabled={!!is_valid_to_cancel}
            setCurrentFocus={setCurrentFocus}
        />
    );

    const cancellation_price = getCancellationPrice(contract_info);
    const total_profit = getTotalProfit(contract_info);

    return (
        <React.Fragment>
            <MobileWrapper>
                <div className='dc-contract-card-dialog__total-profit'>
                    <span>{getCardLabels().TOTAL_PROFIT_LOSS}</span>
                    <div
                        className={classNames(
                            'dc-contract-card__profit-loss dc-contract-card-item__total-profit-loss-value',
                            {
                                'dc-contract-card__profit-loss--is-crypto': isCryptocurrency(currency),
                                'dc-contract-card__profit-loss--negative': total_profit < 0,
                                'dc-contract-card__profit-loss--positive': total_profit > 0,
                            }
                        )}
                    >
                        <Money amount={total_profit} currency={currency} />
                        <div
                            className={classNames('dc-contract-card__indicative--movement', {
                                'dc-contract-card__indicative--movement-complete': is_sold,
                            })}
                        >
                            {status === 'profit' && <Icon icon='IcProfit' />}
                            {status === 'loss' && <Icon icon='IcLoss' />}
                        </div>
                    </div>
                </div>
            </MobileWrapper>
            <div className='dc-contract-card-dialog__form'>
                <div className='dc-contract-card-dialog__input'>{take_profit_input}</div>
                <div className='dc-contract-card-dialog__input'>{stop_loss_input}</div>
                <div className='dc-contract-card-dialog__button'>
                    <Button
                        text={getCardLabels().APPLY}
                        onClick={onClick}
                        primary
                        is_disabled={has_validation_errors || !is_valid_contract_update || isStateUnchanged()}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

ContractUpdateForm.propTypes = {
    addToast: PropTypes.func,
    contract: PropTypes.object,
    current_focus: PropTypes.string,
    error_message_alignment: PropTypes.string,
    getCardLabels: PropTypes.func,
    onMouseLeave: PropTypes.func,
    removeToast: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    status: PropTypes.string,
    toggleDialog: PropTypes.func,
};

export default ContractUpdateForm;
