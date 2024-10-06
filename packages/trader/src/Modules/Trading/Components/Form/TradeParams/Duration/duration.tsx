import classNames from 'classnames';
import React from 'react';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset';
import RangeSlider from 'App/Components/Form/RangeSlider';
import { Dropdown } from '@deriv/components';
import { toMoment, isVanillaContract } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import DurationToggle from './duration-toggle';
import AdvancedDuration from './advanced-duration';
import SimpleDuration from './simple-duration';

type TUIStore = ReturnType<typeof useStore>['ui'];
type TTradeStore = ReturnType<typeof useTraderStore>;
export type TDuration = {
    advanced_duration_unit: TUIStore['advanced_duration_unit'];
    advanced_expiry_type: TUIStore['advanced_expiry_type'];
    contract_type: TTradeStore['contract_type'];
    duration: TTradeStore['duration'];
    duration_t: TUIStore['duration_t'];
    duration_unit: TTradeStore['duration_unit'];
    duration_units_list: TTradeStore['duration_units_list'];
    expiry_date: TTradeStore['expiry_date'];
    expiry_epoch: TTradeStore['expiry_epoch'];
    expiry_time: TTradeStore['expiry_time'];
    expiry_type: TTradeStore['expiry_type'];
    getDurationFromUnit: TUIStore['getDurationFromUnit'];
    hasDurationUnit: (duration_type: string, is_advanced: boolean) => boolean;
    is_advanced_duration: TUIStore['is_advanced_duration'];
    is_minimized?: boolean;
    max_value: number | null;
    min_value: number | null;
    onChange: TTradeStore['onChange'];
    onChangeMultiple: TTradeStore['onChangeMultiple'];
    onChangeUiStore: TUIStore['onChangeUiStore'];
    server_time?: moment.MomentInput;
    simple_duration_unit: TUIStore['simple_duration_unit'];
    start_date: TTradeStore['start_date'];
};

