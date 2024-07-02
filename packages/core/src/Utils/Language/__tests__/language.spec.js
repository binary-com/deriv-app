import { getAllowedLanguages } from '@deriv/translations';

const languages = {
    AR: 'العربية',
    EN: 'English',
    ES: 'Español',
    BN: 'বাংলা',
    DE: 'Deutsch',
    FR: 'Français',
    ID: 'Indonesian',
    IT: 'Italiano',
    KM: 'ខ្មែរ',
    KO: '한국어',
    MN: 'Монгол',
    PL: 'Polish',
    PT: 'Português',
    SW: 'Kiswahili',
    RU: 'Русский',
    SI: 'සිංහල',
    TR: 'Türkçe',
    VI: 'Tiếng Việt',
    ZH_CN: '简体中文',
    ZH_TW: '繁體中文',
    TH: 'ไทย',
};

describe('getAllowedLanguages method', () => {
    it('should return the desired allowed languages', () => {
        expect(getAllowedLanguages()).toEqual(languages);
    });
});
