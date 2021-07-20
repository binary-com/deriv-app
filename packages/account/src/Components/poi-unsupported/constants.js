import { localize } from '@deriv/translations';

export const ROOT_CLASS = 'manual-poi-details';

export const DOCUMENT_TYPES = {
    NATIONAL_IDENTITY_CARD: 'national_identity_card',
    PASSPORT: 'passport',
    DRIVING_LICENCE: 'driving_licence',
    OTHER: 'other',
};

const PAGE_TYPE = {
    FRONT: 'front',
    BACK: 'back',
    PHOTO: 'photo',
};

export const SELFIE_DOCUMENT = {
    document_type: DOCUMENT_TYPES.OTHER,
    pageType: PAGE_TYPE.PHOTO,
    name: 'selfie',
    icon: 'IcSelfie',
    info: localize('Upload your selfie.'),
};

const date_field = {
    name: 'expiry_date',
    label: localize('Expiry date'),
    type: 'date',
    required: true,
};

export const getDocumentIndex = ({ residence }) => [
    {
        onfido_name: 'Passport',
        card: {
            title: localize('Passport'),
            description: localize('Upload the page that contains your photo.'),
            icon: 'IcPoiPassport',
        },
        details: {
            fields: [
                {
                    name: 'document_id',
                    label: localize('Passport number'),
                    type: 'text',
                    required: true,
                },
                { ...date_field },
            ],
            documents_title: localize('Next, upload the page of your passport that contains your photo.'),
            documents: [
                {
                    document_type: DOCUMENT_TYPES.PASSPORT,
                    pageType: PAGE_TYPE.FRONT,
                    name: 'passport',
                    icon: 'IcPassport',
                    info: localize('Upload the page of your passport that contains your photo.'),
                },
            ],
        },
    },
    {
        onfido_name: 'Driving Licence',
        card: {
            title: localize('Driving licence'),
            description: localize('Upload the front and back of your driving licence.'),
            icon: 'IcPoiDrivingLicence',
        },
        details: {
            fields_title: localize('First, enter your driving licence number and the expiry date.'),
            fields: [
                {
                    name: 'document_id',
                    label: localize('Driving licence number'),
                    type: 'text',
                    required: true,
                },
                { ...date_field },
            ],
            documents_title: localize('Next, upload the front and back of your driving licence.'),
            documents: [
                {
                    document_type: DOCUMENT_TYPES.DRIVING_LICENCE,
                    pageType: PAGE_TYPE.FRONT,
                    name: 'driving_licence_front',
                    icon: 'IcDrivingLicenceFront',
                    info: localize('Upload the front of your driving licence.'),
                },
                {
                    document_type: DOCUMENT_TYPES.DRIVING_LICENCE,
                    pageType: PAGE_TYPE.BACK,
                    name: 'driving_licence_back',
                    icon: 'IcIdCardBack',
                    info: localize('Upload the back of your driving licence.'),
                },
            ],
        },
    },
    {
        onfido_name: 'National Identity Card',
        card: {
            title: localize('Identity card'),
            description: localize('Upload the front and back of your identity card.'),
            icon: 'IcPoiIdentityCard',
        },
        details: {
            fields_title: localize('First, enter your identity card number and the expiry date.'),
            fields: [
                {
                    name: 'document_id',
                    label: localize('Identity card number'),
                    type: 'text',
                    required: true,
                },
                { ...date_field },
            ],
            documents_title: localize('Next, upload the front and back of your identity card.'),
            documents: [
                {
                    document_type: DOCUMENT_TYPES.NATIONAL_IDENTITY_CARD,
                    pageType: PAGE_TYPE.FRONT,
                    name: 'identity_card_front',
                    icon: 'IcIdCardFront',
                    info: localize('Upload the front of your identity card.'),
                },
                {
                    document_type: DOCUMENT_TYPES.NATIONAL_IDENTITY_CARD,
                    pageType: PAGE_TYPE.BACK,
                    name: 'identity_card_back',
                    icon: 'IcIdCardBack',
                    info: localize('Upload the back of your identity card.'),
                },
            ],
        },
    },
    ...(residence === 'ng'
        ? [
              {
                  card: {
                      title: localize('NIMC slip and proof of age'),
                      description: localize('Upload both of these documents to prove your identity.'),
                      icon: 'IcPoiNimcSlip',
                  },
                  details: {
                      fields: [
                          {
                              name: 'nimc_slip_number',
                              label: localize('NIMC slip number'),
                              type: 'text',
                              required: true,
                          },
                          { ...date_field, required: false },
                      ],
                      documents_title: localize('Next, upload both of the following documents.'),
                      documents: [
                          {
                              document_type: DOCUMENT_TYPES.NATIONAL_IDENTITY_CARD,
                              lifetime_valid: true,
                              pageType: PAGE_TYPE.FRONT,
                              name: 'identity_card_front',
                              icon: 'IcPoiNimcSlipHorizontal',
                              info: localize('Upload your NIMC slip.'),
                          },
                          {
                              document_type: DOCUMENT_TYPES.OTHER,
                              pageType: PAGE_TYPE.PHOTO,
                              name: 'birth_certificate_front',
                              icon: 'IcDop',
                              info: localize(
                                  'Upload your proof of age: birth certificate or age declaration document.'
                              ),
                          },
                      ],
                  },
              },
          ]
        : []),
];
