import * as Yup from 'yup';
import { ValidationConstants } from '@deriv-com/utils';
import { localize } from '@deriv-com/translations';

const phoneNumberSchema = Yup.string().matches(
    ValidationConstants.patterns.phoneNumber,
    localize('Enter a valid phone number.')
);

export const validatePhoneNumber = (
    phone_number: string,
    setErrorMessage: (value: string) => void,
    setIsDisabledRequestButton: (value: boolean) => void
) => {
    phoneNumberSchema
        .validate(phone_number)
        .then(() => {
            setErrorMessage('');
            setIsDisabledRequestButton(false);
        })
        .catch(({ errors }: any) => {
            setErrorMessage(errors);
            setIsDisabledRequestButton(true);
        });
};
