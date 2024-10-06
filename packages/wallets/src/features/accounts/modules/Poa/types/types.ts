import { THooks } from '../../../../../types';

export type TAddressDetails = {
    firstLine: THooks.AccountSettings['address_line_1'];
    secondLine: THooks.AccountSettings['address_line_2'];
    stateProvinceLine: THooks.AccountSettings['address_state'];
    townCityLine: THooks.AccountSettings['address_city'];
    zipCodeLine: THooks.AccountSettings['address_postcode'];
};

export type TPoaValues = TAddressDetails & TDocumentSubmission;

export type TAddressSectionProps = {
    hasError?: boolean;
};

export type TDocumentSubmission = { documentType?: string; poaFile?: File };

export type TDocumentSubmissionProps = {
    countryCode: string;
};

/** Type for the list of items in a dropdown or select */
export type TListItem = {
    text?: string;
    value?: string;
};
