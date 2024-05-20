import React from 'react';
import type { TWebSocket } from 'Types';
import initStore from 'App/init-store';
import 'Sass/app.scss';
import type { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../trader-providers';
import BottomNav from './Components/BottomNav';
import Trade from './Containers/Trade';
import Markets from './Containers/Markets';
import Positions from './Containers/Positions';
import Menu from './Containers/Menu';
import { NotificationsProvider } from '@deriv-com/quill-ui';
import Notifications from './Containers/Notifications/notifications';

type Apptypes = {
    passthrough: {
        root_store: TCoreStores;
        WS: TWebSocket;
    };
};

const App = ({ passthrough }: Apptypes) => {
    const root_store = initStore(passthrough.root_store, passthrough.WS);
    React.useEffect(() => {
        return () => root_store.ui.setPromptHandler(false);
    }, [root_store]);

    return (
        <TraderProviders store={root_store}>
            <NotificationsProvider>
                <Notifications />
                <BottomNav>
                    <Trade />
                    <Markets />
                    <Positions />
                    <Menu />
                </BottomNav>
            </NotificationsProvider>
        </TraderProviders>
    );
};

export default App;
