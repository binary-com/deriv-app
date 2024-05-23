import { useMemo } from 'react';
import useMutation from '../useMutation';
import useInvalidateQuery from '../useInvalidateQuery';

/** A custom hook to create third party CFD accounts. */
const useCreateOtherCFDAccount = () => {
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useMutation('trading_platform_new_account', {
        onSuccess: () => {
            invalidate('trading_platform_accounts');
        },
    });

    // Add additional information to the create Other CFD account response.
    const modified_data = useMemo(() => {
        if (!data) return undefined;

        return { ...data.trading_platform_new_account };
    }, [data]);

    return {
        /** The response and the mutation of the create third party CFDs API request */
        data: modified_data,
        ...rest,
    };
};

export default useCreateOtherCFDAccount;
