import { unix } from 'dayjs';
import * as Yup from 'yup';
import { GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import { ValidationConstants } from '@deriv-com/utils';
import { TGetSettingsResponse } from '../types';

type TInitialValues = {
    addressCity?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressPostcode?: string;
    addressState?: string;
    dateOfBirth?: number | null;
    email?: string;
    emailConsent?: 0 | 1;
    employmentStatus?: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    placeOfBirth?: string;
    requestProfessionalStatus?: 1;
    residence?: string | null;
    taxIdentificationNumber?: string;
};

const getLocation = (location_list: StatesList, value: string, type: keyof StatesList[number]) => {
    if (!value || !location_list.length) return '';
    const locationObj = location_list.find(
        location => location[type === 'text' ? 'value' : 'text']?.toLowerCase() === value.toLowerCase()
    );

    return locationObj?.[type] ?? '';
};

export const getPersonalDetailsInitialValues = (
    accountSettings: GetSettings,
    residenceList: ResidenceList,
    statesList: StatesList,
    isSocialSignup?: boolean
) => {
    const initialValues: TInitialValues = {
        addressCity: accountSettings.address_city,
        addressLine1: accountSettings.address_line_1,
        addressLine2: accountSettings.address_line_2 ?? '',
        addressPostcode: accountSettings.address_postcode ?? '',
        addressState: '',
        dateOfBirth: accountSettings.date_of_birth,
        emailConsent: accountSettings.email_consent ?? 0,
        firstName: accountSettings.first_name,
        lastName: accountSettings.last_name,
        phone: accountSettings.phone,
        residence: accountSettings.residence,
        taxIdentificationNumber: accountSettings.tax_identification_number ?? '',
    };

    const isGetSettingsKey = (value: string): value is keyof GetSettings =>
        Object.keys(accountSettings).includes(value);

    const snakeToCamelCase = (key: string) => {
        return key.replace(/_([a-z])/g, function (match, letter) {
            return letter.toUpperCase();
        });
    };

    ['citizen', 'place_of_birth', 'tax_residence'].forEach(key => {
        if (isGetSettingsKey(key) && accountSettings[key]) {
            const camelCaseKey = snakeToCamelCase(key);
            // @ts-expect-error keys will always be available
            initialValues[camelCaseKey] = getLocation(residenceList, accountSettings[key] as string, 'text');
        }
    });

    if (isSocialSignup) {
        initialValues.email = accountSettings.email;
    }

    if (accountSettings.address_state) {
        initialValues.addressState = statesList.length
            ? getLocation(statesList, accountSettings.address_state, 'text')
            : accountSettings.address_state;
    }

    if (accountSettings.employment_status) {
        initialValues.employmentStatus = accountSettings.employment_status;
    }

    if (accountSettings.request_professional_status) {
        initialValues.requestProfessionalStatus = accountSettings.request_professional_status;
    }

    return initialValues;
};

export const getPersonalDetailsBaseValidationSchema = () => {
    const characterLengthMessage = 'You should enter 2-50 characters.';
    const addressLengthMessage = 'Should be less than 70 characters.';
    const phoneNumberLengthMessage = 'You should enter 9-35 numbers.';

    const regexPattern = ValidationConstants.patterns;

    return Yup.object({
        accountOpeningReason: Yup.string().required('Account opening reason is required.'),
        addressCity: Yup.string()
            .required('Town/City is required.')
            .max(70, addressLengthMessage)
            .matches(regexPattern.addressCity, 'Only letters, space, hyphen, period, and apostrophe are allowed.'),
        addressLine1: Yup.string()
            .trim()
            .required('First line of address is required.')
            .max(70, addressLengthMessage)
            .matches(regexPattern.address, 'Use only the following special characters: 70'),
        addressLine2: Yup.string()
            .trim()
            .max(70, addressLengthMessage)
            .matches(regexPattern.address, 'Use only the following special characters: 70'),
        addressPostcode: Yup.string()
            .max(20, 'Please enter a Postal/ZIP code under 20 chatacters.')
            .matches(regexPattern.postalCode, 'Only letters, numbers, space, and hyphen are allowed.'),
        citizenship: Yup.string().required('Citizenship is required.'),
        countryOfResidence: Yup.string().required('Country of residence is required.'),
        dateOfBirth: Yup.string().required('Date of birth is required.'),
        employmentStatus: Yup.string().required('Employment status is required.'),
        firstName: Yup.string()
            .required('First name is required.')
            .min(2, characterLengthMessage)
            .max(50, characterLengthMessage)
            .matches(regexPattern.name, 'Letters, spaces, periods, hyphens, apostrophes only.'),
        lastName: Yup.string()
            .required('Last Name is required.')
            .min(2, characterLengthMessage)
            .max(50, characterLengthMessage)
            .matches(regexPattern.name, 'Letters, spaces, periods, hyphens, apostrophes only.'),
        nameDOBConfirmation: Yup.boolean().required(),
        phoneNumber: Yup.string()
            .required('Phone number is required.')
            .matches(regexPattern.phoneNumber, 'Please enter a valid phone number.')
            .min(9, phoneNumberLengthMessage)
            .max(35, phoneNumberLengthMessage),
        placeOfBirth: Yup.string().required('Place of birth is required.'),
        taxIdentificationNumber: Yup.string()
            .required('TIN is required.')
            .max(25, "Tax Identification Number can't be longer than 25 characters.")
            .matches(
                regexPattern.taxIdentificationNumber,
                'Only letters, numbers, space, hyphen, period, and forward slash are allowed.'
            ),
        taxInfoConfirmation: Yup.boolean().when(['taxIdentificationNumber', 'taxResidence'], {
            is: (taxIdentificationNumber: string, taxResidence: string) => taxIdentificationNumber && taxResidence,
            otherwise: Yup.boolean(),
            then: Yup.boolean()
                .required('Tax info confirmation is required.')
                .oneOf(
                    [true],
                    'You must confirm that the tax identification number and tax residence above are correct and up to date.'
                ),
        }),
        taxResidence: Yup.string().when('taxIdentificationNumber', {
            is: (taxIdentificationNumber: string) => !!taxIdentificationNumber,
            otherwise: Yup.string(),
            then: Yup.string().required('Please fill in tax residence.'),
        }),
    });
};

export const getNameDOBValidationSchema = () => {
    return getPersonalDetailsBaseValidationSchema()
        .pick(['dateOfBirth', 'firstName', 'lastName', 'nameDOBConfirmation'])
        .default(() => ({
            dateOfBirth: '',
            firstName: '',
            lastName: '',
            nameDOBConfirmation: false,
        }));
};

export const getPersonalDetailsValidationSchema = (isEu: boolean) => {
    const personalValidationSchema = getPersonalDetailsBaseValidationSchema().pick([
        'addressCity',
        'addressLine1',
        'addressLine2',
        'addressPostcode',
        'firstName',
        'lastName',
        'phoneNumber',
    ]);

    const euPersonalValidationSchema = personalValidationSchema.concat(
        getPersonalDetailsBaseValidationSchema().pick(['employmentStatus', 'taxIdentificationNumber', 'taxResidence'])
    );

    return isEu ? euPersonalValidationSchema : personalValidationSchema;
};

export const isFieldDisabled = (accountSettings: GetSettings, fieldName: string) => {
    return accountSettings?.immutable_fields?.includes(fieldName);
};

export const generateNameDOBPayloadData = (values: Yup.InferType<ReturnType<typeof getNameDOBValidationSchema>>) => ({
    date_of_birth: values.dateOfBirth.toString(),
    first_name: values.firstName.trim(),
    last_name: values.lastName.trim(),
});

export const generateNameDOBFormData = (values: TGetSettingsResponse) => ({
    dateOfBirth: values.date_of_birth ? unix(values.date_of_birth as number).format('YYYY-MM-DD') : '',
    firstName: values.first_name,
    lastName: values.last_name,
});
