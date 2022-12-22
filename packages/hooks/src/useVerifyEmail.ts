import { useState } from 'react';
import { useWS } from '@deriv/api';
import { useStore } from '@deriv/stores';
import type { TSocketEndpoints } from '@deriv/api/types';
import useCountdown from './useCountdown';

const RESEND_COUNTDOWN = 60;

export type TEmailVerificationType = TSocketEndpoints['verify_email']['request']['type'];

const useVerifyEmail = (type: TEmailVerificationType) => {
    const WS = useWS('verify_email');
    const counter = useCountdown({ from: RESEND_COUNTDOWN });
    const { client } = useStore();
    const { setVerifyEmailSentCount, verify_email_sent_count } = client;

    const send = () => {
        if (!client.email) return;
        if (counter.is_running) return;

        counter.reset();
        counter.start();
        setVerifyEmailSentCount(verify_email_sent_count + 1);

        WS.send({ verify_email: client.email, type });
    };

    return {
        is_loading: WS.is_loading,
        error: WS.error,
        data: WS.data,
        counter: counter.count,
        is_counter_running: counter.is_running,
        sent_count: verify_email_sent_count,
        has_been_sent: verify_email_sent_count !== 0,
        send,
    };
};

export default useVerifyEmail;
