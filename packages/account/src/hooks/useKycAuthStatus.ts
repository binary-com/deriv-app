import { useCallback } from 'react';
import { useInvalidateQuery, useQuery } from '@deriv/api';
import { TSocketRequestPayload } from '@deriv/api/types';
import { useStore } from '@deriv/stores';

type TKycAuthStatusPayload = TSocketRequestPayload<'kyc_auth_status'>['payload'];

/** Custom hook that returns Proof of Identity (POI) and Proof of Address (POA) authentication status details. */
export const useKycAuthStatus = (payload?: TKycAuthStatusPayload) => {
    const { client } = useStore();
    const invalidate = useInvalidateQuery();

    const { is_authorize } = client;
    const { data, ...kyc_auth_status_rest } = useQuery('kyc_auth_status', {
        payload,
        options: { enabled: is_authorize },
    });

    /** Invalidate KYC auth status API call */
    const reFetchKycAuthStatus = useCallback(() => invalidate('kyc_auth_status'), [invalidate]);

    return {
        /** The KYC auth status */
        kyc_auth_status: data?.kyc_auth_status,
        reFetchKycAuthStatus,
        ...kyc_auth_status_rest,
    };
};
