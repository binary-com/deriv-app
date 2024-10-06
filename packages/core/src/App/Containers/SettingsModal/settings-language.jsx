import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { getAllowedLanguages, useTranslations } from '@deriv-com/translations';
import { LanguageLink } from 'App/Components/Routes';
import { UNSUPPORTED_LANGUAGES } from '@deriv/shared';

const isCurrentLanguage = (lang, current_language) => lang === current_language;

const LanguageSettings = observer(() => {
    const { client, ui } = useStore();
    const { has_wallet } = client;
    const { toggleLanguageSettingsModal } = ui;
    const { currentLang } = useTranslations();

    const allowed_languages = Object.keys(getAllowedLanguages(UNSUPPORTED_LANGUAGES));

    const filtered_languages = has_wallet
        ? allowed_languages.filter(lang => lang === 'EN' || lang === 'AR')
        : allowed_languages;

    return (
        <div className='settings-language'>
            <div className='settings-language__language-container'>
                {filtered_languages.map(lang =>
                    isCurrentLanguage(lang, currentLang) ? (
                        <LanguageLink key={lang} lang={lang} />
                    ) : (
                        <LanguageLink key={lang} is_clickable lang={lang} toggleModal={toggleLanguageSettingsModal} />
                    )
                )}
            </div>
        </div>
    );
});

export default LanguageSettings;
