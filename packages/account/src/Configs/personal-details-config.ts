import { GetAccountStatus, GetSettings, ResidenceList } from '@deriv/api-types';
import {
    TSchema,
    generateValidationFunction,
    getDefaultFields,
    getErrorMessages,
    toMoment,
    validLength,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { shouldShowIdentityInformation } from 'Helpers/utils';
import { TUpgradeInfo } from 'Types';
import { PHONE_NUMBER_LENGTH } from 'Constants/personal-details';

type TPersonalDetailsConfig = {
    upgrade_info?: TUpgradeInfo;
    real_account_signup_target: string;
    residence_list: ResidenceList;
    account_settings: GetSettings & {
        document_type: string;
        document_number: string;
    };
    residence: string;
    account_status: GetAccountStatus;
};

export const personal_details_config = ({
    residence_list,
    account_settings,
    real_account_signup_target,
}: TPersonalDetailsConfig): TSchema => {
    if (!residence_list || !account_settings) {
        return {};
    }

    const default_residence = (real_account_signup_target === 'maltainvest' && account_settings?.residence) || '';

    const config = {
        account_opening_reason: {
            supported_in: ['maltainvest'],
            default_value: account_settings.account_opening_reason ?? '',
            rules: [['req', localize('Account opening reason is required.')]],
        },
        salutation: {
            supported_in: ['maltainvest'],
            default_value: account_settings.salutation ?? '',
            rules: [['req', localize('Salutation is required.')]],
        },
        first_name: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.first_name ?? '',
            rules: [
                ['req', localize('First name is required.')],
                ['length', localize('Enter no more than 50 characters.'), { min: 1, max: 50 }],
                ['name', getErrorMessages().name()],
            ],
        },
        last_name: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.last_name ?? '',
            rules: [
                ['req', localize('Last name is required.')],
                ['length', localize('Enter no more than 50 characters.'), { min: 1, max: 50 }],
                ['name', getErrorMessages().name()],
            ],
        },
        date_of_birth: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.date_of_birth
                ? toMoment(account_settings.date_of_birth).format('YYYY-MM-DD')
                : '',
            rules: [
                ['req', localize('Date of birth is required.')],
                [
                    (v: string) => toMoment(v).isValid() && toMoment(v).isBefore(toMoment().subtract(18, 'years')),
                    localize('You must be 18 years old and above.'),
                ],
            ],
        },
        place_of_birth: {
            supported_in: ['maltainvest'],
            default_value:
                (account_settings.place_of_birth &&
                    residence_list.find(item => item.value === account_settings.place_of_birth)?.text) ||
                '',
            rules: [['req', localize('Place of birth is required.')]],
        },
        citizen: {
            supported_in: ['maltainvest'],
            default_value:
                (account_settings.citizen &&
                    residence_list.find(item => item.value === account_settings.citizen)?.text) ||
                '',
            rules: [['req', localize('Citizenship is required')]],
        },
        phone: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.phone ?? '',
            rules: [
                ['req', localize('Phone is required.')],
                ['phone', localize('Phone is not in a proper format.')],
                [
                    (value: string) => {
                        return validLength(value, { min: PHONE_NUMBER_LENGTH.MIN, max: PHONE_NUMBER_LENGTH.MAX });
                    },
                    localize('You should enter {{min}}-{{max}} characters.', {
                        min: PHONE_NUMBER_LENGTH.MIN,
                        max: PHONE_NUMBER_LENGTH.MAX,
                    }),
                ],
            ],
        },
        tax_residence: {
            //if tax_residence is already set, we will use it as default value else for mf clients we will use residence as default value
            default_value:
                (account_settings?.tax_residence &&
                    residence_list.find(item => item.value === account_settings?.tax_residence)?.text) ||
                default_residence,
            supported_in: ['maltainvest'],
            rules: [['req', localize('Tax residence is required.')]],
        },
        tax_identification_number: {
            default_value: account_settings.tax_identification_number ?? '',
            supported_in: ['maltainvest'],
            rules: [
                ['req', localize('Tax Identification Number is required.')],
                [
                    'length',
                    localize("Tax Identification Number can't be longer than 25 characters."),
                    { min: 0, max: 25 },
                ],
                [
                    // check if the TIN value is available, then perform the regex test
                    // else return true (to pass the test)
                    // this is to allow empty string to pass the test in case of optioal TIN field
                    (value: string) => (value ? RegExp(/^(?!^$|\s+)[A-Za-z0-9./\s-]{0,25}$/).test(value) : true),
                    localize('Letters, numbers, spaces, periods, hyphens and forward slashes only.'),
                ],
                [
                    (value: string, options: Record<string, unknown>, { tax_residence }: { tax_residence: string }) => {
                        // check if  TIN value is available,
                        // only then ask client to fill in tax residence
                        return value ? !!tax_residence : true;
                    },
                    localize('Please fill in Tax residence.'),
                ],
                [
                    (value: string, options: Record<string, unknown>, { tax_residence }: { tax_residence: string }) => {
                        const tin_format = residence_list.find(
                            res => res.text === tax_residence && res.tin_format
                        )?.tin_format;
                        return value && tin_format ? tin_format.some(regex => new RegExp(regex).test(value)) : true;
                    },
                    localize('Tax Identification Number is not properly formatted.'),
                ],
            ],
        },
        employment_status: {
            default_value: account_settings.employment_status ?? '',
            supported_in: ['maltainvest'],
            rules: [['req', localize('Employment status is required.')]],
        },
        tax_identification_confirm: {
            default_value: false,
            supported_in: ['maltainvest'],
            rules: [['confirm', localize('Please confirm your tax information.')]],
        },
        document_type: {
            default_value: account_settings.document_type ?? {
                id: '',
                text: '',
                value: '',
                example_format: '',
            },
            supported_in: ['svg'],
            rules: [],
        },
        document_number: {
            default_value: account_settings.document_number ?? '',
            supported_in: ['svg'],
            rules: [],
        },
        confirmation_checkbox: {
            default_value: false,
            supported_in: ['svg'],
            rules: [],
        },
        crs_confirmation: {
            default_value: false,
            supported_in: ['svg'],
            rules: [
                [
                    (
                        value: string,
                        options: Record<string, unknown>,
                        { tax_identification_number }: { tax_identification_number: string }
                    ) => {
                        // need the confirmation in case of both Tax residence and TIN are available
                        // only checking for TIN as we already have a rule for Tax residence to be filled if TIN field is filled
                        return tax_identification_number ? value : true;
                    },
                    localize('CRS confirmation is required.'),
                ],
            ],
        },
    };

    if (real_account_signup_target !== 'maltainvest') {
        const properties_to_update: (keyof typeof config)[] = [
            'place_of_birth',
            'tax_residence',
            'tax_identification_number',
            'account_opening_reason',
        ];

        properties_to_update.forEach(key => {
            config[key].supported_in.push('svg');
            // Remove required rule for TIN and Tax residence from the config to make the fields optional
            if (key === 'tax_identification_number' || key === 'tax_residence') {
                config[key].rules = config[key].rules.filter(rule => rule[0] !== 'req');
            }
        });
    }

    return config;
};

