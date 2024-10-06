import React from 'react';
import { TFilesDescription, TListItem } from '../Types';
import { localize, Localize } from '@deriv-com/translations';

export const getFileUploaderDescriptions = (page: string, is_eu?: boolean): TFilesDescription => {
    const proof_of_income_descriptions = {
        title: <Localize i18n_default_text='The document must be recent and include your name and address:' />,
        descriptions: [
            {
                id: 'signed_document',
                value: (
                    <Localize i18n_default_text='The document must be up-to-date and signed by the issuance authority.' />
                ),
            },
            {
                id: 'contains_letterhead',
                value: <Localize i18n_default_text='The document must contain a letterhead.' />,
            },
            {
                id: 'invalid_rejected',
                value: <Localize i18n_default_text='Invalid or incomplete documents shall be rejected.' />,
            },
        ],
    };
    const proof_of_address_descriptions = {
        title: (
            <Localize
                i18n_default_text='We accept only the following documents as proof of address. The document must be issued within the last {{expiry_in_months}} months and include your full name and address:'
                values={{ expiry_in_months: is_eu ? 6 : 12 }}
            />
        ),
        descriptions: [
            {
                id: 'utility_bill',
                value: (
                    <Localize
                        i18n_default_text='<0>Utility bill:</0> Electricity, water, gas, or landline phone bill.'
                        components={[<strong key={0} />]}
                    />
                ),
            },
            {
                id: 'financial_legal_government_document',
                value: (
                    <Localize
                        i18n_default_text='<0>Financial, legal, or government document:</0> Recent bank statement, affidavit, or government-issued letter.'
                        components={[<strong key={0} />]}
                    />
                ),
            },
            {
                id: 'tenancy_agreement',
                value: (
                    <Localize
                        i18n_default_text='<0>Tenancy agreement:</0> Valid and current agreement.'
                        components={[<strong key={0} />]}
                    />
                ),
            },
        ],
    };

    if (page === 'poinc') return proof_of_income_descriptions;
    if (page === 'poa') return proof_of_address_descriptions;
    return { title: '', descriptions: [] };
};

export const getSupportedProofOfAddressDocuments = (): Required<TListItem>[] => {
    return [
        {
            value: 'utility_bill',
            text: localize('Utility bill (electricity, water, gas)'),
        },
        {
            value: 'phone_bill',
            text: localize('Landline phone bill'),
        },
        {
            value: 'bank_statement',
            text: localize('Bank statement'),
        },
        {
            value: 'affidavit',
            text: localize('Official residence declaration or affidavit'),
        },
        {
            value: 'official_letter',
            text: localize('Official letter issued by the government or solicitor'),
        },
        {
            value: 'rental_agreement',
            text: localize('Rental/tenancy agreement'),
        },
        {
            text: localize('Others'),
            value: 'poa_others',
        },
    ];
};
