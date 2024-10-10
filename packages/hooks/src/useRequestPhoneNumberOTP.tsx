import React, { useState } from 'react';
import { useMutation } from '@deriv/api';
import { getCarriers, getUseRequestPhoneNumberOTPErrorMessage, VERIFICATION_SERVICES } from '@deriv/shared';
import useSettings from './useSettings';
import { useStore } from '@deriv/stores';
import usePhoneVerificationAnalytics from './usePhoneVerificationAnalytics';

type TFormatError = {
    code: string;
    message: string;
};

/** A hook for requesting OTP which is sent on whatsapp or sms platforms */
const useRequestPhoneNumberOTP = () => {
    const {
        data,
        mutate,
        error: email_otp_error,
        isSuccess: is_email_verified,
        ...rest
    } = useMutation('phone_number_challenge');
    const [error_message, setErrorMessage] = useState<React.ReactNode>('');
    const [is_disabled_request_button, setIsDisabledRequestButton] = useState(false);
    const [carrier, setCarrier] = useState('');
    const { client } = useStore();
    const { verification_code } = client;
    const { phone_number_verification: phone_number_verification_code } = verification_code;
    const {
        mutation: { mutateAsync: updateSettings },
    } = useSettings();
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();

    React.useEffect(() => {
        //@ts-expect-error will fix this later
        if (email_otp_error) formatError(email_otp_error);
    }, [email_otp_error]);

    const getOtherCarrier = () => {
        return carrier === VERIFICATION_SERVICES.SMS ? getCarriers().WHATSAPP : getCarriers().SMS;
    };

    const getCurrentCarrier = () => {
        return carrier === VERIFICATION_SERVICES.SMS ? getCarriers().SMS : getCarriers().WHATSAPP;
    };

    const requestOnSMS = () => {
        mutate({
            payload: {
                carrier: VERIFICATION_SERVICES.SMS,
                email_code: phone_number_verification_code || '',
            },
        });
        setCarrier(VERIFICATION_SERVICES.SMS);
    };

    const requestOnWhatsApp = () => {
        mutate({
            payload: {
                carrier: VERIFICATION_SERVICES.WHATSAPP,
                email_code: phone_number_verification_code || '',
            },
        });
        setCarrier(VERIFICATION_SERVICES.WHATSAPP);
    };

    const sendEmailOTPVerification = (value: string) => {
        mutate({ payload: { email_code: value } });
    };

    const setUsersPhoneNumber = async (value: { [key: string]: unknown }) => {
        let error;
        try {
            await updateSettings({
                payload: value,
            });
        } catch (err) {
            trackPhoneVerificationEvents({
                action: 'error',
                subform_name: 'verify_phone_screen',
                // @ts-expect-error will remove once solved
                error_code: err.code,
            });
            formatError(err as TFormatError);
            error = err;
        }

        return {
            error,
        };
    };

    const formatError = ({ code, message }: TFormatError) => {
        const errorCases = {
            // This boolean value is used to disable the request button: setIsDisabledRequestButton()
            PhoneNumberTaken: true,
            PhoneNumberVerificationSuspended: false,
            InvalidPhone: false,
        };

        if (code in errorCases) {
            setIsDisabledRequestButton(errorCases[code as keyof typeof errorCases]);
            setErrorMessage(getUseRequestPhoneNumberOTPErrorMessage(code, getCurrentCarrier, getOtherCarrier));
        } else {
            setIsDisabledRequestButton(true);
            setErrorMessage(message);
        }
    };

    return {
        data: data?.phone_number_challenge,
        error_message,
        email_otp_error,
        is_email_verified,
        requestOnWhatsApp,
        requestOnSMS,
        formatError,
        setErrorMessage,
        setUsersPhoneNumber,
        sendEmailOTPVerification,
        is_disabled_request_button,
        setIsDisabledRequestButton,
        getCurrentCarrier,
        getOtherCarrier,
        setCarrier,
        mutate,
        ...rest,
    };
};

export default useRequestPhoneNumberOTP;
