import { ActiveSymbols } from '@deriv/api-types';
import { TTextValueStrings, TTradeTypesCategories } from '../constants/contract';
import { routes } from '../routes';

type TGetTradeURLParamsArgs = {
    active_symbols?: ActiveSymbols;
    contract_types_list?: TTradeTypesCategories;
};

type TTradeUrlParams = {
    contractType?: string;
    chartType?: string;
    granularity?: number | null;
    symbol?: string;
};

type TTradeURLParamsConfig = {
    [key: string]: TTextValueStrings[];
};

const TRADE_URL_PARAMS = {
    CHART_TYPE: 'chart_type',
    INTERVAL: 'interval',
    SYMBOL: 'symbol',
    TRADE_TYPE: 'trade_type',
};

const tradeURLParamsConfig: TTradeURLParamsConfig = {
    chartType: [
        { text: 'area', value: 'line' },
        { text: 'candle', value: 'candles' },
        { text: 'hollow', value: 'hollow' },
        { text: 'ohlc', value: 'ohlc' },
    ],
    interval: [
        { text: '1t', value: '0' },
        { text: '1m', value: '60' },
        { text: '2m', value: '120' },
        { text: '3m', value: '180' },
        { text: '5m', value: '300' },
        { text: '10m', value: '600' },
        { text: '15m', value: '900' },
        { text: '30m', value: '1800' },
        { text: '1h', value: '3600' },
        { text: '2h', value: '7200' },
        { text: '4h', value: '14400' },
        { text: '8h', value: '28800' },
        { text: '1d', value: '86400' },
    ],
};

const getParamTextByValue = (value: number | string, key: string) =>
    tradeURLParamsConfig[key].find(interval => interval.value === value.toString())?.text ?? '';

export const getTradeURLParams = ({ active_symbols = [], contract_types_list = {} }: TGetTradeURLParamsArgs = {}) => {
    const searchParams = new URLSearchParams(window.location.search);
    const result: TTradeUrlParams & { showModal?: boolean } = {};
    if (searchParams.toString()) {
        const { chart_type, interval, trade_type, symbol } = [...searchParams.entries()].reduce<{
            [key: string]: string;
        }>((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        const validInterval = tradeURLParamsConfig.interval.find(item => item.text === interval);
        const validChartType = tradeURLParamsConfig.chartType.find(item => item.text === chart_type);
        const chartTypeParam = Number(validInterval?.value) === 0 ? 'candles' : validChartType?.value;
        const isSymbolValid = active_symbols.some(item => item.symbol === symbol);
        const contractList = Object.keys(contract_types_list).reduce<string[]>((acc, key) => {
            const categories: TTradeTypesCategories['Ups & Downs']['categories'] =
                contract_types_list[key]?.categories || [];
            return [...acc, ...categories.map(contract => (contract as TTextValueStrings).value)];
        }, []);

        const isTradeTypeValid =
            (contractList.length === 0 && trade_type !== '') ||
            (contractList.length > 0 && contractList.includes(trade_type ?? ''));

        if (validInterval) result.granularity = Number(validInterval.value);
        if (validChartType) result.chartType = chartTypeParam;
        if (isSymbolValid) result.symbol = symbol;
        if (isTradeTypeValid) result.contractType = trade_type;
        if (
            (!isSymbolValid && symbol && active_symbols.length) ||
            (!isTradeTypeValid && trade_type && contractList.length)
        )
            result.showModal = true;
    }
    return result;
};

export const setTradeURLParams = ({ contractType, symbol, chartType, granularity }: TTradeUrlParams) => {
    const searchParams = new URLSearchParams(window.location.search);
    chartType && searchParams.set(TRADE_URL_PARAMS.CHART_TYPE, getParamTextByValue(chartType, 'chartType'));
    !isNaN(Number(granularity)) &&
        searchParams.set(
            TRADE_URL_PARAMS.INTERVAL,
            getParamTextByValue(Number(granularity), TRADE_URL_PARAMS.INTERVAL)
        );
    symbol && searchParams.set(TRADE_URL_PARAMS.SYMBOL, symbol);
    contractType && searchParams.set(TRADE_URL_PARAMS.TRADE_TYPE, contractType);
    if (searchParams.toString() && window.location.pathname === routes.trade) {
        const newQuery = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.replaceState({}, document.title, newQuery);
    }
};
