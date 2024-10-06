import React from 'react';
import { ActiveSymbols, TickSpotData } from '@deriv/api-types';
import { useDevice } from '@deriv-com/ui';
import { ChartBarrierStore, isAccumulatorContract } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { SmartChart } from 'Modules/SmartChart';
import AccumulatorsChartElements from 'Modules/SmartChart/Components/Markers/accumulators-chart-elements';
import ToolbarWidgets from 'Modules/SmartChart/Components/toolbar-widgets';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import useDefaultSymbol from 'AppV2/Hooks/useDefaultSymbol';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';

type TBottomWidgetsParams = {
    digits: number[];
    tick: TickSpotData | null;
};
type TBottomWidgetsMobile = TBottomWidgetsParams & {
    setDigitStats: (digits: number[]) => void;
    setTickData: (tick: TickSpotData | null) => void;
};

const BottomWidgetsMobile = ({ digits, tick, setTickData, setDigitStats }: TBottomWidgetsMobile) => {
    // Using bottom widgets in V2 to get tick data for all trade types and to get digit stats for Digit trade types
    React.useEffect(() => {
        setTickData(tick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick]);

    React.useEffect(() => {
        setDigitStats(digits);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [digits]);

    // render no bottom widgets on chart
    return null;
};

const TradeChart = observer(() => {
    const { ui, common, contract_trade, portfolio } = useStore();
    const { isMobile } = useDevice();
    const {
        accumulator_barriers_data,
        accumulator_contract_barriers_data,
        chart_type,
        granularity,
        has_crossed_accu_barriers,
        markers_array,
        updateChartType,
        updateGranularity,
    } = contract_trade;
    const ref = React.useRef<{ hasPredictionIndicators(): void; triggerPopup(arg: () => void): void }>(null);
    const { all_positions } = portfolio;
    const { is_chart_countdown_visible, is_chart_layout_default, is_dark_mode_on, is_positions_drawer_on } = ui;
    const { current_language, is_socket_opened } = common;
    const { activeSymbols: active_symbols } = useActiveSymbols();
    const { symbol } = useDefaultSymbol();
    const {
        barriers_flattened: extra_barriers,
        chartStateChange,
        chart_layout,
        contract_type,
        exportLayout,
        has_alternative_source,
        has_barrier,
        main_barrier_flattened: main_barrier,
        setChartStatus,
        setDigitStats,
        setTickData,
        show_digits_stats,
        onChange,
        prev_contract_type,
        wsForget,
        wsForgetStream,
        wsSendRequest,
        wsSubscribe,
    } = useTraderStore();
    const is_digit_trade_type = isDigitTradeType(contract_type);
    const is_accumulator = isAccumulatorContract(contract_type);
    const settings = {
        countdown: is_chart_countdown_visible,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: current_language.toLowerCase(),
        position: is_chart_layout_default ? 'bottom' : 'left',
        theme: is_dark_mode_on ? 'dark' : 'light',
        ...(is_accumulator ? { whitespace: 190, minimumLeftBars: isMobile ? 3 : undefined } : {}),
        ...(has_barrier ? { whitespace: 110 } : {}),
    };

    const { current_spot, current_spot_time } = accumulator_barriers_data || {};

    const bottomWidgets = React.useCallback(({ digits, tick }: TBottomWidgetsParams) => {
        return (
            <BottomWidgetsMobile digits={digits} tick={tick} setTickData={setTickData} setDigitStats={setDigitStats} />
        );
    }, []);

    const chartKey = React.useMemo(() => {
        if (is_digit_trade_type) {
            return symbol;
        }
        return null;
    }, [symbol, is_digit_trade_type]);

    React.useEffect(() => {
        if ((is_accumulator || show_digits_stats) && ref.current?.hasPredictionIndicators()) {
            const cancelCallback = () => onChange({ target: { name: 'contract_type', value: prev_contract_type } });
            ref.current?.triggerPopup(cancelCallback);
        }
    }, [is_accumulator, onChange, prev_contract_type, show_digits_stats]);

    const getMarketsOrder = (active_symbols: ActiveSymbols): string[] => {
        const synthetic_index = 'synthetic_index';
        const has_synthetic_index = active_symbols.some(s => s.market === synthetic_index);
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

    const barriers: ChartBarrierStore[] = main_barrier ? [main_barrier, ...extra_barriers] : extra_barriers;

    // max ticks to display for mobile view for tick chart
    const max_ticks = granularity === 0 ? 8 : 24;

    if (!symbol || !active_symbols.length) return null;
    return (
        <SmartChart
            key={chartKey}
            ref={ref}
            barriers={barriers}
            contracts_array={markers_array}
            bottomWidgets={bottomWidgets}
            crosshair={isMobile ? 0 : undefined}
            crosshairTooltipLeftAllow={560}
            showLastDigitStats
            chartControlsWidgets={null}
            chartStatusListener={(v: boolean) => setChartStatus(!v, true)}
            chartType={chart_type}
            initialData={{
                activeSymbols: JSON.parse(JSON.stringify(active_symbols)),
            }}
            chartData={{
                activeSymbols: JSON.parse(JSON.stringify(active_symbols)),
            }}
            feedCall={{
                activeSymbols: false,
            }}
            enabledNavigationWidget={!isMobile}
            enabledChartFooter={false}
            id='trade'
            isMobile={isMobile}
            isVerticalScrollEnabled={false}
            maxTick={isMobile ? max_ticks : undefined}
            granularity={show_digits_stats || is_accumulator ? 0 : granularity}
            requestAPI={wsSendRequest}
            requestForget={wsForget}
            requestForgetStream={wsForgetStream}
            requestSubscribe={wsSubscribe}
            settings={settings}
            allowTickChartTypeOnly={show_digits_stats || is_accumulator}
            stateChangeListener={chartStateChange}
            symbol={symbol}
            topWidgets={() => <div /> /* to hide the original chart market dropdown */}
            isConnectionOpened={is_socket_opened}
            clearChart={false}
            toolbarWidget={() => {
                return <ToolbarWidgets updateChartType={updateChartType} updateGranularity={updateGranularity} />;
            }}
            importedLayout={chart_layout}
            onExportLayout={exportLayout}
            shouldFetchTradingTimes={false}
            hasAlternativeSource={has_alternative_source}
            getMarketsOrder={getMarketsOrder}
            should_zoom_out_on_yaxis={is_accumulator}
            yAxisMargin={{
                top: isMobile ? 76 : 106,
            }}
            isLive
            leftMargin={!isMobile && is_positions_drawer_on ? 328 : 80}
        >
            {is_accumulator && (
                <AccumulatorsChartElements
                    all_positions={all_positions}
                    current_spot={current_spot}
                    current_spot_time={current_spot_time}
                    has_crossed_accu_barriers={has_crossed_accu_barriers}
                    should_show_profit_text={!!accumulator_contract_barriers_data.accumulators_high_barrier}
                    symbol={symbol}
                    is_mobile={isMobile}
                />
            )}
        </SmartChart>
    );
});
export default TradeChart;
