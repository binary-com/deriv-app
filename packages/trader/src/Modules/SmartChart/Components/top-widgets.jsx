import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { DesktopWrapper, MobileWrapper, Text, Toast } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isEnded, isDigitContract } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { ChartTitle } from 'Modules/SmartChart';

const TradeInfo = ({ markers_array, granularity }) => {
    const latest_tick_contract = markers_array[markers_array.length - 1];
    if (!latest_tick_contract || !latest_tick_contract.contract_info.tick_stream) return null;

    const is_ended = isEnded(latest_tick_contract.contract_info);
    if (is_ended || granularity !== 0) return null;

    const { contract_type, tick_stream, tick_count } = latest_tick_contract.contract_info;
    const current_tick = isDigitContract(contract_type) ? tick_stream.length : Math.max(tick_stream.length - 1, 0);
    return (
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
    action_toastbox,
    actionChangeToastbox,
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

    const BuyNotificationPopup = ({ portal_id = 'popup_root' }) => {
        const message = `Please be on time ${action_toastbox}`;

        // if (!document.getElementById(portal_id) || !purchase_info) return null;

        React.useEffect(() => {
            setTimeout(() => {
                actionChangeToastbox(false);
            }, 4000);
        }, []);

        return ReactDOM.createPortal(
            <MobileWrapper>
                <Toast className='dc-toat-popup4' is_open={action_toastbox} timeout={0} type='info'>
                    {message}
                </Toast>
            </MobileWrapper>,
            document.getElementById(portal_id)
        );
    };

    const portal = ReactDOM.createPortal(
        <div className={`smartcharts-${theme}`}>
            <div
                className='top-widgets-portal'
                style={{
                    width: `calc(100% - ${y_axis_width ? y_axis_width + 5 : 0}px)`,
                }}
            >
                {is_mobile && action_toastbox && <BuyNotificationPopup />}
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
            <DesktopWrapper>{ChartTitleLocal}</DesktopWrapper>
        </React.Fragment>
    );
};

TopWidgets.propTypes = {
    InfoBox: PropTypes.node,
    is_digits_widget_active: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_title_enabled: PropTypes.bool,
    onSymbolChange: PropTypes.func,
    open: PropTypes.bool,
    open_market: PropTypes.object,
    theme: PropTypes.string,
    y_axis_width: PropTypes.number,
    proposal_info: PropTypes.object,
    purchase_info: PropTypes.object,
    action_toastbox: PropTypes.bool,
    actionChangeToastbox: PropTypes.func,
};

export default connect(({ modules }) => ({
    proposal_info: modules.trade.proposal_info,
    purchase_info: modules.trade.purchase_info,
    action_toastbox: modules.trade.action_toastbox,
    actionChangeToastbox: modules.trade.actionChangeToastbox,
}))(TopWidgets);
