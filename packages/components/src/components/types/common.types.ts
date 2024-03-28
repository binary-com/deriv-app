import React from 'react';
import { getCardLabels, getContractTypeDisplay } from '@deriv/shared';
import { TContractOptions } from '@deriv/shared/src/utils/contract/contract-types';

export type TGenericObjectType = {
    [key: string]: React.ReactNode;
};
export type TGetCardLables = () => ReturnType<typeof getCardLabels>;

export type TGetContractTypeDisplay = (
    type: string,
    options: TContractOptions
) => ReturnType<typeof getContractTypeDisplay>;

export type TItem = {
    id: string;
    value: Array<TItem> | string;
};

export type TTableRowItem =
    | {
          message?: string;
          component?: React.ReactElement;
      }
    | string;

export type TRow = { [key: string]: any };

export type TPassThrough = { isTopUp: (item: TRow) => boolean };

export type TDatePickerOnChangeEvent = {
    date?: string;
    duration?: number | null | string;
    target?: { name?: string; value?: number | string | moment.Moment | null };
};
