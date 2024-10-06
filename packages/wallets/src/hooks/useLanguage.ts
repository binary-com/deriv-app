import { useEffect, useRef, useState } from 'react';
import { getInitialLanguage } from '@deriv-com/translations';
import { TLanguageType } from '../types';

const useLanguage = (preferredLanguage: TLanguageType | null) => {
    const [language, setLanguage] = useState<TLanguageType>(() => {
        return preferredLanguage ?? 'EN';
    });
    const initialLang = getInitialLanguage() as TLanguageType;
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (preferredLanguage) {
            if (isFirstRender.current) {
                setLanguage(preferredLanguage);
                isFirstRender.current = false;
            } else {
                setLanguage(initialLang);
            }
        }
    }, [initialLang, preferredLanguage]);

    return language;
};

export default useLanguage;
