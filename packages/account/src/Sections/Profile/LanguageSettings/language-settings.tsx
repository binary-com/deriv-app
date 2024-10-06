import { Redirect } from 'react-router-dom';
import { UNSUPPORTED_LANGUAGES, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTranslations, getAllowedLanguages } from '@deriv-com/translations';
import FormSubHeader from '../../../Components/form-sub-header';
import LanguageRadioButton from '../../../Components/language-settings';
import { useDevice } from '@deriv-com/ui';

const LanguageSettings = observer(() => {
    const { client, common } = useStore();
    const { switchLanguage, currentLang, localize } = useTranslations();
    // [TODO]: Remove changeSelectedLanguage() when whole app starts to use @deriv-com/translations
    const { changeSelectedLanguage } = common;
    const { has_wallet } = client;
    const { isDesktop } = useDevice();

    if (!isDesktop) {
        return <Redirect to={routes.traders_hub} />;
    }

    const handleLanguageChange = async (language_key: string) => {
        // [TODO]: Remove changeSelectedLanguage() when whole app starts to use @deriv-com/translations
        // This function also helps in informing language change to BE
        await changeSelectedLanguage(language_key);
        switchLanguage(language_key);
    };

    let allowed_languages: Record<string, string> = getAllowedLanguages(UNSUPPORTED_LANGUAGES);

    if (has_wallet) {
        allowed_languages = Object.fromEntries(
            Object.entries(allowed_languages).filter(([language_key]) => ['EN', 'AR'].includes(language_key))
        );
    }

    return (
        <div className='settings-language'>
            <FormSubHeader title={localize('Select language')} />
            <div className='settings-language__language-container'>
                {Object.entries(allowed_languages).map(([language_key, value]) => {
                    return (
                        <LanguageRadioButton
                            key={language_key}
                            id={language_key}
                            language_text={value}
                            is_current_language={currentLang === language_key}
                            name='language-radio-group'
                            onChange={async () => {
                                await handleLanguageChange(language_key);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default LanguageSettings;
