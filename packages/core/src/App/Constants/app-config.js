import { isProduction } from '@deriv/shared';

export const website_domain = 'app.deriv.com';
export const website_name = 'Deriv';
export const default_title = website_name;
export const cookie_banner_expires_in_days = 7;
export const cookie_banner_domain = isProduction() ? 'deriv.com' : window.location.hostname;
