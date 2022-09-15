import React from 'react';
import { PlatformContext, routes } from '@deriv/shared';
import DefaultHeader from './default-header.jsx';
import DashboardPlatformHeader from './dashboard-platform-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import TradingHubHeader from './trading-hub-header.jsx';
import DTraderHeader from './dtrader-header.jsx';
import { connect } from 'Stores/connect';
import { useLocation } from 'react-router-dom';

const Header = ({ is_logged_in }) => {
    const { is_appstore, is_pre_appstore } = React.useContext(PlatformContext);
    const { pathname } = useLocation();

    if (is_appstore) {
        /**
         * The below line will implement when the new domain myapps.deriv.com added.
         */
        if (/myapps.deriv/.test(window.location.pathname)) return <DashboardPlatformHeader />;
        return <DashboardHeader />;
    } else if (is_logged_in && is_pre_appstore) {
        let result;
        if (
            pathname === routes.trading_hub ||
            pathname.startsWith(routes.cashier) ||
            pathname.startsWith(routes.account)
        ) {
            result = <TradingHubHeader />;
        } else {
            result = <DTraderHeader />;
        }
        return result;
    }
    return <DefaultHeader />;
};

export default connect(({ client }) => ({
    is_logged_in: client.is_logged_in,
}))(Header);
