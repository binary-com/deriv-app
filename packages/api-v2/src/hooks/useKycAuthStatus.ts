import { TSocketRequestPayload } from '../../types';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

type TKycAuthStatusPayload = TSocketRequestPayload<'kyc_auth_status'>['payload'];

/** Custom hook that returns Proof of Identity (POI) and Proof of Address (POA) authentication status details. */
const useKycAuthStatus = (payload?: TKycAuthStatusPayload) => {
    const { isSuccess } = useAuthorize();
    const { data, ...kyc_auth_status_rest } = useQuery('kyc_auth_status', {
        payload,
        options: { enabled: isSuccess },
    });
    return {
        /** The KYC auth status */
        kyc_auth_status: data?.kyc_auth_status,
        ...kyc_auth_status_rest,
    };
};

export default useKycAuthStatus;
