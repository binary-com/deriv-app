import React from 'react';
import { moduleLoader } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

const AppStore = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "appstore" */ '@deriv/appstore');
    })
);

const Wallets = React.lazy(() =>
    moduleLoader(() => {
        // eslint-disable-next-line import/no-unresolved
        return import(/* webpackChunkName: "wallets" */ '@deriv/wallets');
    })
);

const RootComponent = observer(props => {
    const { client } = useStore();
    const { has_wallet, logout } = client;
    return has_wallet ? (
        <Wallets
            logout={async () => {
                await logout();
            }}
        />
    ) : (
        <AppStore {...props} />
    );
});

export default RootComponent;
