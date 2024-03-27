import React from 'react';
import Loadable from 'react-loadable';
import Routes from 'App/Containers/Routes/routes';
import TradeHeaderExtensions from 'App/Containers/trade-header-extensions';
import TradeFooterExtensions from 'App/Containers/trade-footer-extensions';
import TradeSettingsExtensions from 'App/Containers/trade-settings-extensions';
import { NetworkStatusToastErrorPopup } from 'Modules/Trading/Containers/toast-popup';
import type { TWebSocket } from 'Types';
import initStore from './init-store';
import 'Sass/app.scss';
import type { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../trader-providers';

type Apptypes = {
    passthrough: {
        root_store: TCoreStores;
        WS: TWebSocket;
    };
};

const TradeModals = Loadable({
    loader: () => import(/* webpackChunkName: "trade-modals", webpackPrefetch: true */ './Containers/Modals'),
    loading: () => null,
});

const App = ({ passthrough }: Apptypes) => {
    const root_store = initStore(passthrough.root_store, passthrough.WS);
    React.useEffect(() => {
        return () => root_store.ui.setPromptHandler(false);
    }, [root_store]);

    React.useEffect(() => {
        const landscapeBlockerElement = document.querySelector('.landscape-blocker');
        if (landscapeBlockerElement) {
            landscapeBlockerElement.classList.add('landscape-blocker--hidden');
        }

        return () => {
            if (landscapeBlockerElement) {
                landscapeBlockerElement.classList.remove('landscape-blocker--hidden');
            }
        };
    }, []);

    return (
        <TraderProviders store={root_store}>
            <Routes />
            <TradeModals />
            <NetworkStatusToastErrorPopup />
            <TradeHeaderExtensions store={root_store} />
            <TradeFooterExtensions />
            <TradeSettingsExtensions store={root_store} />
        </TraderProviders>
    );
};

export default App;
