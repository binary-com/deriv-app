import React from 'react';
import ReactDOM from 'react-dom';
import { ChartTitle } from 'Modules/SmartChart';
import { useTraderStore } from 'Stores/useTraderStores';
import RecentTradeInfo from './recent-trade-info';

type TTopWidgets = {
    InfoBox?: React.ReactNode;
    is_digits_widget_active?: boolean;
    is_mobile?: boolean;
    is_title_enabled?: boolean;
    onSymbolChange?: ReturnType<typeof useTraderStore>['onChange'];
    open?: boolean;
    open_market?: {
        category?: string;
        subcategory?: string;
    } | null;
    theme?: string;
    y_axis_width?: number;
};

const TopWidgets = ({
    InfoBox,
    is_mobile,
    is_title_enabled = true,
    onSymbolChange,
    theme,
    open_market,
    open,
    is_digits_widget_active,
}: TTopWidgets) => {
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
            <div className='top-widgets-portal'>
                {ChartTitleLocal}
                {!is_digits_widget_active && <RecentTradeInfo />}
            </div>
        </div>,
        document.getElementById('app_contents') as Element | DocumentFragment
    );

    return (
        <React.Fragment>
            {InfoBox}
            {is_mobile ? portal : ChartTitleLocal}
        </React.Fragment>
    );
};

export default TopWidgets;
