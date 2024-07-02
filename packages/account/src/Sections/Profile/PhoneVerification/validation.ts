import * as Yup from 'yup';
import { ValidationConstants } from '@deriv-com/utils';
import { localize } from '@deriv/translations';
import dayjs from 'dayjs';

const phoneNumberSchema = Yup.string().matches(
    ValidationConstants.patterns.phoneNumber,
    localize('Please enter a valid phone number.')
);

export const validatePhoneNumber = (phone_number: string, setErrorMessage: (value: string) => void) => {
    phoneNumberSchema
        .validate(phone_number)
        .then(() => setErrorMessage(''))
        .catch(({ errors }: any) => {
            setErrorMessage(errors);
        });
};

export const otpRequestCountdown = (
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
