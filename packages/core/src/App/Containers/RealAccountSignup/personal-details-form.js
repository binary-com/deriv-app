import { toMoment } from '@deriv/shared/utils/date';
import { localize } from '@deriv/translations';
import PersonalDetails from 'App/Containers/RealAccountSignup/personal-details.jsx';
import { getPreBuildDVRs } from 'Utils/Validator/declarative-validation-rules';
import { generateValidationFunction, getDefaultFields } from './form-validations';

const personal_details_config = ({ residence_list }) => {
    if (!residence_list) {
        return {};
    }

    return {
        account_opening_reason: {
            supported_in: ['iom', 'malta', 'maltainvest'],
            default_value: '',
            rules: [['req', localize('Account opening reason is required')]],
        },
        salutation: {
            supported_in: ['iom', 'malta', 'maltainvest'],
            default_value: '',
            rules: [['req', localize('Salutation is required')]],
        },
        first_name: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: '',
            rules: [
                ['req', localize('First name is required')],
                ['letter_symbol', getPreBuildDVRs().letter_symbol.message],
                ['length', localize('First name should be between 2 and 30 characters.'), { min: 2, max: 30 }],
            ],
        },
        last_name: {
            supported_in: ['svg', 'iom', 'malta', 'maltainvest'],
            default_value: '',
            rules: [
                ['req', localize('Last name is required')],
                ['letter_symbol', getPreBuildDVRs().letter_symbol.message],
                ['length', localize('Last name should be between 2 and 30 characters.'), { min: 2, max: 30 }],
            ],
        },
        date_of_birth: {
            supported_in: ['svg', 'iom', 'malta'],
            default_value: '',
            rules: [
                ['req', localize('Date of birth is required')],
                [
                    v => toMoment(v).isValid() && toMoment(v).isBefore(toMoment().subtract(18, 'years')),
                    localize('Date of birth is not in a proper format'),
                ],
            ],
        },
        place_of_birth: {
            supported_in: ['maltainvest', 'iom', 'malta'],
            default_value: '',
            rules: [['req', localize('Place of birth is required')]],
        },
        citizen: {
            supported_in: ['iom', 'malta'],
            default_value: '',
            rules: [['req', localize('Citizenship is required')]],
        },
        phone: {
            supported_in: ['svg', 'iom', 'malta'],
            default_value: '',
            rules: [
                ['req', localize('Phone is required')],
                ['phone', localize('Phone is not in a correct format.')],
            ],
        },
        tax_residence: {
            default_value: '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Tax residence is required')]],
        },
        tax_identification_number: {
            default_value: '',
            supported_in: ['maltainvest'],
            rules: [
                ['req', localize('Tax identification number is required')],
                [
                    (value, options, { tax_residence }) => {
                        return !!tax_residence;
                    },
                    localize('Please fill in Tax residence'),
                ],
                [
                    (value, options, { tax_residence }) => {
                        const from_list = residence_list.filter(res => res.text === tax_residence && res.tin_format);
                        const tax_regex = from_list[0]?.tin_format?.[0];
                        return tax_regex ? new RegExp(tax_regex).test(value) : true;
                    },
                    localize('Tax identification number is not in a proper format'),
                ],
            ],
        },
        tax_identification_confirm: {
            default_value: '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Please confirm your tax information')]],
        },
    };
};

export const personalDetailsConfig = ({ real_account_signup_target, residence_list }) => {
    window.pev = generateValidationFunction(real_account_signup_target, personal_details_config({ residence_list }));
    window.vs = getDefaultFields(real_account_signup_target, personal_details_config({ residence_list }));
    return {
        header: {
            active_title: localize('Complete your personal details'),
            title: localize('Personal details'),
        },
        body: PersonalDetails,
        form_value: getDefaultFields(real_account_signup_target, personal_details_config({ residence_list })),
        props: {
            validate: window.pev,
            account_opening_reason_list: [
                {
                    text: localize('Hedging'),
                    value: 'Hedging',
                },
                {
                    text: localize('Income Earning'),
                    value: 'Income Earning',
                },
                {
                    text: localize('Speculative'),
                    value: 'Speculative',
                },
                {
                    text: localize('Peer-to-peer exchange'),
                    value: 'Peer-to-peer exchange',
                },
            ],
            salutation_list: [
                {
                    text: localize('Mr'),
                    value: 'Mr',
                },
                {
                    text: localize('Ms'),
                    value: 'Ms',
                },
                {
                    text: localize('Mrs'),
                    value: 'Mrs',
                },
                {
                    text: localize('Miss'),
                    value: 'Miss',
                },
            ],
        },
        passthrough: ['residence_list', 'is_fully_authenticated'],
    };
};
