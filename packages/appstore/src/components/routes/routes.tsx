import * as React from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { Switch, useHistory } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';

const Onboarding = React.lazy(() => import(/* webpackChunkName: "modules-onboarding" */ 'Modules/onboarding'));
const TradersHub = React.lazy(() => import(/* webpackChunkName: "modules-traders-hub" */ 'Modules/traders-hub'));

const Routes: React.FC = observer(() => {
    const { client } = useStore();
    const { has_wallet } = client;
    const history = useHistory();

    React.useLayoutEffect(() => {
        if (has_wallet) history.push(routes.wallets);
    }, [history, has_wallet]);

    return (
        <React.Suspense fallback={<Loading />}>
            <Switch>
                <RouteWithSubroutes
                    path={'/appstore/traders-hub'}
                    component={TradersHub}
                    getTitle={() => localize("Trader's Hub")}
                />
                <RouteWithSubroutes
                    path={'/appstore/onboarding'}
                    component={Onboarding}
                    getTitle={() => localize('Onboarding')}
                />
            </Switch>
        </React.Suspense>
    );
});

export default Routes;
