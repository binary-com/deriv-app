const isBrowser = () => typeof window !== 'undefined';

const deriv_com_url = 'deriv.com';
const deriv_me_url = 'deriv.me';

const supported_domains = [deriv_com_url, deriv_me_url];
const domain_url_initial = isBrowser() && window.location.hostname.split('app.')[1];
const domain_url = supported_domains.includes(domain_url_initial) ? domain_url_initial : deriv_com_url;

export const deriv_urls = Object.freeze({
    DERIV_HOST_NAME: domain_url,
    DERIV_COM_PRODUCTION: `https://${domain_url}`,
    DERIV_COM_STAGING: 'https://staging.deriv.com',
    DERIV_DASHBOARD_PRODUCTION: `https://myapps.${domain_url}`,
    DERIV_DASHBOARD_STAGING: 'https://staging-myapps.deriv.com',
    DERIV_DASHBOARD_HOST_NAME: `myapps.${domain_url}`,
    DERIV_APP_PRODUCTION: `https://app.${domain_url}`,
    DERIV_APP_STAGING: 'https://staging-app.deriv.com',
    SMARTTRADER_PRODUCTION: `https://smarttrader.${domain_url}`,
    SMARTTRADER_STAGING: 'https://staging-smarttrader.deriv.com',
});
