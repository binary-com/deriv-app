import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { redirectToLogin, routes, removeBranchName, default_title, isEmptyObject } from '@deriv-lib/shared';
import { getLanguage } from '@deriv-lib/translations';
import { TBinaryRoutes, TRoute, TRouteConfig } from 'Types';

type TRouteWithSubRoutesProps = TRouteConfig & TBinaryRoutes;

const RouteWithSubRoutes = (route: TRouteWithSubRoutesProps) => {
    const renderFactory = (props: RouteComponentProps) => {
        let result = null;
        const { location } = props;

        if (route.component === Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else if (route.is_authenticated && !route.is_logging_in && !route.is_logged_in) {
            redirectToLogin(route.is_logged_in, getLanguage());
        } else {
            const default_subroute: TRoute = (route.routes ?? []).reduce(
                (acc: TRoute, cur: TRoute) => ({
                    ...acc,
                    ...cur.subroutes?.find((subroute: TRoute) => subroute.default),
                }),
                {}
            );
            const has_default_subroute = !isEmptyObject(default_subroute);
            const pathname = removeBranchName(location.pathname);

            const RouteComponent = route.component as React.ElementType;

            result = (
                <React.Fragment>
                    {has_default_subroute && pathname === route.path && <Redirect to={default_subroute.path} />}
                    <RouteComponent {...props} routes={route.routes} />
                </React.Fragment>
            );
        }

        const title = route.getTitle?.() || '';
        document.title = `${title} | ${default_title}`;

        return result;
    };

    return <Route exact={route.exact} path={route.path} render={renderFactory} />;
};

export default RouteWithSubRoutes;
