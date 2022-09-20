import React from 'react';
import classNames from 'classnames';
import { SelectField, InputField, data_fields, data_uniq_input_obj } from '.';
import { TDataFields } from './data/data-fields';
import {
    TSelectsFieldNames,
    TDropdownItems,
    TInputBaseFields,
    TInputsFieldNames,
    TDropdowns,
    TSelectedValuesSelect,
} from '../q-strategy.types';
import { TQStrategyFields } from './q-strategy-components.types';

const QStrategyFields = React.memo(
    ({
        is_mobile,
        types_strategies_dropdown,
        symbol_dropdown,
        trade_type_dropdown,
        duration_unit_dropdown,
        selected_type_strategy,
        selected_trade_type,
        selected_symbol,
        selected_duration_unit,
        onChangeDropdownItem,
        onHideDropdownList,
        setFieldValue,
        onScrollStopDropdownList,
        handleChange,
        onChangeInputValue,
        setCurrentFocus,
        values,
        description,
        errors,
    }: TQStrategyFields) => {
        const is_double_idx_ref: React.MutableRefObject<number | undefined> = React.useRef();

        const uniq_selected_input = React.useMemo(
            () => data_uniq_input_obj.filter(elem => elem.index === selected_type_strategy.index)[0],
            [selected_type_strategy]
        );

        const fields = React.useMemo(
            () =>
                data_fields.map((item, idx) => {
                    const {
                        id,
                        name,
                        field_name,
                        className,
                        label_className,
                        field_className,
                        input_value,
                        label,
                        placeholder,
                        trailing_icon_message,
                        zIndex,
                        is_able_disabled,
                    } = item as TDataFields;

                    const is_uniq_strategy_field = Array.isArray(item);
                    const is_input_field = is_uniq_strategy_field || input_value.startsWith('input_');

                    //dropdowns
                    const types_strategies_drop = name?.endsWith('types-strategies') && types_strategies_dropdown;
                    const symbol_drop = name?.endsWith('symbol') && symbol_dropdown;
                    const trade_type_drop = name?.endsWith('trade-type') && trade_type_dropdown;
                    const duration_unit_drop = name?.endsWith('duration-unit') && duration_unit_dropdown;

                    const dropdowns: TDropdowns =
                        types_strategies_drop || symbol_drop || trade_type_drop || duration_unit_drop || [];
                    const dropdown_list: TDropdowns = !is_uniq_strategy_field ? dropdowns : [];

                    //selected_items
                    const type_strategy_pick = name?.endsWith('types-strategies') && selected_type_strategy;
                    const symbol_pick = name?.endsWith('symbol') && selected_symbol;
                    const trade_type_pick = name?.endsWith('trade-type') && selected_trade_type;
                    const duration_unit_pick = name?.endsWith('duration-unit') && selected_duration_unit;

                    const selected_item =
                        type_strategy_pick || symbol_pick || trade_type_pick || duration_unit_pick || {};
                    const selected_value: Partial<TSelectedValuesSelect> = !is_uniq_strategy_field ? selected_item : {};

                    const is_base_field = !is_uniq_strategy_field && name.startsWith('base__');
                    const is_current_strategy_fields = is_base_field || is_uniq_strategy_field;

                    const is_duration_unit_field = !is_uniq_strategy_field && name.endsWith('duration-unit');
                    const is_duration_value_field = !is_uniq_strategy_field && name.endsWith('duration-value');

                    if (is_double_idx_ref.current === idx || is_duration_value_field) {
                        return false;
                    }

                    if (is_current_strategy_fields && is_input_field) {
                        is_double_idx_ref.current = idx + 1;
                    }

                    if (is_current_strategy_fields) {
                        if (is_duration_unit_field && selected_value) {
                            return (
                                <div
                                    key={idx}
                                    className={classNames('quick-strategy__form-row', {
                                        'quick-strategy__form-row--multiple': !is_mobile,
                                    })}
                                >
                                    <SelectField
                                        field_name={field_name as TSelectsFieldNames}
                                        id={id}
                                        is_mobile={is_mobile}
                                        dropdown_list={dropdown_list}
                                        selected_value={selected_value}
                                        label={label}
                                        input_value={input_value as TDropdownItems}
                                        setFieldValue={setFieldValue}
                                        className={className}
                                        is_able_disabled={is_able_disabled}
                                        values={values}
                                        onChangeDropdownItem={onChangeDropdownItem}
                                        onHideDropdownList={onHideDropdownList}
                                        onScrollStopDropdownList={onScrollStopDropdownList}
                                        selected_trade_type={selected_trade_type}
                                        selected_symbol={selected_symbol}
                                    />
                                    <InputField
                                        idx={idx}
                                        handleChange={handleChange}
                                        onChangeInputValue={onChangeInputValue}
                                        setCurrentFocus={setCurrentFocus}
                                        is_mobile={is_mobile}
                                        errors={errors}
                                    />
                                </div>
                            );
                        } else if (is_input_field) {
                            return (
                                <div
                                    key={idx}
                                    className={classNames('quick-strategy__form-row', {
                                        'quick-strategy__form-row--multiple': !is_mobile,
                                    })}
                                >
                                    <InputField
                                        idx={idx}
                                        handleChange={handleChange}
                                        onChangeInputValue={onChangeInputValue}
                                        setCurrentFocus={setCurrentFocus}
                                        is_mobile={is_mobile}
                                        field_name={field_name as TInputsFieldNames}
                                        id={id}
                                        className={className}
                                        label_className={label_className}
                                        field_className={field_className}
                                        label={label}
                                        input_value={input_value as TInputBaseFields}
                                        placeholder={placeholder}
                                        is_uniq_strategy_field={is_uniq_strategy_field}
                                        trailing_icon_message={trailing_icon_message}
                                        zIndex={zIndex}
                                        uniq_selected_input={uniq_selected_input}
                                        errors={errors}
                                    />
                                    <InputField
                                        idx={idx}
                                        handleChange={handleChange}
                                        onChangeInputValue={onChangeInputValue}
                                        setCurrentFocus={setCurrentFocus}
                                        is_mobile={is_mobile}
                                        errors={errors}
                                    />
                                </div>
                            );
                        }
                        return (
                            <div key={idx}>
                                {selected_value && (
                                    <div className='quick-strategy__form-row'>
                                        <SelectField
                                            field_name={field_name as TSelectsFieldNames}
                                            id={id}
                                            is_mobile={is_mobile}
                                            dropdown_list={dropdown_list}
                                            selected_value={selected_value}
                                            label={label}
                                            input_value={input_value as TDropdownItems}
                                            setFieldValue={setFieldValue}
                                            className={className}
                                            is_able_disabled={is_able_disabled}
                                            values={values}
                                            onChangeDropdownItem={onChangeDropdownItem}
                                            onHideDropdownList={onHideDropdownList}
                                            onScrollStopDropdownList={onScrollStopDropdownList}
                                            selected_trade_type={selected_trade_type}
                                            selected_symbol={selected_symbol}
                                        />
                                    </div>
                                )}
                                {name.endsWith('types-strategies') && (
                                    <div key='description' className='quick-strategy__description'>
                                        {description}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return false;
                }),
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [
                types_strategies_dropdown,
                symbol_dropdown,
                trade_type_dropdown,
                duration_unit_dropdown,
                selected_type_strategy,
                selected_trade_type,
                selected_symbol,
                selected_duration_unit,
                errors,
            ]
        );

        return <>{fields}</>;
    },
    (prevProps, nextProps) => prevProps.values === nextProps.values && prevProps.errors === nextProps.errors
);

QStrategyFields.displayName = 'QStrategyFields';

export default QStrategyFields;
