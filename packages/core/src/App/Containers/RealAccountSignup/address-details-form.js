import { localize } from '@deriv/translations';
import AddressDetails from 'App/Containers/RealAccountSignup/address-details.jsx';
import { generateValidationFunction, getDefaultFields } from './form-validations';

const address_details_config = ({ account_settings }) => {
    if (!account_settings) {
        return {};
    }

    return {
        address_line_1: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_line_1 ?? '',
            rules: [
                ['req', localize('Address line 1 is required')],
                ['address', localize('Address is not in a proper format')],
            ],
        },
        address_line_2: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_line_2 ?? '',
            rules: [
                [
                    'length',
                    localize('Address line 2 length should be between 0 to 30 characters.'),
                    { min: 0, max: 30 },
                ],
                [
                    'regular',
                    localize('Address line 2 is not in a proper format'),
                    {
                        regex: /^[a-zA-Z\s\w'.-]{0,30}$/,
                    },
                ],
            ],
        },
        address_city: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_city ?? '',
            rules: [
                ['req', localize('City is required')],
                [
                    'regular',
                    localize('City field is not in a proper format'),
                    {
                        regex: /^[a-zA-Z\s\w'.-]{1,35}$/,
                    },
                ],
            ],
        },
        address_state: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_state ?? '',
            rules: [
                ['req', localize('State is required')],
                [
                    'regular',
                    localize('State is not in a proper format'),
                    {
                        regex: /^[\w\s\W'.-;,]{0,60}$/,
                    },
                ],
            ],
        },
        address_postcode: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: account_settings.address_postcode ?? '',
            rules: [
                [
                    'length',
                    localize('Please enter a {{field_name}} under {{max_number}} characters.', {
                        field_name: localize('postal/ZIP code'),
                        max_number: 20,
                        interpolation: { escapeValue: false },
                    }),
                    { min: 0, max: 20 },
                ],
                ['postcode', localize('Only letters, numbers, space, and hyphen are allowed.')],
            ],
        },
    };
};

export const addressDetailsConfig = ({ upgrade_info, real_account_signup_target, residence, account_settings }) => {
    const config = address_details_config({ account_settings });
    return {
        header: {
            active_title: localize('Complete your address details'),
            title: localize('Address'),
        },
        body: AddressDetails,
        form_value: getDefaultFields(real_account_signup_target, config),
        props: {
            validate: generateValidationFunction(
                real_account_signup_target,
                transformConfig(transformForResidence(config, residence), real_account_signup_target)
            ),
            is_svg: upgrade_info?.can_upgrade_to === 'svg',
        },
        passthrough: ['residence_list', 'is_fully_authenticated'],
    };
};

/**
 * Transform general rules based on residence
 *
 * @param {object} rules - Original rules
 * @param {string} residence - Client's residence
 * @return {object} rules - Transformed rules
 */
const transformForResidence = (rules, residence) => {
    // Isle of Man Clients do not need to fill out state since API states_list is empty.
    if (residence === 'im') {
        rules.address_state.rules.shift();
    }
    // GB residence are required to fill in the post code.
    if (/^(im|gb)$/.test(residence)) {
        rules.address_postcode.rules.splice(0, 0, ['req', localize('Postal/ZIP code is required')]);
    }

    return rules;
};

const transformConfig = (config, { real_account_signup_target }) => {
    // Remove required rule for svg clients
    if (!real_account_signup_target || real_account_signup_target === 'svg') {
        config.address_state.rules.shift();
    }

    return config;
};
