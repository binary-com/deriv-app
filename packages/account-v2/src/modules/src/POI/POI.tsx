import React, { useEffect, useReducer } from 'react';
import { useKycAuthStatus } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { AUTH_STATUS_CODES, POI_SUBMISSION_STATUS } from '../../../constants';
import { POICountrySelector, POIFlowContainer, VerificationStatus } from '../../../containers';
import { TPOIActions, TPOISubmissionStatus } from '../../../utils';

type TPOIInitialState = {
    selectedCountry: string;
    submissionStatus: TPOISubmissionStatus;
};

export const ProofOfIdentity = () => {
    const { isLoading, kyc_auth_status: kycAuthStatus } = useKycAuthStatus();

    const poiStatus = kycAuthStatus?.identity.status;
    const service = kycAuthStatus?.identity.service;
    const isPOARequired = kycAuthStatus?.address.status === AUTH_STATUS_CODES.NONE;

    const initialState: TPOIInitialState = {
        selectedCountry: '',
        submissionStatus: POI_SUBMISSION_STATUS.selecting,
    };

    const reducer = (state: TPOIInitialState, action: TPOIActions) => {
        switch (action.type) {
            case 'setSelectedCountry':
                return { ...state, selectedCountry: action.payload };
            case 'setSubmissionStatus':
                return { ...state, submissionStatus: action.payload };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const shouldDisplayStatus = [AUTH_STATUS_CODES.PENDING, AUTH_STATUS_CODES.VERIFIED].some(
            status => status === poiStatus
        );
        if (!isLoading && shouldDisplayStatus) {
            dispatch({ payload: POI_SUBMISSION_STATUS.complete, type: 'setSubmissionStatus' });
        }
    }, [poiStatus, isLoading]);

    if (isLoading) {
        return <Loader />;
    }

    switch (state.submissionStatus) {
        case POI_SUBMISSION_STATUS.complete:
            return <VerificationStatus isPOARequired={isPOARequired} service={service} status={poiStatus} />;
        case POI_SUBMISSION_STATUS.submitting:
            return (
                <POIFlowContainer
                    countryCode={state.selectedCountry}
                    onCancel={() => dispatch({ payload: POI_SUBMISSION_STATUS.selecting, type: 'setSubmissionStatus' })}
                    onComplete={() =>
                        dispatch({ payload: POI_SUBMISSION_STATUS.complete, type: 'setSubmissionStatus' })
                    }
                />
            );
        default:
            return (
                <POICountrySelector
                    handleNext={() =>
                        dispatch({ payload: POI_SUBMISSION_STATUS.submitting, type: 'setSubmissionStatus' })
                    }
                    onCountrySelect={value => {
                        dispatch({ payload: value, type: 'setSelectedCountry' });
                    }}
                />
            );
    }
};
