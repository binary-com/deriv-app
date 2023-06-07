import React from 'react';
import { ApiHelpers, ServerTime, setColors } from '@deriv/bot-skeleton';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import {
    Audio,
    BotFooterExtensions,
    BotNotificationMessages,
    Dashboard,
    NetworkToastPopup,
    RoutePromptDialog,
} from 'Components';
import BotBuilder from 'Components/dashboard/bot-builder';
import GTM from 'Utils/gtm';
import { MobxContentProvider } from 'Stores/connect';
import { useDBotStore } from 'Stores/useDBotStore';
import BlocklyLoading from '../components/blockly-loading';
import './app.scss';

const AppContent = observer(() => {
    const [is_loading, setIsLoading] = React.useState(true);
    const RootStore = useStore();
    const {
        common,
        client,
        ui: { is_dark_mode_on },
    } = RootStore;
    const DBotStores = useDBotStore();
    const { app } = DBotStores;
    const { showDigitalOptionsMaltainvestError } = app;

    // TODO: Remove this when connect is removed completely
    const combinedStore = { ...DBotStores, core: { ...RootStore } };

    //Do not remove this is for the bot-skeleton package to load blockly with the theme
    React.useEffect(() => {
        setColors(is_dark_mode_on);
    }, [is_dark_mode_on]);

    React.useEffect(() => {
        /**
         * Inject: External Script Hotjar - for DBot only
         */
        (function (h, o, t, j) {
            /* eslint-disable */
            h.hj =
                h.hj ||
                function () {
                    (h.hj.q = h.hj.q || []).push(arguments);
                };
            /* eslint-enable */
            h._hjSettings = { hjid: 3050531, hjsv: 6 };
            const a = o.getElementsByTagName('head')[0];
            const r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

        const initSurvicate = () => {
            if (document.getElementById('dbot-survicate')) {
                const survicate_box = document.getElementById('survicate-box') || undefined;
                if (survicate_box) {
                    survicate_box.style.display = 'block';
                }
                return;
            }
            const script = document.createElement('script');
            script.id = 'dbot-survicate';
            script.async = true;
            script.src = 'https://survey.survicate.com/workspaces/83b651f6b3eca1ab4551d95760fe5deb/web_surveys.js';
            document.body.appendChild(script);
        };

        initSurvicate();
        return () => {
            if (document.getElementById('survicate-box')) {
                document.getElementById('survicate-box').style.display = 'none';
            }
        };
    }, []);

    React.useEffect(() => {
        showDigitalOptionsMaltainvestError(client, common);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client.is_options_blocked, client.account_settings.country_code]);

    React.useEffect(() => {
        GTM.init(combinedStore);
        ServerTime.init(common);
        app.setDBotEngineStores(combinedStore);
        ApiHelpers.setInstance(app.api_helpers_store);
        const { active_symbols } = ApiHelpers.instance;
        setIsLoading(true);
        active_symbols.retrieveActiveSymbols(true).then(() => {
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        // TODO: remove MobxContentProvider when all connect method is removed
        <MobxContentProvider store={combinedStore}>
            <BlocklyLoading />
            <div className='bot-dashboard bot'>
                <Audio />
                <BotFooterExtensions />
                <BotNotificationMessages />
                <Dashboard />
                <NetworkToastPopup />
                <BotBuilder />
                <RoutePromptDialog />
            </div>
        </MobxContentProvider>
    );
});

export default AppContent;
