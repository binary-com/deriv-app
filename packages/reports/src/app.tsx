import React from 'react';
import Loadable from 'react-loadable';
import Routes from 'Containers/routes';
import ReportsProviders from './reports-providers';
import 'Sass/app.scss';
import type { TCoreStores } from '@deriv/stores/types';

type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
    };
};

const TradeModals = Loadable({
    loader: () => import(/* webpackChunkName: "trade-modals", webpackPrefetch: true */ './Components/Modals'),
    loading: () => null,
});

const App = ({ passthrough }: TAppProps) => {
    return (
        <ReportsProviders store={passthrough.root_store}>
            <Routes />
            <TradeModals />
        </ReportsProviders>
    );
};

export default App;
