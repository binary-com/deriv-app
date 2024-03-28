import React from 'react';
import Routes from './Containers/routes';
import ResetTradingPassword from './Containers/reset-trading-password';
import { NetworkStatusToastErrorPopup } from './Containers/toast-popup';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { POIProvider } from '@deriv/shared';

// TODO: add correct types for WS after implementing them
type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
        WS: Record<string, any>;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store } = passthrough;

    const { notification_messages_ui: Notifications } = root_store.ui;

    return (
        <StoreProvider store={root_store}>
            <NetworkStatusToastErrorPopup />
            <APIProvider>
                <POIProvider>
                    {Notifications && <Notifications />}
                    <Routes />
                    <ResetTradingPassword />
                </POIProvider>
            </APIProvider>
        </StoreProvider>
    );
};

export default App;
