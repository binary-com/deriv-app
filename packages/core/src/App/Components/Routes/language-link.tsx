import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { getAllowedLanguages } from '@deriv/translations';
import { TranslationFlag } from '@deriv/shared';
import { Icon } from '@deriv/components';

export type TLanguageLink = {
    is_clickable?: boolean;
    lang: string;
    toggleModal?: () => void;
};

const LanguageLink = observer(({ is_clickable = false, lang, toggleModal }: TLanguageLink) => {
    const { common } = useStore();
    const { changeSelectedLanguage, current_language } = common;
    const is_active = current_language === lang;

    const link: React.ReactNode = (
        <React.Fragment>
            {TranslationFlag[lang] ? (
                TranslationFlag[lang](36, 24)
            ) : (
                <Icon icon={`IcFlag${lang}`} className='settings-language__language-flag' />
            )}
            <span
                className={classNames('settings-language__language-name', {
                    'settings-language__language-name--active': is_active,
                })}
            >
                {getAllowedLanguages()[lang]}
            </span>
        </React.Fragment>
    );
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
                    onClick={() => {
                        changeSelectedLanguage(lang);
                        toggleModal?.();
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
