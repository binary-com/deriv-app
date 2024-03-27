import React from 'react';
import { usePrevious } from '@deriv/components';
import {
    getDurationPeriod,
    getDurationUnitText,
    getEndTime,
    getPlatformRedirect,
    hasContractStarted,
} from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { ChartBottomWidgets, ChartTopWidgets } from './contract-replay-widget';
import ResetContractChartElements from 'Modules/SmartChart/Components/Markers/reset-contract-chart-elements';
import { SmartChart } from 'Modules/SmartChart';
import ChartMarker from 'Modules/SmartChart/Components/Markers/marker';
import { useDevice } from '@deriv/hooks';

const ReplayChart = observer(
    ({
        is_dark_theme_prop,
        is_accumulator_contract,
        is_reset_contract,
    }: {
        is_dark_theme_prop?: boolean;
        is_accumulator_contract?: boolean;
        is_reset_contract?: boolean;
    }) => {
        const trade = useTraderStore();
        const { contract_replay, common, ui } = useStore();
        const { isMobile } = useDevice();
        const { contract_store, chart_state, chartStateChange, margin } = contract_replay;
        const { contract_config, is_digit_contract, barriers_array, getContractsArray, markers_array, contract_info } =
            contract_store;
        const { underlying: symbol, audit_details, barrier_count } = contract_info;
        const allow_scroll_to_epoch = chart_state === 'READY' || chart_state === 'SCROLL_TO_LEFT';
        const { app_routing_history, current_language, is_socket_opened } = common;
        const { is_chart_layout_default, is_chart_countdown_visible } = ui;
        const { end_epoch, chart_type, start_epoch, granularity } = contract_config || {};
        const is_dark_theme = is_dark_theme_prop || ui.is_dark_mode_on;
        const is_sold_before_started =
            !!contract_info?.is_forward_starting && !hasContractStarted(contract_info) && !!contract_info.is_sold;
        /**
         * TODO: remove forcing light theme once DBot supports dark theme
         * DBot does not support for dark theme since till now,
         * as a result, if any user come to report detail pages
         * from DBot, we should force it to have light theme
         */
        const from_platform = getPlatformRedirect(app_routing_history);
        const should_force_light_theme = from_platform.name === 'DBot';
        const settings = {
            language: current_language.toLowerCase(),
            theme: is_dark_theme && !should_force_light_theme ? 'dark' : 'light',
            position: is_chart_layout_default ? 'bottom' : 'left',
            countdown: is_chart_countdown_visible,
            assetInformation: false, // ui.is_chart_asset_info_visible,
            isHighestLowestMarkerEnabled: false, // TODO: Pending UI
        };
        const scroll_to_epoch = allow_scroll_to_epoch && contract_config ? contract_config.scroll_to_epoch : undefined;
        const all_ticks = audit_details ? audit_details.all_ticks : [];
        const { wsForget, wsSubscribe, wsSendRequest, wsForgetStream } = trade;

        const isBottomWidgetVisible = () => {
            return !isMobile && is_digit_contract;
        };

        const getChartYAxisMargin = () => {
            const chart_margin = {
                top: isMobile ? 96 : 148,
                bottom: isBottomWidgetVisible() ? 128 : 112,
            };

            if (isMobile) {
                chart_margin.bottom = 48;
                chart_margin.top = 48;
            }

            return chart_margin;
        };
        const prev_start_epoch = usePrevious(start_epoch);

        const has_ended = !!getEndTime(contract_info);

        return (
            <SmartChart
                id='replay'
                barriers={barriers_array}
                bottomWidgets={isBottomWidgetVisible() ? ChartBottomWidgets : undefined}
                chartControlsWidgets={null}
                chartType={chart_type}
                endEpoch={end_epoch}
                margin={margin}
                isMobile={isMobile}
                enabledNavigationWidget={!isMobile}
                enabledChartFooter={false}
                granularity={granularity}
                requestAPI={wsSendRequest}
                requestForget={wsForget}
                requestForgetStream={wsForgetStream}
                crosshair={isMobile ? 0 : undefined}
                maxTick={isMobile ? 8 : undefined}
                requestSubscribe={wsSubscribe}
                settings={settings}
                startEpoch={is_sold_before_started ? contract_info.purchase_time : start_epoch}
                scrollToEpoch={scroll_to_epoch}
                stateChangeListener={chartStateChange}
                symbol={symbol}
                allTicks={all_ticks}
                topWidgets={ChartTopWidgets}
                isConnectionOpened={is_socket_opened}
                isStaticChart={
                    // forcing chart reload when start_epoch changes to an earlier epoch for ACCU closed contract:
                    !!is_accumulator_contract && !!end_epoch && Number(start_epoch) < Number(prev_start_epoch)
                }
                shouldFetchTradingTimes={false}
                should_zoom_out_on_yaxis={is_accumulator_contract}
                yAxisMargin={getChartYAxisMargin()}
                anchorChartToLeft={isMobile}
                shouldFetchTickHistory={
                    getDurationUnitText(getDurationPeriod(contract_info)) !== 'seconds' ||
                    contract_info.status === 'open'
                }
                shouldDrawTicksFromContractInfo={is_accumulator_contract}
                contractInfo={contract_info}
                contracts_array={getContractsArray()}
                isLive={!has_ended}
                startWithDataFitMode={true}
            >
                {markers_array.map(({ content_config, marker_config, react_key, type }) => (
                    <ChartMarker
                        key={react_key}
                        marker_config={marker_config}
                        marker_content_props={content_config}
                        is_positioned_before={(type === 'SPOT_ENTRY' || type === 'SPOT_EXIT') && barrier_count === 2}
                    />
                ))}
                {is_reset_contract && contract_info?.reset_time && (
                    <ResetContractChartElements contract_info={contract_info} />
                )}
            </SmartChart>
        );
    }
);
export default ReplayChart;
