import { useEffect, useMemo, useState } from 'react';
import useInfiniteQuery from '../useInfiniteQuery';
import { TSocketRequestPayload } from '../../types';
import useAuthorize from './useAuthorize';
import useInvalidateQuery from '../useInvalidateQuery';
import useActiveAccount from './useActiveAccount';
import { displayMoney } from '../utils';

type TFilter = NonNullable<TSocketRequestPayload<'statement'>['payload']>['action_type'];

/** A custom hook to get the summary of account transactions */
const useInfiniteTransactions = () => {
    const {
        data: { preferred_language },
        isFetching,
        isSuccess,
    } = useAuthorize();

    const { data: account } = useActiveAccount();
    const display_code = account?.currency_config?.display_code || 'USD';
    const fractional_digits = account?.currency_config?.fractional_digits || 2;

    const [filter, setFilter] = useState<TFilter>();
    const { data, fetchNextPage, remove, ...rest } = useInfiniteQuery('statement', {
        options: {
            enabled: !isFetching && isSuccess,
            getNextPageParam: (lastPage, pages) => {
                if (!lastPage?.statement?.count) return;

                return pages.length;
            },
        },
        payload: {
            action_type: filter,
        },
    });

    const invalidate = useInvalidateQuery();
    useEffect(() => {
        invalidate('statement');
    }, [filter, invalidate]);

    useEffect(() => {
        return remove;
    }, [remove]);

    // Flatten the data array.
    const flatten_data = useMemo(() => {
        if (!data?.pages?.length) return;

        return data?.pages?.flatMap(page => page?.statement?.transactions);
    }, [data?.pages]);

    // Modify the data.
    const modified_data = useMemo(() => {
        if (!flatten_data?.length) return;

        return flatten_data?.map(transaction => ({
            ...transaction,
            /** The transaction amount in currency format. */
            display_amount: displayMoney(transaction?.amount || 0, display_code, {
                fractional_digits,
                preferred_language,
            }),
            /** The balance of account after the transaction in currency format. */
            display_balance_after: displayMoney(transaction?.balance_after || 0, display_code, {
                fractional_digits,
                preferred_language,
            }),
        }));
    }, [flatten_data, preferred_language, fractional_digits, display_code]);

    return {
        /** List of account transactions */
        data: modified_data,
        /** Fetch the next page of transactions */
        fetchNextPage,
        /** Filter the transactions by type */
        setFilter,
        ...rest,
    };
};

export default useInfiniteTransactions;
