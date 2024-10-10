import { LocalStorageUtils, URLUtils } from '@deriv-com/utils';

const isBrowser = () => typeof window !== 'undefined';

const derivComUrl = 'deriv.com';
const derivMeUrl = 'deriv.me';
const derivBeUrl = 'deriv.be';

const supportedDomains = [derivComUrl, derivMeUrl, derivBeUrl];
const domainUrlInitial = (isBrowser() && window.location.hostname.split('app.')[1]) || '';
const domainUrl = supportedDomains.includes(domainUrlInitial) ? domainUrlInitial : derivComUrl;

export const derivUrls = Object.freeze({
    DERIV_APP_PRODUCTION: `https://app.${domainUrl}`,
    DERIV_APP_STAGING: `https://staging-app.${domainUrl}`,
    DERIV_COM_PRODUCTION: `https://${domainUrl}`,
    DERIV_COM_PRODUCTION_EU: `https://eu.${domainUrl}`,
    DERIV_COM_STAGING: `https://staging.${domainUrl}`,
    DERIV_HOST_NAME: domainUrl,
    SMARTTRADER_PRODUCTION: `https://smarttrader.${domainUrl}`,
    SMARTTRADER_STAGING: `https://staging-smarttrader.${domainUrl}`,
});

/**
 * @deprecated Please use 'URLConstants.whatsApp' from '@deriv-com/utils' instead of this.
 */
export const whatsappUrl = 'https://wa.me/35699578341';

let defaultLanguage: string;

export const setUrlLanguage = (lang: string) => {
    defaultLanguage = lang;
};

/**
 * @deprecated Please use 'URLUtils.normalizePath' from '@deriv-com/utils' instead of this.
 */
export const normalizePath = (path: string) => (path ? path.replace(/(^\/|\/$|[^a-zA-Z0-9-_./()#])/g, '') : '');

/**
 * @deprecated Please use 'URLUtils.getQueryParameter' from '@deriv-com/utils' instead of this.
 */
export const getActionFromUrl = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const action = urlParams.get('action');
    return action;
};

export const getUrlSmartTrader = () => {
    const { isStagingDerivApp } = getPlatformFromUrl();
    const localizeLanguage = LocalStorageUtils.getValue<string>('i18n_language');
    const urlLang = URLUtils.getQueryParameter('lang');
    const i18NLanguage = localizeLanguage || urlLang || 'en';

    let baseLink = '';

    if (isStagingDerivApp) {
        baseLink = derivUrls.SMARTTRADER_STAGING;
    } else {
        baseLink = derivUrls.SMARTTRADER_PRODUCTION;
    }

    return `${baseLink}/${i18NLanguage.toLowerCase()}/trading.html`;
};

export const getPlatformFromUrl = (domain = window.location.hostname) => {
    const resolutions = {
        isDerivApp: /^app\.deriv\.(com|me|be)$/i.test(domain),
        isStagingDerivApp: /^staging-app\.deriv\.(com|me|be)$/i.test(domain),
        isTestLink: /^(.*)\.binary\.sx$/i.test(domain),
    };

    return {
        ...resolutions,
        isStaging: resolutions.isStagingDerivApp,
    };
};

export const isStaging = (domain = window.location.hostname) => {
    const { isStagingDerivApp } = getPlatformFromUrl(domain);

    return isStagingDerivApp;
};

/**
 * @deprecated Please use 'URLUtils.getDerivStaticURL' from '@deriv-com/utils' instead of this.
 */
export const getStaticUrl = (path = '', isDocument = false, isEuUrl = false) => {
    const host = isEuUrl ? derivUrls.DERIV_COM_PRODUCTION_EU : derivUrls.DERIV_COM_PRODUCTION;
    let lang = defaultLanguage?.toLowerCase();

    if (lang && lang !== 'en') {
        lang = `/${lang}`;
    } else {
        lang = '';
    }

    if (isDocument) return `${host}/${normalizePath(path)}`;

    // Deriv.com supports languages separated by '-' not '_'
    if (host === derivUrls.DERIV_COM_PRODUCTION && lang.includes('_')) {
        lang = lang.replace('_', '-');
    }

    return `${host}${lang}/${normalizePath(path)}`;
};
