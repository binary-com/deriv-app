import React from 'react';
import { Switch, Prompt, useLocation } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { PlatformContext } from '@deriv/shared';
import { connect } from 'Stores/connect';
import getRoutesConfig from 'App/Constants/routes-config';
import RouteWithSubRoutes from './route-with-sub-routes.jsx';

const BinaryRoutes = props => {
    const location = useLocation();
    const { is_appstore } = React.useContext(PlatformContext);
    const { is_social_signup } = props;
    React.useEffect(() => {
        props.pushDataLayer({ event: 'page_load' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <React.Suspense fallback={<Loading />}>
            <Prompt when={props.prompt_when} message={props.promptFn} />
            <Switch>
                {getRoutesConfig({ is_appstore }, is_social_signup).map(route => (
                    <RouteWithSubRoutes key={route?.getTitle?.() || route?.path} {...route} {...props} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default connect(({ ui, gtm, client }) => ({
    prompt_when: ui.prompt_when,
    promptFn: ui.promptFn,
    pushDataLayer: gtm.pushDataLayer,
    is_social_signup: client.is_social_signup,
}))(BinaryRoutes);
