import React from 'react';
import Cookies from 'js-cookie';
import { useRemoteConfig } from '@deriv/api';
import { DesktopWrapper } from '@deriv/components';
import { getAppId, LocalStore, useIsMounted } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getLanguage } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { browserSupportsWebAuthn } from '@simplewebauthn/browser';

import BinaryBotIFrame from 'Modules/BinaryBotIFrame';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';

import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header';
import AppModals from './Containers/Modals';
import Routes from './Containers/Routes/routes.jsx';
import Devtools from './Devtools';
import initDatadog from '../Utils/Datadog';
import { ThemeProvider } from '@deriv-com/quill-ui';

const AppContent: React.FC<{ passthrough: unknown }> = observer(({ passthrough }) => {
    const store = useStore();
    const { has_wallet } = store.client;

    const isMounted = useIsMounted();
    const { data } = useRemoteConfig(isMounted());
    const { marketing_growthbook, tracking_datadog, tracking_rudderstack, passkeys } = data;
    const is_passkeys_supported = browserSupportsWebAuthn();

    const account_type = LocalStore?.get('active_loginid')
        ?.match(/[a-zA-Z]+/g)
        ?.join('');

    React.useEffect(() => {
        if (process.env.RUDDERSTACK_KEY && tracking_rudderstack) {
            const config = {
                growthbookKey: marketing_growthbook ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
                growthbookDecryptionKey: marketing_growthbook ? process.env.GROWTHBOOK_DECRYPTION_KEY : undefined,
                rudderstackKey: process.env.RUDDERSTACK_KEY,
            };
            Analytics.initialise(config);
            const ppc_campaign_cookies =
                Cookies.getJSON('utm_data') === 'null'
                    ? {
                          utm_source: 'no source',
                          utm_medium: 'no medium',
                          utm_campaign: 'no campaign',
                          utm_content: 'no content',
                      }
                    : Cookies.getJSON('utm_data');

            Analytics.setAttributes({
                account_type: account_type === 'null' ? 'unlogged' : account_type,
                app_id: String(getAppId()),
                device_type: store?.ui?.is_mobile ? 'mobile' : 'desktop',
                device_language: navigator?.language || 'en-EN',
                user_language: getLanguage().toLowerCase(),
                country: Cookies.get('clients_country') || Cookies?.getJSON('website_status')?.clients_country,
                utm_source: ppc_campaign_cookies?.utm_source,
                utm_medium: ppc_campaign_cookies?.utm_medium,
                utm_campaign: ppc_campaign_cookies?.utm_campaign,
                utm_content: ppc_campaign_cookies?.utm_content,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.marketing_growthbook, tracking_rudderstack]);

    React.useEffect(() => {
        store.client.setIsPasskeySupported(is_passkeys_supported && passkeys);
    }, [passkeys, is_passkeys_supported, store.client]);

    React.useEffect(() => {
        initDatadog(tracking_datadog);
    }, [tracking_datadog]);

    // intentionally switch the user with wallets to light mode and EN language
    React.useLayoutEffect(() => {
        if (has_wallet) {
            if (store.ui.is_dark_mode_on) {
                store.ui.setDarkMode(false);
            }
            if (store.common.current_language !== 'EN') {
                store.common.changeSelectedLanguage('EN');
            }
        }
    }, [has_wallet, store.common, store.ui]);

    return (
        <ThemeProvider theme={store.ui.is_dark_mode_on ? 'dark' : 'light'}>
            <Header />
            <ErrorBoundary root_store={store}>
                <AppContents>
                    {/* TODO: [trader-remove-client-base] */}
                    <Routes passthrough={passthrough} />
                </AppContents>
            </ErrorBoundary>
            <DesktopWrapper>
                <Footer />
            </DesktopWrapper>
            <ErrorBoundary root_store={store}>
                <AppModals />
            </ErrorBoundary>
            <SmartTraderIFrame />
            <BinaryBotIFrame />
            <AppToastMessages />
            <Devtools />
        </ThemeProvider>
    );
});

export default AppContent;
