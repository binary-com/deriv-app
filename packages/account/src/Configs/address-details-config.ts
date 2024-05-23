import React from 'react';
import { GetSettings, StatesList } from '@deriv/api-types';
import {
    generateValidationFunction,
    getDefaultFields,
    getErrorMessages,
    regex_checks,
    address_permitted_special_characters_message,
    TSchema,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TUpgradeInfo } from 'Types';

type TAddressDetailsConfigProps = {
    upgrade_info: TUpgradeInfo;
    real_account_signup_target: string;
    residence: string;
    account_settings: GetSettings;
    states_list: StatesList;
};

const address_details_config: ({
    states_list,
    account_settings,
    is_svg,
}: {
    states_list: StatesList;
    account_settings: GetSettings;
    is_svg: boolean;
}) => TSchema = ({ states_list, account_settings, is_svg }) => {
    if (!account_settings) {
        return {};
    }

    const base_case = {
        address_line_1: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.address_line_1 ?? '',
            rules: [
                ['req', localize('First line of address is required')],
                ['length', localize('Only {{max}} characters, please.', { max: 70 }), { max: 70 }],
                [
                    'regular',
                    localize('Use only the following special characters: {{permitted_characters}}', {
                        permitted_characters: address_permitted_special_characters_message,
                        interpolation: { escapeValue: false },
                    }),
                    {
                        regex: regex_checks.address_details.address_line_1,
                    },
                ],
                ['po_box', getErrorMessages().po_box()],
            ].filter(x => (is_svg ? x.indexOf('po_box') !== 0 : x)),
        },
        address_line_2: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.address_line_2 ?? '',
            rules: [
                ['length', localize('Only {{max}} characters, please.', { max: 70 }), { max: 70 }],
                [
                    'regular',
                    localize('Use only the following special characters: {{permitted_characters}}', {
                        permitted_characters: address_permitted_special_characters_message,
                        interpolation: { escapeValue: false },
                    }),
                    {
                        regex: regex_checks.address_details.address_line_2,
                    },
                ],
                ['po_box', getErrorMessages().po_box()],
            ].filter(x => (is_svg ? x.indexOf('po_box') !== 0 : x)),
        },
        address_city: {
            supported_in: ['svg', 'maltainvest'],
            default_value: account_settings.address_city ?? '',
            rules: [
                ['req', localize('City is required')],
                ['length', localize('Only {{max}} characters, please.', { max: 99 }), { max: 99 }],
                [
                    'regular',
                    localize('Only letters, periods, hyphens, apostrophes, and spaces, please.'),
                    {
                        regex: regex_checks.address_details.address_city,
                    },
                ],
            ],
        },
        address_state: {
            supported_in: ['svg', 'maltainvest'],
            default_value: states_list.find(state => state.value === account_settings.address_state)?.text ?? '',
            rules: [
                ['req', localize('State is required')],
                [
                    'regular',
                    localize('State is not in a proper format'),
                    {
                        regex: regex_checks.address_details.address_state,
                    },
                ],
            ],
        },
        address_postcode: {
            supported_in: ['svg', 'maltainvest'],
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
                [
                    'regular',
                    localize('Only letters, numbers, space and hyphen are allowed.'),
                    {
                        regex: regex_checks.address_details.address_postcode,
                    },
                ],
            ],
        },
    };

    return base_case;
};

const addressDetailsConfig = (
    { states_list, upgrade_info, real_account_signup_target, account_settings }: TAddressDetailsConfigProps,
    AddressDetails: React.Component
) => {
    const is_svg = upgrade_info?.can_upgrade_to === 'svg';
    const config = address_details_config({ states_list, account_settings, is_svg });
    const disabled_items = account_settings.immutable_fields;

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
                transformConfig(config, real_account_signup_target)
            ),
            disabled_items,
        },
        passthrough: ['residence_list', 'is_fully_authenticated', 'has_real_account'],
        icon: 'IcDashboardAddress',
    };
};

export const transformConfig = (config: TSchema, real_account_signup_target: string) => {
    // Remove required rule for svg clients and maltainvest clients
    if (
        !real_account_signup_target ||
        real_account_signup_target === 'svg' ||
        real_account_signup_target === 'maltainvest'
    ) {
        config.address_state.rules?.shift();
    }

    return config;
};

export default addressDetailsConfig;
