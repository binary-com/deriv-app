import React from 'react';
import { GetAccountStatus, ResidenceList } from '@deriv/api-types';
import { IDV_ERROR_STATUS, getIDVError } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { DerivLightNameDobPoiIcon, DerivLightDobPoiIcon, DerivLightNamePoiIcon } from '@deriv/quill-icons';
import { getIDVDocumentType } from '../Helpers/utils';

const handleOnClick = () => window.LiveChatWidget.call('maximize');

export const GENERIC_ERROR_MESSAGE = (
    <Localize i18n_default_text='Sorry, an internal error occurred. Hit the above checkbox to try again.' />
);

export const DUPLICATE_ACCOUNT_ERROR_MESSAGE = (
    <Localize
        i18n_default_text='An account with these details already exists. Please make sure the details you entered are correct as only one real account is allowed per client. If this is a mistake, contact us via <0>live chat</0>.'
        components={[<span key={0} className='link link--orange' onClick={handleOnClick} onKeyDown={handleOnClick} />]}
    />
);

export const CLAIMED_DOCUMENT_ERROR_MESSAGE = (
    <Localize
        i18n_default_text="This document number was already submitted for a different account. It seems you have an account with us that doesn't need further verification. Please contact us via <0>live chat</0> if you need help."
        components={[<span key={0} className='link link--orange' onClick={handleOnClick} onKeyDown={handleOnClick} />]}
    />
);

export const generateIDVError = (
    is_document_upload_required: boolean,
    latest_status: DeepRequired<GetAccountStatus>['authentication']['attempts']['latest'],
    chosen_country: ResidenceList[0],
    mismatch_status: keyof typeof IDV_ERROR_STATUS
) => {
    const document_name = is_document_upload_required
        ? 'identity document'
        : getIDVDocumentType(latest_status, chosen_country);

    switch (mismatch_status) {
        case IDV_ERROR_STATUS.NameMismatch.code:
            return {
                required_fields: ['first_name', 'last_name'],
                side_note_image: <DerivLightNamePoiIcon height='195px' width='285px' />,
                inline_note_text: (
                    <Localize
                        i18n_default_text='To avoid delays, enter your <0>name</0> exactly as it appears on your {{document_name}}.'
                        components={[<strong key={0} />]}
                        values={{ document_name }}
                    />
                ),
                failure_message: IDV_ERROR_STATUS.NameMismatch.message,
            };
        case IDV_ERROR_STATUS.DobMismatch.code:
            return {
                required_fields: ['date_of_birth'],
                side_note_image: <DerivLightDobPoiIcon height='195px' width='285px' />,
                inline_note_text: (
                    <Localize
                        i18n_default_text='To avoid delays, enter your <0>date of birth</0> exactly as it appears on your {{document_name}}.'
                        components={[<strong key={0} />]}
                        values={{ document_name }}
                    />
                ),
                failure_message: IDV_ERROR_STATUS.DobMismatch.message,
            };
        default:
            return {
                required_fields: ['first_name', 'last_name', 'date_of_birth'],
                side_note_image: <DerivLightNameDobPoiIcon height='195px' width='285px' />,
                inline_note_text: (
                    <Localize
                        i18n_default_text='To avoid delays, enter your <0>name</0> and <0>date of birth</0> exactly as they appear on your {{document_name}}.'
                        components={[<strong key={0} />]}
                        values={{ document_name }}
                    />
                ),
                failure_message: getIDVError(mismatch_status),
            };
    }
};
