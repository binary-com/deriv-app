import useAuthorize from './useAuthorize';
import useQuery from '../useQuery';

const useLoginHistory = (limitValue: number) => {
    const { isSuccess } = useAuthorize();

    const { data, ...rest } = useQuery('login_history', {
        options: { enabled: isSuccess },
        payload: { limit: limitValue },
    });

    return {
        loginHistory: data?.login_history,
        ...rest,
    };
};
export default useLoginHistory;
