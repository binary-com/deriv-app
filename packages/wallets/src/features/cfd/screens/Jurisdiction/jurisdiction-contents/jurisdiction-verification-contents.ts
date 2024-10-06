import { useTranslations } from '@deriv-com/translations';
import { TJurisdictionVerificationItems, TJurisdictionVerificationStatus } from './props.types';

type TJurisdictionVerificationContents = {
    requiredVerificationDocs: TJurisdictionVerificationItems;
    shortDescription: string;
    statusReferences: TJurisdictionVerificationStatus[];
};
export const jurisdictionVerificationContents = (
    localize: ReturnType<typeof useTranslations>['localize']
): TJurisdictionVerificationContents => ({
    requiredVerificationDocs: {
        documentNumber: {
            icon: 'IcDocumentNumberVerification',
            text: localize("Document number (eg. identity card, passport, driver's license)"),
        },
        identityDocument: {
            icon: 'IcIdentityDocumentVerification',
            text: localize("A copy of your identity document (eg. identity card, passport, driver's license)"),
        },
        nameAndAddress: {
            icon: 'IcNameAndAddressVerification',
            text: localize(
                'A recent utility bill (eg. electricity, water or gas) or recent bank statement or government-issued letter with your name and address.'
            ),
        },
        notApplicable: {
            icon: 'IcNotApplicableVerification',
            text: '',
        },
        selfie: {
            icon: 'IcSelfieVerification',
            text: localize('A selfie of yourself.'),
        },
    },
    shortDescription: localize('We need you to submit these in order to get this account:'),
    statusReferences: [
        {
            color: 'yellow',
            icon: 'verificationPendingStatusIcon',
            text: localize('Verification in review.'),
        },
        {
            color: 'red',
            icon: 'verificationFailedStatusIcon',
            text: localize('Verification failed. Resubmit your details.'),
        },
        {
            color: 'green',
            icon: 'verificationSuccessStatusIcon',
            text: localize('Verification successful.'),
        },
    ],
});
