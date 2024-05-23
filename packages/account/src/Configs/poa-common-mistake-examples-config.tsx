import React from 'react';
import { Localize } from '@deriv/translations';
import {
    DerivLightIcBlurryDocumentIcon,
    DerivLightIcCroppedDocumentIcon,
    DerivLightIcDocumentAddressMismatchIcon,
    DerivLightIcDocumentNameMismatchIcon,
    DerivLightIcEnvelopeIcon,
    DerivLightIcOldIssuedDocumentIcon,
} from '@deriv/quill-icons';
import Ic12MonthsIssuedDocument from '../Assets/ic-12-months-expiry.svg';

type TExampleImageConfig = {
    image: React.ComponentType<React.SVGAttributes<SVGElement>>;
    description: JSX.Element;
    ref: string;
};
/**
 * Returns a configuration containing images and descriptions for common POA document upload mistakes
 * @returns Array of objects containing image and description
 */
export const getExampleImagesConfig = (is_eu: boolean): Array<TExampleImageConfig> => [
    {
        image: DerivLightIcDocumentNameMismatchIcon,
        description: <Localize i18n_default_text='Name in document doesn’t match your Deriv profile.' />,
        ref: 'name_mismatch',
    },
    {
        image: DerivLightIcDocumentAddressMismatchIcon,
        description: <Localize i18n_default_text='Address in document doesn’t match address you entered above.' />,
        ref: 'address_mismatch',
    },
    {
        ...(is_eu
            ? {
                  image: DerivLightIcOldIssuedDocumentIcon,
                  description: <Localize i18n_default_text='Document issued more than 6-months ago.' />,
                  ref: 'old_6_month_issued_document',
              }
            : {
                  image: Ic12MonthsIssuedDocument,
                  description: <Localize i18n_default_text='Document issued more than 12-months ago.' />,
                  ref: 'old_12_month_issued_document',
              }),
    },
    {
        image: DerivLightIcBlurryDocumentIcon,
        description: <Localize i18n_default_text='Blurry document. All information must be clear and visible.' />,
        ref: 'blurry_document',
    },
    {
        image: DerivLightIcCroppedDocumentIcon,
        description: <Localize i18n_default_text='Cropped document. All information must be clear and visible.' />,
        ref: 'cropped_document',
    },
    {
        image: DerivLightIcEnvelopeIcon,
        description: <Localize i18n_default_text='An envelope with your name and address.' />,
        ref: 'envelope',
    },
];
