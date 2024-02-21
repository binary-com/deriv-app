import { useCallback } from 'react';
import useSubscription from '../useSubscription';

type TPayload = WithRequiredProperty<
    NonNullable<Parameters<ReturnType<typeof useSubscription<'exchange_rates'>>['subscribe']>>[0]['payload'],
    'target_currency'
>;

/** A custom hook that gets exchange rates from base currency to target currency */
const useExchangeRateSubscription = () => {
    const { data, subscribe: _subscribe, ...rest } = useSubscription('exchange_rates');

    const subscribe = useCallback((payload: TPayload) => _subscribe({ payload }), [_subscribe]);

    return {
        /** The exchange rates response */
        data: data?.exchange_rates,
        /** Function to subscribe to exchange rates */
        subscribe,
        ...rest,
    };
};

export default useExchangeRateSubscription;
