export const API_ERROR_CODES = {
    claimedDocument: {
        code: 'ClaimedDocument',
        message:
            "This document number was already submitted for a different account. It seems you have an account with us that doesn't need further verification. Please contact us via live chat if you need help.",
    },
    duplicateAccount: {
        code: 'DuplicateAccount',
        message:
            'An account with these details already exists. Please make sure the details you entered are correct as only one real account is allowed per client. If this is a mistake, contact us via live chat.',
    },
    generic: {
        code: null,
        message: 'Sorry, an internal error occurred. Hit the above checkbox to try again.',
    },
    invalidOTP: { code: 'InvalidOTP', message: "That's not the right code. Please try again." },
    isInaccessibleMT5: {
        code: 'MT5AccountInaccessible',
        message: 'Inaccessible MT5 account(s)',
    },
    pendingCondition: {
        code: 'AccountHasPendingConditions',
        message: 'Action required',
    },
} as const;

const documentRejectedMessage = 'We were unable to verify the identity document with the details provided.';
const dataComparisonMessage = 'Your document type is not supported.';
const dataValidationMessage = 'Some details on your document appear to be invalid, missing, or unclear.';

export const IDV_ERROR_CODES = {
    deceased: {
        code: 'Deceased',
        message: 'The document’s owner is deceased.',
    },
    dobMismatch: {
        code: 'DobMismatch',
        message: "The date of birth on your identity document doesn't match your profile.",
    },
    documentRejected: {
        code: 'DocumentRejected',
        message: documentRejectedMessage,
    },
    emptyStatus: {
        code: 'EmptyStatus',
        message: 'The verification status was empty, rejected for lack of information.',
    },
    expired: {
        code: 'expired',
        message: 'Your identity document has expired.',
    },
    failed: {
        code: 'Failed',
        message: documentRejectedMessage,
    },
    generic: {
        code: null,
        message: 'Sorry, an internal error occurred. Click Verify to try again.',
    },
    highRisk: {
        code: 'HighRisk',
        message:
            'For enhanced security, we need to reverify your identity. Kindly resubmit your proof of identity to unlock your account.',
    },
    informationLack: {
        code: 'InformationLack',
        message: 'The verification is passed but the personal info is not available to compare.',
    },
    malformedJson: {
        code: 'MalformedJson',
        message: 'The verification status is not available, provider says: Malformed JSON.',
    },
    nameDobMismatch: {
        code: 'NameDobMismatch',
        message: "The name and date of birth on your identity document don't match your profile.",
    },
    nameMismatch: {
        code: 'NameMismatch',
        message: "The name on your identity document doesn't match your profile.",
    },
    needsTechnicalInvestigation: {
        code: 'NeedsTechnicalInvestigation',
        message: 'The verification status is not available, provider says: Needs Technical Investigation.',
    },
    rejected: {
        code: 'rejected',
        message: documentRejectedMessage,
    },
    rejectedByProvider: {
        code: 'RejectedByProvider',
        message: 'The document was rejected by the Provider.',
    },
    reportNotAvailable: {
        code: 'ReportNotAvailable',
        message: documentRejectedMessage,
    },
    underage: {
        code: 'Underage',
        message: 'You’re under legal age.',
    },
} as const;

export const ONFIDO_ERROR_CODES = {
    ageValidationMinimumAcceptAge: {
        code: 'AgeValidationMinimumAcceptedAge',
        message:
            'Your age in the document you provided appears to be below 18 years. We’re only allowed to offer our services to clients above 18 years old, so we’ll need to close your account. If you have a balance in your account, contact us via live chat and we’ll help to withdraw your funds before your account is closed.',
    },
    compromisedDocument: {
        code: 'CompromisedDocument',
        message: 'Your document failed our verification checks.',
    },
    dataComparisonDateOfBirth: {
        code: 'DataComparisonDateOfBirth',
        message: 'The date of birth on your document doesn’t match your profile.',
    },
    dataComparisonDateOfExpiry: {
        code: 'DataComparisonDateOfExpiry',
        message: 'Your document has expired.',
    },
    dataComparisonDocumentNumbers: {
        code: 'DataComparisonDocumentNumbers',
        message: dataComparisonMessage,
    },
    dataComparisonDocumentType: {
        code: 'DataComparisonDocumentType',
        message: dataComparisonMessage,
    },
    dataComparisonIssuingCountry: {
        code: 'DataComparisonIssuingCountry',
        message: 'The name on your document doesn’t match your profile.',
    },
    dataValidationDateOfBirth: {
        code: 'DataValidationDateOfBirth',
        message: dataValidationMessage,
    },
    dataValidationDocumentExpiration: {
        code: 'DataValidationDocumentExpiration',
        message: 'Your document has expired.',
    },
    dataValidationDocumentNumbers: {
        code: 'DataValidationDocumentNumbers',
        message: dataValidationMessage,
    },
    dataValidationExpiryDate: {
        code: 'DataValidationExpiryDate',
        message: dataValidationMessage,
    },
    dataValidationMrz: {
        code: 'DataValidationMrz',
        message: dataValidationMessage,
    },
    dataValidationNoDocumentNumbers: {
        code: 'DataValidationNoDocumentNumbers',
        message: 'The serial number of your document couldn’t be verified.',
    },
    duplicatedDocument: {
        code: 'DuplicatedDocument',
        message: 'Your verification documents were already used for another account.',
    },
    expired: {
        code: 'expired',
        message: 'Your identity document has expired.',
    },
    generic: {
        code: null,
        message: 'Sorry, an internal error occurred. Click Save to try again.',
    },
    imageIntegrityColourPicture: {
        code: 'ImageIntegrityColourPicture',
        message: 'Your document appears to be in black and white. Please upload a colour photo of your document.',
    },
} as const;
