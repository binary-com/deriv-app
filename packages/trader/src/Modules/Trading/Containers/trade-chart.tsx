import React from 'react';
import { ActiveSymbols } from '@deriv/api-types';
import { isDesktop } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { ChartBottomWidgets } from './chart-widgets';
import AccumulatorsChartElements from '../../SmartChart/Components/Markers/accumulators-chart-elements';
import ToolbarWidgets from '../../SmartChart/Components/toolbar-widgets';
import type { TBottomWidgetsParams } from './trade';
import { SmartChart } from 'Modules/SmartChart';
import { ChartBarrierStore } from 'Stores/Modules/SmartChart/chart-barrier-store';

type TTradeChartProps = {
    bottomWidgets?: (props: TBottomWidgetsParams) => React.ReactElement;
    has_barrier?: boolean;
    is_accumulator: boolean;
    topWidgets: (() => JSX.Element) | null | undefined;
    children?: React.ReactNode;
};

const TradeChart = observer((props: TTradeChartProps) => {
    const { has_barrier, is_accumulator, topWidgets } = props;
    const { client, ui, common, contract_trade, portfolio } = useStore();
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
    const { is_chart_countdown_visible, is_chart_layout_default, is_dark_mode_on, is_mobile, is_positions_drawer_on } =
        ui;
    const { current_language, is_socket_opened } = common;
    const { should_show_eu_content } = client;
    const {
        active_symbols,
        barriers_flattened: extra_barriers,
        chartStateChange,
        chart_layout,
        exportLayout,
        has_alternative_source,
        is_trade_enabled,
        main_barrier_flattened: main_barrier,
        setChartStatus,
        show_digits_stats,
        symbol,
        onChange,
        prev_contract_type,
        wsForget,
        wsForgetStream,
        wsSendRequest,
        wsSubscribe,
    } = useTraderStore();

    const settings = {
        countdown: is_chart_countdown_visible,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: current_language.toLowerCase(),
        position: is_chart_layout_default ? 'bottom' : 'left',
        theme: is_dark_mode_on ? 'dark' : 'light',
        ...(is_accumulator ? { whitespace: 190, minimumLeftBars: is_mobile ? 3 : undefined } : {}),
        ...(has_barrier ? { whitespace: 110 } : {}),
    };

    const { current_spot, current_spot_time } = accumulator_barriers_data || {};

    const bottomWidgets = React.useCallback(
        ({ digits, tick }: TBottomWidgetsParams) => (
            <ChartBottomWidgets digits={digits} tick={tick} show_accumulators_stats={is_accumulator} />
        ),
        [is_accumulator]
    );

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
            ref={ref}
            barriers={barriers}
            contracts_array={markers_array}
            bottomWidgets={(is_accumulator || show_digits_stats) && isDesktop() ? bottomWidgets : props.bottomWidgets}
            crosshair={is_mobile ? 0 : undefined}
            crosshairTooltipLeftAllow={560}
            showLastDigitStats={show_digits_stats}
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
            enabledNavigationWidget={isDesktop()}
            enabledChartFooter={false}
            id='trade'
            isMobile={is_mobile}
            maxTick={is_mobile ? max_ticks : undefined}
            granularity={show_digits_stats || is_accumulator ? 0 : granularity}
            requestAPI={wsSendRequest}
            requestForget={wsForget}
            requestForgetStream={wsForgetStream}
            requestSubscribe={wsSubscribe}
            settings={settings}
            should_show_eu_content={should_show_eu_content}
            allowTickChartTypeOnly={show_digits_stats || is_accumulator}
            stateChangeListener={chartStateChange}
            symbol={symbol}
            topWidgets={is_trade_enabled ? topWidgets : null}
            isConnectionOpened={is_socket_opened}
            clearChart={false}
            toolbarWidget={() => {
                return (
                    <ToolbarWidgets
                        updateChartType={updateChartType}
                        updateGranularity={updateGranularity}
                        is_mobile={is_mobile}
                    />
                );
            }}
            importedLayout={chart_layout}
            onExportLayout={exportLayout}
            shouldFetchTradingTimes={false}
            hasAlternativeSource={has_alternative_source}
            getMarketsOrder={getMarketsOrder}
            should_zoom_out_on_yaxis={is_accumulator}
            yAxisMargin={{
                top: is_mobile ? 76 : 106,
            }}
            isLive
            leftMargin={isDesktop() && is_positions_drawer_on ? 328 : 80}
        >
            {is_accumulator && (
                <AccumulatorsChartElements
                    all_positions={all_positions}
                    current_spot={current_spot}
                    current_spot_time={current_spot_time}
                    has_crossed_accu_barriers={has_crossed_accu_barriers}
                    should_show_profit_text={!!accumulator_contract_barriers_data.accumulators_high_barrier}
                    symbol={symbol}
                    is_mobile={is_mobile}
                />
            )}
        </SmartChart>
    );
});
export default TradeChart;
