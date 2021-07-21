import React from 'react';
import { useLocation } from 'react-router-dom';
import { PlatformContext, deriv_urls, routes } from '@deriv/shared';
import DefaultHeader from './default-header.jsx';
import DashboardPlatformHeader from './dashboard-platform-header.jsx';
import DashboardHeader from './dashboard-header.jsx';
import SignupOnboardingHeader from './signup-onboarding-header.jsx';

const Header = () => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const { pathname } = useLocation();

    if (is_dashboard) {
        /**
         * The below line will implement when the new domain myapps.deriv.com added.
         */
        if (window.location.hostname === deriv_urls.DERIV_DASHBOARD_HOST_NAME) return <DashboardPlatformHeader />;
        return <DashboardHeader />;
    }

    if (pathname === routes.onboarding) {
        return <SignupOnboardingHeader />;
    }

    return <DefaultHeader />;
};

export default Header;
