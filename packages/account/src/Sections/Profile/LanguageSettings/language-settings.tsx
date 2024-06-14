import { Redirect } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, getAllowedLanguages } from '@deriv/translations';
import FormSubHeader from '../../../Components/form-sub-header';
import LanguageRadioButton from '../../../Components/language-settings';

const LanguageSettings = observer(() => {
    const { client, common, ui } = useStore();
    const { has_wallet } = client;
    const { changeSelectedLanguage, current_language } = common;
    const { is_mobile_or_tablet } = ui;

    if (is_mobile_or_tablet || has_wallet) {
        return <Redirect to={routes.traders_hub} />;
    }

    const allowed_languages: Record<string, string> = getAllowedLanguages();
    return (
        <div className='settings-language'>
            <FormSubHeader title={localize('Select Language')} />
            <div className='settings-language__language-container'>
                {Object.entries(allowed_languages).map(([language_key, value]) => {
                    return (
                        <LanguageRadioButton
                            key={language_key}
                            id={language_key}
                            language_text={value}
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
