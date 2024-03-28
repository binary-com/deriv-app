import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { redirectToLogin, removeBranchName, routes, isEmptyObject, default_title } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import Page404 from 'Modules/Page404';
import { TBinaryRoutesProps, TRouteConfig } from 'Types';

type TRouteWithSubRoutesProps = TRouteConfig & TBinaryRoutesProps;

const RouteWithSubRoutes = (route: TRouteWithSubRoutesProps) => {
    const validateRoute = (pathname: string) => {
        if (pathname === '') return true;
        if (route.path?.includes(':')) {
            const static_pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
            return static_pathname === route.path.substring(0, route.path.indexOf(':'));
        }
        return route.path === pathname || !!route.routes?.find(r => pathname === r.path);
    };

    const renderFactory = (props: RouteComponentProps) => {
        let result = null;

        const pathname = removeBranchName(location.pathname).replace(/\/$/, '');
        const is_valid_route = validateRoute(pathname);

        if (route.component === Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                const { location } = props;
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else if (is_valid_route && route.is_authenticated && !route.is_logging_in && !route.is_logged_in) {
            redirectToLogin(route.is_logged_in, getLanguage());
        } else {
            const default_subroute = route.routes ? route.routes.find(r => r.default) : {};
            const has_default_subroute = !isEmptyObject(default_subroute);
            const RouteComponent = route.component as React.ElementType;
            result = (
                <React.Fragment>
                    {has_default_subroute && pathname === route.path && <Redirect to={default_subroute?.path} />}
                    {is_valid_route ? <RouteComponent {...props} routes={route.routes} /> : <Page404 />}
                </React.Fragment>
            );
        }

        const title = route.getTitle?.() ?? '';
        document.title = `${title} | ${default_title}`;

        return result;
    };

    return <Route exact={route.exact} path={route.path} render={renderFactory} />;
};

export default RouteWithSubRoutes;
