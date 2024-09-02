// eslint-disable-next-line import/no-extraneous-dependencies
import type { StatesList } from '@deriv/api';

export const getLocation = (location_list: StatesList, value: string, type: keyof StatesList[number]) => {
    if (!value || !location_list.length) return '';
    const location_obj = location_list.find(
        location => location[type === 'text' ? 'value' : 'text']?.toLowerCase() === value.toLowerCase()
    );

    return location_obj?.[type] ?? '';
};

// eu countries to support
const eu_countries = [
    'it',
    'de',
    'fr',
    'lu',
    'gr',
    'mf',
    'es',
    'sk',
    'lt',
    'nl',
    'at',
    'bg',
    'si',
    'cy',
    'be',
    'ro',
    'hr',
    'pt',
    'pl',
    'lv',
    'ee',
    'cz',
    'fi',
    'hu',
    'dk',
    'se',
    'ie',
    'im',
    'gb',
    'mt',
];
// check if client is from EU
export const isEuCountry = (country: string) => eu_countries.includes(country);
