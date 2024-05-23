import { useMemo } from 'react';
import { useAuthContext } from '../AuthProvider';
import { getAccountListWithAuthToken } from '@deriv/utils';

/** A custom hook that authorize the user with the given token. If no token is given,
 * it will use the current token from localStorage.
 */
const useAuthorize = () => {
    const ctx = useAuthContext();
    const {
        data,
        switchAccount,
        isLoading,
        isSuccess,
        isFetching,
        isError,
        refetch,
        error,
        loginid,
        isSwitching,
        isInitializing,
    } = ctx;

    const modifiedData = useMemo(() => {
        return { ...data?.authorize, account_list: getAccountListWithAuthToken(data?.authorize?.account_list) };
    }, [data]);

    const value = useMemo(() => {
        return {
            /** The authorize response. */
            data: modifiedData,
            /** Function to switch to another account */
            switchAccount,
            isLoading,
            isSuccess,
            isFetching,
            isError,
            refetch,
            error,
            loginid,
            isSwitching,
            isInitializing,
        };
    }, [modifiedData, switchAccount, isLoading, isSuccess, isFetching, isError, refetch, error, loginid]);

    return value;
};

export default useAuthorize;
