import { useCallback, useState } from 'react';
import { useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';
import useCountdown from './useCountdown';

const RESEND_COUNTDOWN = 60;

/**
 * @deprecated Please use useVerifyEmail from @deriv/api instead
 */
const useVerifyEmail = (
    type: Parameters<ReturnType<typeof useRequest<'verify_email'>>['mutate']>[0]['payload']['type']
) => {
    const WS = useRequest('verify_email');
    const counter = useCountdown({ from: RESEND_COUNTDOWN });
    const { client } = useStore();
    const [sent_count, setSentCount] = useState(0);

    const send = useCallback(
        (email?: Parameters<ReturnType<typeof useRequest<'verify_email'>>['mutate']>[0]['payload']['verify_email']) => {
            const request_email = email ?? client.email;
            if (!request_email) return;
            if (counter.is_running) return;

            counter.reset();
            counter.start();

            setSentCount(count => count + 1);

            WS.mutate({ payload: { verify_email: request_email, type } });
        },
        [WS, client.email, counter, type]
    );

    return {
        is_loading: WS.isLoading,
        is_success: WS.isSuccess,
        error: WS.error,
        data: WS.data,
        counter: counter.count,
        is_counter_running: counter.is_running,
        sent_count,
        has_been_sent: sent_count !== 0,
        send,
    };
};

export default useVerifyEmail;
