import { useFetch } from '@deriv/api';

/** A custom hook to check whether the current mf account has deposited based on status in account_status */
const useHasMFAccountDeposited = () => {
    const expected_status = ['unwelcome', 'withdrawal_locked', 'cashier_locked'];

    /** Check if the status contains one of the expected status
     * @param {string[]} status - status from account_status
     * @returns {boolean} - true if status contains one of the expected status
     */
    const hasDeposited = (status?: string[]) => {
        return status?.some(status => expected_status.includes(status)) ?? false;
    };

    const { data } = useFetch('get_account_status', {
        options: {
            /** Refetch account_status every 2 seconds if expected status is not in response.
             *  This is need to be done because OneTimeDepositModal will be closed based on those status
             */
            refetchInterval: response => (hasDeposited(response?.get_account_status?.status) ? false : 2000),
        },
    });

    const status = data?.get_account_status?.status;

    const has_mf_account_deposited = hasDeposited(status);

    /** Boolean of return value from hasDeposited function */
    return has_mf_account_deposited;
};

export default useHasMFAccountDeposited;
