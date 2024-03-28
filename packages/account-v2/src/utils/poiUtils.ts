import { TSocketEndpointNames, TSocketError } from '@deriv/api-v2/types';
import { API_ERROR_CODES, ERROR_MESSAGE, POI_SUBMISSION_STATUS } from '../constants';

type TPOISubmissionStatus = typeof POI_SUBMISSION_STATUS[keyof typeof POI_SUBMISSION_STATUS];

export type TPOIActions =
    | { payload: string; type: 'setSelectedCountry' }
    | { payload: TPOISubmissionStatus; type: 'setSubmissionStatus' };

export const setErrorMessage = <T extends TSocketError<TSocketEndpointNames>['error']>(error: T) => {
    const { code, message } = error ?? { code: null, message: null };
    switch (code) {
        case API_ERROR_CODES.DUPLICATE_ACCOUNT:
            return ERROR_MESSAGE.DUPLICATE_ACCOUNT;
        case API_ERROR_CODES.CLAIMED_DOCUMENT:
            return ERROR_MESSAGE.CLAIMED_DOCUMENT;
        default:
            return message ?? ERROR_MESSAGE.GENERIC;
    }
};
