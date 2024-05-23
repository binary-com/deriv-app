import { useCallback } from 'react';
import useMutation from '../useMutation';

type TCashierParam = NonNullable<
    Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>
>[0]['payload']['cashier'];

type TParams = Omit<
    NonNullable<Parameters<ReturnType<typeof useMutation<'cashier'>>['mutate']>>[0]['payload'],
    'cashier' | 'provider'
>;

/** A custom hook to get the deposit and withdrawal fiat address. */
const useCashierFiatAddress = () => {
    const { data, mutate: _mutate, mutateAsync: _mutateAsync, ...rest } = useMutation('cashier');
    const iframe_url = typeof data?.cashier === 'string' ? `${data?.cashier}&DarkMode=off` : undefined;

    const mutate = useCallback(
        (cashier: TCashierParam, payload?: TParams) =>
            _mutate({ payload: { cashier, provider: 'doughflow', ...payload } }),
        [_mutate]
    );
    const mutateAsync = useCallback(
        (cashier: TCashierParam, payload?: TParams) =>
            _mutateAsync({ payload: { cashier, provider: 'doughflow', ...payload } }),
        [_mutateAsync]
    );

    return {
        /** The deposit/withdrawal fiat iframe */
        data: iframe_url,
        /** Function to get deposit/withdrawal fiat address */
        mutate,
        mutateAsync,
        ...rest,
    };
};

export default useCashierFiatAddress;
