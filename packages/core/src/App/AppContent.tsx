import React from 'react';
import Cookies from 'js-cookie';
import { useRemoteConfig } from '@deriv/api';
import { DesktopWrapper } from '@deriv/components';
import { useFeatureFlags } from '@deriv/hooks';
import { getAppId, LocalStore } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getLanguage } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';

import BinaryBotIFrame from 'Modules/BinaryBotIFrame';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';

import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header';
import AppModals from './Containers/Modals';
import PlatformContainer from './Containers/PlatformContainer/PlatformContainer.jsx';
import Routes from './Containers/Routes/routes.jsx';
import Devtools from './Devtools';
import initDatadog from '../Utils/Datadog';

const AppContent: React.FC<{ passthrough: unknown }> = observer(({ passthrough }) => {
    const { is_next_wallet_enabled } = useFeatureFlags();
    const store = useStore();

    const { data } = useRemoteConfig();
    const { marketing_growthbook, tracking_datadog, tracking_rudderstack } = data;

    React.useEffect(() => {
        if (process.env.RUDDERSTACK_KEY && tracking_rudderstack) {
            const config = {
                growthbookKey: marketing_growthbook ? process.env.GROWTHBOOK_CLIENT_KEY : undefined,
                growthbookDecryptionKey: marketing_growthbook ? process.env.GROWTHBOOK_DECRYPTION_KEY : undefined,
                rudderstackKey: process.env.RUDDERSTACK_KEY,
            };
            Analytics.initialise(config);
            Analytics.setAttributes({
                account_type: LocalStore?.get('active_loginid')?.substring(0, 2) ?? 'unlogged',
                app_id: String(getAppId()),
                device_type: store?.ui?.is_mobile ? 'mobile' : 'desktop',
                device_language: navigator?.language || 'en-EN',
                user_language: getLanguage().toLowerCase(),
                country: Cookies.get('clients_country') || Cookies?.getJSON('website_status'),
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.marketing_growthbook, tracking_rudderstack]);

    React.useEffect(() => {
        initDatadog(tracking_datadog);
    }, [tracking_datadog]);

    return (
        <PlatformContainer>
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
            {is_next_wallet_enabled && <Devtools />}
        </PlatformContainer>
    );
});

export default AppContent;
