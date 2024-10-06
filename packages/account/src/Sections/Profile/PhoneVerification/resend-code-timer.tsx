import React, { useCallback } from 'react';
import { usePhoneNumberVerificationSetTimer, useVerifyEmail } from '@deriv/hooks';
import { Button, CaptionText } from '@deriv-com/quill-ui';
import { Localize, useTranslations } from '@deriv-com/translations';

type TResendCodeTimer = {
    is_button_disabled: boolean;
    should_show_resend_code_button: boolean;
    setIsButtonDisabled: (value: boolean) => void;
    setShouldShowDidntGetTheCodeModal: (value: boolean) => void;
    clearOtpValue: () => void;
    reInitializeGetSettings: () => void;
};
const ResendCodeTimer = ({
    is_button_disabled,
    should_show_resend_code_button,
    clearOtpValue,
    setIsButtonDisabled,
    setShouldShowDidntGetTheCodeModal,
    reInitializeGetSettings,
}: TResendCodeTimer) => {
    // @ts-expect-error this for now
    const { sendPhoneNumberVerifyEmail, WS, error } = useVerifyEmail('phone_number_verification');
    const { is_request_button_disabled, next_email_otp_request_timer, next_phone_otp_request_timer } =
        usePhoneNumberVerificationSetTimer();
    const { localize } = useTranslations();

    React.useEffect(() => {
        if (WS.isSuccess || error) reInitializeGetSettings();
    }, [WS.isSuccess, reInitializeGetSettings, error]);

    const resendCode = () => {
        if (should_show_resend_code_button) {
            clearOtpValue();
            setIsButtonDisabled(true);
            sendPhoneNumberVerifyEmail();
        } else {
            setShouldShowDidntGetTheCodeModal(true);
        }
    };

    const resendCodeTimer = () => {
        let resendCodeTimer = '';
        if (next_email_otp_request_timer) {
            next_email_otp_request_timer < 60
                ? (resendCodeTimer = `${localize(' in ')}${next_email_otp_request_timer}s`)
                : (resendCodeTimer = `${localize(' in ')}${Math.round(next_email_otp_request_timer / 60)}m`);
        } else {
            resendCodeTimer = '';
        }

        return resendCodeTimer;
    };

    const didntGetACodeTimer = () => {
        let didntGetACodeTimer = '';
        if (next_phone_otp_request_timer) {
            next_phone_otp_request_timer < 60
                ? (didntGetACodeTimer = ` (${next_phone_otp_request_timer}s)`)
                : (didntGetACodeTimer = ` (${
                      next_phone_otp_request_timer && Math.round(next_phone_otp_request_timer / 60)
                  }m)`);
        } else {
            didntGetACodeTimer = '';
        }

        return didntGetACodeTimer;
    };

    const isButtonDisabled = useCallback(() => {
        const disable_resend_code_button = !!next_email_otp_request_timer || is_button_disabled;
        const disable_didnt_get_a_code_button =
            !!next_phone_otp_request_timer || is_button_disabled || is_request_button_disabled;

        return should_show_resend_code_button ? disable_resend_code_button : disable_didnt_get_a_code_button;
    }, [
        should_show_resend_code_button,
        next_email_otp_request_timer,
        next_phone_otp_request_timer,
        is_button_disabled,
        is_request_button_disabled,
    ]);

    return (
        <Button variant='tertiary' onClick={resendCode} disabled={isButtonDisabled()} color='black'>
            <CaptionText bold underlined>
                {should_show_resend_code_button ? (
                    <Localize
                        i18n_default_text='Resend code{{resendCode}}'
                        values={{
                            resendCode: resendCodeTimer(),
                        }}
                    />
                ) : (
                    <Localize
                        i18n_default_text="Didn't get the code?{{resendCode}}"
                        values={{
                            resendCode: didntGetACodeTimer(),
                        }}
                    />
                )}
            </CaptionText>
        </Button>
    );
};

export default ResendCodeTimer;