const personalDetailsConfig = <T>(
    {
        upgrade_info,
        real_account_signup_target,
        residence_list,
        account_settings,
        account_status,
        residence,
    }: TPersonalDetailsConfig,
    PersonalDetails: T
) => {
    const config = personal_details_config({
        residence_list,
        account_settings,
        real_account_signup_target,
        residence,
        account_status,
    });
    const disabled_items = account_settings.immutable_fields;
    return {
        header: {
            active_title: localize('Complete your personal details'),
            title: localize('Personal details'),
        },
        body: PersonalDetails,
        form_value: getDefaultFields(real_account_signup_target, config),
        props: {
            validate: generateValidationFunction(
                real_account_signup_target,
                transformConfig(config, {
                    real_account_signup_target,
                    residence_list,
                    account_settings,
                    account_status,
                    residence,
                })
            ),
            is_svg: upgrade_info?.can_upgrade_to === 'svg',
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
            ],
            salutation_list: [
                {
                    label: localize('Mr'),
                    value: 'Mr',
                },

                {
                    label: localize('Ms'),
                    value: 'Ms',
                },
            ],
            disabled_items,
            account_status,
            residence,
            account_settings,
            real_account_signup_target,
        },
        passthrough: ['residence_list', 'is_fully_authenticated', 'has_real_account'],
        icon: 'IcDashboardPersonalDetails',
    };
};

const transformConfig = (
    config: TSchema,
    { real_account_signup_target, residence_list, account_status, residence }: TPersonalDetailsConfig
) => {
    // Remove IDV for non supporting SVG countries
    if (
        !shouldShowIdentityInformation({
            account_status,
            citizen: residence,
            residence_list,
            real_account_signup_target,
        })
    ) {
        delete config.document_type;
        delete config.document_number;
    }
    return config;
};

export default personalDetailsConfig;
