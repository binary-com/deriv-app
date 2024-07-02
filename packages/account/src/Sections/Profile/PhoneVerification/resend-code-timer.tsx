import React from 'react';
import { Button, CaptionText } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useSettings, useVerifyEmail } from '@deriv/hooks';
import dayjs from 'dayjs';
import { otpRequestCountdown } from './validation';

type TResendCodeTimer = {
    is_button_disabled: boolean;
    should_show_resend_code_button: boolean;
    setIsButtonDisabled: (value: boolean) => void;
    setShouldShowDidntGetTheCodeModal: (value: boolean) => void;
    reInitializeGetSettings: () => void;
};
const ResendCodeTimer = ({
    is_button_disabled,
    should_show_resend_code_button,
    setIsButtonDisabled,
    setShouldShowDidntGetTheCodeModal,
    reInitializeGetSettings,
}: TResendCodeTimer) => {
    const [timer, setTimer] = React.useState<number | undefined>();
    const [next_otp_request, setNextOtpRequest] = React.useState('');
    // @ts-expect-error this for now
    const { send, is_success } = useVerifyEmail('phone_number_verification');
    const { data: account_settings } = useSettings();
    const current_time = dayjs();

    const setTitle = React.useCallback(
        (timer: number) => {
            let display_time: string;
            if (timer > 60) {
                display_time = `${Math.round(timer / 60)}m`;
            } else {
                display_time = `${timer}s`;
            }
            should_show_resend_code_button
                ? setNextOtpRequest(` in ${display_time}`)
                : setNextOtpRequest(` (${display_time})`);
        },
        [should_show_resend_code_button]
    );

    React.useEffect(() => {
        if (is_success) reInitializeGetSettings();
    }, [is_success, reInitializeGetSettings]);

    React.useEffect(() => {
        // @ts-expect-error this for now
        if (should_show_resend_code_button && account_settings?.phone_number_verification?.next_email_attempt) {
            otpRequestCountdown(
                // @ts-expect-error this for now
                account_settings.phone_number_verification.next_email_attempt,
                setTitle,
                setTimer,
                current_time
            );
            // @ts-expect-error this for now
        } else if (account_settings?.phone_number_verification?.next_attempt) {
            otpRequestCountdown(
                // @ts-expect-error this for now
                account_settings.phone_number_verification.next_attempt,
                setTitle,
                setTimer,
                current_time
            );
        }
    }, [
        // @ts-expect-error this for now
        account_settings?.phone_number_verification?.next_email_attempt,
        // @ts-expect-error this for now
        account_settings?.phone_number_verification?.next_attempt,
        timer,
        setTitle,
        should_show_resend_code_button,
        current_time,
    ]);

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

    const resendCode = () => {
        if (should_show_resend_code_button) {
            setIsButtonDisabled(true);
            send();
        } else {
            setShouldShowDidntGetTheCodeModal(true);
        }
    };

    return (
        <Button variant='tertiary' onClick={resendCode} disabled={!!timer || is_button_disabled} color='black'>
            <CaptionText bold underlined>
                {should_show_resend_code_button ? (
                    <Localize i18n_default_text='Resend code{{resendCode}}' values={{ resendCode: next_otp_request }} />
                ) : (
                    <Localize
                        i18n_default_text="Didn't get the code?{{resendCode}}"
                        values={{ resendCode: next_otp_request }}
                    />
                )}
            </CaptionText>
        </Button>
    );
};

export default ResendCodeTimer;
