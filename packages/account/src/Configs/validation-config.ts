import { localize } from '@deriv-com/translations';
import { ResidenceList } from '@deriv/api-types';
import * as Yup from 'yup';
import { ValidationConstants } from '@deriv-com/utils';
import { toMoment } from '@deriv/shared';

const {
    taxIdentificationNumber,
    address,
    addressCity,
    addressState,
    postalCode,
    phoneNumber,
    name,
    postalOfficeBoxNumber,
} = ValidationConstants.patterns;
const { addressPermittedSpecialCharacters } = ValidationConstants.messagesHints;

export const getEmploymentAndTaxValidationSchema = (residence_list: ResidenceList) =>
    Yup.object({
        employment_status: Yup.string().required(localize('Employment status is required.')),
        tax_residence: Yup.string().required(localize('Tax residence is required.')),
        tax_identification_number: Yup.string()
            .required(localize('TIN is required.'))
            .max(25, localize("Tax Identification Number can't be longer than 25 characters."))
            .matches(
                taxIdentificationNumber,
                localize('Only letters, numbers, space, hyphen, period, and forward slash are allowed.')
            )
            .matches(
                /^[a-zA-Z0-9].*$/,
                localize('Should start with letter or number and may contain a hyphen, period and slash.')
            )
            .test({
                name: 'validate-tin',
                test: (value, context) => {
                    const { tax_residence } = context.parent;
                    if (!tax_residence) {
                        return context.createError({ message: localize('Please fill in tax residence.') });
                    }
                    const tin_format = residence_list.find(
                        res => res.text === tax_residence && res.tin_format
                    )?.tin_format;
                    if (tin_format?.some(tax_regex => new RegExp(tax_regex).test(value as string))) {
                        return context.createError({ message: localize('Tax Identification Number is invalid.') });
                    }
                    return true;
                },
            }),
    });

export const getAddressDetailValidationSchema = (is_svg: boolean) => ({
    address_city: Yup.string()
        .required(localize('City is required'))
        .max(99, localize('Only 99 characters, please.'))
        .matches(addressCity, localize('Only letters, periods, hyphens, apostrophes, and spaces, please.')),
    address_line_1: Yup.string()
        .required(localize('First line of address is required'))
        .max(70, localize('Only 70 characters, please.'))
        .matches(
            address,
            `${localize('Use only the following special characters:')} ${addressPermittedSpecialCharacters}`
        )
        .when({
            is: () => is_svg,
            then: Yup.string().test(
                'po_box',
                localize('P.O. Box is not accepted in address'),
                value => !postalOfficeBoxNumber.test(value ?? '')
            ),
        }),
    address_line_2: Yup.string()
        .max(70, localize('Only 70 characters, please.'))
        .matches(
            address,
            `${localize('Use only the following special characters:')} ${addressPermittedSpecialCharacters}`
        )
        .when({
            is: () => is_svg,
            then: Yup.string().test(
                'po_box',
                localize('P.O. Box is not accepted in address'),
                value => !postalOfficeBoxNumber.test(value ?? '')
            ),
        }),
    address_postcode: Yup.string()
        .max(20, localize('Please enter a postal/ZIP code under 20 characters.'))
        .matches(postalCode, localize('Only letters, numbers, space and hyphen are allowed.')),
    address_state: Yup.string()
        .required(localize('State is required'))
        .matches(addressState, localize('State is not in a proper format')),
});

export const getPersonalDetailsBaseValidationSchema = () =>
    Yup.object({
        salutation: Yup.string().required(localize('Salutation is required.')),
        account_opening_reason: Yup.string().required(localize('Intended use of account is required.')),
        first_name: Yup.string()
            .required(localize('First name is required.'))
            .min(1, localize('Enter no more than 50 characters.'))
            .max(50, localize('Enter no more than 50 characters.'))
            .matches(name, localize('Letters, spaces, periods, hyphens, apostrophes only.')),
        last_name: Yup.string()
            .required(localize('Last name is required.'))
            .min(1, localize('Enter no more than 50 characters.'))
            .max(50, localize('Enter no more than 50 characters.'))
            .matches(name, localize('Letters, spaces, periods, hyphens, apostrophes only.')),
        date_of_birth: Yup.string()
            .required('Date of birth is required.')
            .test({
                name: 'validate_dob',
                test: value => toMoment(value).isValid() && toMoment(value).isBefore(toMoment().subtract(18, 'years')),
                message: localize('You must be 18 years old and above.'),
            }),
        phone: Yup.string()
            .required(localize('Phone is required.'))
            .min(9, localize('You should enter 9-35 numbers.'))
            .max(35, localize('You should enter 9-35 characters.'))
            .matches(phoneNumber, localize('Please enter a valid phone number (e.g. +15417541234).')),
        place_of_birth: Yup.string().required(localize('Place of birth is required.')),
        citizen: Yup.string().required(localize('Citizenship is required.')),
        tax_identification_confirm: Yup.bool().oneOf([true], localize('Please confirm your tax information.')),
        crs_confirmation: Yup.bool().test({
            name: 'crs_confirmation',
            test: (value, context) => (context.parent.tax_identification_number ? !!value : true),
            message: localize('Please confirm your CRS self-certification.'),
        }),
    });
