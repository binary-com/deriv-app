import * as Yup from 'yup';

export const drivingLicenseValidator = Yup.string()
    .matches(/^[A-Z]\d{7}$/, 'Please enter the correct format. Example: B1234567')
    .max(8)
    .required('Please enter your Driver License number. Example: B1234567');

export const passportValidator = Yup.string()
    .matches(/^[A-Z]\d{7}$/, 'Please enter the correct format. Example: G1234567')
    .max(8)
    .required('Please enter your Passport number. Example: G1234567');

export const documentRequiredValidator = (documentType: string) => Yup.string().required(`${documentType} is required`);

export const ssnitValidator = Yup.string()
    .matches(/^[A-Z]\d{12}$/, 'Please enter the correct format. Example: C123456789012')
    .max(13)
    .required('Please enter your SSNIT number. Example: C123456789012');

export const nimcSlipValidator = Yup.string().matches(
    /^\d{11}$/,
    'Please enter your document number. Example: 12345678901'
);

export const requiredValidator = Yup.string().required('This field is required');

export const dateOfBirthValidator = Yup.date().required('Please enter your date of birth');

export const expiryDateValidator = Yup.date()
    .min(new Date(), 'Expiry date cannot be today date or in the past')
    .required('Expiry date is required');

export const firstNameValidator = Yup.string()
    .required('This field is required')
    .matches(/^(?!\s)[\p{L}'.-]+(?:\s[\p{L}'.-]+)*$/u, 'Letters, spaces, periods, hyphens, apostrophes only.')
    .min(1, 'Enter no more than 50 characters.')
    .max(50, 'Enter no more than 50 characters.');

export const lastNameValidator = Yup.string()
    .required('This field is required')
    .matches(/^(?!\s)[\p{L}'.-]+(?:\s[\p{L}'.-]+)*$/u, 'Letters, spaces, periods, hyphens, apostrophes only.')
    .min(1, 'Enter no more than 50 characters.')
    .max(50, 'Enter no more than 50 characters.');

export const addressFirstLineValidator = Yup.string()
    .trim()
    .required('First line of address is required.')
    .max(70, 'Should be less than 70.')
    .matches(
        /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
        "Use only the following special characters: . , ' : ; ( ) ° @ # / -'"
    );

export const addressSecondLineValidator = Yup.string()
    .trim()
    .max(70, 'Should be less than 70.')
    .matches(
        /^[\p{L}\p{Nd}\s'.,:;()\u00b0@#/-]{0,70}$/u,
        "Use only the following special characters: . , ' : ; ( ) ° @ # / -'"
    );

export const cityValidator = Yup.string()
    .required('Town/City is required.')
    .max(70, 'Should be less than 70.')
    .matches(/^[a-zA-Z\s\-.'']+$/, 'Only letters, space, hyphen, period, and apostrophe are allowed.');

export const postcodeValidator = Yup.string()
    .max(20, 'Please enter a Postal/ZIP code under 20 characters.')
    .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, 'Only letters, numbers, space, and hyphen are allowed.');
