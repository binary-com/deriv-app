import { MutableRefObject } from 'react';

export type TProviderDetails = {
    icon: {
        dark: string;
        light: string;
    };
    name: string;
    getDescription: () => string;
    getAllowedResidencies: () => string[];
    getPaymentIcons: () => {
        dark: string;
        light: string;
    }[];
    getScriptDependencies: () => any[];
    getDefaultFromCurrency: () => string;
    getFromCurrencies: () => string[];
    getToCurrencies: () => string[];
    getWidgetHtml: () => Promise<any>;
    onMountWidgetContainer: (ref?: MutableRefObject<any>) => void;
    should_show_deposit_address: boolean;
};

export type TProviderDetailsWithoutFrom = Omit<TProviderDetails, 'getDefaultFromCurrency' | 'getFromCurrencies'>;
