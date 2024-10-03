import React from 'react';
import dayjs from 'dayjs';
import { localize, Localize } from '@deriv/translations';

export const VERIFICATION_SERVICES = {
    SMS: 'sms',
    WHATSAPP: 'whatsapp',
} as const;

export const getCarriers = () =>
    ({
        SMS: localize('SMS'),
        WHATSAPP: localize('WhatsApp'),
    } as const);

export const shouldShowPhoneVerificationNotification = (nextAttemptTimestamp: number, current_time: dayjs.Dayjs) => {
    const request_in_milliseconds = dayjs(nextAttemptTimestamp * 1000);
    const seconds_until_next_attempt = Math.round(request_in_milliseconds.diff(current_time) / 1000);

    return seconds_until_next_attempt > 0;
};

export const getUseRequestPhoneNumberOTPErrorMessage = (
    error_code: string,
    getCurrentCarrier: () => string,
    getOtherCarrier: () => string
) => {
    switch (error_code) {
        case 'PhoneNumberTaken':
            return (
                <Localize
                    i18n_default_text='Number already exists in our system. Enter a new one or contact us via <0>live chat</0> for help.'
                    components={[
                        <span
                            key={0}
                            className='phone-verification__card--inputfield__livechat'
                            onClick={() => window.LiveChatWidget.call('maximize')}
                        />,
                    ]}
                />
            );
        case 'PhoneNumberVerificationSuspended':
            return (
                <Localize
                    i18n_default_text="We're unable to send codes via {{ current_carrier }} right now. Get your code by {{other_carriers}}."
                    values={{
                        current_carrier: getCurrentCarrier(),
                        other_carriers: getOtherCarrier(),
                    }}
                />
            );
        case 'InvalidPhone':
            return (
                <Localize i18n_default_text='Enter a valid phone number, including the country code (e.g. +15417541234).' />
            );
        default:
            break;
    }
};

export const phoneOTPErrorMessage = (error_code: string) => {
    switch (error_code) {
        case 'PhoneCodeExpired':
            return <Localize i18n_default_text='Code expired. Get a new one.' />;
        case 'InvalidOTP':
            return <Localize i18n_default_text='Invalid code. Try again.' />;
        default:
            break;
    }
};

export const emailOTPErrorMessage = (
    error_code: string,
    getCurrentCarrier: () => string,
    getOtherCarrier: () => string
) => {
    switch (error_code) {
        case 'EmailCodeExpired':
            return <Localize i18n_default_text='Code expired. Get a new code.' />;
        case 'InvalidToken':
            return <Localize i18n_default_text='Invalid code. Try again or get a new code.' />;
        case 'PhoneNumberVerificationSuspended':
            return (
                <Localize
                    i18n_default_text="We're unable to send codes via {{ current_carrier }} right now. Get your code by {{other_carriers}}."
                    values={{
                        current_carrier: getCurrentCarrier(),
                        other_carriers: getOtherCarrier(),
                    }}
                />
            );
        default:
            break;
    }
};
