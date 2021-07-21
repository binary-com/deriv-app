import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    DesktopWrapper,
    Div100vhContainer,
    MobileWrapper,
    PageOverlay,
    SwipeableWrapper,
    FadeWrapper,
} from '@deriv/components';
import { isDesktop, isMobile, isMultiplierContract, isEmptyObject, getPlatformRedirect, urlFor } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ChartLoader from 'App/Components/Elements/chart-loader.jsx';
import ContractDrawer from 'App/Components/Elements/ContractDrawer';
import UnsupportedContractModal from 'App/Components/Elements/Modals/UnsupportedContractModal';
import { SmartChart } from 'Modules/SmartChart';
import { connect } from 'Stores/connect';
import { ChartBottomWidgets, ChartTopWidgets, DigitsWidget, InfoBoxWidget } from './contract-replay-widget.jsx';
import ChartMarker from '../../SmartChart/Components/Markers/marker.jsx';

const ContractReplay = ({
    contract_id,
    contract_info,
    contract_update,
    contract_update_history,
    is_chart_loading,
    is_dark_theme,
    is_digit_contract,
    is_forward_starting,
    is_market_closed,
    is_sell_requested,
    is_valid_to_cancel,
    onClickCancel,
    NotificationMessages,
    onClickSell,
    indicative_status,
    toggleHistoryTab,
    routeBackInApp,
    onMount,
    onUnmount,
}) => {
    const [is_visible, setIsVisible] = React.useState(false);
    const history = useHistory();

    React.useEffect(() => {
        const url_contract_id = +/[^/]*$/.exec(location.pathname)[0];
        onMount(contract_id || url_contract_id);
        setIsVisible(true);

        return () => {
            setIsVisible(false);
            onUnmount();
        };
    }, [contract_id, location, onMount, onUnmount]);

    const onClickClose = () => {
        setIsVisible(false);
        const is_from_table_row = !isEmptyObject(location.state) ? location.state.from_table_row : false;
        return is_from_table_row ? history.goBack() : routeBackInApp(history);
    };

    if (!contract_info.underlying) return null;

    const is_multiplier = isMultiplierContract(contract_info.contract_type);

    const contract_drawer_el = (
        <ContractDrawer
            contract_info={contract_info}
            contract_update={contract_update}
            contract_update_history={contract_update_history}
            is_chart_loading={is_chart_loading}
            is_dark_theme={is_dark_theme}
            is_market_closed={is_market_closed}
            is_multiplier={is_multiplier}
            is_sell_requested={is_sell_requested}
            is_valid_to_cancel={is_valid_to_cancel}
            onClickCancel={onClickCancel}
            onClickSell={onClickSell}
            status={indicative_status}
            toggleHistoryTab={toggleHistoryTab}
        />
    );

    const unsupportedContractOnConfirm = () => {
        history.goBack();
    };

    const unsupportedContractOnClose = () => {
        window.open(urlFor('user/statementws', { legacy: true }), '_blank');
    };

    return (
        <FadeWrapper is_visible={is_visible} className='contract-details-wrapper' keyname='contract-details-wrapper'>
            <MobileWrapper>
                <NotificationMessages />
            </MobileWrapper>
            <UnsupportedContractModal
                onConfirm={unsupportedContractOnConfirm}
                onClose={unsupportedContractOnClose}
                is_visible={is_forward_starting}
            />
            <PageOverlay
                id='dt_contract_replay_container'
                header={localize('Contract details')}
                onClickClose={onClickClose}
            >
                <Div100vhContainer
                    className='trade-container__replay'
                    is_disabled={isDesktop()}
                    height_offset='80px' // * 80px = header + contract details header heights in mobile
                >
                    <DesktopWrapper>{contract_drawer_el}</DesktopWrapper>
                    <MobileWrapper>
                        <div
                            className={classNames('contract-drawer__mobile-wrapper', {
                                'contract-drawer__mobile-wrapper--is-multiplier': isMobile() && is_multiplier,
                            })}
                        >
                            {contract_drawer_el}
                        </div>
                    </MobileWrapper>
                    <React.Suspense fallback={<div />}>
                        <div
                            className={classNames('replay-chart__container', {
                                'replay-chart__container--is-multiplier': isMobile() && is_multiplier,
                            })}
                        >
                            <DesktopWrapper>
                                <NotificationMessages />
                            </DesktopWrapper>
                            <ChartLoader is_dark={is_dark_theme} is_visible={is_chart_loading} />
                            <DesktopWrapper>
                                <ReplayChart />
                            </DesktopWrapper>
                            <MobileWrapper>
                                {is_digit_contract ? (
                                    <React.Fragment>
                                        <InfoBoxWidget />
                                        <SwipeableWrapper className='replay-chart__container-swipeable-wrapper'>
                                            <DigitsWidget />
                                            <ReplayChart />
                                        </SwipeableWrapper>
                                    </React.Fragment>
                                ) : (
                                    <ReplayChart />
                                )}
                            </MobileWrapper>
                        </div>
                    </React.Suspense>
                </Div100vhContainer>
            </PageOverlay>
        </FadeWrapper>
    );
};

ContractReplay.propTypes = {
    contract_id: PropTypes.number,
    contract_info: PropTypes.object,
    indicative_status: PropTypes.string,
    is_chart_loading: PropTypes.bool,
    is_dark_theme: PropTypes.bool,
    is_digit_contract: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    routes: PropTypes.arrayOf(PropTypes.object),
};

