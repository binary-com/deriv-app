import React from 'react';
import { Redirect, RedirectProps, Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import {
    redirectToLogin,
    removeBranchName,
    routes as shared_routes,
    isEmptyObject,
    default_title,
} from '@deriv/shared';

type TRoute = RouteProps & { default: boolean };

type TRoutesWithSubRoutesProps = {
    component: React.ElementType | typeof Redirect;
    exact?: boolean;
    getTitle?: () => string;
    is_authenticated?: boolean;
    is_logged_in?: boolean;
    path: string;
    routes: TRoute[];
    to: RedirectProps['to'];
    language: string;
    Component404: React.ElementType;
    should_redirect_login: boolean;
};

const RouteWithSubRoutes = ({
    component: Component,
    exact,
    getTitle,
    is_authenticated,
    is_logged_in = false,
    path,
    routes,
    to,
    language,
    Component404,
    should_redirect_login,
}: TRoutesWithSubRoutesProps) => {
    const validateRoute = (pathname: string) => {
        if (pathname === '') return true;

        if (path?.includes(':')) {
            const static_pathname = pathname.substring(0, pathname.lastIndexOf('/') + 1);
            return static_pathname === path.substring(0, path.indexOf(':'));
        }

        return path === pathname || !!(routes && routes.find(route => pathname === route.path));
    };

    const renderFactory = (props: RouteComponentProps<{ [key: string]: string | undefined }>) => {
        let result = null;

        if (Component === Redirect) {
            let redirect_to = to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (path === shared_routes.index) {
                /* eslint-disable react/prop-types */
                const { location } = props;
                redirect_to = location.pathname.toLowerCase().replace(path, '');
            }

            result = <Redirect to={redirect_to} />;
        } else if (is_authenticated && !is_logged_in) {
            if (should_redirect_login) {
                redirectToLogin(is_logged_in, language);
            } else {
                result = <Redirect to={shared_routes.root} />;
            }
        } else {
            const default_subroute = routes.find(r => r.default);
            const pathname = removeBranchName(location.pathname).replace(/\/$/, '');
            const is_valid_route = validateRoute(pathname);
            const should_redirect = !Component404;

            result = (
                <React.Fragment>
                    {default_subroute && pathname === path && <Redirect to={default_subroute.path} />}
                    {is_valid_route ? (
                        <Component {...props} routes={routes} />
                    ) : (
                        <React.Fragment>
                            {should_redirect ? <Redirect to={shared_routes.root} /> : <Component404 />}
                        </React.Fragment>
                    )}
                </React.Fragment>
            );
        }

        const title = getTitle?.() || '';
        document.title = `${title} | ${default_title}`;

        return result;
    };

    return <Route exact={exact} path={path} render={renderFactory} />;
};

export { RouteWithSubRoutes as RouteWithSubRoutesRender }; // For tests

export default RouteWithSubRoutes;
