import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isEmptyObject, routes, removeBranchName } from '@deriv/shared';

import { redirectToLogin, redirectToSignUp } from 'Duplicated/_common/base/login';
import LoginPrompt from 'Duplicated/App/Components/Elements/login-prompt.jsx';
import { default_title } from 'Duplicated/App/Constants/app-config';

const RouteWithSubRoutes = (route) => {
    const renderFactory = (props) => {
        let result = null;
        if (route.component === Redirect) {
            let to = route.to;

            // This if clause has been added just to remove '/index' from url in localhost env.
            if (route.path === routes.index) {
                const { location } = props;
                to = location.pathname.toLowerCase().replace(route.path, '');
            }
            result = <Redirect to={to} />;
        } else if (route.is_authenticated && !route.is_logged_in) {
            result = (
                <LoginPrompt
                    onLogin={() => redirectToLogin(route.is_logged_in)}
                    onSignup={redirectToSignUp}
                    page_title={route.title}
                />
            );
        } else {
            const default_subroute = route.routes ? route.routes.find((r) => r.default) : {};
            const has_default_subroute = !isEmptyObject(default_subroute);
            const pathname = removeBranchName(location.pathname);
            result = (
                <React.Fragment>
                    {has_default_subroute && pathname === route.path && <Redirect to={default_subroute.path} />}
                    <route.component {...props} routes={route.routes} />
                </React.Fragment>
            );
        }

        const title = route.title ? `${route.title} | ` : '';
        document.title = `${title}${default_title}`;
        return result;
    };

    return <Route exact={route.exact} path={route.path} render={renderFactory} />;
};

export { RouteWithSubRoutes as RouteWithSubRoutesRender }; // For tests

export default RouteWithSubRoutes;
