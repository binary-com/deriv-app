import React, { useMemo } from 'react';
import { APIProvider, useSettings } from '@deriv/api-v2';
import { getInitialLanguage, initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { ModalProvider } from './components/ModalProvider';
import AppContent from './AppContent';
import WalletsAuthProvider from './AuthProvider';
import './styles/fonts.scss';
import './index.scss';

type LanguageType = 'AR' | 'EN';

const App: React.FC = () => {
    const {
        data: { preferred_language: preferredLanguage },
    } = useSettings();
    const defaultLanguage = (preferredLanguage ?? getInitialLanguage()) as LanguageType;

    const i18nInstance = useMemo(
        () =>
            initializeI18n({
                cdnUrl: `${process.env.CROWDIN_URL}/${process.env.WALLETS_TRANSLATION_PATH}`, // 'https://translations.deriv.com/deriv-app-wallets/staging'
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [defaultLanguage]
    );

    return (
        <APIProvider standalone>
            <WalletsAuthProvider>
                <TranslationProvider defaultLang={defaultLanguage} i18nInstance={i18nInstance}>
                    <React.Suspense fallback={<Loader />}>
                        <ModalProvider>
                            <AppContent />
                        </ModalProvider>
                    </React.Suspense>
                </TranslationProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

export default App;
