import { str as crc32 } from 'crc-32';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import withI18n from './component';
// TODO: [fix-p2p-translation] add in context translation
import ach from 'Translations/ach.json';
import ar from 'Translations/ar.json';
import en from 'Translations/en.json';
import es from 'Translations/es.json';
import de from 'Translations/de.json';
import fr from 'Translations/fr.json';
import id from 'Translations/id.json';
import it from 'Translations/it.json';
import ko from 'Translations/ko.json';
import pl from 'Translations/pl.json';
import pt from 'Translations/pt.json';
import ru from 'Translations/ru.json';
import th from 'Translations/th.json';
import tr from 'Translations/tr.json';
import vi from 'Translations/vi.json';
import zh_cn from 'Translations/zh_cn.json';
import zh_tw from 'Translations/zh_tw.json';

const DEFAULT_LANGUAGE = 'EN';
let CURRENT_LANGUAGE = 'EN';

export const setLanguage = (lang: string) => {
    CURRENT_LANGUAGE = lang || DEFAULT_LANGUAGE;
    i18n.changeLanguage(lang);
};

const getLanguage = () => CURRENT_LANGUAGE;

const initial_language = getLanguage();

const i18n_config = {
    resources: {
        ACH: { translations: { ...ach } },
        AR: { translations: { ...ar } },
        EN: { translations: { ...en } },
        ES: { translations: { ...es } },
        DE: { translations: { ...de } },
        FR: { translations: { ...fr } },
        ID: { translations: { ...id } },
        IT: { translations: { ...it } },
        KO: { translations: { ...ko } },
        PL: { translations: { ...pl } },
        PT: { translations: { ...pt } },
        RU: { translations: { ...ru } },
        TH: { translations: { ...th } },
        TR: { translations: { ...tr } },
        VI: { translations: { ...vi } },
        ZH_CN: { translations: { ...zh_cn } },
        ZH_TW: { translations: { ...zh_tw } },
    },
    react: {
        hashTransKey(defaultValue: string) {
            return crc32(defaultValue);
        },
    },
    lng: initial_language,
    fallbackLng: 'EN',
    ns: ['translations'],
    defaultNS: 'translations',
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init(i18n_config);

// <Localize /> component wrapped with i18n
export const Localize = withI18n(i18n);

export const localize = <T extends object>(string: string, values?: T) => {
    if (!string) return '';
    return i18n.t(crc32(string).toString(), { defaultValue: string, ...values });
};

export default i18n;
