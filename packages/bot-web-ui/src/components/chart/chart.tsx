import React from 'react';
import classNames from 'classnames';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import ToolbarWidgets from './toolbar-widgets';
import { ChartTitle, SmartChart } from './v1';
import { ChartTitleBeta, SmartChartBeta } from './v2';

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const barriers: [] = [];
    const { common, ui, client } = useStore();
    const { chart_store, run_panel } = useDBotStore();

    const {
        chart_type,
        getMarketsOrder,
        granularity,
        onSymbolChange,
        setChartStatus,
        symbol,
        updateChartType,
        updateGranularity,
        wsForget,
        wsForgetStream,
        wsSendRequest,
        wsSubscribe,
    } = chart_store;
    const { is_drawer_open } = run_panel;
    const is_socket_opened = common.is_socket_opened;
    const settings = {
        assetInformation: false, // ui.is_chart_asset_info_visible,
        countdown: true,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    };

    return (
        <div
            className={classNames('dashboard__chart-wrapper', {
                'dashboard__chart-wrapper--expanded': is_drawer_open && !isMobile(),
            })}
        >
            {client.is_beta_chart && (
                <SmartChartBeta
                    id='dbot'
                    barriers={barriers}
                    showLastDigitStats={show_digits_stats}
                    chartControlsWidgets={null}
                    enabledChartFooter={false}
                    chartStatusListener={v => setChartStatus(!v)}
                    toolbarWidget={() => (
                        <ToolbarWidgets
                            is_beta_chart={true}
                            updateChartType={updateChartType}
                            updateGranularity={updateGranularity}
                        />
                    )}
                    chartType={chart_type}
                    isMobile={isMobile()}
                    enabledNavigationWidget={isDesktop()}
                    granularity={granularity}
                    requestAPI={wsSendRequest}
                    requestForget={wsForget}
                    requestForgetStream={wsForgetStream}
                    requestSubscribe={wsSubscribe}
                    settings={settings}
                    symbol={symbol}
                    topWidgets={() => <ChartTitleBeta onChange={onSymbolChange} />}
                    isConnectionOpened={is_socket_opened}
                    getMarketsOrder={getMarketsOrder}
                    isLive={true}
                    leftMargin={80}
                />
            )}
            {!client.is_beta_chart && (
                <SmartChart
                    id='dbot'
                    barriers={barriers}
                    showLastDigitStats={show_digits_stats}
                    chartControlsWidgets={null}
                    enabledChartFooter={false}
                    chartStatusListener={v => setChartStatus(!v)}
                    toolbarWidget={() => (
                        <ToolbarWidgets
                            is_beta_chart={false}
                            updateChartType={updateChartType}
                            updateGranularity={updateGranularity}
                        />
                    )}
                    chartType={chart_type}
                    isMobile={isMobile()}
                    enabledNavigationWidget={isDesktop()}
                    granularity={granularity}
                    requestAPI={wsSendRequest}
                    requestForget={wsForget}
                    requestForgetStream={wsForgetStream}
                    requestSubscribe={wsSubscribe}
                    settings={settings}
                    symbol={symbol}
                    topWidgets={() => <ChartTitle onChange={onSymbolChange} />}
                    isConnectionOpened={is_socket_opened}
                    getMarketsOrder={getMarketsOrder}
                />
            )}
        </div>
    );
});

export default Chart;
