import React from 'react';
import CashierStoreProvider from '@deriv/cashier/src/cashier-providers';
import CFDStoreProvider from '@deriv/cfd/src/cfd-providers';
import { StoreProvider } from '@deriv/stores';
import AppContent from './app-content';
import { APIProvider } from '@deriv/api';
import './app.scss';

type TProps = {
    passthrough: {
        root_store: React.ComponentProps<typeof StoreProvider>['store'];
    };
};

const App: React.FC<TProps> = ({ passthrough: { root_store } }) => (
    <CashierStoreProvider store={root_store}>
        <CFDStoreProvider store={root_store}>
            <StoreProvider store={root_store}>
                <APIProvider>
                    <AppContent />
                </APIProvider>
            </StoreProvider>
        </CFDStoreProvider>
    </CashierStoreProvider>
);

export default App;
