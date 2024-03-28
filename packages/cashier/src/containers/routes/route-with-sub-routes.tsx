import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Redirect, Route } from 'react-router-dom';
import { redirectToLogin, routes, removeBranchName, default_title } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { TRootStore, TRouteConfig, TRoute } from '../../types';

type TRouteWithSubRoutesProps = TRouteConfig & {
    is_logged_in: TRootStore['client']['is_logged_in'];
    is_logging_in: TRootStore['client']['is_logging_in'];
};

type TDefaultSubroute = TRoute | undefined;

const RouteWithSubRoutes = (route: TRouteWithSubRoutesProps) => {
    const renderFactory = (props: RouteComponentProps) => {
        let result = null;
        if (route.component === Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                const { location } = props;
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else if (route.is_authenticated && !route.is_logging_in && !route.is_logged_in) {
            redirectToLogin(route.is_logged_in, getLanguage());
        } else {
            const default_subroute: TDefaultSubroute = route.routes?.find(r => r.default);
            const pathname = removeBranchName(location.pathname);
            result = (
                <React.Fragment>
                    {!!default_subroute && pathname === route.path && <Redirect to={default_subroute.path} />}
                    <route.component {...props} routes={route.routes} />
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
