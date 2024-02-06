import React from 'react';
import IdentityCardBack from '../assets/manual-form/document-back.svg';
import DrivingLicenseCardFront from '../assets/manual-form/driving-license-front.svg';
import IdentityCardFront from '../assets/manual-form/identity-card-front.svg';
import NIMCSlipFront from '../assets/manual-form/nimc-slip-front.svg';
import PassportPlaceholder from '../assets/manual-form/passport-placeholder.svg';
import ProofOfAgeIcon from '../assets/manual-form/proof-of-age.svg';

export type TManualDocumentTypes = typeof MANUAL_DOCUMENT_TYPES[keyof typeof MANUAL_DOCUMENT_TYPES];

export const MANUAL_DOCUMENT_TYPES = Object.freeze({
    DRIVING_LICENCE: 'driving_licence',
    NATIONAL_IDENTITY_CARD: 'national_identity_card',
    NIMC_SLIP: 'nimc_slip',
    PASSPORT: 'passport',
});

export const MANUAL_FORM_INITIAL_VALUES = Object.freeze({
    document_expiry: '',
    document_number: '',
});

export const MANUAL_DOCUMENT_TYPES_DATA = Object.freeze({
    [MANUAL_DOCUMENT_TYPES.DRIVING_LICENCE]: {
        fields: {
            documentNumber: {
                label: 'Driving licence number',
                errorMessage: 'Driving licence number is required.',
            },
            documentExpiry: {
                label: 'Expiry date',
                errorMessage: 'Expiry date is required.',
            },
        },
        upload: [
            {
                fileUploadIcon: <DrivingLicenseCardFront />,
                fileUploadText: 'Upload the front of your driving licence.',
            },
            {
                fileUploadIcon: <IdentityCardBack />,
                fileUploadText: 'Upload the back of your driving licence.',
            },
        ],
        inputSectionHeader: 'First, enter your Driving licence number and the expiry date.',
        uploadSectionHeader: 'Next, upload the front and back of your driving licence.',
    },
    [MANUAL_DOCUMENT_TYPES.NATIONAL_IDENTITY_CARD]: {
        fields: {
            documentNumber: {
                label: 'Identity card number',
                errorMessage: 'Identity card number is required.',
            },
            documentExpiry: {
                label: 'Expiry date',
                errorMessage: 'Expiry date is required.',
            },
        },
        upload: [
            {
                fileUploadIcon: <IdentityCardFront />,
                fileUploadText: 'Upload the front of your identity card.',
            },
            {
                fileUploadIcon: <IdentityCardBack />,
                fileUploadText: 'Upload the back of your identity card.',
            },
        ],
        inputSectionHeader: 'First, enter your Identity card number and the expiry date.',
        uploadSectionHeader: 'Next, upload the front and back of your identity card.',
    },
    [MANUAL_DOCUMENT_TYPES.NIMC_SLIP]: {
        fields: {
            documentNumber: {
                label: 'NIMC slip number',
                errorMessage: 'NIMC slip number is required.',
            },
            documentExpiry: {
                label: 'Expiry date',
                errorMessage: 'Expiry date is required.',
            },
        },
        upload: [
            {
                fileUploadIcon: <NIMCSlipFront />,
                fileUploadText: 'Upload your NIMC slip.',
            },
            {
                fileUploadIcon: <ProofOfAgeIcon />,
                fileUploadText: 'Upload your proof of age: birth certificate or age declaration document.',
            },
        ],
        inputSectionHeader: 'First, enter your NIMC slip number and the expiry date.',
        uploadSectionHeader: 'Next, upload the page of your NIMC slip that contains your photo.',
    },
    [MANUAL_DOCUMENT_TYPES.PASSPORT]: {
        fields: {
            documentNumber: {
                label: 'Passport number',
                errorMessage: 'Passport number is required.',
            },
            documentExpiry: {
                label: 'Expiry date',
                errorMessage: 'Expiry date is required.',
            },
        },
        upload: [
            {
                fileUploadIcon: <PassportPlaceholder />,
                fileUploadText: 'Upload the page of your passport that contains your photo.',
            },
        ],
        inputSectionHeader: 'First, enter your Passport number and the expiry date.',
        uploadSectionHeader: 'Next, upload the page of your passport that contains your photo.',
    },
});
