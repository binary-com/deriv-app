import React from 'react';
import { Switch, Prompt, useLocation } from 'react-router-dom';
import { Loading } from '@deriv/components';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { routes } from '@deriv/shared';

const BinaryRoutes = observer(props => {
    const { ui, gtm } = useStore();
    const { isMobile } = useDevice();
    const { promptFn, prompt_when } = ui;
    const { pushDataLayer } = gtm;
    const location = useLocation();
    React.useEffect(() => {
        pushDataLayer({ event: 'page_load' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const getLoader = () => {
        const should_show_dtrader_v2_loader =
            JSON.parse(localStorage.getItem('FeatureFlagsStore') ?? '').data.dtrader_v2 && isMobile;
        if (should_show_dtrader_v2_loader)
            return (
                <Loading.DTraderV2
                    initial_app_loading
                    is_contract_details={window.location.pathname.startsWith('/contract/')}
                    is_positions={window.location.pathname === routes.trader_positions}
                />
            );
        return <Loading />;
    };

    return (
        <React.Suspense fallback={getLoader()}>
            <Prompt when={prompt_when} message={promptFn} />
            <Switch>
                {getRoutesConfig().map((route, idx) => (
                    <RouteWithSubRoutes key={idx} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
});

export default BinaryRoutes;
