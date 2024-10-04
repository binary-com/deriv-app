import * as Yup from 'yup';
import { formatDate, getLocation, toMoment } from '@deriv/shared';
import { GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import {
    getAddressDetailValidationSchema,
    getPersonalDetailsBaseValidationSchema,
    getEmploymentAndTaxValidationSchema,
} from 'Configs/user-profile-validation-config';
import { TinValidations } from '@deriv/api/types';
import { PersonalDetailsValueTypes } from 'Types';

export const getPersonalDetailsInitialValues = (
    account_settings: GetSettings & { tin_skipped?: 0 | 1 },
    residence_list: ResidenceList,
    states_list: StatesList,
    is_virtual?: boolean
): PersonalDetailsValueTypes => {
    const virtualAccountInitialValues: PersonalDetailsValueTypes = {
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
        date_of_birth: formatDate(account_settings.date_of_birth, 'YYYY-MM-DD'),
        first_name: account_settings.first_name,
        last_name: account_settings.last_name,
        phone: `+${account_settings.phone?.replace(/\D/g, '')}`,
        account_opening_reason: account_settings.account_opening_reason,
        employment_status: account_settings?.employment_status,
        tax_residence:
            (account_settings?.tax_residence
                ? residence_list.find(item => item.value === account_settings?.tax_residence)?.text
                : account_settings?.residence) || '',
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

    if (account_settings?.tin_skipped) {
        initialValues.tin_skipped = account_settings.tin_skipped;
        initialValues.tax_identification_number = '';
    } else {
        initialValues.tax_identification_number = account_settings.tax_identification_number ?? '';
    }

    if (account_settings.address_state) {
        initialValues.address_state = states_list.length
            ? getLocation(states_list, account_settings.address_state, 'text')
            : account_settings.address_state;
    }

    if (account_settings.request_professional_status) {
        initialValues.request_professional_status = account_settings.request_professional_status;
    }

    // Setting default value of `I confirm that my tax information is accurate and complete.` checkbox
    if (account_settings.tax_residence && account_settings.tax_identification_number && !account_settings.tin_skipped) {
        initialValues.tax_identification_confirm = true;
    } else {
        initialValues.tax_identification_confirm = false;
    }

    return initialValues;
};

export const makeSettingsRequest = (
    settings: PersonalDetailsValueTypes,
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
    delete request.tax_identification_confirm;

    return request;
};

export const getPersonalDetailsValidationSchema = (
    is_virtual?: boolean,
    is_svg?: boolean,
    tin_validation_config?: TinValidations,
    is_tin_auto_set?: boolean
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

    const employment_tin_schema = getEmploymentAndTaxValidationSchema({
        tin_config: tin_validation_config as TinValidations,
        is_mf: !is_svg,
        is_real: !is_virtual,
        is_tin_auto_set,
    });

    return personal_details_schema.concat(address_detail_schema).concat(employment_tin_schema);
};
