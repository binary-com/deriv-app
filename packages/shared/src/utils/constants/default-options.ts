import { isProduction } from '../config/config';

/**
 * Returns List of unsupported languages based on the environment.
 */
export const UNSUPPORTED_LANGUAGES = isProduction() ? ['ID', 'MN'] : ['MN'];

/**
 * Returns List of unsupported languages for Wallets.
 */
export const WALLETS_UNSUPPORTED_LANGUAGES = [
    ...UNSUPPORTED_LANGUAGES,
    'BN',
    'DE',
    'ES',
    'ID',
    'IT',
    'SW',
    'KM',
    'KO',
    'PL',
    'PT',
    'RU',
    'SI',
    'TH',
    'TR',
    'UZ',
    'VI',
    'ZH_CN',
    'ZH_TW',
];
