import React from 'react';
import { Redirect } from 'react-router-dom';
import { TCoreStores } from '@deriv/stores/types';
import {
    getMultiplierOpenPositionsColumnsTemplate,
    getOpenPositionsColumnsTemplate,
    getProfitTableColumnsTemplate,
    getStatementTableColumnsTemplate,
    TKeys,
} from 'Constants/data-table-constants';
import { getSupportedContracts, getUnsupportedContracts } from '@deriv/shared';

export type TPassthrough = {
    root_store: TCoreStores;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WS: Record<string, any>;
};

export type TBinaryRoutes = {
    is_logged_in?: boolean;
    is_logging_in?: boolean;
    passthrough?: TPassthrough;
};

export type TRoute = {
    path?: string;
    component: React.ComponentType | typeof Redirect;
    is_authenticated?: boolean;
    getTitle: () => string;
    icon_component?: string;
    routes?: TRoute[];
    default?: boolean;
    to?: string;
    exact?: boolean;
};

export type TErrorComponent = {
    header: string | JSX.Element;
    is_dialog: boolean;
    message: React.ReactElement | string;
    redirect_label: string;
    redirectOnClick: (() => void) | null;
    should_show_refresh: boolean;
    type: string;
};

export type TRoutes = {
    error?: TErrorComponent;
    has_error?: boolean;
    is_logged_in?: boolean;
    is_logging_in?: boolean;
    is_virtual?: boolean;
    passthrough?: TPassthrough;
};

export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: TRoute[];
};

export type TInputDateRange = {
    value?: string;
    label?: string;
    duration?: number;
    onClick?: () => void;
};

export type TColIndex =
    | ReturnType<typeof getStatementTableColumnsTemplate>[number]['col_index']
    | ReturnType<typeof getProfitTableColumnsTemplate>[number]['col_index']
    | ReturnType<typeof getOpenPositionsColumnsTemplate>[number]['col_index']
    | ReturnType<typeof getMultiplierOpenPositionsColumnsTemplate>[number]['col_index'];

export type TCellContentProps = {
    cell_value: TKeys;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passthrough: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    row_obj: any;
    is_footer: boolean;
    is_turbos?: boolean;
    is_vanilla: boolean;
};

export type THeaderProps = {
    title: React.ReactNode;
    is_vanilla: boolean;
};

export type TColumnTemplateType = {
    key?: string;
    title?: React.ReactNode;
    col_index: TColIndex;
    renderCellContent?: (props: TCellContentProps) => React.ReactNode;
    renderHeader?: (props: THeaderProps) => React.ReactNode;
    icon?: string;
    action_type?: string;
    refid?: string;
    date?: string;
    balance?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map?: any;
};

export type TSupportedContractType = keyof ReturnType<typeof getSupportedContracts>;
export type TUnsupportedContractType = keyof ReturnType<typeof getUnsupportedContracts>;