export default connect(({ common, modules, ui }) => {
    const contract_replay = modules.contract_replay;
    const contract_store = contract_replay.contract_store;
    return {
        routeBackInApp: common.routeBackInApp,
        contract_info: contract_store.contract_info,
        contract_update: contract_store.contract_update,
        contract_update_history: contract_store.contract_update_history,
        is_digit_contract: contract_store.is_digit_contract,
        is_market_closed: contract_replay.is_market_closed,
        is_sell_requested: contract_replay.is_sell_requested,
        is_valid_to_cancel: contract_replay.is_valid_to_cancel,
        onClickCancel: contract_replay.onClickCancel,
        onClickSell: contract_replay.onClickSell,
        onMount: contract_replay.onMount,
        onUnmount: contract_replay.onUnmount,
        indicative_status: contract_replay.indicative_status,
        is_chart_loading: contract_replay.is_chart_loading,
        is_forward_starting: contract_replay.is_forward_starting,
        is_dark_theme: ui.is_dark_mode_on,
        NotificationMessages: ui.notification_messages_ui,
        toggleHistoryTab: ui.toggleHistoryTab,
    };
})(ContractReplay);

// CHART -----------------------------------------

const Chart = props => {
    const isBottomWidgetVisible = () => {
        return isDesktop() && props.is_digit_contract;
    };

    const getChartYAxisMargin = () => {
        const margin = {
            top: isMobile() ? 96 : 148,
            bottom: isBottomWidgetVisible() ? 128 : 112,
        };

        if (isMobile()) {
            margin.bottom = 48;
        }

        return margin;
    };

    return (
        <SmartChart
            barriers={props.barriers_array}
            bottomWidgets={isBottomWidgetVisible() ? ChartBottomWidgets : null}
            chartControlsWidgets={null}
            chartType={props.chart_type}
            endEpoch={props.end_epoch}
            margin={props.margin || null}
            isMobile={isMobile()}
            enabledNavigationWidget={isDesktop()}
            enabledChartFooter={false}
            granularity={props.granularity}
            requestAPI={props.wsSendRequest}
            requestForget={props.wsForget}
            requestForgetStream={props.wsForgetStream}
            crosshair={isMobile() ? 0 : undefined}
            maxTick={isMobile() ? 8 : undefined}
            requestSubscribe={props.wsSubscribe}
            settings={props.settings}
            startEpoch={props.start_epoch}
            scrollToEpoch={props.scroll_to_epoch}
            stateChangeListener={props.chartStateChange}
            symbol={props.symbol}
            topWidgets={ChartTopWidgets}
            isConnectionOpened={props.is_socket_opened}
            isStaticChart={false}
            shouldFetchTradingTimes={!props.end_epoch}
            yAxisMargin={getChartYAxisMargin()}
            anchorChartToLeft={isMobile()}
        >
            {props.markers_array.map(marker => (
                <ChartMarker
                    key={marker.react_key}
                    marker_config={marker.marker_config}
                    marker_content_props={marker.content_config}
                    is_bottom_widget_visible={isBottomWidgetVisible()}
                />
            ))}
        </SmartChart>
    );
};

Chart.propTypes = {
    barriers_array: PropTypes.array,
    BottomWidgets: PropTypes.node,
    chart_type: PropTypes.string,
    end_epoch: PropTypes.number,
    granularity: PropTypes.number,
    InfoBox: PropTypes.node,
    is_mobile: PropTypes.bool,
    is_socket_opened: PropTypes.bool,
    is_static_chart: PropTypes.bool,
    margin: PropTypes.number,
    markers_array: PropTypes.array,
    replay_controls: PropTypes.object,
    scroll_to_epoch: PropTypes.number,
    settings: PropTypes.object,
    start_epoch: PropTypes.number,
    symbol: PropTypes.string,
    wsForget: PropTypes.func,
    wsForgetStream: PropTypes.func,
    wsSendRequest: PropTypes.func,
    wsSubscribe: PropTypes.func,
};

const ReplayChart = connect(({ modules, ui, common }) => {
    const trade = modules.trade;
    const contract_replay = modules.contract_replay;
    const contract_store = contract_replay.contract_store;
    const contract_config = contract_store.contract_config;
    const allow_scroll_to_epoch =
        contract_replay.chart_state === 'READY' || contract_replay.chart_state === 'SCROLL_TO_LEFT';
    /**
     * TODO: remove forcing light theme once DBot supports dark theme
     * DBot does not support for dark theme since till now,
     * as a result, if any user come to report detail pages
     * from DBot, we should force it to have light theme
     */
    const from_platform = getPlatformRedirect(common.app_routing_history);
    const should_force_light_theme = from_platform.name === 'DBot';

    const settings = {
        language: common.current_language.toLowerCase(),
        theme: ui.is_dark_mode_on && !should_force_light_theme ? 'dark' : 'light',
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        countdown: ui.is_chart_countdown_visible,
        isHighestLowestMarkerEnabled: false, // TODO: Pending UI
    };

    return {
        end_epoch: contract_config.end_epoch,
        chart_type: contract_config.chart_type,
        start_epoch: contract_config.start_epoch,
        granularity: contract_config.granularity,
        scroll_to_epoch: allow_scroll_to_epoch ? contract_config.scroll_to_epoch : undefined,
        settings,
        is_mobile: ui.is_mobile,
        is_socket_opened: common.is_socket_opened,
        is_digit_contract: contract_store.is_digit_contract,
        chartStateChange: contract_replay.chartStateChange,
        margin: contract_replay.margin,
        is_static_chart: contract_replay.is_static_chart,
        barriers_array: contract_store.barriers_array,
        markers_array: contract_store.markers_array,
        symbol: contract_store.contract_info.underlying,
        wsForget: trade.wsForget,
        wsSubscribe: trade.wsSubscribe,
        wsSendRequest: trade.wsSendRequest,
        wsForgetStream: trade.wsForgetStream,
    };
})(Chart);
