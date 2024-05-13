import React from 'react';
import { Localize } from '@deriv/translations';
import IcDocumentNameMismatch from '../Assets/ic-document-name-mismatch.svg';
import IcDocumentAddressMismatch from '../Assets/ic-document-address-mismatch.svg';
import Ic6MonthsIssuedDocument from '../Assets/ic-6-month-issued-document.svg';
import Ic12MonthsIssuedDocument from '../Assets/ic-12-months-expiry.svg';
import IcBlurryDocument from '../Assets/ic-blurry-document.png';
import IcCroppedDocument from '../Assets/ic-cropped-document.svg';
import IcEnvelope from '../Assets/ic-envelop.svg';

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
        image: IcDocumentNameMismatch,
        description: <Localize i18n_default_text='Name in document doesn’t match your Deriv profile.' />,
        ref: 'name_mismatch',
    },
    {
        image: IcDocumentAddressMismatch,
        description: <Localize i18n_default_text='Address in document doesn’t match address you entered above.' />,
        ref: 'address_mismatch',
    },
    {
        ...(is_eu
            ? {
                  image: Ic6MonthsIssuedDocument,
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
        image: IcBlurryDocument,
        description: <Localize i18n_default_text='Blurry document. All information must be clear and visible.' />,
        ref: 'blurry_document',
    },
    {
        image: IcCroppedDocument,
        description: <Localize i18n_default_text='Cropped document. All information must be clear and visible.' />,
        ref: 'cropped_document',
    },
    {
        image: IcEnvelope,
        description: <Localize i18n_default_text='An envelope with your name and address.' />,
        ref: 'envelope',
    },
];
