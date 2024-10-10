import { useStore } from '@deriv/stores';
import useGetMFAccountStatus from './useGetMFAccountStatus';
import useIsSelectedMT5AccountCreated from './useIsSelectedMT5AccountCreated';
import { CFD_PLATFORMS } from '@deriv/shared';

/** A custom hook to fetch the status badge value and client_kyc_status for MF account and MT5 account 
MF account status is fetched from useGetMFAccountStatus
MT5 account status is fetched from useIsSelectedMT5AccountCreated
*/
const useGetStatus = () => {
    const { common } = useStore();
    const { mf_account_status, kyc_status } = useGetMFAccountStatus();
    const { is_selected_MT5_account_created, existing_account_status, existing_account, available_account_to_create } =
        useIsSelectedMT5AccountCreated();
    const { platform } = common;

    if (platform === CFD_PLATFORMS.MT5) {
        return {
            status_badge: existing_account_status,
            client_kyc_status: is_selected_MT5_account_created
                ? existing_account?.client_kyc_status
                : available_account_to_create?.client_kyc_status,
        };
    }
    return {
        status_badge: mf_account_status,
        client_kyc_status: kyc_status,
    };
};

export default useGetStatus;
