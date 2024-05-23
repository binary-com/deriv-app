import React from 'react';
import { ToastContainer } from 'react-toastify';
import { api_base, ApiHelpers, ServerTime, setColors } from '@deriv/bot-skeleton';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import TransactionDetailsModal from 'Components/transaction-details';
import GTM from 'Utils/gtm';
import { useDBotStore } from 'Stores/useDBotStore';
import Audio from '../components/audio';
import BlocklyLoading from '../components/blockly-loading';
import BotNotificationMessages from '../components/bot-notification-messages';
import BotStopped from '../components/bot-stopped';
import NetworkToastPopup from '../components/network-toast-popup';
import RoutePromptDialog from '../components/route-prompt-dialog';
import BotBuilder from '../pages/bot-builder';
import Main from '../pages/main';
import './app.scss';
import 'react-toastify/dist/ReactToastify.css';
import '../components/bot-notification/bot-notification.scss';

const AppContent = observer(() => {
    const [is_loading, setIsLoading] = React.useState(true);
    const RootStore = useStore();
    const {
        common,
        client,
        ui: { is_dark_mode_on },
    } = RootStore;
    const DBotStores = useDBotStore();
    const { app, transactions } = DBotStores;
    const { showDigitalOptionsMaltainvestError } = app;

    // TODO: Remove this when connect is removed completely
    const combinedStore = { ...DBotStores, core: { ...RootStore } };

    const { recovered_transactions, recoverPendingContracts } = transactions;
    const is_subscribed_to_msg_listener = React.useRef(false);
    const msg_listener = React.useRef(null);

    const handleMessage = ({ data }) => {
        if (data?.msg_type === 'proposal_open_contract' && !data?.error) {
            const { proposal_open_contract } = data;
            if (
                proposal_open_contract?.status !== 'open' &&
                !recovered_transactions?.includes(proposal_open_contract?.contract_id)
            ) {
                recoverPendingContracts(proposal_open_contract);
            }
        }
    };

    React.useEffect(() => {
        // Listen for proposal open contract messages to check
        // if there is any active contract from bot still running
        if (api_base?.api && !is_subscribed_to_msg_listener.current) {
            is_subscribed_to_msg_listener.current = true;
            msg_listener.current = api_base.api?.onMessage()?.subscribe(handleMessage);
        }
        return () => {
            if (is_subscribed_to_msg_listener.current && msg_listener.current) {
                is_subscribed_to_msg_listener.current = false;
                msg_listener.current.unsubscribe();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_base?.api]);

    //Do not remove this is for the bot-skeleton package to load blockly with the theme
    React.useEffect(() => {
        setColors(is_dark_mode_on);
    }, [is_dark_mode_on]);

    React.useEffect(() => {
        showDigitalOptionsMaltainvestError(client, common);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client.is_options_blocked, client.account_settings.country_code, client.clients_country]);

    const init = () => {
        GTM.init(combinedStore);
        ServerTime.init(common);
        app.setDBotEngineStores(combinedStore);
        ApiHelpers.setInstance(app.api_helpers_store);
    };

    const changeActiveSymbolLoadingState = () => {
        init();
        const { active_symbols } = ApiHelpers.instance;
        active_symbols.retrieveActiveSymbols(true).then(() => {
            setIsLoading(false);
        });
    };

    React.useEffect(() => {
        init();
        setIsLoading(true);
        if (!client.is_logged_in) {
            changeActiveSymbolLoadingState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (client.is_logged_in && client.is_landing_company_loaded) {
            changeActiveSymbolLoadingState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client.is_landing_company_loaded]);

    React.useEffect(() => {
        const onDisconnectFromNetwork = () => {
            setIsLoading(false);
        };
        window.addEventListener('offline', onDisconnectFromNetwork);
        return () => {
            window.removeEventListener('offline', onDisconnectFromNetwork);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return is_loading ? (
        <Loading />
    ) : (
        <>
            <BlocklyLoading />
            <div className='bot-dashboard bot'>
                <Audio />
                <BotNotificationMessages />
                <Main />
                <NetworkToastPopup />
                <BotBuilder />
                <BotStopped />
                <RoutePromptDialog />
                <TransactionDetailsModal />
                <ToastContainer limit={3} draggable={false} />
            </div>
        </>
    );
});

export default AppContent;
