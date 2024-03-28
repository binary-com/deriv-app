import React from 'react';
import { useTranslation } from 'react-i18next';

const useIsRtl = () => {
    const { i18n } = useTranslation();

    const checkRtl = React.useCallback(() => {
        return i18n.dir(i18n.language?.toLowerCase()) === 'rtl';
    }, [i18n]);

    const [is_rtl, setIsRtl] = React.useState<boolean>(() => checkRtl());

    React.useEffect(() => {
        setIsRtl(checkRtl());
    }, [checkRtl, i18n.language]);

    return is_rtl;
};

export default useIsRtl;
