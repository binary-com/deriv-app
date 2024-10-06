import {
    DerivLightIcBlurryDocumentIcon,
    DerivLightIcCroppedDocumentIcon,
    DerivLightIcDocumentAddressMismatchIcon,
    DerivLightIcDocumentNameMismatchIcon,
    DerivLightIcEnvelopeIcon,
    DerivLightIcOldIssuedDocumentMoreThan12Icon,
} from '@deriv/quill-icons';
import { localize } from '@deriv-com/translations';
import { TListItem } from '../types';

type TExampleImageConfig = {
    description: string;
    image: React.ComponentType<React.SVGAttributes<SVGElement>>;
};

export const getExampleImagesConfig = (): TExampleImageConfig[] => [
    {
        description: localize('Name in document doesn’t match your Deriv profile.'),
        image: DerivLightIcDocumentNameMismatchIcon,
    },
    {
        description: localize('Address in document doesn’t match address you entered above.'),
        image: DerivLightIcDocumentAddressMismatchIcon,
    },
    {
        description: localize('Document issued more than 12-months ago.'),
        image: DerivLightIcOldIssuedDocumentMoreThan12Icon,
    },
    {
        description: localize('Blurry document. All information must be clear and visible.'),
        image: DerivLightIcBlurryDocumentIcon,
    },
    {
        description: localize('Cropped document. All information must be clear and visible.'),
        image: DerivLightIcCroppedDocumentIcon,
    },
    {
        description: localize('An envelope with your name and address.'),
        image: DerivLightIcEnvelopeIcon,
    },
];

export const getSupportedProofOfAddressDocuments = (): Required<TListItem>[] => {
    return [
        {
            text: localize('Utility bill (electricity, water, gas)'),
            value: 'utility_bill',
        },
        {
            text: localize('Landline phone bill'),
            value: 'phone_bill',
        },
        {
            text: localize('Bank statement'),
            value: 'bank_statement',
        },
        {
            text: localize('Official residence declaration or affidavit'),
            value: 'affidavit',
        },
        {
            text: localize('Official letter issued by the government or solicitor'),
            value: 'official_letter',
        },
        {
            text: localize('Rental/tenancy agreement'),
            value: 'rental_agreement',
        },
        {
            text: localize('Others'),
            value: 'poa_others',
        },
    ];
};
