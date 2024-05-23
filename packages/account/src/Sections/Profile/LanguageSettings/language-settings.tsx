import React from 'react';
import { Redirect } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, getAllowedLanguages } from '@deriv/translations';
import FormSubHeader from 'Components/form-sub-header';
import LanguageRadioButton from 'Components/language-settings';

const LanguageSettings = observer(() => {
    const { client, common, ui } = useStore();
    const { has_wallet } = client;
    const { changeSelectedLanguage, current_language } = common;
    const { is_mobile } = ui;

    if (is_mobile || has_wallet) {
        return <Redirect to={routes.traders_hub} />;
    }

    const allowed_language_keys: string[] = Object.keys(getAllowedLanguages());
    return (
        <div className='settings-language'>
            <FormSubHeader title={localize('Select Language')} />
            <div className='settings-language__language-container'>
                {allowed_language_keys.map(language_key => {
                    return (
                        <LanguageRadioButton
                            key={language_key}
                            id={language_key}
                            language_code={language_key}
                            is_current_language={current_language === language_key}
                            name='language-radio-group'
                            onChange={() => {
                                changeSelectedLanguage(language_key);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default LanguageSettings;
