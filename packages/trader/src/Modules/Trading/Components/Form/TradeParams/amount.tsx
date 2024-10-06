import { AMOUNT_MAX_LENGTH, addComma, getDecimalPlaces, TRADE_TYPES } from '@deriv/shared';
import { ButtonToggle, Dropdown, InputField } from '@deriv/components';
import { localize } from '@deriv/translations';
import AllowEquals from './allow-equals';
import Fieldset from 'App/Components/Form/fieldset';
import Multiplier from './Multiplier/multiplier';
import MultipliersInfo from './Multiplier/info';
import MinMaxStakeInfo from './min-max-stake-info';
import React from 'react';
import classNames from 'classnames';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

type TInput = {
    amount: string | number;
    currency: string;
    current_focus: string | null;
    error_messages?: string[];
    is_disabled?: boolean;
    is_single_currency?: boolean;
    onChange: (e: { target: { name: string; value: number | string } }) => void;
    setCurrentFocus: (name: string | null) => void;
};

export const Input = ({
    amount,
    currency,
    current_focus,
    error_messages,
    is_single_currency,
    is_disabled,
    onChange,
    setCurrentFocus,
}: TInput) => (
    <InputField
        className='trade-container__amount'
        classNameInlinePrefix='trade-container__currency'
        classNameInput='trade-container__input'
        currency={currency}
        current_focus={current_focus}
        error_messages={error_messages}
        fractional_digits={getDecimalPlaces(currency)}
        id='dt_amount_input'
        inline_prefix={is_single_currency ? currency : undefined}
        is_autocomplete_disabled
        is_float
        is_hj_whitelisted
        is_incrementable
        is_negative_disabled
        is_disabled={is_disabled}
        max_length={AMOUNT_MAX_LENGTH}
        name='amount'
        onChange={onChange}
        type='tel'
        value={amount}
        ariaLabel={localize('Amount')}
        setCurrentFocus={setCurrentFocus}
    />
);

const Amount = observer(({ is_minimized = false }: { is_minimized?: boolean }) => {
    const { ui, client } = useStore();
    const { currencies_list, is_single_currency } = client;
    const { setCurrentFocus, current_focus } = ui;
    const {
        amount,
        basis,
        basis_list,
        contract_start_type,
        contract_type,
        contract_types_list,
        currency,
        duration_unit,
        expiry_type,
        is_accumulator,
        is_equal,
        is_multiplier,
        is_turbos,
        is_vanilla,
        has_equals_only,
        has_open_accu_contract,
        stake_boundary,
        onChange,
        validation_errors,
    } = useTraderStore();

    const { min_stake, max_stake } = stake_boundary[contract_type.toUpperCase()] || {};

    if (is_minimized) {
        return (
            <div className='fieldset-minimized fieldset-minimized__amount'>
                <span className='fieldset-minimized__basis'>{basis_list.find(o => o.value === basis)?.text}</span>
                &nbsp;
                <i>
                    <span
                        className={classNames('fieldset-minimized__currency', 'symbols', {
                            [`symbols--${(currency || '').toLowerCase()}`]: currency,
                        })}
                    />
                </i>
                {addComma(amount, 2)}
            </div>
        );
    }

    const error_messages = validation_errors?.amount;

    const getBasisList = () => basis_list.map(item => ({ text: item.text, value: item.value }));

    const changeAmount = ({ target }: { target: { name: string; value: string | number; type?: string } }) => {
        onChange({ target });
    };

    const changeAllowEquals = ({ target }: { target: { name: string; value: number } }) => {
        onChange({ target });
    };

    return (
        <Fieldset
            className='trade-container__fieldset center-text'
            header={
                contract_type === TRADE_TYPES.HIGH_LOW || is_multiplier || is_accumulator || is_vanilla || is_turbos
                    ? localize('Stake')
                    : undefined
            }
        >
            {basis_list.length > 1 && (
                <ButtonToggle
                    id='dt_amount_toggle'
                    buttons_arr={getBasisList()}
                    className='dropdown--no-margin'
                    is_animated
                    name='basis'
                    onChange={onChange}
                    value={basis}
                />
            )}
            {!is_single_currency ? (
                <div className='trade-container__currency-options'>
                    <Input
                        amount={amount}
                        currency={currency}
                        current_focus={current_focus}
                        error_messages={error_messages}
                        is_single_currency={is_single_currency}
                        onChange={changeAmount}
                        setCurrentFocus={setCurrentFocus}
                    />
                    <Dropdown
                        className={classNames({ 'dc-dropdown-container__currency': !is_single_currency })}
                        is_alignment_left
                        is_nativepicker={false}
                        list={currencies_list}
                        name='currency'
                        initial_offset={256}
                        no_border={true}
                        value={currency}
                        onChange={onChange}
                    />
                </div>
            ) : (
                <Input
                    amount={amount}
                    currency={currency}
                    current_focus={current_focus}
                    error_messages={error_messages}
                    is_single_currency={is_single_currency}
                    is_disabled={has_open_accu_contract}
                    onChange={changeAmount}
                    setCurrentFocus={setCurrentFocus}
                />
            )}
            <AllowEquals
                contract_start_type={contract_start_type}
                contract_type={contract_type}
                contract_types_list={contract_types_list}
                duration_unit={duration_unit}
                expiry_type={expiry_type}
                onChange={changeAllowEquals}
                value={Number(is_equal)}
                has_equals_only={has_equals_only}
            />
            {is_multiplier && (
                <React.Fragment>
                    <Multiplier />
                    <MultipliersInfo
                        className='trade-container__multipliers-trade-info'
                        should_show_tooltip
                        is_tooltip_relative
                    />
                </React.Fragment>
            )}
            {(is_turbos || is_vanilla) && (
                <MinMaxStakeInfo currency={currency} max_stake={max_stake} min_stake={min_stake} />
            )}
        </Fieldset>
    );
});

export default Amount;
