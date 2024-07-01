import { localize } from '@deriv/translations';
import * as Yup from 'yup';
import { getLocation, toMoment } from '@deriv/shared';
import { GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import {
    getAddressDetailValidationSchema,
    getPersonalDetailsBaseValidationSchema,
    getEmploymentAndTaxValidationSchema,
} from 'Configs/user-profile-validation-config';
import { TinValidations } from '@deriv/api/types';

export const getPersonalDetailsInitialValues = (
    account_settings: GetSettings,
    residence_list: ResidenceList,
    states_list: StatesList,
    is_virtual?: boolean
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
        employment_status: account_settings?.employment_status,
        tax_identification_number: account_settings.tax_identification_number ?? '',
        tax_residence: account_settings.tax_residence ?? '',
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

export const getPersonalDetailsValidationSchema = (
    is_virtual?: boolean,
    is_svg?: boolean,
    tin_validation_config?: TinValidations
) => {
    if (is_virtual) return Yup.object();

    const personal_details_schema = getPersonalDetailsBaseValidationSchema().pick([
        'first_name',
        'last_name',
        'phone',
        'date_of_birth',
        'citizen',
    ]);

    const address_detail_schema = getAddressDetailValidationSchema(is_svg ?? false);

    const employment_tin_schema = getEmploymentAndTaxValidationSchema(tin_validation_config as TinValidations);

    return personal_details_schema.concat(address_detail_schema).concat(employment_tin_schema);
};
