import React from 'react';
import { FormikErrors, FormikValues } from 'formik';
import countries from 'i18n-iso-countries';
import { ResidenceList, GetAccountStatus } from '@deriv/api-types';
import {
    filterObjProperties,
    toMoment,
    validLength,
    validName,
    getIDVNotApplicableOption,
    IDV_ERROR_STATUS,
    AUTH_STATUS_CODES,
    VERIFICATION_SERVICES,
} from '@deriv/shared';
import { localize } from '@deriv-com/translations';
import { getIDVDocuments } from '../Configs/idv-document-config';
import { TServerError } from '../Types';
import { LANGUAGE_CODES } from '../Constants/onfido';

export const documentAdditionalError = (
    additional_document_value: string | undefined,
    document_additional_config: FormikValues
) => {
    let error_message = null;
    if (!additional_document_value) {
        error_message = localize('Please enter your {{document_name}}. ', {
            document_name: document_additional_config?.display_name?.toLowerCase() ?? localize('document number'),
        });
    } else {
        const format_regex = getRegex(document_additional_config?.format);
        if (!format_regex.test(additional_document_value)) {
            error_message = localize('Please enter the correct format. ');
        }
    }

    return error_message;
};

// Unsupported Regex List
const regex = [
    {
        regex_string: '^(?i)G[a-zA-Z0-9]{7,9}$',
        value: '^G[a-zA-Z0-9]{7,9}$',
        flags: 'i',
    },
];

const IDV_NOT_APPLICABLE_OPTION = getIDVNotApplicableOption();

type TIDVSupportCheck = {
    residence_list: ResidenceList;
    account_status: GetAccountStatus;
    real_account_signup_target: string;
    citizen: string;
};

export const shouldShowIdentityInformation = ({
    account_status,
    citizen,
    residence_list,
    real_account_signup_target,
}: TIDVSupportCheck) => {
    const country = residence_list.find(item => item.value === citizen);
    const maltainvest = real_account_signup_target === 'maltainvest';
    const identity = account_status?.authentication?.identity;

    const is_identity_verified = identity?.status === AUTH_STATUS_CODES.VERIFIED;
    const should_skip_idv =
        is_identity_verified || account_status?.status?.some((status: string) => status === 'skip_idv'); //status added by BE when idv should be skipped for the user
    return Boolean(
        !maltainvest && citizen && country?.identity?.services?.idv?.is_country_supported && !should_skip_idv
    );
};

export const getDocumentData = (country_code: string, document_type: string) => {
    const DEFAULT_CONFIG = {
        new_display_name: '',
        example_format: '',
    };
    const IDV_DOCUMENT_DATA: any = getIDVDocuments(country_code);
    if (IDV_DOCUMENT_DATA) {
        return IDV_DOCUMENT_DATA[document_type] ?? DEFAULT_CONFIG;
    }
    return DEFAULT_CONFIG;
};

export const preventEmptyClipboardPaste = (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const clipboardData = (e.clipboardData ?? window.clipboardData).getData('text');
    if (clipboardData.length === 0) {
        e.preventDefault();
    }
};

export const getRegex = (target_regex: string) => {
    const output_regex = regex.find(r => r.regex_string === target_regex);
    if (output_regex) {
        return new RegExp(output_regex.value, output_regex.flags);
    }
    return new RegExp(target_regex);
};

/**
 * @param {string} selected_doc  - Could be one of the following: 'drivers_license', 'ssnit', 'id_card', 'passport'
 * @returns {string} - Returns the placeholder text for the document number input
 */
export const generatePlaceholderText = (selected_doc: string): string => {
    switch (selected_doc) {
        case 'drivers_license':
            return localize('Enter Driver License Reference number');
        case 'ssnit':
            return localize('Enter your SSNIT number');
        case 'national_id_no_photo':
            return localize('Enter your National Identification Number (NIN)');
        default:
            return localize('Enter your document number');
    }
};

export const isFieldImmutable = (field: string, mutable_fields: string[] = []) => !mutable_fields.includes(field);

export const makeSettingsRequest = (values: FormikValues, changeable_fields: string[]) => {
    const request = filterObjProperties(values, changeable_fields);

    if (request.first_name) {
        request.first_name = request.first_name.trim();
    }
    if (request.last_name) {
        request.last_name = request.last_name.trim();
    }
    if (request.date_of_birth) {
        request.date_of_birth = toMoment(request.date_of_birth).format('YYYY-MM-DD');
    }

    return request;
};

export const validateName = (name: string) => {
    if (name) {
        if (!validLength(name.trim(), { min: 1, max: 50 })) {
            return localize('Enter no more than 50 characters.');
        } else if (!validName(name)) {
            return localize('Letters, spaces, periods, hyphens, apostrophes only.');
        }
    }
    return '';
};

export const getExampleFormat = (example_format?: string) =>
    example_format ? localize('Example: ') + example_format : '';

