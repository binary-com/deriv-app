import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { TranslationFlag, UNSUPPORTED_LANGUAGES } from '@deriv/shared';
import { getAllowedLanguages, useTranslations } from '@deriv-com/translations';

export type TLanguageLink = {
    is_clickable?: boolean;
    lang: string;
    toggleModal?: () => void;
};

const LanguageLink = observer(({ is_clickable = false, lang, toggleModal }: TLanguageLink) => {
    const { common } = useStore();
    const { currentLang, switchLanguage } = useTranslations();
    const { changeSelectedLanguage } = common;
    const is_active = currentLang === lang;

    const link: React.ReactNode = (
        <React.Fragment>
            {TranslationFlag[lang](36, 24)}
            <span
                className={classNames('settings-language__language-name', {
                    'settings-language__language-name--active': is_active,
                })}
            >
                {getAllowedLanguages(UNSUPPORTED_LANGUAGES)[lang]}
            </span>
        </React.Fragment>
    );

    const handleLanguageChange = async (lang: string) => {
        await changeSelectedLanguage(lang);
        switchLanguage(lang);
        window.fcWidget?.user.setLocale(lang.toLowerCase());
        toggleModal?.();
    };

    return (
        <React.Fragment>
            {!is_clickable ? (
                <div
                    id={`dt_settings_${lang}_button`}
                    className={classNames('settings-language__language-link', {
                        'settings-language__language-link--active': is_active,
                    })}
                >
                    {link}
                </div>
            ) : (
                <span
                    data-testid='dt_settings_language_button'
                    id={`dt_settings_${lang}_button`}
                    key={lang}
                    onClick={async () => {
                        await handleLanguageChange(lang);
                    }}
                    className={classNames('settings-language__language-link', {
                        'settings-language__language-link--active': is_active,
                    })}
                >
                    {link}
                </span>
            )}
        </React.Fragment>
    );
});

export default LanguageLink;
