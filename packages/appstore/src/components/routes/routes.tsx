import * as React from 'react';
import { Switch } from 'react-router-dom';
import RouteWithSubroutes from './route-with-sub-routes.jsx';
import { Localize } from '@deriv/translations';
import { observer } from 'mobx-react-lite';
import getRoutesConfig from 'Constants/routes-config';
import { TRoute } from 'Types';

const Routes: React.FC = () => {
    return (
        <React.Suspense
            fallback={
                <div>
                    <Localize i18n_default_text='Loading...' />
                </div>
            }
        >
            <Switch>
                {getRoutesConfig().map((route: TRoute, idx: number) => (
                    <RouteWithSubroutes key={idx} {...route} />
                ))}
            </Switch>
        </React.Suspense>
    );
};

export default observer(Routes);
