import React from 'react';
import { GetSettings, ResidenceList } from '@deriv/api-types';
import { Localize, localize } from '@deriv/translations';
import { generateValidationFunction } from '@deriv/shared';
import { TListItem } from 'Types';

export type TFields = 'place_of_birth' | 'tax_residence' | 'tax_identification_number' | 'account_opening_reason';

type ReqRule = ['req', React.ReactNode];

type LengthRule = ['length', React.ReactNode, { min: number; max: number }];

type RegularRule = ['regular', React.ReactNode, { regex: RegExp }];

type CustomValidator = (
    value: string,
    /**
     * The options passed to the validation function
     */
    options: Record<string, unknown>,
    /**
     * The values of all fields in the form
     */
    values: Record<string, unknown>
) => React.ReactNode;

type CustomRule = [CustomValidator, React.ReactNode];

type Rule = ReqRule | LengthRule | RegularRule | CustomRule;

type TInputConfig = {
    label: React.ReactNode;
    /**
     * The type of the input field (e.g. 'text', 'password', 'select', etc.)
     */
    type?: string;
    initial_value: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    /**
     * The list of items for the dropdown or select
     */
    list_items?: TListItem[];
    /**
     * The validation rules for the input field (e.g. 'req', 'length', 'regular', etc.)
     */
    rules?: Array<Rule>;
};

export type TGetField = Omit<TInputConfig, 'initial_value'> & { name: string };

export type TFormFieldsConfig = {
    [key in TFields]: TInputConfig;
};

/**
 *  The base config for form fields with validation rules
 *  every field should have label, type, initial_value, disabled, required, placeholder, list_items, rules
 *
 *  `list_items` is used for dropdowns and select
 * @returns TFormFieldsConfig
 */
export const getFormFieldsConfig = (
    account_settings: GetSettings,
    residence_list: ResidenceList,
    required_fields: TFields[]
) => {
    /**
     * Check if the field is disabled based on the immutable_fields from API
     */
    const isFieldDisabled = (field: string) => account_settings?.immutable_fields?.includes(field);

    /**
     * Check if the field is required based on the required_fields array passed
     */
    const isFieldRequired = (field: TFields) => required_fields.includes(field);

    const config: TFormFieldsConfig = {
        place_of_birth: {
            label: (
                <Localize
                    i18n_default_text='Place of birth{{required}}'
                    values={{ required: isFieldRequired('place_of_birth') ? '*' : '' }}
                />
            ),
            type: 'select',
            initial_value:
                (account_settings.place_of_birth &&
                    residence_list.find(item => item.value === account_settings.place_of_birth)?.text) ??
                '',
            disabled: isFieldDisabled('place_of_birth'),
            required: isFieldRequired('place_of_birth'),
            list_items: residence_list as TListItem[],
            rules: [['req', <Localize key='place_of_birth' i18n_default_text='Place of birth is required.' />]],
        },
        tax_residence: {
            label: (
                <Localize
                    i18n_default_text='Tax residence{{required}}'
                    values={{ required: isFieldRequired('tax_residence') ? '*' : '' }}
                />
            ),
            type: 'select',
            initial_value:
                (account_settings.tax_residence &&
                    residence_list.find(item => item.value === account_settings.tax_residence)?.text) ??
                '',
            disabled: isFieldDisabled('tax_residence'),
            required: isFieldRequired('tax_residence'),
            list_items: residence_list as TListItem[],
            rules: [],
        },
        tax_identification_number: {
            label: (
                <Localize
                    i18n_default_text='Tax Identification number{{required}}'
                    values={{ required: isFieldRequired('tax_identification_number') ? '*' : '' }}
                />
            ),
            type: 'text',
            initial_value: account_settings.tax_identification_number ?? '',
            disabled: isFieldDisabled('tax_identification_number'),
            required: isFieldRequired('tax_identification_number'),
            rules: [
                [
                    'length',
                    <Localize
                        key='TIN'
                        i18n_default_text="Tax Identification Number can't be longer than 25 characters."
                    />,
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
                    (value, options, { tax_residence }) => {
                        return value ? !!tax_residence : true;
                    },
                    <Localize key='TIN' i18n_default_text='Please fill in tax residence.' />,
                ],
                [
                    (value: string, options, { tax_residence }) => {
                        const tin_format = residence_list.find(
                            res => res.text === tax_residence && res.tin_format
                        )?.tin_format;
                        return value && tin_format
                            ? tin_format.some(tax_regex => new RegExp(tax_regex).test(value))
                            : true;
                    },
                    <Localize key='TIN' i18n_default_text='Tax Identification Number is invalid.' />,
                ],
            ],
        },
        account_opening_reason: {
            label: (
                <Localize
                    i18n_default_text='Intended use of account{{required}}'
                    values={{ required: isFieldRequired('account_opening_reason') ? '*' : '' }}
                />
            ),
            type: 'select',
            initial_value: account_settings.account_opening_reason ?? '',
            disabled: isFieldDisabled('account_opening_reason'),
            required: isFieldRequired('account_opening_reason'),
            list_items: [
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
            rules: [
                [
                    'req',
                    <Localize key='account_opening_reason' i18n_default_text='Intended use of account is required.' />,
                ],
            ],
        },
    };
    return config;
};

/**
 * Generate initial values for form fields
 */
const generateInitialValues = (fields: ReturnType<typeof getFormFieldsConfig>) => {
    const initial_values: Record<TFields, string> = {} as Record<TFields, string>;
    (Object.keys(fields) as TFields[]).forEach(field => {
        initial_values[field] = fields[field].initial_value;
    });
    return initial_values;
};

/**
 * This function is used to transform form fields config to the format that is used in Formik or Formik Field
 */
const getField = (fields: TFormFieldsConfig, name: TFields, with_input_types: boolean): TGetField => {
    const { label, placeholder, required, disabled, type, list_items } = fields[name];

    return {
        name,
        label,
        required,
        disabled,
        ...(with_input_types ? { type } : {}),
        ...(placeholder ? { placeholder } : {}),
        ...(list_items ? { list_items } : {}),
    };
};

/**
 * Function to transform and return form config that can be used within the component that renders the form
 */
export const getFormConfig = (options: {
    account_settings: GetSettings;
    residence_list: ResidenceList;
    required_fields: TFields[];
    with_input_types?: boolean;
}) => {
    const { account_settings, residence_list, required_fields, with_input_types = false } = options;
    const fields_config = getFormFieldsConfig(account_settings, residence_list, required_fields);
    const inputs: Record<TFields, TGetField> = {} as Record<TFields, TGetField>;
    Object.keys(fields_config).forEach(field_key => {
        // @ts-expect-error `field_key` is always a key of `fields_config`, Hence can ignore the TS error.
        inputs[field_key] = getField(fields_config, field_key, with_input_types);
    });
    return {
        fields: inputs,
        /** typing fields_config as any as this current config has different structure
         * and generateValidationFunction should have generic types
         * */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validate: generateValidationFunction('', fields_config as any),
        initialValues: generateInitialValues(fields_config),
    };
};
