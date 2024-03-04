import React from 'react';
import { useTranslation } from 'react-i18next';

const useIsRtl = () => {
    const { i18n } = useTranslation();

    const check_rtl = React.useCallback(() => {
        return i18n.dir(i18n.language?.toLowerCase()) === 'rtl';
    }, [i18n]);

    const [is_rtl, setIsRtl] = React.useState<boolean>(() => {
        return check_rtl();
    });

    React.useEffect(() => {
        setIsRtl(check_rtl());
    }, [check_rtl]);

    return is_rtl;
};

export default useIsRtl;
