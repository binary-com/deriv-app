import { useCallback, useMemo } from 'react';
import useSubscription from '../useSubscription';

type TPayload = NonNullable<Parameters<ReturnType<typeof useSubscription<'balance'>>['subscribe']>[0]>['payload'];

/** A custom hook that subscribes to the balance call and continuously gets the balance for the user account(s) provided. */
const useBalanceSubscription = () => {
    const { data: balance_data, subscribe: _subscribe, ...rest } = useSubscription('balance');

    const subscribe = useCallback(
        (payload: TPayload) => {
            _subscribe({ payload });
        },
        [_subscribe]
    );

    // Add additional information to the balance data.
    const modified_balance = useMemo(() => ({ ...balance_data?.balance }), [balance_data?.balance]);

    return {
        /** The balance response. */
        data: modified_balance,
        /** Function to subscribe to balance */
        subscribe,
        ...rest,
    };
};

export default useBalanceSubscription;
