import React from 'react';
import PropTypes from 'prop-types';
import { DesktopWrapper, Div100vhContainer, MobileWrapper, SwipeableWrapper, usePrevious } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import ChartLoader from 'App/Components/Elements/chart-loader.jsx';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import { connect } from 'Stores/connect';
import PositionsDrawer from 'App/Components/Elements/PositionsDrawer';
import MarketIsClosedOverlay from 'App/Components/Elements/market-is-closed-overlay.jsx';
import Test from './test.jsx';
import { ChartBottomWidgets, ChartToolbarWidgets, ChartTopWidgets, DigitsWidget } from './chart-widgets.jsx';
import FormLayout from '../Components/Form/form-layout.jsx';
import AllMarkers from '../../SmartChart/Components/all-markers.jsx';

const BottomWidgetsMobile = ({ tick, digits, setTick, setDigits }) => {
    React.useEffect(() => {
        setTick(tick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick]);

    React.useEffect(() => {
        setDigits(digits);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [digits]);

    // render nothing for bottom widgets on chart in mobile
    return null;
};

const Trade = ({
    contract_type,
    form_components,
    getFirstOpenMarket,
    is_chart_loading,
    is_dark_theme,
    is_eu,
    is_market_closed,
    is_market_unavailable_visible,
    is_synthetics_unavailable,
    is_trade_enabled,
    network_status,
    NotificationMessages,
    onChange,
    onMount,
    onUnmount,
    prepareTradeStore,
    setContractTypes,
    setMobileDigitView,
    show_digits_stats,
    onboarding_contract_type,
    symbol,
}) => {
    const [digits, setDigits] = React.useState([]);
    const [tick, setTick] = React.useState({});
    const [try_synthetic_indices, setTrySyntheticIndices] = React.useState(false);
    const [try_open_markets, setTryOpenMarkets] = React.useState(false);
    const [category, setCategory] = React.useState(null);
    const [subcategory, setSubcategory] = React.useState(null);
    const [is_digits_widget_active, setIsDigitsWidgetActive] = React.useState(false);

    React.useEffect(() => {
        onMount();
        if (is_eu) {
            const setMarket = async () => {
                const markets_to_search = ['forex', 'indices', 'commodities']; // none-synthetic
                const { category: market_cat, subcategory: market_subcat } =
                    (await getFirstOpenMarket(markets_to_search)) ?? {};
                if (market_cat) {
                    setCategory(market_cat);
                    setSubcategory(market_subcat);
                }
            };

            setMarket();
        }
        return () => onUnmount();
    }, [onMount, onUnmount]);

    React.useEffect(() => {
        if (isMobile()) {
            setDigits([]);
        }
        setTrySyntheticIndices(false);
        setTryOpenMarkets(false);
    }, [symbol, setDigits, setTrySyntheticIndices]);

    React.useEffect(() => {
        const selectContractType = async () => {
            await setContractTypes();
            onChange({ target: { name: 'contract_type', value: onboarding_contract_type } });
        };
        if (onboarding_contract_type && !is_chart_loading && (!is_synthetics_unavailable || !is_market_closed)) {
            selectContractType();
        }
    }, [onboarding_contract_type, is_chart_loading]);
    const bottomWidgets = React.useCallback(({ digits: d, tick: t }) => {
        return <BottomWidgetsMobile digits={d} tick={t} setTick={setTick} setDigits={setDigits} />;
    }, []);

    const onChangeSwipeableIndex = index => {
        setMobileDigitView(index === 0);
        setIsDigitsWidgetActive(index === 0);
    };

    const onTryOtherMarkets = async () => {
        if (is_eu || is_synthetics_unavailable) {
            setTryOpenMarkets(true);
            setTimeout(() => setTryOpenMarkets(false));
        } else {
            setTrySyntheticIndices(true);
            setTimeout(() => setTrySyntheticIndices(false));
        }
    };

    const form_wrapper_class = isMobile() ? 'mobile-wrapper' : 'sidebar__container desktop-only';

    let open_market = null;
    if (try_synthetic_indices) {
        open_market = { category: 'synthetic_index' };
    } else if (try_open_markets && category) {
        open_market = { category, subcategory };
    }

    return (
        <div id='trade_container' className='trade-container'>
            <DesktopWrapper>
                <PositionsDrawer />
            </DesktopWrapper>
            {/* Div100vhContainer is workaround for browsers on devices
                    with toolbars covering screen height,
                    using css vh is not returning correct screen height */}
            <Div100vhContainer
                id='chart_container'
                className='chart-container'
                is_disabled={isDesktop()}
                height_offset='259px'
            >
                <NotificationMessages />
                <React.Suspense
                    fallback={<ChartLoader is_dark={is_dark_theme} is_visible={!symbol || is_chart_loading} />}
                >
                    <DesktopWrapper>
                        <div className='chart-container__wrapper'>
                            <ChartLoader is_visible={is_chart_loading} />
                            <ChartTrade
                                try_synthetic_indices={try_synthetic_indices}
                                try_open_markets={try_open_markets}
                                open_market={open_market}
                            />
                        </div>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <ChartLoader is_visible={is_chart_loading || (isDigitTradeType(contract_type) && !digits[0])} />
                        <SwipeableWrapper
                            onChange={onChangeSwipeableIndex}
                            is_disabled={
                                !show_digits_stats ||
                                !is_trade_enabled ||
                                form_components.length === 0 ||
                                is_chart_loading
                            }
                        >
                            {show_digits_stats && <DigitsWidget digits={digits} tick={tick} />}
                            <ChartTrade
                                bottomWidgets={show_digits_stats ? bottomWidgets : undefined}
                                is_digits_widget_active={show_digits_stats ? is_digits_widget_active : undefined}
                                try_synthetic_indices={try_synthetic_indices}
                                try_open_markets={try_open_markets}
                                open_market={open_market}
                            />
                        </SwipeableWrapper>
                    </MobileWrapper>
                </React.Suspense>

                {/* Remove Test component for debugging below for production release */}
                <Test />
            </Div100vhContainer>
            <div className={form_wrapper_class}>
                {is_market_closed && !is_market_unavailable_visible && (
                    <MarketIsClosedOverlay
                        is_eu={is_eu}
                        is_synthetics_unavailable={is_synthetics_unavailable}
                        {...(is_eu && category && { is_market_available: true })}
                        onClick={onTryOtherMarkets}
                        onMarketOpen={prepareTradeStore}
                        symbol={symbol}
                    />
                )}
                <FormLayout
                    is_market_closed={is_market_closed}
                    is_trade_enabled={
                        is_trade_enabled && form_components.length > 0 && network_status.class === 'online'
                    }
                />
            </div>
        </div>
    );
};

export default connect(({ client, common, modules, ui }) => ({
    getFirstOpenMarket: modules.trade.getFirstOpenMarket,
    is_eu: client.is_eu,
    is_synthetics_unavailable: client.is_synthetics_unavailable,
    network_status: common.network_status,
    contract_type: modules.trade.contract_type,
    form_components: modules.trade.form_components,
    is_chart_loading: modules.trade.is_chart_loading,
    is_market_closed: modules.trade.is_market_closed,
    show_digits_stats: modules.trade.show_digits_stats,
    is_trade_enabled: modules.trade.is_trade_enabled,
    prepareTradeStore: modules.trade.prepareTradeStore,
    setMobileDigitView: modules.trade.setMobileDigitView,
    symbol: modules.trade.symbol,
    onMount: modules.trade.onMount,
    onUnmount: modules.trade.onUnmount,
    purchase_info: modules.trade.purchase_info,
    NotificationMessages: ui.notification_messages_ui,
    is_market_unavailable_visible: ui.has_only_forward_starting_contracts,
    onboarding_contract_type: ui.onboarding_contract_type,
    onChange: modules.trade.onChange,
    setContractTypes: modules.trade.setContractTypes,
}))(Trade);

// CHART (ChartTrade)--------------------------------------------------------

/* eslint-disable */
import { SmartChart } from 'Modules/SmartChart';

const SmartChartWithRef = React.forwardRef((props, ref) => <SmartChart innerRef={ref} {...props} />);

// ChartMarkers --------------------------
const Markers = ({ markers_array, is_dark_theme, granularity, currency, config }) =>
    markers_array.map(marker => {
        const Marker = AllMarkers[marker.type];
        return (
            <Marker
                key={marker.key}
                is_dark_theme={is_dark_theme}
                granularity={granularity}
                currency={currency}
                config={config}
                {...marker}
            />
        );
    });

const ChartMarkers = connect(({ modules, ui, client }) => ({
    markers_array: modules.contract_trade.markers_array,
    is_digit_contract: modules.contract_trade.is_digit_contract,
    granularity: modules.contract_trade.granularity,
    is_dark_theme: ui.is_dark_mode_on,
    currency: client.currency,
}))(Markers);

const Chart = props => {
    const {
        active_symbols,
        chart_layout,
        chart_type,
        chartStateChange,
        exportLayout,
        extra_barriers = [],
        end_epoch,
        granularity,
        has_alternative_source,
        is_trade_enabled,
        is_socket_opened,
        main_barrier,
        refToAddTick,
        resetRefresh,
        setChartStatus,
        settings,
        show_digits_stats,
        should_refresh,
        symbol,
        wsForget,
        wsForgetStream,
        wsSendRequest,
        wsSubscribe,
    } = props;

    const charts_ref = React.useRef();
    const props_ref = React.useRef();
    props_ref.current = props;

    const prev_should_refresh = usePrevious(should_refresh);
    if (prev_should_refresh) resetRefresh();

    const bottomWidgets = React.useCallback(
        ({ digits, tick }) => <ChartBottomWidgets digits={digits} tick={tick} />,
        []
    );

    const topWidgets = React.useCallback(({ ...params }) => {
        // changing reference of topWidgets function by adding dependencies to useCallback results in Smartcharts performance drop.
        // so, using props_ref to get current props value
        const { is_digits_widget_active, try_synthetic_indices, try_open_markets, open_market } = props_ref.current;
        return (
            <ChartTopWidgets
                open_market={open_market}
                open={try_synthetic_indices || try_open_markets}
                charts_ref={charts_ref}
                is_digits_widget_active={is_digits_widget_active}
                {...params}
            />
        );
    }, []);

    const getMarketsOrder = active_symbols => {
        const synthetic_index = 'synthetic_index';

        const has_synthetic_index = !!active_symbols.find(s => s.market === synthetic_index);
        return active_symbols
            .slice()
            .sort((a, b) => (a.display_name < b.display_name ? -1 : 1))
            .map(s => s.market)
            .reduce(
                (arr, market) => {
                    if (arr.indexOf(market) === -1) arr.push(market);
                    return arr;
                },
                has_synthetic_index ? [synthetic_index] : []
            );
    };

    const barriers = main_barrier ? [main_barrier, ...extra_barriers] : extra_barriers;

    // max ticks to display for mobile view for tick chart
    const max_ticks = granularity === 0 ? 8 : 24;

    if (!symbol || active_symbols.length === 0) return null;

    return (
        <SmartChartWithRef
            ref={charts_ref}
            barriers={barriers}
            bottomWidgets={show_digits_stats && isDesktop() ? bottomWidgets : props.bottomWidgets}
            crosshair={isMobile() ? 0 : undefined}
            crosshairTooltipLeftAllow={560}
            showLastDigitStats={isDesktop() ? show_digits_stats : false}
            chartControlsWidgets={null}
            chartStatusListener={v => setChartStatus(!v)}
            chartType={chart_type}
            enabledNavigationWidget={isDesktop()}
            enabledChartFooter={false}
            id='trade'
            isMobile={isMobile()}
            maxTick={isMobile() ? max_ticks : undefined}
            granularity={granularity}
            requestAPI={wsSendRequest}
            requestForget={wsForget}
            requestForgetStream={wsForgetStream}
            requestSubscribe={wsSubscribe}
            settings={settings}
            stateChangeListener={chartStateChange}
            symbol={symbol}
            topWidgets={is_trade_enabled ? topWidgets : null}
            isConnectionOpened={is_socket_opened}
            clearChart={false}
            toolbarWidget={ChartToolbarWidgets}
            importedLayout={chart_layout}
            onExportLayout={exportLayout}
            shouldFetchTradingTimes={!end_epoch}
            refreshActiveSymbols={should_refresh}
            hasAlternativeSource={has_alternative_source}
            refToAddTick={refToAddTick}
            getMarketsOrder={getMarketsOrder}
            yAxisMargin={{
                top: isMobile() ? 76 : 106,
            }}
        >
            <ChartMarkers />
        </SmartChartWithRef>
    );
};

Chart.propTypes = {
    bottomWidgets: PropTypes.func,
    chart_type: PropTypes.string,
    chart_layout: PropTypes.any,
    chartStateChange: PropTypes.func,
    exportLayout: PropTypes.func,
    end_epoch: PropTypes.number,
    granularity: PropTypes.number,
    is_digits_widget_active: PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
    is_socket_opened: PropTypes.bool,
    has_alternative_source: PropTypes.bool,
    main_barrier: PropTypes.any,
    refToAddTick: PropTypes.func,
    setChartStatus: PropTypes.func,
    settings: PropTypes.object,
    symbol: PropTypes.string,
    try_synthetic_indices: PropTypes.bool,
    wsForget: PropTypes.func,
    wsForgetStream: PropTypes.func,
    wsSendRequest: PropTypes.func,
    wsSubscribe: PropTypes.func,
};

const ChartTrade = connect(({ modules, ui, common }) => ({
    is_socket_opened: common.is_socket_opened,
    granularity: modules.contract_trade.granularity,
    chart_type: modules.contract_trade.chart_type,
    chartStateChange: modules.trade.chartStateChange,
    settings: {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: ui.is_chart_countdown_visible,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    },
    last_contract: {
        is_digit_contract: modules.contract_trade.last_contract.is_digit_contract,
        is_ended: modules.contract_trade.last_contract.is_ended,
    },
    is_trade_enabled: modules.trade.is_trade_enabled,
    main_barrier: modules.trade.main_barrier_flattened,
    extra_barriers: modules.trade.barriers_flattened,
    show_digits_stats: modules.trade.show_digits_stats,
    contract_type: modules.trade.contract_type,
    symbol: modules.trade.symbol,
    exportLayout: modules.trade.exportLayout,
    setChartStatus: modules.trade.setChartStatus,
    chart_layout: modules.trade.chart_layout,
    wsForget: modules.trade.wsForget,
    wsForgetStream: modules.trade.wsForgetStream,
    wsSendRequest: modules.trade.wsSendRequest,
    wsSubscribe: modules.trade.wsSubscribe,
    active_symbols: modules.trade.active_symbols,
    should_refresh: modules.trade.should_refresh_active_symbols,
    resetRefresh: modules.trade.resetRefresh,
    has_alternative_source: modules.trade.has_alternative_source,
    refToAddTick: modules.trade.refToAddTick,
}))(Chart);
