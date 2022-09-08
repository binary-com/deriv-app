import { FormikProps } from 'formik';
import {
    TCreateStrategy,
    TDurationUnitDropdown,
    TTypeStrategiesDropdown,
    TOnChangeDropdownItem,
    TOnChangeInputValue,
    TOnHideDropdownList,
    TOnScrollStopDropdownList,
    TSymbolDropdown,
    TTradeTypeDropdown,
    TTradeType,
    TDurationOptions,
    TSetCurrentFocus,
    TTypeStrategy,
    TSetFieldValue,
    TFormValues,
    TMarketOption,
    TGetSizeDesc,
    TInitialValues,
    TQuickStrategyFormValues,
    TSelectsFieldNames,
    TDropdowns,
    TSelectedValuesSelect,
    TDropdownItems,
    TInputBaseFields,
    TInputsFieldNames,
} from '../q-strategy.types';
import { TDataUniqInput } from './data/data-uniq-input-obj';
import { TCommonInputsProperties } from './data/common-input-properties';

export type TQStrategyForm = {
    active_index: number;
    createStrategy: TCreateStrategy;
    duration_unit_dropdown: TDurationUnitDropdown;
    types_strategies_dropdown: TTypeStrategiesDropdown;
    initial_values: TQuickStrategyFormValues | (TQuickStrategyFormValues & TInitialValues);
    getSizeDesc: TGetSizeDesc;
    is_onscreen_keyboard_active: boolean;
    is_stop_button_visible: boolean;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onChangeInputValue: TOnChangeInputValue;
    onHideDropdownList: TOnHideDropdownList;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    symbol_dropdown: TSymbolDropdown;
    trade_type_dropdown: TTradeTypeDropdown;
    is_mobile: boolean;
    selected_symbol: TMarketOption;
    selected_trade_type: TTradeType;
    selected_duration_unit: TDurationOptions;
    setCurrentFocus: TSetCurrentFocus;
    selected_type_strategy: TTypeStrategy;
    description: string;
};

export type TQStrategyFields = {
    is_mobile: boolean;
    types_strategies_dropdown: TTypeStrategiesDropdown;
    symbol_dropdown: TSymbolDropdown;
    trade_type_dropdown: TTradeTypeDropdown;
    duration_unit_dropdown: TDurationUnitDropdown;
    selected_type_strategy: TTypeStrategy;
    selected_trade_type: TTradeType;
    selected_symbol: TMarketOption;
    selected_duration_unit: TDurationOptions;
    onChangeDropdownItem: TOnChangeDropdownItem;
    onHideDropdownList: TOnHideDropdownList;
    setFieldValue: TSetFieldValue;
    onScrollStopDropdownList: TOnScrollStopDropdownList;
    handleChange: FormikProps<TFormValues>['handleChange'];
    onChangeInputValue: TOnChangeInputValue;
    setCurrentFocus: TSetCurrentFocus;
    values: TFormValues;
    description: string;
};

export type TQStrategyFooter = {
    is_onscreen_keyboard_active: boolean;
    is_mobile: boolean;
    is_submit_enabled: boolean;
    is_stop_button_visible: boolean;
    setFieldValue: TSetFieldValue;
    submitForm: FormikProps<TFormValues>['submitForm'];
};

export type TSelectFieldProps = {
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

export type TInputFieldProps = {
    idx?: number;
    handleChange: FormikProps<TFormValues>['handleChange'];
    onChangeInputValue: TOnChangeInputValue;
    setCurrentFocus: TSetCurrentFocus;
    is_mobile: boolean;
    field_name?: TInputsFieldNames;
    id?: string;
    label?: string;
    input_value?: TInputBaseFields;
    placeholder?: string;
    isUniqStrategyField?: boolean;
    trailing_icon_message?: string;
    uniq_selected_input?: TDataUniqInput;
} & TCommonInputsProperties;

export type TTradeTypeOptionProps = {
    trade_type: TTradeType;
};

export type TMarketOptionProps = {
    symbol: TMarketOption;
};
