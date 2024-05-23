import { STRATEGIES } from '../config';
import { STORED_ITEM_NOT_FOUND, TFormStrategy } from './constants';

export const getRsDropdownTextFromLocalStorage = () => {
    try {
        return JSON.parse(localStorage?.getItem('qs-analytics') ?? '{}');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Rudderstack: unable to get dropdown text');
        return {};
    }
};

const hasStoredText = (parameter: string) => parameter && parameter !== STORED_ITEM_NOT_FOUND;

export const getRsStrategyType = (selected_strategy: string) => STRATEGIES[selected_strategy]?.rs_strategy_name;

export const getQsActiveTabString = (tab: string) => (tab === 'TRADE_PARAMETERS' ? 'trade parameters' : 'learn more');

export const getSubpageName = () => {
    const pathname = window.location.hash;
    switch (pathname) {
        case 'dashboard':
            return 'dashboard';
        case 'charts':
            return 'charts';
        case 'tutorials':
            return 'tutorials';
        default:
            return 'bot_builder';
    }
};

export const getTradeParameterData = ({ form_values }: TFormStrategy) => {
    const { symbol, tradetype, type, stake } = form_values;
    const stored_texts = getRsDropdownTextFromLocalStorage();

    return {
        asset_type: hasStoredText(stored_texts?.symbol) ? stored_texts.symbol : symbol,
        trade_type: hasStoredText(stored_texts?.tradetype) ? stored_texts?.tradetype : tradetype,
        purchase_condition: hasStoredText(stored_texts?.type) ? stored_texts?.type : type,
        initial_stake: hasStoredText(stored_texts?.stake) ? stored_texts?.stake : stake,
    };
};
