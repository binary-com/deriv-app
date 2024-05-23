import { ReactNode } from 'react';

export type TDurationItemRaw = {
    display: string;
    unit: string;
    min: number;
    max: number;
};

export type TFormData = {
    [key: string]: string | number | boolean;
};

export type TValidationType = 'min' | 'max' | 'required' | 'number' | 'ceil' | 'floor' | 'integer';

export interface ValidationObject {
    getMessage: (min: number | string) => string;
}

export type TValidationItem =
    | TValidationType
    | ({
          type: TValidationType;
          value: number | string;
      } & ValidationObject);

export type TStrategyDescription = {
    item: TDescriptionItem;
    font_size: string;
};

export type TConfigItem = Partial<{
    type: string;
    name: keyof TFormData;
    dependencies: string[];
    label: string;
    description: string;
    attached: boolean;
    hide: string[];
    validation: TValidationItem[];
    should_have: {
        key: string;
        value: string | number | boolean;
        multiple?: Array<string>;
    }[];
    hide_without_should_have: boolean;
    has_currency_unit: boolean;
}>;

export type TDescriptionItem = Partial<{
    type: string;
    content: string[];
    src: string;
    alt: string;
    className: string;
    expanded: boolean;
    no_collapsible: boolean;
    font_size: string;
    id: number;
    dark_src?: string;
    styles?: { [key: string]: string };
}>;
export type TDescription = TDescriptionItem[] | TDescriptionItem[][];

export type TStrategy = {
    name: string;
    label: string;
    description: TDescriptionItem[];
    fields: TConfigItem[][];
    rs_strategy_name?: TRsStrategyName;
};

export type TStrategies = {
    [key: string]: TStrategy;
};

export type TShouldHave = {
    key: string;
    value: string | number | boolean;
    multiple?: Array<string>;
};

export type TDropdownItems = {
    text: string;
    value: string;
};

export type TDurationUnitItem = {
    text: string;
    value: string;
    min: number;
    max: number;
    display?: string;
    unit?: string;
};

export type TTradeType = {
    component?: ReactNode;
    text: string;
    value: string;
    group: string;
    icon: string[];
};

export type TApiHelpersInstance = {
    contracts_for: {
        getTradeTypesForQuickStrategy: (tradetype: string | number | boolean) => Promise<TTradeType[]>;
        getContractTypes: (tradetype: string | number | boolean) => Promise<TDropdownItems[]>;
        getDurations: (
            symbol: string | number | boolean,
            tradetype: string | number | boolean
        ) => Promise<TDurationUnitItem[]>;
    };
};

export type TRsStrategyName =
    | `d'alembert`
    | `martingale`
    | `oscar's-grind`
    | `reverse martingale`
    | `reverse d'alembert`
    | `1-3-2-6`;

export type TDurationType = 't' | 's' | 'm' | 'h' | 'd';

export type TFormValues = Record<string, string | number | boolean> & {
    symbol: string;
    tradetype: string;
    type?: string;
    stake?: string;
};
