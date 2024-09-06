import { useStore } from '@deriv/stores';
import useGetMFAccountStatus from './useGetMFAccountStatus';
import { CFD_PLATFORMS } from '@deriv/shared';

const useGetStatus = () => {
    const { common, traders_hub } = useStore();
    const { mf_account_status, kyc_status } = useGetMFAccountStatus();
    const { platform } = common;
    const { selected_jurisdiction_kyc_status } = traders_hub;
    if (platform === CFD_PLATFORMS.MT5) {
        return {
            status_badge: mf_account_status,
            client_kyc_status: {
                ...selected_jurisdiction_kyc_status,
            },
        };
    }
    return {
        status_badge: mf_account_status,
        client_kyc_status: {
            ...kyc_status,
        },
    };
};

export default useGetStatus;
