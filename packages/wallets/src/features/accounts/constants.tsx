import Ic12MonthsIssuedDocument from '../../public/images/accounts/ic-12-months-expiry.svg';
import IcBlurryDocument from '../../public/images/accounts/ic-blurry-document.svg';
import IcCroppedDocument from '../../public/images/accounts/ic-cropped-document.svg';
import IcDocumentAddressMismatch from '../../public/images/accounts/ic-document-address-mismatch.svg';
import IcDocumentNameMismatch from '../../public/images/accounts/ic-document-name-mismatch.svg';
import IcEnvelope from '../../public/images/accounts/ic-envelop.svg';
import i18n from '../../translations/i18n';
import { THooks } from '../../types';

type TExampleImageConfig = {
    description: React.ReactNode;
    image: React.ComponentType<React.SVGAttributes<SVGElement>>;
};

type TStatusCodes = Exclude<THooks.POA['status'] | THooks.POI['current']['status'], undefined>;

export const getExampleImagesConfig = (): TExampleImageConfig[] => [
    {
        description: i18n.t('Name in document doesn’t match your Deriv profile.'),
        image: IcDocumentNameMismatch,
    },
    {
        description: i18n.t('Address in document doesn’t match address you entered above.'),
        image: IcDocumentAddressMismatch,
    },
    {
        description: i18n.t('Document issued more than 12-months ago.'),
        image: Ic12MonthsIssuedDocument,
    },
    {
        description: i18n.t('Blurry document. All information must be clear and visible.'),
        image: IcBlurryDocument,
    },
    {
        description: i18n.t('Cropped document. All information must be clear and visible.'),
        image: IcCroppedDocument,
    },
    {
        description: i18n.t('An envelope with your name and address.'),
        image: IcEnvelope,
    },
];

export const statusCodes: Record<TStatusCodes, string> = {
    expired: 'expired',
    none: 'none',
    pending: 'pending',
    rejected: 'rejected',
    suspected: 'suspected',
    verified: 'verified',
} as const;

export const ErrorCode = {
    DuplicateUpload: 'DuplicateUpload',
} as const;