const Duration = ({
    advanced_duration_unit,
    advanced_expiry_type,
    contract_type,
    duration_t,
    duration_unit,
    duration_units_list,
    duration,
    expiry_date,
    expiry_epoch,
    expiry_time,
    expiry_type,
    getDurationFromUnit,
    hasDurationUnit,
    is_advanced_duration,
    is_minimized,
    max_value,
    min_value,
    onChange,
    onChangeMultiple,
    onChangeUiStore,
    server_time,
    simple_duration_unit,
    start_date,
}: TDuration) => {
    React.useEffect(() => {
        if (isVanillaContract(contract_type)) {
            onToggleDurationType({ target: { value: true, name: 'is_advanced_duration' } });
        }
    }, [contract_type]);

    const expiry_list = [{ text: localize('Duration'), value: 'duration' }];

    const has_end_time = expiry_list.find(expiry => expiry.value === 'endtime');
    if (duration_units_list.length === 1 && duration_unit === 't') {
        if (has_end_time) {
            expiry_list.pop(); // remove end time for contracts with only tick duration
        }
    } else if (!has_end_time) {
        expiry_list.push({ text: localize('End time'), value: 'endtime' });
    }

    if (is_minimized) {
        const moment_expiry = toMoment(expiry_date);
        const duration_unit_text = duration_units_list.find(({ value }) => value === duration_unit)?.text ?? '';
        return (
            <div className='fieldset-minimized fieldset-minimized__duration'>
                {expiry_type === 'duration'
                    ? `${duration} ${duration_unit_text}`
                    : `${moment_expiry.format('ddd - DD MMM, YYYY')}\n${expiry_time}`}
            </div>
        );
    }

    const changeDurationUnit = ({ target }: { target: { name: string; value: string } }) => {
        const { name, value } = target;
        const duration_value = getDurationFromUnit(value);

        onChangeUiStore({ name, value });
        onChangeMultiple({
            duration_unit: value,
            duration: Number(duration_value),
        });
    };

    const changeDurationValue = ({ target }: { target: { name: string; value: string | number; type?: string } }) => {
        const { name, value } = target;
        const duration_name = `duration_${is_advanced_duration ? advanced_duration_unit : simple_duration_unit}`;

        // e.target.value returns string, we need to convert them to number
        onChangeUiStore({ name: duration_name, value: +value });
        onChange({ target: { name, value: +value } });
    };

    const onToggleDurationType = ({ target }: { target: { name: string; value: boolean } }) => {
        const { name, value: is_advanced } = target;
        onChangeUiStore({ name, value: is_advanced });

        // replace selected duration unit and duration if the contract doesn't have that duration unit
        let current_duration_unit = is_advanced ? advanced_duration_unit : simple_duration_unit;
        const duration_value = getDurationFromUnit(current_duration_unit);
        if (!hasDurationUnit(current_duration_unit, is_advanced)) {
            current_duration_unit = duration_units_list[0].value;
            onChangeUiStore({
                name: `${is_advanced ? 'advanced' : 'simple'}_duration_unit`,
                value: current_duration_unit,
            });
        }

        const new_trade_store_values: Record<string, string | number> = {};

        // simple only has expiry type of duration
        if (!is_advanced && expiry_type !== 'duration') {
            new_trade_store_values.expiry_type = 'duration';
        }
        if (is_advanced && expiry_type !== advanced_expiry_type) {
            new_trade_store_values.expiry_type = advanced_expiry_type;
        }

        const has_same_duration = current_duration_unit === duration_unit && Number(duration_value) === duration;
        if (!has_same_duration) {
            new_trade_store_values.duration_unit = current_duration_unit;
            new_trade_store_values.duration = duration_value;
        }

        const should_update_trade_store = Object.keys(new_trade_store_values).length;
        if (should_update_trade_store) {
            onChangeMultiple({ ...new_trade_store_values });
        }
    };

    const passthrough_props = {
        shared_input: {
            is_hj_whitelisted: true,
            onChange: changeDurationValue,
            max_value: Number(max_value),
            min_value: Number(min_value),
        },
        number_input: {
            type: 'number',
            is_incrementable: true,
        },
    };

    // e.g. digit contracts only has range slider - does not have toggle between advanced / simple
    const has_toggle = expiry_list.length > 1 || duration_units_list.length > 1;

    return (
        <Fieldset
            className={classNames('trade-container__fieldset', {
                'trade-container__fieldset--advanced': is_advanced_duration,
            })}
        >
            {duration_units_list.length === 1 && !is_advanced_duration && (
                <Dropdown
                    classNameDisplay='dc-dropdown__display--duration'
                    disabled={false}
                    is_alignment_left
                    is_nativepicker={false}
                    list={duration_units_list}
                    name='simple_duration_unit'
                    no_border={true}
                    onChange={changeDurationUnit}
                    value={simple_duration_unit}
                />
            )}
            {!has_toggle && <RangeSlider name='duration' value={duration_t} {...passthrough_props.shared_input} />}
            {has_toggle && (
                <>
                    {is_advanced_duration && (
                        <AdvancedDuration
                            advanced_duration_unit={advanced_duration_unit}
                            advanced_expiry_type={advanced_expiry_type}
                            changeDurationUnit={changeDurationUnit}
                            duration_t={duration_t}
                            duration_units_list={duration_units_list}
                            expiry_date={expiry_date}
                            expiry_epoch={expiry_epoch}
                            expiry_list={expiry_list}
                            expiry_type={expiry_type}
                            getDurationFromUnit={getDurationFromUnit}
                            number_input_props={passthrough_props.number_input}
                            onChange={onChange}
                            onChangeUiStore={onChangeUiStore}
                            server_time={server_time}
                            shared_input_props={passthrough_props.shared_input}
                            start_date={start_date}
                        />
                    )}
                    {!is_advanced_duration && (
                        <SimpleDuration
                            getDurationFromUnit={getDurationFromUnit}
                            changeDurationUnit={changeDurationUnit}
                            duration_t={duration_t}
                            duration_units_list={duration_units_list}
                            number_input_props={passthrough_props.number_input}
                            shared_input_props={passthrough_props.shared_input}
                            simple_duration_unit={simple_duration_unit}
                        />
                    )}
                    {!isVanillaContract(contract_type) && (
                        <DurationToggle
                            name={'is_advanced_duration'}
                            onChange={onToggleDurationType}
                            value={is_advanced_duration}
                        />
                    )}
                </>
            )}
        </Fieldset>
    );
};

export default Duration;
