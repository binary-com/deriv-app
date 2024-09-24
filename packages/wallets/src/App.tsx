import React, { useMemo, useState } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { getInitialLanguage, initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { ModalProvider } from './components/ModalProvider';
import AppContent from './AppContent';
import WalletsAuthProvider from './AuthProvider';
import './styles/fonts.scss';
import './index.scss';

type LanguageType = 'AR' | 'EN';

const App: React.FC = () => {
    const [preferredLanguage, setPreferredLanguage] = useState<LanguageType | null>(null);
    const defaultLanguage = (preferredLanguage ?? getInitialLanguage()) as LanguageType;

    const i18nInstance = useMemo(
        () =>
            initializeI18n({
                cdnUrl: `${process.env.CROWDIN_URL}/${process.env.WALLETS_TRANSLATION_PATH}`, // 'https://translations.deriv.com/deriv-app-wallets/staging'
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [getInitialLanguage()]
    );

    return (
        <APIProvider standalone>
            <WalletsAuthProvider>
                <TranslationProvider defaultLang={defaultLanguage} i18nInstance={i18nInstance}>
                    <React.Suspense fallback={<Loader />}>
                        <ModalProvider>
                            <AppContent setPreferredLanguage={setPreferredLanguage} />
                        </ModalProvider>
                    </React.Suspense>
                </TranslationProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

export default App;
