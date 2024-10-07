import React from 'react';

type TExtraFilterMessage = {
    currency: string;
    profit: number;
};
type TExtraJournal = {
    longcode: string;
    transaction_id: number;
};

export type TDateItemProps = Record<'date' | 'time', string>;

export type TFilterMessageValues = {
    className: string;
    date: string;
    extra: TExtraFilterMessage | TExtraJournal;
    message: string | ((value: () => void) => string);
    message_type: string;
    time: string;
    unique_id: string;
};

type TFilterMessageProps = Array<TFilterMessageValues> | TFilterMessageValues;

type TKeyFilters = 'error' & 'notify' & 'success';
type TValuesFilters = 'Errors' & 'Notifications' & 'System';

type TFilters = Array<{ id: TKeyFilters; label: TValuesFilters }>;
export type TCheckedFilters = Record<'error' | 'notify' | 'success', string[]>;

export type TFilterDialogProps = {
    toggle_ref: React.RefObject<HTMLDivElement>;
    checked_filters: TCheckedFilters;
    filters: TFilters;
    filterMessage: () => TFilterMessageProps;
    is_filter_dialog_visible: boolean;
    toggleFilterDialog: () => void;
};

export type TJournalToolsProps = {
    checked_filters: TCheckedFilters;
    filters: TFilters;
    filterMessage: () => TFilterMessageProps;
    is_filter_dialog_visible: boolean;
    toggleFilterDialog: () => void;
};

export type TFiltersProps = {
    wrapper_ref: React.RefObject<HTMLDivElement>;
    checked_filters: TCheckedFilters;
    filters: TFilters;
    filterMessage: (checked: boolean, item_id: number) => TFilterMessageProps;
    className: string;
    classNameLabel?: string;
};

export type TJournalProps = {
    contract_stage: number;
    filtered_messages: TFilterMessageProps | [];
    is_drawer_open: boolean;
    is_stop_button_visible: boolean;
    unfiltered_messages: TFilterMessageProps;
    checked_filters: TCheckedFilters;
    filterMessage: () => TFilterMessageProps;
    filters: TFilters;
    is_filter_dialog_visible: boolean;
    toggleFilterDialog: () => void;
};

export type TJournalItemProps = {
    row: TFilterMessageValues;
    is_new_row: boolean;
    measure: () => void;
};

export type TJournalItemExtra = TExtraFilterMessage & TExtraJournal & { sold_for: string; current_currency?: string };

export type TFormatMessageProps = {
    logType: string;
    className: string;
    extra: TJournalItemExtra;
};

export type TJournalDataListArgs = {
    is_new_row: boolean;
    is_scrolling: boolean;
    measure: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passthrough?: any;
    row: TFilterMessageValues;
};
