import { getInitialLanguage } from '@deriv-com/translations';

const useIsRtl = () => {
    const i18nLanguage = getInitialLanguage();
    return i18nLanguage === 'AR';
};

export default useIsRtl;
