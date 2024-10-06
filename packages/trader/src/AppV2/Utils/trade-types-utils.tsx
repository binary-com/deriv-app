import React from 'react';
import { Localize } from '@deriv/translations';
import { getAvailableContractTypes, getCategoriesSortedByKey } from 'Modules/Trading/Helpers/contract-type';
import {
    getContractTypePosition,
    getSupportedContracts,
    TRADE_TYPES,
    unsupported_contract_types_list,
} from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { getTradeTypeTabsList } from './trade-params-utils';

type TContractType = {
    text?: string;
    value: string;
};

type TCategories = {
    id: string;
    title: string;
    icon?: React.ReactNode;
};

const getSortedIndex = (type: string) =>
    getContractTypePosition(type as keyof ReturnType<typeof getSupportedContracts>) === 'bottom' ? 1 : 0;

export const CONTRACT_LIST = {
    ACCUMULATORS: 'Accumulators',
    VANILLAS: 'Vanillas',
    TURBOS: 'Turbos',
    MULTIPLIERS: 'Multipliers',
    RISE_FALL: 'Rise/Fall',
    HIGHER_LOWER: 'Higher/Lower',
    TOUCH_NO_TOUCH: 'Touch/No Touch',
    MATCHES_DIFFERS: 'Matches/Differs',
    EVEN_ODD: 'Even/Odd',
    OVER_UNDER: 'Over/Under',
};

export const AVAILABLE_CONTRACTS = [
    { tradeType: <Localize i18n_default_text='Accumulators' />, id: CONTRACT_LIST.ACCUMULATORS },
    { tradeType: <Localize i18n_default_text='Vanillas' />, id: CONTRACT_LIST.VANILLAS },
    { tradeType: <Localize i18n_default_text='Turbos' />, id: CONTRACT_LIST.TURBOS },
    { tradeType: <Localize i18n_default_text='Multipliers' />, id: CONTRACT_LIST.MULTIPLIERS },
    { tradeType: <Localize i18n_default_text='Rise/Fall' />, id: CONTRACT_LIST.RISE_FALL },
    { tradeType: <Localize i18n_default_text='Higher/Lower' />, id: CONTRACT_LIST.HIGHER_LOWER },
    { tradeType: <Localize i18n_default_text='Touch/No Touch' />, id: CONTRACT_LIST.TOUCH_NO_TOUCH },
    { tradeType: <Localize i18n_default_text='Matches/Differs' />, id: CONTRACT_LIST.MATCHES_DIFFERS },
    { tradeType: <Localize i18n_default_text='Even/Odd' />, id: CONTRACT_LIST.EVEN_ODD },
    { tradeType: <Localize i18n_default_text='Over/Under' />, id: CONTRACT_LIST.OVER_UNDER },
];

export const getTradeTypesList = (contract_types_list: ReturnType<typeof useTraderStore>['contract_types_list']) => {
    const available_trade_types = getAvailableContractTypes(
        contract_types_list as unknown as Parameters<typeof getAvailableContractTypes>[0],
        unsupported_contract_types_list
    );
    return Object.values(getCategoriesSortedByKey(available_trade_types))
        .map(({ contract_types }) =>
            contract_types[0].value.startsWith('vanilla')
                ? contract_types.map(type => ({ ...type, text: 'Vanillas' }))
                : contract_types
        )
        .flat()
        .filter(
            ({ value }) =>
                ![TRADE_TYPES.VANILLA.PUT, TRADE_TYPES.TURBOS.SHORT, TRADE_TYPES.RISE_FALL_EQUAL].includes(value)
        );
};

/* Gets the array of sorted contract types that are used to display purchased buttons and other info based on a selected trade type tab if applicable. */
export const getDisplayedContractTypes = (
    trade_types: ReturnType<typeof useTraderStore>['trade_types'],
    contract_type: string,
    trade_type_tab: string
) =>
    Object.keys(trade_types)
        .filter(type => !getTradeTypeTabsList(contract_type).length || type === trade_type_tab)
        .sort((a, b) => getSortedIndex(a) - getSortedIndex(b));

export const sortCategoriesInTradeTypeOrder = (trade_types: TContractType[], categories: TCategories[]) => {
    return trade_types
        .map((item: { value: string }) => {
            return categories.find(category => category.id === item.value);
        })
        .filter(item => item) as TCategories[];
};
