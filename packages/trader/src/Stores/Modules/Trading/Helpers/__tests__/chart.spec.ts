import { ACTION, getChartAnalyticsData, STATE_TYPES, SUBFORM_NAME } from '../chart';

describe('getChartAnalyticsData', () => {
    const mocked_data = {
        indicator_type_name: 'Donchian Channel',
        indicators_category_name: 'Volatility',
        is_favorite: true,
        is_info_open: true,
        is_open: true,
        chart_type_name: 'area',
        search_string: 'test',
        symbol: 'Volatility 75 (1s) Index',
        symbol_category: 'derived-synthetics-continuous_indices',
        time_interval_name: '1 minute',
    };
    const market_type_name = mocked_data.symbol;
    const tab_market_name = mocked_data.symbol_category;
    const chart_event_type = 'ce_chart_types_form';
    const market_event_type = 'ce_market_types_form';
    const indicators_event_type = 'ce_indicators_types_form';
    it('should return empty object if args are empty', () => {
        expect(getChartAnalyticsData('' as keyof typeof STATE_TYPES)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.CHART_MODE_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.CHART_MODE_TOGGLE, {
                is_open: mocked_data.is_open,
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            })
        ).toEqual({
            data: {
                action: ACTION.OPEN,
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            },
            event_type: chart_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.CHART_MODE_TOGGLE, {
                is_open: false,
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            })
        ).toEqual({
            data: {
                action: ACTION.CLOSE,
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            },
            event_type: chart_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.CHART_MODE_TOGGLE)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.CHART_TYPE_CHANGE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.CHART_TYPE_CHANGE, {
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            })
        ).toEqual({
            data: {
                action: ACTION.CHOOSE_CHART_TYPE,
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            },
            event_type: chart_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.CHART_TYPE_CHANGE)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.CHART_INTERVAL_CHANGE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.CHART_INTERVAL_CHANGE, {
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            })
        ).toEqual({
            data: {
                action: ACTION.CHOOSE_TIME_INTERVAL,
                chart_type_name: mocked_data.chart_type_name,
                time_interval_name: mocked_data.time_interval_name,
            },
            event_type: chart_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.CHART_INTERVAL_CHANGE)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_DELETED', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_DELETED, {
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: ACTION.DELETE_ACTIVE,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_DELETED)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_SETTINGS_OPEN', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_SETTINGS_OPEN, {
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: ACTION.EDIT_ACTIVE,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_SETTINGS_OPEN)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_INFO_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_INFO_TOGGLE, {
                is_info_open: mocked_data.is_info_open,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: ACTION.INFO_OPEN,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            },
            event_type: indicators_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_INFO_TOGGLE, {
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: ACTION.INFO_CLOSE,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_INFO_TOGGLE)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATORS_MODAL_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATORS_MODAL_TOGGLE, {
                is_open: mocked_data.is_open,
            })
        ).toEqual({
            data: { action: ACTION.OPEN },
            event_type: indicators_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATORS_MODAL_TOGGLE, {
                is_open: false,
            })
        ).toEqual({
            data: { action: ACTION.CLOSE },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATORS_MODAL_TOGGLE)).toEqual({
            data: {
                action: ACTION.CLOSE,
            },
            event_type: indicators_event_type,
        });
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_ADDED', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_ADDED, {
                is_info_open: mocked_data.is_info_open,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: ACTION.ADD_ACTIVE,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
                subform_name: SUBFORM_NAME.INDICATORS_INFO,
            },
            event_type: indicators_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_ADDED, {
                is_info_open: false,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
            })
        ).toEqual({
            data: {
                action: ACTION.ADD_ACTIVE,
                indicator_type_name: mocked_data.indicator_type_name,
                indicators_category_name: mocked_data.indicators_category_name,
                subform_name: SUBFORM_NAME.INDICATORS_TYPE,
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_ADDED)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATORS_CLEAR_ALL', () => {
        expect(getChartAnalyticsData(STATE_TYPES.INDICATORS_CLEAR_ALL)).toEqual({
            data: { action: ACTION.CLEAN_ALL_ACTIVE },
            event_type: indicators_event_type,
        });
    });
    it('should return correct object with data and event_type for STATE_TYPES.INDICATOR_SEARCH', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.INDICATOR_SEARCH, {
                search_string: mocked_data.search_string,
            })
        ).toEqual({
            data: {
                action: ACTION.SEARCH,
                search_string: mocked_data.search_string,
            },
            event_type: indicators_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_SEARCH, { search_string: '' })).toEqual({});
        expect(getChartAnalyticsData(STATE_TYPES.INDICATOR_SEARCH)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.MARKET_SEARCH', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.MARKET_SEARCH, {
                search_string: mocked_data.search_string,
            })
        ).toEqual({
            data: {
                action: ACTION.SEARCH,
                search_string: mocked_data.search_string,
            },
            event_type: market_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.MARKET_SEARCH)).toEqual({});
    });
    it('should return correct object with data and event_type for STATE_TYPES.MARKETS_LIST_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.MARKETS_LIST_TOGGLE, {
                is_open: mocked_data.is_open,
                symbol: mocked_data.symbol,
            })
        ).toEqual({
            data: {
                action: ACTION.OPEN,
                market_type_name,
            },
            event_type: market_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.MARKETS_LIST_TOGGLE, {
                is_open: false,
                symbol: mocked_data.symbol,
            })
        ).toEqual({
            data: {
                action: ACTION.CLOSE,
                market_type_name,
            },
            event_type: market_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.MARKETS_LIST_TOGGLE)).toEqual({
            data: {
                action: ACTION.CLOSE,
                market_type_name: '',
            },
            event_type: market_event_type,
        });
    });
    it('should return correct object with data and event_type for STATE_TYPES.SYMBOL_CHANGE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.SYMBOL_CHANGE, {
                symbol: mocked_data.symbol,
                symbol_category: mocked_data.symbol_category,
            })
        ).toEqual({
            data: {
                action: ACTION.CHOOSE_MARKET_TYPE,
                tab_market_name,
                market_type_name,
            },
            event_type: market_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.SYMBOL_CHANGE)).toEqual({
            data: {
                action: ACTION.CHOOSE_MARKET_TYPE,
                market_type_name: '',
                tab_market_name: '',
            },
            event_type: market_event_type,
        });
    });
    it('should return correct object with data and event_type for STATE_TYPES.FAVORITE_MARKETS_TOGGLE', () => {
        expect(
            getChartAnalyticsData(STATE_TYPES.FAVORITE_MARKETS_TOGGLE, {
                is_favorite: mocked_data.is_favorite,
                symbol: mocked_data.symbol,
            })
        ).toEqual({
            data: {
                action: ACTION.ADD_TO_FAVORITES,
                market_type_name,
            },
            event_type: market_event_type,
        });
        expect(
            getChartAnalyticsData(STATE_TYPES.FAVORITE_MARKETS_TOGGLE, {
                is_favorite: false,
                symbol: mocked_data.symbol,
            })
        ).toEqual({
            data: {
                action: ACTION.DELETE_FROM_FAVORITES,
                market_type_name,
            },
            event_type: market_event_type,
        });
        expect(getChartAnalyticsData(STATE_TYPES.FAVORITE_MARKETS_TOGGLE)).toEqual({});
    });
});
