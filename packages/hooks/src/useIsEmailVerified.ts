import { useStore } from '@deriv/stores';
import { useMemo } from 'react';

/**
 * @description Check if the email is verified based on the account status
 *
 * @returns {boolean} is_email_verified
 */
const useIsEmailVerified = (): boolean => {
    const {
        client: { account_status },
    } = useStore();

    const is_email_verified = useMemo(() => {
        return !account_status?.status?.includes('email_not_verified');
    }, [account_status?.status]);

    return is_email_verified;
};

export default useIsEmailVerified;
