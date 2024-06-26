import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import ToolbarWidgets from './toolbar-widgets';
import { ChartTitle, SmartChart } from './v1';

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const barriers: [] = [];
    const { common, ui } = useStore();
    const { chart_store, run_panel, dashboard } = useDBotStore();

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
    const {
        ui: { is_desktop, is_mobile },
    } = useStore();
    const { is_drawer_open } = run_panel;
    const { is_chart_modal_visible } = dashboard;
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
                'dashboard__chart-wrapper--expanded': is_drawer_open && is_desktop,
                'dashboard__chart-wrapper--modal': is_chart_modal_visible && is_desktop,
            })}
            dir='ltr'
        >
            <SmartChart
                id='dbot'
                barriers={barriers}
                showLastDigitStats={show_digits_stats}
                chartControlsWidgets={null}
                enabledChartFooter={false}
                chartStatusListener={(v: boolean) => setChartStatus(!v)}
                toolbarWidget={() => (
                    <ToolbarWidgets
                        updateChartType={updateChartType}
                        updateGranularity={updateGranularity}
                        position={is_desktop ? null : 'bottom'}
                    />
                )}
                chartType={chart_type}
                isMobile={is_mobile}
                enabledNavigationWidget={is_desktop}
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
                isLive
                leftMargin={80}
            />
        </div>
    );
});

export default Chart;
