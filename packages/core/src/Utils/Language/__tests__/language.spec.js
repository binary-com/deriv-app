import { getAllowedLanguages } from '@deriv/translations';

const languages = {
    AR: 'العربية',
    EN: 'English',
    ES: 'Español',
    DE: 'Deutsch',
    FR: 'Français',
    ID: 'Indonesian',
    IT: 'Italiano',
    KO: '한국어',
    PL: 'Polish',
    PT: 'Português',
    RU: 'Русский',
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
