import React, { Suspense } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { BASE_URL, BUY_SELL_URL } from '@/constants';
import { Loader } from '@deriv-com/ui';
import { routes } from './routes-config';

const prefix = '/cashier/p2p-v2';

type TRoutes = `${typeof prefix}/cashier/p2p-v2` | `${typeof prefix}`;

declare module 'react-router-dom' {
    export function useHistory(): {
        goBack: () => void;
        push: (path: TRoutes | string) => void;
        replace(arg0: { pathname: string; search: string }): void;
    };

    export function useRouteMatch(path: TRoutes): boolean;
}

type TRoutesWithSubRoutes = {
    component: React.FC<RouteComponentProps>;
    path: string;
    routes?: TRoutesWithSubRoutes[];
};

const RouteWithSubRoutes = (route: TRoutesWithSubRoutes) => {
    return (
        <Switch>
            {route.routes &&
                route.routes.map(subRoute => (
                    <Route
                        key={subRoute.path}
                        path={subRoute.path}
                        render={props => <subRoute.component {...props} />}
                    />
                ))}
            <Route path={route.path} render={props => <route.component {...props} />} />
        </Switch>
    );
};

const Router: React.FC = () => {
    return (
        <Suspense fallback={<Loader isFullScreen />}>
            <Switch>
                {routes.map(route => (
                    <RouteWithSubRoutes key={route.path} {...route} />
                ))}
                {/* TODO: Add 404 page here once ready */}
                <Redirect exact from={`${BASE_URL}/*`} to={BUY_SELL_URL} />
                <Redirect exact from={BASE_URL} to={BUY_SELL_URL} />
            </Switch>
        </Suspense>
    );
};

export default Router;
