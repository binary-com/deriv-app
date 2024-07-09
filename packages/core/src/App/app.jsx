import React from 'react';
import WS from 'Services/ws-methods';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { Analytics } from '@deriv-com/analytics';
import { BreakpointProvider } from '@deriv/quill-design';
import { APIProvider } from '@deriv/api';
import { CashierStore } from '@deriv/cashier';
import { CFDStore } from '@deriv/cfd';
import { Loading } from '@deriv/components';
import {
    POIProvider,
    initFormErrorMessages,
    setSharedCFDText,
    setUrlLanguage,
    setWebsocket,
    useOnLoadTranslation,
} from '@deriv/shared';
import { StoreProvider, P2PSettingsProvider } from '@deriv/stores';
import { getLanguage, initializeTranslations } from '@deriv/translations';
import { withTranslation, useTranslation } from 'react-i18next';
import { initializeI18n, TranslationProvider, getInitialLanguage } from '@deriv-com/translations';
import { CFD_TEXT } from '../Constants/cfd-text';
import { FORM_ERROR_MESSAGES } from '../Constants/form-error-messages';
import AppContent from './AppContent';
import initHotjar from '../Utils/Hotjar';
import 'Sass/app.scss';

const AppWithoutTranslation = ({ root_store }) => {
    const i18nInstance = initializeI18n({
        cdnUrl: `${process.env.CROWDIN_URL}/${process.env.ACC_TRANSLATION_PATH}`, // https://translations.deriv.com/deriv-app-accounts/staging/translations
    });
    const l = window.location;
    const base = l.pathname.split('/')[1];
    const has_base = /^\/(br_)/.test(l.pathname);
    const [is_translation_loaded] = useOnLoadTranslation();
    const initCashierStore = () => {
        root_store.modules.attachModule('cashier', new CashierStore(root_store, WS));
        root_store.modules.cashier.general_store.init();
    };
    const { i18n } = useTranslation();
    const initCFDStore = () => {
        root_store.modules.attachModule('cfd', new CFDStore({ root_store, WS }));
    };
    const { preferred_language } = root_store.client;
    const language = preferred_language ?? getInitialLanguage();

    React.useEffect(() => {
        const dir = i18n.dir(i18n.language.toLowerCase());
        document.documentElement.dir = dir;
    }, [i18n, i18n.language]);

    React.useEffect(() => {
        initCashierStore();
        initCFDStore();
        const loadSmartchartsStyles = () => {
            import('@deriv/deriv-charts/dist/smartcharts.css');
        };

        const loadExternalScripts = async () => {
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

            await delay(3000);
            window.LiveChatWidget.init();

            await delay(2000);
            initHotjar(root_store.client);
        };

        initializeTranslations();

        // TODO: [translation-to-shared]: add translation implemnentation in shared
        setUrlLanguage(getLanguage());
        initFormErrorMessages(FORM_ERROR_MESSAGES);
        setSharedCFDText(CFD_TEXT);
        root_store.common.setPlatform();
        loadSmartchartsStyles();

        // Set maximum timeout before we load livechat in case if page loading is disturbed or takes too long
        const max_timeout = setTimeout(loadExternalScripts, 15 * 1000); // 15 seconds

        window.addEventListener('load', () => {
            clearTimeout(max_timeout);
            loadExternalScripts();
        });

        return () => {
            window.removeEventListener('load', loadExternalScripts);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const platform_passthrough = {
        root_store,
        WS,
        i18nInstance,
        language,
    };

    setWebsocket(WS);

    React.useEffect(() => {
        if (!root_store.client.email) {
            Analytics.reset();
        }
    }, [root_store.client.email]);

    return (
        <>
            {is_translation_loaded ? (
                <Router basename={has_base ? `/${base}` : null}>
                    <StoreProvider store={root_store}>
                        <BreakpointProvider>
                            <APIProvider>
                                <POIProvider>
                                    <P2PSettingsProvider>
                                        <TranslationProvider defaultLang={language} i18nInstance={i18nInstance}>
                                            {/* This is required as translation provider uses suspense to reload language */}
                                            <React.Suspense fallback={<Loading />}>
                                                <AppContent passthrough={platform_passthrough} />
                                            </React.Suspense>
                                        </TranslationProvider>
                                    </P2PSettingsProvider>
                                </POIProvider>
                            </APIProvider>
                        </BreakpointProvider>
                    </StoreProvider>
                </Router>
            ) : (
                <></>
            )}
        </>
    );
};

AppWithoutTranslation.propTypes = {
    root_store: PropTypes.object,
};
const App = withTranslation()(AppWithoutTranslation);

export default App;
