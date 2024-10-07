import Routes from './Containers/routes';
import ResetTradingPassword from './Containers/reset-trading-password';
import NetworkStatusToastPopup from './Components/network-status-toast-popup/network-status-toast-popup';
import { APIProvider } from '@deriv/api';
import { StoreProvider } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { POIProvider } from '@deriv/shared';

// TODO: add correct types for WS after implementing them
type TAppProps = {
    passthrough: {
        root_store: TCoreStores;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        WS: Record<string, any>;
    };
};

const App = ({ passthrough }: TAppProps) => {
    const { root_store } = passthrough;

    const { notification_messages_ui: Notifications } = root_store.ui;

    return (
        <StoreProvider store={root_store}>
            <APIProvider>
                <POIProvider>
                    {Notifications && <Notifications />}
                    <Routes />
                    <ResetTradingPassword />
                </POIProvider>
            </APIProvider>
            <NetworkStatusToastPopup />
        </StoreProvider>
    );
};

export default App;
