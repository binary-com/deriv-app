import React from 'react';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import type { TWebSocket } from 'Types';
import { DBotStoreProvider } from 'Stores/useDBotStore';

const DBotProviders = ({ children, store, WS }: React.PropsWithChildren<{ store: TStores; WS: TWebSocket }>) => {
    return (
        <StoreProvider store={store}>
            <APIProvider>
                <DBotStoreProvider ws={WS}>{children}</DBotStoreProvider>
            </APIProvider>
        </StoreProvider>
    );
};

export default DBotProviders;
