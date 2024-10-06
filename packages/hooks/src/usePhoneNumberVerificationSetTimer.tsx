import React from 'react';
import dayjs from 'dayjs';
import { useIsMounted, WS } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import useIsPhoneNumberVerified from './useIsPhoneNumberVerified';

/** A hook for calculating email verification otp and phone number otp timer */
const usePhoneNumberVerificationSetTimer = (is_from_request_phone_number_otp = false) => {
    const { client, ui } = useStore();
    const { account_settings } = client;
    const { should_show_phone_number_otp } = ui;
    const { phone_number_verification } = account_settings;
    const [next_email_otp_request_timer, setNextEmailOtpRequestTimer] = React.useState<number | undefined>();
    const [next_phone_otp_request_timer, setNextPhoneOtpRequestTimer] = React.useState<number | undefined>();
    const [is_request_button_disabled, setIsRequestButtonDisabled] = React.useState(false);
    const { is_phone_number_verified } = useIsPhoneNumberVerified();
    const isMounted = useIsMounted();

    React.useEffect(() => {
        if (!is_phone_number_verified) {
            if (isMounted()) setIsRequestButtonDisabled(true);
            WS.send({ time: 1 }).then((response: { error?: Error; time: number }) => {
                if (isMounted()) setIsRequestButtonDisabled(false);
                if (response.error) return;

                if (
                    response.time &&
                    !should_show_phone_number_otp &&
                    !is_from_request_phone_number_otp &&
                    phone_number_verification?.next_email_attempt
                ) {
                    const request_in_milliseconds = dayjs(phone_number_verification.next_email_attempt * 1000);
                    const next_request = Math.round(request_in_milliseconds.diff(response.time * 1000) / 1000);

                    if (isMounted())
                        if (next_request > 0) {
                            setNextEmailOtpRequestTimer(next_request);
                        } else {
                            setNextEmailOtpRequestTimer(0);
                        }
                } else if (response.time && phone_number_verification?.next_attempt) {
                    const request_in_milliseconds = dayjs(phone_number_verification.next_attempt * 1000);
                    const next_request = Math.round(request_in_milliseconds.diff(response.time * 1000) / 1000);

                    if (isMounted())
                        if (next_request > 0) {
                            setNextPhoneOtpRequestTimer(next_request);
                        } else {
                            setNextPhoneOtpRequestTimer(0);
                        }
                }
            });
        }
    }, [
        is_phone_number_verified,
        phone_number_verification?.next_email_attempt,
        phone_number_verification?.next_attempt,
        is_from_request_phone_number_otp,
        should_show_phone_number_otp,
    ]);

    React.useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (next_email_otp_request_timer && next_email_otp_request_timer > 0) {
            countdown = setInterval(() => {
                setNextEmailOtpRequestTimer(next_email_otp_request_timer - 1);
            }, 1000);
        }

        return () => clearInterval(countdown);
    }, [next_email_otp_request_timer]);

    React.useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (next_phone_otp_request_timer && next_phone_otp_request_timer > 0) {
            countdown = setInterval(() => {
                setNextPhoneOtpRequestTimer(next_phone_otp_request_timer - 1);
            }, 1000);
        }

        return () => clearInterval(countdown);
    }, [next_phone_otp_request_timer]);

    return {
        is_email_otp_timer_loading: typeof next_email_otp_request_timer !== 'number',
        setNextEmailOtpRequestTimer,
        setNextPhoneOtpRequestTimer,
        is_phone_otp_timer_loading: typeof next_phone_otp_request_timer !== 'number',
        next_email_otp_request_timer,
        next_phone_otp_request_timer,
        is_request_button_disabled,
    };
};

export default usePhoneNumberVerificationSetTimer;
