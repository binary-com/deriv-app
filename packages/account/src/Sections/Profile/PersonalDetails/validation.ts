import { localize } from '@deriv/translations';
import * as Yup from 'yup';
import { address_permitted_special_characters_message, getLocation, toMoment } from '@deriv/shared';
import { GetSettings, ResidenceList, StatesList } from '@deriv/api-types';

const getBaseSchema = () =>
    Yup.object().shape({
        first_name: Yup.string()
            .required(localize('First name is required.'))
            .min(2, localize('You should enter 2-50 characters.'))
            .max(50, localize('You should enter 2-50 characters.'))
            .matches(
                /^(?!.*\s{2,})[\p{L}\s'.-]{2,50}$/u,
                localize('Letters, spaces, periods, hyphens, apostrophes only.')
            ),
        last_name: Yup.string()
            .required(localize('Last name is required.'))
            .min(2, localize('You should enter 2-50 characters.'))
            .max(50, localize('You should enter 2-50 characters.'))
            .matches(
                /^(?!.*\s{2,})[\p{L}\s'.-]{2,50}$/u,
                localize('Letters, spaces, periods, hyphens, apostrophes only.')
            ),
        phone: Yup.string()
            .required(localize('Phone is required.'))
            .min(9, localize('You should enter 9-35 numbers.'))
            .max(35, localize('You should enter 9-35 characters.'))
            .matches(/^\+?([0-9-]+\s)*[0-9-]+$/, localize('Please enter a valid phone number (e.g. +15417541234).')),
        address_line_1: Yup.string()
            .trim()
            .required(localize('First line of address is required.'))
            .max(70, localize('Should be less than 70.'))
            .matches(
                /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
                localize('Use only the following special characters: {{permitted_characters}}', {
                    permitted_characters: address_permitted_special_characters_message,
                    interpolation: { escapeValue: false },
                })
            ),
        address_line_2: Yup.string()
            .trim()
            .max(70, localize('Should be less than 70.'))
            .matches(
                /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
                localize('Use only the following special characters: {{permitted_characters}}', {
                    permitted_characters: address_permitted_special_characters_message,
                    interpolation: { escapeValue: false },
                })
            ),
        address_city: Yup.string()
            .required(localize('Town/City is required.'))
            .max(70, localize('Should be less than 70.'))
            .matches(
                /^[A-Za-z]+(?:[.' -]*[A-Za-z]+){1,70}$/,
                localize('Only letters, space, hyphen, period, and apostrophe are allowed.')
            ),
        address_postcode: Yup.string()
            .max(20, localize('Please enter a Postal/ZIP code under 20 characters.'))
            .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, localize('Only letters, numbers, space, and hyphen are allowed.')),
    });

export const getPersonalDetailsInitialValues = (
    account_settings: GetSettings,
    residence_list: ResidenceList,
    states_list: StatesList,
    is_virtual: boolean
): GetSettings => {
    const virtualAccountInitialValues: GetSettings = {
        email_consent: account_settings.email_consent ?? 0,
        residence: account_settings.residence,
    };
    if (is_virtual) return virtualAccountInitialValues;

    const initialValues = {
        ...virtualAccountInitialValues,
        address_city: account_settings.address_city,
        address_line_1: account_settings.address_line_1,
        address_line_2: account_settings.address_line_2 ?? '',
        address_postcode: account_settings.address_postcode ?? '',
        address_state: '',
        date_of_birth: account_settings.date_of_birth,
        first_name: account_settings.first_name,
        last_name: account_settings.last_name,
        phone: account_settings.phone,
        tax_identification_number: account_settings.tax_identification_number ?? '',
    };

    const isGetSettingsKey = (value: string): value is keyof GetSettings =>
        Object.keys(account_settings).includes(value);

    ['citizen', 'place_of_birth', 'tax_residence'].forEach(key => {
        if (isGetSettingsKey(key)) {
            if (account_settings[key]) {
                // @ts-expect-error keys will always be available
                initialValues[key] = getLocation(residence_list, account_settings[key] as string, 'text');
            }
        }
    });

    if (account_settings.address_state) {
        initialValues.address_state = states_list.length
            ? getLocation(states_list, account_settings.address_state, 'text')
            : account_settings.address_state;
    }

    if (account_settings.employment_status) {
        initialValues.employment_status = account_settings.employment_status;
    }

    if (account_settings.request_professional_status) {
        initialValues.request_professional_status = account_settings.request_professional_status;
    }

    return initialValues;
};

export const makeSettingsRequest = (
    settings: GetSettings,
    residence_list: ResidenceList,
    states_list: StatesList,
    is_virtual: boolean
) => {
    if (is_virtual && settings.email_consent) return { email_consent: settings.email_consent };
    const request = settings;

    if (request.residence) delete request.residence;
    if (request.first_name) {
        request.first_name = request.first_name.trim();
    }

    if (request.last_name) {
        request.last_name = request.last_name.trim();
    }
    if (request.date_of_birth) {
        // @ts-expect-error need to fix the type for date_of_birth in GetSettings because it should be string not number
        request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
    }

    if (request.tax_residence) {
        request.tax_residence = getLocation(residence_list, request.tax_residence, 'value');
    }

    if (request.tax_identification_number) {
        request.tax_identification_number = request.tax_identification_number.trim();
    }

    if (request.citizen) {
        request.citizen = getLocation(residence_list, request.citizen, 'value');
    }

    if (request.place_of_birth) {
        request.place_of_birth = getLocation(residence_list, request.place_of_birth, 'value');
    } else {
        delete request.place_of_birth;
    }

    if (request.address_state) {
        request.address_state = states_list.length
            ? getLocation(states_list, request.address_state, 'value')
            : request.address_state;
    }

    return request;
};

export const getPersonalDetailsValidationSchema = (is_eu: boolean, is_virtual: boolean) => {
    if (is_virtual) return Yup.object();
    if (!is_eu) return getBaseSchema();
    return getBaseSchema().concat(
        Yup.object().shape({
            tax_identification_number: Yup.string()
                .required(localize('TIN is required.'))
                .max(25, localize("Tax Identification Number can't be longer than 25 characters."))
                .matches(
                    /^(?!^$|\s+)[A-Za-z0-9./\s-]{0,25}$/,
                    localize('Only letters, numbers, space, hyphen, period, and forward slash are allowed.')
                )
                .matches(
                    /^[a-zA-Z0-9].*$/,
                    localize('Should start with letter or number and may contain a hyphen, period and slash.')
                ),
            tax_residence: Yup.string().required(localize('Tax residence is required.')),
            employment_status: Yup.string().required(localize('Employment status is required.')),
        })
    );
};