export const isDocumentTypeValid = (document_type: FormikValues) => {
    if (!document_type?.text) {
        return localize('Please select a document type.');
    }
    return undefined;
};

export const isAdditionalDocumentValid = (document_type: FormikValues, additional_document_value?: string) => {
    const error_message = documentAdditionalError(additional_document_value, document_type?.additional);
    if (error_message) {
        return error_message + getExampleFormat(document_type?.additional?.example_format);
    }
    return undefined;
};

export const isDocumentNumberValid = (document_number?: string, document_type?: FormikValues) => {
    const is_document_number_invalid = document_number === document_type?.example_format;
    if (!document_number && document_type?.text) {
        let document_name = '';
        const example_format = getExampleFormat(document_type.example_format);
        switch (document_type.id) {
            case 'drivers_license':
                document_name = localize('Driver License Reference number');
                break;
            case 'ssnit':
                document_name = localize('SSNIT number');
                break;
            case 'national_id_no_photo':
                document_name = localize('NIN');
                break;
            default:
                document_name = localize('document number');
                break;
        }
        return localize('Please enter your {{document_name}}. {{example_format}}', { document_name, example_format });
    } else if (is_document_number_invalid) {
        return localize('Please enter a valid ID number.');
    }
    const format_regex = getRegex(document_type?.value);
    if (document_number && !format_regex.test(document_number)) {
        return localize('Please enter the correct format. ') + getExampleFormat(document_type?.example_format);
    }
    return undefined;
};

export const shouldHideHelperImage = (document_id: string) => document_id === IDV_NOT_APPLICABLE_OPTION.id;

export const isServerError = (error: unknown): error is TServerError =>
    typeof error === 'object' && error !== null && 'code' in error;

/**
 *  Returns the alpha 3 code for a given country code
 * @name convertAlpha2toAlpha3
 * @param country_code  - country code
 * @returns alpha 3 code
 */
export const convertAlpha2toAlpha3 = (country_code: string) =>
    country_code.length !== 3 ? countries.alpha2ToAlpha3(country_code.toUpperCase()) : country_code;

/**
 * Returns the alpha 2 code for a given country code
 * @name convertAlpha3toAlpha2
 * @param country_code - country code
 * @returns alpha 2 code
 */

export const convertAlpha3toAlpha2 = (country_code: string) =>
    country_code.length !== 2 ? countries.alpha3ToAlpha2(country_code.toUpperCase()) : country_code;

/**
 * Generates a language code supported by Onfido
 * @name getOnfidoSupportedLocaleCode
 * @param language_code
 * @returns language code supported by Onfido
 */
export const getOnfidoSupportedLocaleCode = (language_code: string) => {
    try {
        const code = language_code.toLowerCase().split('_');
        if (code[0] === 'id') {
            return LANGUAGE_CODES.ID;
        }
        return code.length > 1 ? `${code[0]}_${code[1].toUpperCase()}` : code[0];
    } catch (e) {
        return LANGUAGE_CODES.EN;
    }
};

export const getIDVDocumentType = (
    idv_latest_attempt: DeepRequired<GetAccountStatus>['authentication']['attempts']['latest'],
    residence: ResidenceList[0]
) => {
    if (!idv_latest_attempt || !Object.keys(residence).length) return localize('identity document');
    const { document_type } = idv_latest_attempt;
    if (!document_type) return localize('identity document');
    if (residence?.identity?.services?.idv?.documents_supported) {
        const {
            identity: {
                services: {
                    idv: { documents_supported },
                },
            },
        } = residence;
        return documents_supported[document_type as string].display_name;
    }
    return null;
};

export const validate = <T,>(errors: FormikErrors<FormikValues>, values: T) => {
    return (fn: (value: string) => string, arr: string[], err_msg: string) => {
        arr.forEach(field => {
            const value = values[field as keyof typeof values] as string;
            if (!fn(value) && !errors[field]) errors[field] = err_msg;
        });
    };
};

type TIDVErrorStatus = keyof typeof IDV_ERROR_STATUS;
export const verifyFields = (status: TIDVErrorStatus) => {
    switch (status) {
        case IDV_ERROR_STATUS.DobMismatch.code:
            return ['date_of_birth'];
        case IDV_ERROR_STATUS.NameMismatch.code:
            return ['first_name', 'last_name'];
        default:
            return ['first_name', 'last_name', 'date_of_birth'];
    }
};

export const isSpecialPaymentMethod = (payment_method_icon: string) =>
    ['IcOnlineNaira', 'IcAstroPayLight', 'IcAstroPayDark'].some(icon => icon === payment_method_icon);

export const convertPhoneTypeDisplay = (phone_verification_type: string) => {
    if (phone_verification_type === VERIFICATION_SERVICES.SMS) return phone_verification_type.toUpperCase();

    return 'WhatsApp';
};
