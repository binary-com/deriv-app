import { useEffect } from 'react';
import { useStore } from '@deriv/stores';
import { ACCOUNT_BADGE_STATUS } from '@deriv/shared';

const useGetMFAccountStatus = () => {
    const { client } = useStore();
    const { account_status, updateAccountStatus } = client || {};

    useEffect(() => {
        async function fetchData() {
            await updateAccountStatus();
        }
        fetchData();
    }, []);
    const authentication = account_status?.authentication;
    const poi_status = authentication?.identity?.status;
    const onfido_status = authentication?.identity?.services?.onfido?.status;
    const manual_status = authentication?.identity?.services?.manual?.status;
    const poa_status = authentication?.document?.status;

    const STATUS = {
        NONE: 'none',
        VERIFIED: 'verified',
        PENDING: 'pending',
        REJECTED: 'rejected',
        EXPIRED: 'expired',
        SUSPECTED: 'suspected',
    } as const;
    const failed_cases = [STATUS.REJECTED, STATUS.EXPIRED, STATUS.SUSPECTED];

    //@ts-expect-error we can ignore this error since we are checking the status and returning true or false
    const need_poa_resubmission = poa_status && failed_cases.includes(poa_status);
    const poa_pending = poa_status === STATUS.PENDING;
    const poa_not_submitted = poa_status === STATUS.NONE;

    const poi_verified_by_onfido_or_manual = [onfido_status, manual_status].includes(STATUS.VERIFIED);
    const poi_pending_by_onfido_or_manual =
        [onfido_status, manual_status].includes(STATUS.PENDING) && !poi_verified_by_onfido_or_manual;

    const poi_not_submitted_by_onfido_or_manual = [onfido_status, manual_status].every(
        status => status === STATUS.NONE
    );
    const need_poi_submission = !poi_pending_by_onfido_or_manual && !poi_verified_by_onfido_or_manual;

    const need_poi_resubmission = !poi_not_submitted_by_onfido_or_manual && need_poi_submission;
    const is_verified = poi_status === STATUS.VERIFIED && poa_status === STATUS.VERIFIED;

    const getMFAccountStatus = () => {
        if (poa_status && onfido_status && manual_status) {
            if (need_poi_resubmission || need_poa_resubmission) {
                return ACCOUNT_BADGE_STATUS.FAILED;
            } else if (poi_not_submitted_by_onfido_or_manual || poa_not_submitted) {
                return ACCOUNT_BADGE_STATUS.NEEDS_VERIFICATION;
            } else if (poi_pending_by_onfido_or_manual || poa_pending) {
                return ACCOUNT_BADGE_STATUS.PENDING;
            }
            return null;
        }
        return null;
    };
    const getVerificationStatus = () => (!is_verified ? { poi_status, poa_status, valid_tin: 1 } : {});

    return {
        mf_account_status: getMFAccountStatus(),
        kyc_status: getVerificationStatus(),
    };
};

export default useGetMFAccountStatus;
