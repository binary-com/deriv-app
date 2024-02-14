import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDevice } from '@deriv-com/ui';
import { DesktopWrapper } from '@deriv/components';
import { useFeatureFlags } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { isDisabledLandscapeRoute } from '@deriv/shared';
import BinaryBotIFrame from 'Modules/BinaryBotIFrame';
import SmartTraderIFrame from 'Modules/SmartTraderIFrame';
import ErrorBoundary from './Components/Elements/Errors/error-boundary.jsx';
import AppContents from './Containers/Layout/app-contents.jsx';
import Footer from './Containers/Layout/footer.jsx';
import Header from './Containers/Layout/header';
import AppModals from './Containers/Modals';
import PlatformContainer from './Containers/PlatformContainer/PlatformContainer.jsx';
import Routes from './Containers/Routes/routes.jsx';
import AppToastMessages from './Containers/app-toast-messages.jsx';
import Devtools from './Devtools';
import LandscapeBlocker from './Components/Elements/LandscapeBlocker';

const AppContent: React.FC<{ passthrough: unknown }> = observer(({ passthrough }) => {
    const { isDesktop } = useDevice();
    const { is_next_wallet_enabled } = useFeatureFlags();
    const store = useStore();
    const location = useLocation();
    const pathname = location?.pathname;
    const is_hidden_landscape_blocker = isDisabledLandscapeRoute(pathname);

    return (
        <PlatformContainer>
            <LandscapeBlocker />
            <Header />
            <ErrorBoundary root_store={store}>
                <AppContents>
                    {/* TODO: [trader-remove-client-base] */}
                    <Routes passthrough={passthrough} />
                </AppContents>
            </ErrorBoundary>
            {is_hidden_landscape_blocker ? (
                isDesktop && <Footer />
            ) : (
                <DesktopWrapper>
                    <Footer />
                </DesktopWrapper>
            )}
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
