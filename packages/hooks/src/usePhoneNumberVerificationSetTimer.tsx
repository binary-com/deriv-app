import { useStore } from '@deriv/stores';
import dayjs from 'dayjs';
import React from 'react';

const otpRequestCountdown = (
    nextAttemptTimestamp: number,
    setTitle: (title: number) => void,
    setTimer: (title: number) => void,
    current_time: dayjs.Dayjs
) => {
    const request_in_milliseconds = dayjs(nextAttemptTimestamp * 1000);
    const next_request = Math.round(request_in_milliseconds.diff(current_time) / 1000);

    if (next_request > 0) {
        setTitle(next_request);
        setTimer(next_request);
    }
};

/** A hook for calculating email verification otp and phone number otp timer */
const usePhoneNumberVerificationSetTimer = () => {
    const { client, ui } = useStore();
    const { account_settings } = client;
    const { should_show_phone_number_otp } = ui;
    //@ts-expect-error ignore for now
    const { phone_number_verification } = account_settings;
    const { next_email_attempt, next_attempt } = phone_number_verification;
    const [timer, setTimer] = React.useState<number | undefined>();
    const [next_otp_request, setNextOtpRequest] = React.useState('');
    const current_time = dayjs();

    const setTitle = React.useCallback(
        (timer: number) => {
            let display_time: string;
            if (timer > 60) {
                display_time = `${Math.round(timer / 60)}m`;
            } else {
                display_time = `${timer}s`;
            }
            should_show_phone_number_otp
                ? setNextOtpRequest(` (${display_time})`)
                : setNextOtpRequest(` in ${display_time}`);
        },
        [should_show_phone_number_otp]
    );

    React.useEffect(() => {
        if (next_email_attempt) {
            otpRequestCountdown(next_email_attempt, setTitle, setTimer, current_time);
        } else if (should_show_phone_number_otp && next_attempt) {
            otpRequestCountdown(next_attempt, setTitle, setTimer, current_time);
        }
    }, [current_time, next_email_attempt, next_attempt, setTitle, should_show_phone_number_otp]);

    React.useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (timer && timer > 0) {
            countdown = setInterval(() => {
                setTimer(timer - 1);
                setTitle(timer);
            }, 1000);
        } else {
            setNextOtpRequest('');
        }

        return () => clearInterval(countdown);
    }, [timer, setTitle]);

    return {
        next_otp_request,
    };
};

export default usePhoneNumberVerificationSetTimer;
