import React, { useMemo, useState } from 'react';
import { APIProvider } from '@deriv/api-v2';
import { initializeI18n, TranslationProvider } from '@deriv-com/translations';
import { Loader } from '@deriv-com/ui';
import { ModalProvider } from './components/ModalProvider';
import useLanguage from './hooks/useLanguage';
import AppContent from './AppContent';
import WalletsAuthProvider from './AuthProvider';
import { TLanguageType } from './types';
import './styles/fonts.scss';
import './index.scss';

const App: React.FC<{ logout: () => Promise<void> }> = ({ logout }) => {
    const [preferredLanguage, setPreferredLanguage] = useState<TLanguageType | null>(null);
    const language = useLanguage(preferredLanguage);

    const i18nInstance = useMemo(
        () =>
            initializeI18n({
                cdnUrl: `${process.env.CROWDIN_URL}/${process.env.WALLETS_TRANSLATION_PATH}`, // 'https://translations.deriv.com/deriv-app-wallets/staging'
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [language]
    );
    const defaultLanguage = preferredLanguage ?? language;

    return (
        <APIProvider standalone>
            <WalletsAuthProvider logout={logout}>
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
