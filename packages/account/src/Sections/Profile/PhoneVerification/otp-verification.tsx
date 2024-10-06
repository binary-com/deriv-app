import { useEffect, useState, useCallback, Fragment } from 'react';
import {
    usePhoneNumberVerificationSetTimer,
    usePhoneVerificationAnalytics,
    useSendOTPVerificationCode,
    useSettings,
} from '@deriv/hooks';
import { Text, InputGroupButton, Button } from '@deriv-com/quill-ui';
import { observer, useStore } from '@deriv/stores';
import { Localize, useTranslations } from '@deriv-com/translations';
import { convertPhoneTypeDisplay } from '../../../Helpers/utils';
import ResendCodeTimer from './resend-code-timer';
import DidntGetTheCodeModal from './didnt-get-the-code-modal';
import PhoneNumberVerifiedModal from './phone-number-verified-modal';
import CoolDownPeriodModal from './cool-down-period-modal';
import { useIsMounted } from '@deriv/shared';

type TOTPVerification = {
    phone_verification_type: string;
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
};

const OTPVerification = observer(({ phone_verification_type, setOtpVerification }: TOTPVerification) => {
    const { client, ui } = useStore();
    const { setVerificationCode, is_authorize } = client;
    const { data: account_settings, invalidate } = useSettings();
    const [should_show_didnt_get_the_code_modal, setShouldShowDidntGetTheCodeModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [is_button_disabled, setIsButtonDisabled] = useState(false);
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();
    const { localize } = useTranslations();
    const isMounted = useIsMounted();

    const {
        sendPhoneOTPVerification,
        phone_otp_error_message,
        setPhoneOtpErrorMessage,
        is_phone_number_verified,
        is_email_verified,
        show_cool_down_period_modal,
        setShowCoolDownPeriodModal,
        sendEmailOTPVerification,
        requestOnSMS,
        requestOnWhatsApp,
        email_otp_error,
        reset,
    } = useSendOTPVerificationCode();
    const {
        setNextEmailOtpRequestTimer,
        is_email_otp_timer_loading,
        setNextPhoneOtpRequestTimer,
        is_phone_otp_timer_loading,
    } = usePhoneNumberVerificationSetTimer();
    const { should_show_phone_number_otp, setIsForcedToExitPnv } = ui;

    const reInitializeGetSettings = useCallback(() => {
        invalidate('get_settings').then(() => {
            if (isMounted()) {
                setIsButtonDisabled(false);
            }
        });
    }, [invalidate]);

    useEffect(() => {
        if (should_show_phone_number_otp) {
            trackPhoneVerificationEvents({
                action: 'open',
                subform_name: 'verify_phone_otp_screen',
            });
        } else {
            trackPhoneVerificationEvents({
                action: 'open',
                subform_name: 'verify_email_screen',
            });
        }
    }, [should_show_phone_number_otp, trackPhoneVerificationEvents]);

    useEffect(() => {
        if (is_authorize) {
            setIsButtonDisabled(true);
            reInitializeGetSettings();
        }
    }, [reInitializeGetSettings, is_authorize]);

    useEffect(() => {
        if (is_phone_number_verified) {
            setIsForcedToExitPnv(true);
        } else if (is_email_verified && !should_show_phone_number_otp) {
            setVerificationCode(otp, 'phone_number_verification');
            setOtpVerification({ show_otp_verification: false, phone_verification_type: '' });
        }
    }, [is_phone_number_verified, is_email_verified, setOtpVerification, should_show_phone_number_otp]);

    const clearOtpValue = () => {
        setOtp('');
        setPhoneOtpErrorMessage('');
        should_show_phone_number_otp ? setNextPhoneOtpRequestTimer(undefined) : setNextEmailOtpRequestTimer(undefined);
        reset();
    };

    const handleGetOtpValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        setPhoneOtpErrorMessage('');
    };

    const handleVerifyOTP = () => {
        if (should_show_phone_number_otp) {
            trackPhoneVerificationEvents({
                action: 'click_cta',
                subform_name: 'verify_phone_otp_screen',
            });
            sendPhoneOTPVerification(otp);
        } else {
            trackPhoneVerificationEvents({
                action: 'click_cta',
                subform_name: 'verify_email_screen',
            });
            sendEmailOTPVerification(otp);
        }
    };

    const isTimerLoading = () => {
        return should_show_phone_number_otp ? is_phone_otp_timer_loading : is_email_otp_timer_loading;
    };

    return (
        <>
            <CoolDownPeriodModal
                show_cool_down_period_modal={show_cool_down_period_modal}
                setShowCoolDownPeriodModal={setShowCoolDownPeriodModal}
            />
            <PhoneNumberVerifiedModal should_show_phone_number_verified_modal={is_phone_number_verified} />
            {should_show_phone_number_otp && (
                <DidntGetTheCodeModal
                    clearOtpValue={clearOtpValue}
                    setIsButtonDisabled={setIsButtonDisabled}
                    reInitializeGetSettings={reInitializeGetSettings}
                    requestOnSMS={requestOnSMS}
                    requestOnWhatsApp={requestOnWhatsApp}
                    email_otp_error={email_otp_error}
                    is_email_verified={is_email_verified}
                    should_show_didnt_get_the_code_modal={should_show_didnt_get_the_code_modal}
                    setShouldShowDidntGetTheCodeModal={setShouldShowDidntGetTheCodeModal}
                    phone_verification_type={phone_verification_type}
                    setOtpVerification={setOtpVerification}
                />
            )}
            <Text bold>
                {should_show_phone_number_otp ? (
                    <Localize i18n_default_text='Step 3 of 3: Verify your number' />
                ) : (
                    <Localize i18n_default_text='Step 1 of 3: Email verification needed' />
                )}
            </Text>
            <div className='phone-verification__card--email-verification-content'>
                {should_show_phone_number_otp ? (
                    <Text size='sm'>
                        <Localize
                            i18n_default_text='Enter the 6-digit code sent to you via {{phone_verification_type}} at {{users_phone_number}}. <0></0>'
                            values={{
                                phone_verification_type: localize(convertPhoneTypeDisplay(phone_verification_type)),
                                users_phone_number: account_settings?.phone,
                            }}
                            components={[
                                <Button
                                    key={0}
                                    variant='tertiary'
                                    label={localize('Edit number')}
                                    size='sm'
                                    color='black-white'
                                    onClick={() =>
                                        setOtpVerification({ show_otp_verification: false, phone_verification_type })
                                    }
                                />,
                            ]}
                        />
                    </Text>
                ) : (
                    <Fragment>
                        <Text size='sm'>
                            <Localize
                                i18n_default_text="We've sent a verification code to <0>{{users_email}}</0>."
                                values={{ users_email: account_settings?.email }}
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        <Text size='sm'>
                            <Localize i18n_default_text="Enter the code below to verify it's you." />
                        </Text>
                    </Fragment>
                )}
            </div>
            <div className='phone-verification__card--email-verification-otp-container'>
                <InputGroupButton
                    status={phone_otp_error_message ? 'error' : 'neutral'}
                    buttonLabel={localize('Verify')}
                    label={should_show_phone_number_otp ? localize('OTP code') : localize('Verification code')}
                    buttonCallback={handleVerifyOTP}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                            handleVerifyOTP();
                        }
                    }}
                    inputMode='numeric'
                    buttonColor='coral'
                    onChange={handleGetOtpValue}
                    message={phone_otp_error_message}
                    value={otp}
                    type='number'
                    maxLength={6}
                    buttonDisabled={otp.length < 6}
                />
                <ResendCodeTimer
                    clearOtpValue={clearOtpValue}
                    is_button_disabled={is_button_disabled || isTimerLoading()}
                    setIsButtonDisabled={setIsButtonDisabled}
                    should_show_resend_code_button={!should_show_phone_number_otp}
                    setShouldShowDidntGetTheCodeModal={setShouldShowDidntGetTheCodeModal}
                    reInitializeGetSettings={reInitializeGetSettings}
                />
            </div>
        </>
    );
});

export default OTPVerification;
