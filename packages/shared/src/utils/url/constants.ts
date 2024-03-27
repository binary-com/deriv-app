const isBrowser = () => typeof window !== 'undefined';

const deriv_com_url = 'deriv.com';
const deriv_me_url = 'deriv.me';
const deriv_be_url = 'deriv.be';

const supported_domains = [deriv_com_url, deriv_me_url, deriv_be_url];
const domain_url_initial = (isBrowser() && window.location.hostname.split('app.')[1]) || '';
const domain_url = supported_domains.includes(domain_url_initial) ? domain_url_initial : deriv_com_url;

export const deriv_urls = Object.freeze({
    DERIV_HOST_NAME: domain_url,
    DERIV_COM_PRODUCTION: `https://${domain_url}`,
    DERIV_COM_PRODUCTION_EU: `https://eu.${domain_url}`,
    DERIV_COM_STAGING: `https://staging.${domain_url}`,
    DERIV_APP_PRODUCTION: `https://app.${domain_url}`,
    DERIV_APP_STAGING: `https://staging-app.${domain_url}`,
    SMARTTRADER_PRODUCTION: `https://smarttrader.${domain_url}`,
    SMARTTRADER_STAGING: `https://staging-smarttrader.${domain_url}`,
    BINARYBOT_PRODUCTION: `https://bot.${domain_url}`,
    BINARYBOT_STAGING: `https://staging-bot.${domain_url}`,
});
/**
 * @deprecated Please use 'URLConstants.whatsApp' from '@deriv-com/utils' instead of this.
 */
export const whatsapp_url = 'https://wa.me/35699578341';
