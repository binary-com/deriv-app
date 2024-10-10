import { useState, useEffect, ChangeEvent } from 'react';
import {
    usePhoneNumberVerificationSetTimer,
    usePhoneVerificationAnalytics,
    useRequestPhoneNumberOTP,
    useSettings,
} from '@deriv/hooks';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Button, Snackbar, Text, TextFieldAddon } from '@deriv-com/quill-ui';
import { Localize, useTranslations } from '@deriv-com/translations';
import { validatePhoneNumber } from './validation';

type TConfirmPhoneNumber = {
    show_confirm_phone_number?: boolean;
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
};

const ConfirmPhoneNumber = observer(({ show_confirm_phone_number, setOtpVerification }: TConfirmPhoneNumber) => {
    const [phone_number, setPhoneNumber] = useState('');
    const [phone_verification_type, setPhoneVerificationType] = useState('');
    const [is_button_loading, setIsButtonLoading] = useState(false);
    const {
        requestOnSMS,
        requestOnWhatsApp,
        error_message,
        setErrorMessage,
        setUsersPhoneNumber,
        is_email_verified,
        email_otp_error,
        is_disabled_request_button,
        setIsDisabledRequestButton,
    } = useRequestPhoneNumberOTP();
    const { data: account_settings, invalidate } = useSettings();
    const { ui } = useStore();
    const { setShouldShowPhoneNumberOTP } = ui;
    const { next_phone_otp_request_timer, is_phone_otp_timer_loading } = usePhoneNumberVerificationSetTimer(true);
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();
    const { localize } = useTranslations();

    useEffect(() => {
        if (show_confirm_phone_number) {
            trackPhoneVerificationEvents({
                action: 'open',
                subform_name: 'verify_phone_screen',
            });
        }
    }, [show_confirm_phone_number, trackPhoneVerificationEvents]);

    useEffect(() => {
        setPhoneNumber(account_settings?.phone?.replace(/\D/g, '') || '');
    }, [account_settings?.phone]);

    useEffect(() => {
        if (email_otp_error) {
            trackPhoneVerificationEvents({
                action: 'error',
                subform_name: 'verify_phone_screen',
                //@ts-expect-error will fix this later
                error_code: email_otp_error.code,
            });
            invalidate('get_settings').then(() => setIsButtonLoading(false));
        }
        if (is_email_verified) {
            setIsButtonLoading(false);
            setOtpVerification({ show_otp_verification: true, phone_verification_type });
            setShouldShowPhoneNumberOTP(true);
        }
    }, [is_email_verified, email_otp_error, invalidate, trackPhoneVerificationEvents]);

    const handleOnChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
        validatePhoneNumber(`+${e.target.value}`, setErrorMessage, setIsDisabledRequestButton);
    };

    const handleSubmit = async (phone_verification_type: string) => {
        setIsButtonLoading(true);
        setPhoneVerificationType(phone_verification_type);
        const { error } = await setUsersPhoneNumber({ phone: `+${phone_number}` });

        if (!error) {
            trackPhoneVerificationEvents({
                action: 'click_cta',
                cta_name:
                    phone_verification_type === VERIFICATION_SERVICES.SMS
                        ? 'Get code via SMS'
                        : 'Get code via WhatsApp',
                subform_name: 'verify_phone_screen',
            });
            phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnSMS() : requestOnWhatsApp();
        } else {
            setIsButtonLoading(false);
        }
    };

    const isSingularValue = (time: number) => {
        return time === 1;
    };

    const resendPhoneOtpTimer = () => {
        let resendPhoneOtpTimer = '';
        if (next_phone_otp_request_timer) {
            next_phone_otp_request_timer < 60
                ? (resendPhoneOtpTimer = `${next_phone_otp_request_timer} ${
                      isSingularValue(next_phone_otp_request_timer) ? localize('second') : localize('seconds')
                  }`)
                : (resendPhoneOtpTimer = `${Math.round(next_phone_otp_request_timer / 60)} ${
                      isSingularValue(Math.round(next_phone_otp_request_timer / 60))
                          ? localize('minute')
                          : localize('minutes')
                  }`);
        } else {
            resendPhoneOtpTimer = '';
        }

        return resendPhoneOtpTimer;
    };

    return (
        <>
            <Text bold>
                <Localize i18n_default_text='Step 2 of 3: Confirm your phone number' />
            </Text>
            <div className='phone-verification__card--inputfield'>
                <TextFieldAddon
                    type='number'
                    label={localize('Phone number')}
                    value={phone_number}
                    status={error_message ? 'error' : 'neutral'}
                    message={error_message}
                    className='phone-verification__card--inputfield__phone-number-input'
                    onChange={handleOnChangePhoneNumber}
                    addonLabel='+'
                />
            </div>
            <div className='phone-verification__card--buttons_container'>
                <Button
                    variant='secondary'
                    color='black-white'
                    fullWidth
                    size='lg'
                    onClick={() => handleSubmit(VERIFICATION_SERVICES.SMS)}
                    disabled={
                        is_button_loading ||
                        !!next_phone_otp_request_timer ||
                        is_disabled_request_button ||
                        is_phone_otp_timer_loading
                    }
                >
                    <Text bold>
                        <Localize i18n_default_text='Get code via SMS' />
                    </Text>
                </Button>
                <Button
                    color='coral'
                    fullWidth
                    size='lg'
                    onClick={() => handleSubmit(VERIFICATION_SERVICES.WHATSAPP)}
                    disabled={
                        is_button_loading ||
                        !!next_phone_otp_request_timer ||
                        is_disabled_request_button ||
                        is_phone_otp_timer_loading
                    }
                >
                    <Text color='white' bold>
                        <Localize i18n_default_text='Get code via WhatsApp' />
                    </Text>
                </Button>
            </div>
            <Snackbar
                hasCloseButton={false}
                message={
                    <Localize
                        i18n_default_text='Request new code in {{next_phone_number_attempt_timestamp}}.'
                        values={{ next_phone_number_attempt_timestamp: resendPhoneOtpTimer() }}
                    />
                }
                isVisible={!!next_phone_otp_request_timer}
            />
        </>
    );
});

export default ConfirmPhoneNumber;
