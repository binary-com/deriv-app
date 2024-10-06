import { useEffect, useMemo, useState } from 'react';
import { TSocketRequestPayload } from '../../types';
import useAuthorize from './useAuthorize';
import useQuery from '../useQuery';
import useInvalidateQuery from '../useInvalidateQuery';
import useActiveAccount from './useActiveAccount';
import { displayMoney } from '../utils';

type TFilter = NonNullable<TSocketRequestPayload<'statement'>['payload']>['action_type'];

/** A custom hook to get the summary of account transactions */
const useTransactions = () => {
    const { isFetching, isSuccess } = useAuthorize();

    const { data: account } = useActiveAccount();
    const display_code = account?.currency_config?.display_code || 'USD';
    const fractional_digits = account?.currency_config?.fractional_digits || 2;

    const [filter, setFilter] = useState<TFilter>();
    const { data, remove, ...rest } = useQuery('statement', {
        options: {
            enabled: !isFetching && isSuccess,
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.statement?.count) return;

                return pages.length;
            },
        },
        payload: {
            action_type: filter,
            description: 1,
        },
    });

    const invalidate = useInvalidateQuery();
    useEffect(() => {
        invalidate('statement');
    }, [filter, invalidate]);

    useEffect(() => {
        return remove;
    }, [remove]);

    // Modify the data.
    const modified_data = useMemo(() => {
        if (!data?.statement?.transactions?.length) return;

        return data?.statement?.transactions?.map(transaction => ({
            ...transaction,
            /** The transaction amount in currency format. */
            display_amount: displayMoney(transaction?.amount || 0, display_code, { fractional_digits }),
            /** The balance of account after the transaction in currency format. */
            display_balance_after: displayMoney(transaction?.balance_after || 0, display_code, { fractional_digits }),
        }));
    }, [data?.statement?.transactions, display_code, fractional_digits]);

    return {
        /** List of account transactions */
        data: modified_data,
        /** Filter the transactions by type */
        setFilter,
        ...rest,
    };
};

export default useTransactions;
