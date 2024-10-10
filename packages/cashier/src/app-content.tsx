import React from 'react';
import { observer, useStore } from '@deriv/stores';
import Routes from './containers/routes';
import useUnsafeCashierRouteHandler from './containers/routes/useUnsafeCashierRouteHandler';

const AppContent: React.FC = observer(() => {
    const { ui } = useStore();
    const { notification_messages_ui: Notifications } = ui;
    useUnsafeCashierRouteHandler();

    return (
        <>
            {Notifications && <Notifications />}
            <Routes />
        </>
    );
});

export default AppContent;
