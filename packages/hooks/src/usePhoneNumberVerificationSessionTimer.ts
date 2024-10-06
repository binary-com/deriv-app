import { useCallback, useEffect, useState } from 'react';
import { useIsMounted, WS } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import dayjs from 'dayjs';

const usePhoneNumberVerificationSessionTimer = () => {
    const [session_timer, setSessionTimer] = useState<number | undefined>();
    const [formatted_time, setFormattedTime] = useState('00:00');
    const [should_show_session_timeout_modal, setShouldShowSessionTimeoutModal] = useState(false);
    const { client } = useStore();
    const { account_settings } = client;
    const { phone_number_verification } = account_settings;
    const isMounted = useIsMounted();

    const formatTime = useCallback((totalSeconds: number) => {
        if (totalSeconds <= 0) {
            return setFormattedTime('00:00');
        }

        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const formatted_minutes = String(minutes).padStart(2, '0');
        const formatted_seconds = String(seconds).padStart(2, '0');

        setFormattedTime(`${formatted_minutes}:${formatted_seconds}`);
    }, []);

    useEffect(() => {
        WS.send({ time: 1 }).then((response: { error?: Error; time: number }) => {
            if (response.error) return;

            if (response.time && phone_number_verification?.session_timestamp) {
                // request_in_miliseconds is to convert session_timestamp from get_settings * it with 1000 to make it into miliseconds and convert the time using dayjs package
                const request_in_milliseconds = dayjs(phone_number_verification?.session_timestamp * 1000);
                // next_request is to compare request_in_miliseconds with server's response time
                const next_request = Math.round(request_in_milliseconds.diff(response.time * 1000) / 1000);

                if (isMounted()) {
                    if (next_request > 0) {
                        setSessionTimer(next_request);
                    } else {
                        setSessionTimer(0);
                    }
                }
            }
        });
    }, [phone_number_verification?.session_timestamp]);

    useEffect(() => {
        let countdown: ReturnType<typeof setInterval>;
        if (typeof session_timer === 'number') {
            formatTime(session_timer);
            if (session_timer > 0) {
                setShouldShowSessionTimeoutModal(false);
                countdown = setInterval(() => {
                    setSessionTimer(session_timer - 1);
                }, 1000);
            } else {
                setShouldShowSessionTimeoutModal(true);
            }
        }
        return () => clearInterval(countdown);
    }, [session_timer, formatTime]);

    return {
        formatted_time,
        should_show_session_timeout_modal,
        setShouldShowSessionTimeoutModal,
    };
};

export default usePhoneNumberVerificationSessionTimer;
