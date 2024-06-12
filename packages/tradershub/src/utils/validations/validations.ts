import * as Yup from 'yup';
import { passwordRegex } from '@/constants';

export const personalDetails = Yup.object().shape({
    accountOpeningReason: Yup.string().required('Account opening reason is required.'),
    detailsConfirmation: Yup.boolean()
        .required()
        .oneOf([true], 'You must confirm that the name and date of birth above match your chosen identity document.'),
    dateOfBirth: Yup.date().typeError('Please enter a valid date.').required('Date of birth is required.'),
    firstName: Yup.string()
        .required('First name is required.')
        .matches(/^[a-zA-Z\s\-.'']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.')
        .min(1, 'Enter no more than 50 characters.')
        .max(50, 'Enter no more than 50 characters.'),
    lastName: Yup.string()
        .required('Last Name is required.')
        .matches(/^[a-zA-Z\s\-.'']+$/, 'Letters, spaces, periods, hyphens, apostrophes only.')
        .min(1, 'Enter no more than 50 characters.')
        .max(50, 'Enter no more than 50 characters.'),
    phoneNumber: Yup.string()
        .required('Phone number is required.')
        .min(9, 'You should enter 9-35 numbers.')
        .max(35, 'You should enter 9-35 numbers.')
        .matches(/^\+?([0-9-]+\s)*[0-9-]+$/, 'Please enter a valid phone number.'),
    placeOfBirth: Yup.string().required('Place of birth is required.'),
    taxIdentificationNumber: Yup.string(),
    taxResidence: Yup.string().when('taxIdentificationNumber', {
        is: (taxIdentificationNumber: string) => !!taxIdentificationNumber,
        then: Yup.string().required('Please fill in tax residence.'),
        otherwise: Yup.string(),
    }),
    taxInfoConfirmation: Yup.boolean().when(['taxIdentificationNumber', 'taxResidence'], {
        is: (taxIdentificationNumber: string, taxResidence: string) => taxIdentificationNumber && taxResidence,
        then: Yup.boolean()
            .required('Tax info confirmation is required.')
            .oneOf(
                [true],
                'You must confirm that the tax identification number and tax residence above are correct and up to date.'
            ),
        otherwise: Yup.boolean(),
    }),
});

export const address = Yup.object().shape({
    firstLineAddress: Yup.string().required('First line of address is required.'),
    secondLineAddress: Yup.string(),
    stateProvince: Yup.string(),
    townCity: Yup.string().required('Town/City is required.'),
    zipCode: Yup.string().matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, 'Please enter a valid postal/ZIP code'),
});

export const termsOfUse = Yup.object().shape({
    fatcaDeclaration: Yup.string().required('FATCA declaration is required.'),
    pepConfirmation: Yup.boolean().oneOf([true], 'You must confirm that you are not a PEP.'),
    termsAndCondition: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions.'),
});

export const signup = Yup.object().shape({
    citizenship: Yup.string(),
    country: Yup.string(),
    password: Yup.string().matches(passwordRegex?.isPasswordValid),
});
