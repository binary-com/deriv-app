import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isEnded, isDigitContract, isAccumulatorContract } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { ChartTitle } from 'Modules/SmartChart';

const TickCounter = React.memo(({ current_tick }) => (
    <div className='tick-counter'>
        <Text className='tick-counter__name' size='xxxs'>
            {localize('Tick')}
        </Text>
        <Text as='span' weight='bold' className='tick-counter__count' size='xs'>
            {current_tick}
        </Text>
    </div>
));
TickCounter.displayName = 'TickCounter';

const TradeInfo = ({ markers_array, granularity }) => {
    const latest_tick_contract = markers_array[markers_array.length - 1];
    if (!latest_tick_contract || !latest_tick_contract.contract_info.tick_stream) return null;

    const is_ended = isEnded(latest_tick_contract.contract_info);
    if (is_ended || granularity !== 0) return null;

    const { contract_type, tick_stream, tick_count } = latest_tick_contract.contract_info;
    const is_accumulator = isAccumulatorContract(contract_type);
    const current_tick =
        isDigitContract(contract_type) || is_accumulator ? tick_stream.length : Math.max(tick_stream.length - 1, 0);
    return is_accumulator ? (
        <TickCounter current_tick={current_tick} />
    ) : (
        <Text weight='bold' className='recent-trade-info'>
            {localize('Tick')} {current_tick}/{tick_count}
        </Text>
    );
};

const RecentTradeInfo = connect(({ contract_trade }) => ({
    granularity: contract_trade.granularity,
    markers_array: contract_trade.markers_array,
}))(TradeInfo);

const TopWidgets = ({
    InfoBox,
    is_mobile,
    is_title_enabled = true,
    onSymbolChange,
    y_axis_width,
    theme,
    open_market,
    open,
    is_digits_widget_active,
    show_accumulator_tick_counter,
}) => {
    const ChartTitleLocal = (
        <ChartTitle
            open_market={open_market}
            open={open}
            enabled={is_title_enabled}
            onChange={onSymbolChange}
            searchInputClassName='data-hj-whitelist'
            isNestedList={is_mobile}
            portalNodeId={is_mobile ? 'deriv_app' : undefined}
        />
    );

    const portal = ReactDOM.createPortal(
        <div className={`smartcharts-${theme}`}>
            <div
                className='top-widgets-portal'
                style={{
                    width: `calc(100% - ${y_axis_width ? y_axis_width + 5 : 0}px)`,
                }}
            >
                {ChartTitleLocal}
                {!is_digits_widget_active && <RecentTradeInfo />}
            </div>
        </div>,
        document.getElementById('app_contents')
    );

    return (
        <React.Fragment>
            {InfoBox}
            <MobileWrapper>{portal}</MobileWrapper>
            <DesktopWrapper>
                {ChartTitleLocal}
                {show_accumulator_tick_counter && <RecentTradeInfo />}
            </DesktopWrapper>
        </React.Fragment>
    );
};

TopWidgets.propTypes = {
    InfoBox: PropTypes.node,
    is_mobile: PropTypes.bool,
    is_title_enabled: PropTypes.bool,
    onSymbolChange: PropTypes.func,
    show_accumulator_tick_counter: PropTypes.bool,
};

export default TopWidgets;
