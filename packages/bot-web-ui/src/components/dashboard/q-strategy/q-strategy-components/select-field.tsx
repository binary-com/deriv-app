import { Field, FieldProps } from 'formik';
import React from 'react';
import { Autocomplete, SelectNative, Icon, IconTradeTypes, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import {
    TFormValues,
    TSelectsFieldNames,
    TDropdowns,
    TSelectedValuesSelect,
    TTradeType,
    TDropdownItems,
    TSetFieldValue,
    TOnChangeDropdownItem,
    TOnHideDropdownList,
    TOnScrollStopDropdownList,
    TMarketOption,
} from '../q-strategy.types';

type TSelectField = {
    field_name: TSelectsFieldNames;
    id: string;
    is_mobile: boolean;
    getDropdownList: TDropdowns;
    getSelectedValue: TSelectedValuesSelect;
    label: string;
    input_value: TDropdownItems;
    setFieldValue: TSetFieldValue;
    className?: string;
    is_able_disabled?: boolean;
    values: TFormValues;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onHideDropdownList: TOnHideDropdownList;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    selected_trade_type: TTradeType;
    selected_symbol: TMarketOption;
};

const SelectField = ({
    field_name,
    id,
    is_mobile,
    getDropdownList,
    getSelectedValue,
    label,
    input_value,
    setFieldValue,
    className,
    is_able_disabled,
    values,
    onChangeDropdownItem,
    onHideDropdownList,
    onScrollStopDropdownList,
    selected_trade_type,
    selected_symbol,
}: TSelectField) => (
    <Field name={field_name} key={id}>
        {({ field }: FieldProps<string, TFormValues>) => {
            return (
                <>
                    {is_mobile ? (
                        <SelectNative
                            list_items={getDropdownList}
                            value={typeof getSelectedValue === 'string' ? getSelectedValue : getSelectedValue.value}
                            label={localize(label)}
                            should_show_empty_option={false}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                onChangeDropdownItem(input_value, e.target.value, setFieldValue);
                            }}
                        />
                    ) : (
                        <Autocomplete
                            {...field}
                            autoComplete='off'
                            className={className}
                            type='text'
                            label={localize(label)}
                            list_items={getDropdownList}
                            disabled={is_able_disabled && getDropdownList?.length === 1}
                            onHideDropdownList={() => {
                                onHideDropdownList(
                                    input_value,
                                    values[field.name] as TSelectsFieldNames,
                                    setFieldValue
                                );
                            }}
                            onItemSelection={({ value }: { value: string }) => {
                                onChangeDropdownItem(input_value, value, setFieldValue);
                            }}
                            onScrollStop={() => onScrollStopDropdownList(input_value)}
                            leading_icon={
                                (input_value === 'trade-type' && selected_trade_type?.icon && (
                                    <Text>
                                        <IconTradeTypes type={selected_trade_type?.icon[0]} />
                                        <IconTradeTypes type={selected_trade_type?.icon[1]} />
                                    </Text>
                                )) ||
                                (input_value === 'symbol' && (selected_symbol?.value as string) && (
                                    <Icon icon={`IcUnderlying${selected_symbol?.value}`} size={24} />
                                ))
                            }
                        />
                    )}
                </>
            );
        }}
    </Field>
);

export default SelectField;
