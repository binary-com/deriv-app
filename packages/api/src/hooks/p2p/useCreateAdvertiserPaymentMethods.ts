import { useCallback } from 'react';
import useInvalidateQuery from '../../useInvalidateQuery';
import useAuthorize from '../useAuthorize';
import useMutation from '../../useMutation';

type TPayloads = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useMutation<'p2p_advertiser_payment_methods'>>['mutate']>[0]>['payload']
>;
type TCreatePayload = NonNullable<TPayloads['create']>[0];

/** A custom hook that sends a request to create a new p2p advertiser payment method. */
const useCreateAdvertiserPaymentMethods = () => {
    const invalidate = useInvalidateQuery();
    const { isSuccess } = useAuthorize();
    const { mutate, ...rest } = useMutation('p2p_advertiser_payment_methods', {
        onSuccess: () => invalidate('p2p_advertiser_payment_methods'),
    });

    const create = useCallback(
        (values: TCreatePayload) => {
            if (isSuccess) {
                mutate({ payload: { create: [{ ...values }] } });
            }
        },
        [mutate, isSuccess]
    );

    return {
        /** Sends a request to create a new p2p advertiser payment method */
        create,
        ...rest,
    };
};

export default useCreateAdvertiserPaymentMethods;
