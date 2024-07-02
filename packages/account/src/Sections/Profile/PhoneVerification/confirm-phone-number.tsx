import React from 'react';
import PhoneVerificationCard from './phone-verification-card';
import { Button, Text, TextField } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useRequestPhoneNumberOTP, useSettings } from '@deriv/hooks';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { validatePhoneNumber } from './validation';

type TConfirmPhoneNumber = {
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
};

const ConfirmPhoneNumber = observer(({ setOtpVerification }: TConfirmPhoneNumber) => {
    const [phone_number, setPhoneNumber] = React.useState('');
    const [phone_verification_type, setPhoneVerificationType] = React.useState('');
    const {
        requestOnSMS,
        requestOnWhatsApp,
        error_message,
        setErrorMessage,
        setUsersPhoneNumber,
        is_email_verified,
        ...rest
    } = useRequestPhoneNumberOTP();
    const { data: account_settings } = useSettings();
    const { ui } = useStore();
    const { setShouldShowPhoneNumberOTP } = ui;

    React.useEffect(() => {
        setPhoneNumber(account_settings?.phone || '');
    }, [account_settings?.phone]);

    React.useEffect(() => {
        if (is_email_verified) {
            setOtpVerification({ show_otp_verification: true, phone_verification_type });
            setShouldShowPhoneNumberOTP(true);
        }
    }, [is_email_verified]);

    const handleOnChangePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
        validatePhoneNumber(e.target.value, setErrorMessage);
    };

    const handleSubmit = async (phone_verification_type: string) => {
        setPhoneVerificationType(phone_verification_type);
        const { error } = await setUsersPhoneNumber({ phone: phone_number });

        if (!error) {
            phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnSMS() : requestOnWhatsApp();
        }
    };

    return (
        <PhoneVerificationCard>
            <Text bold>
                <Localize i18n_default_text='Confirm your phone number' />
            </Text>
            <div className='phone-verification__card--inputfield'>
                <TextField
                    label={localize('Phone number')}
                    value={phone_number}
                    status={error_message ? 'error' : 'neutral'}
                    message={error_message}
                    onChange={handleOnChangePhoneNumber}
                />
            </div>
            <div className='phone-verification__card--buttons_container'>
                <Button
                    variant='secondary'
                    color='black'
                    fullWidth
                    size='lg'
                    onClick={() => handleSubmit(VERIFICATION_SERVICES.SMS)}
                >
                    <Text bold>
                        <Localize i18n_default_text='Get code via SMS' />
                    </Text>
                </Button>
                <Button color='black' fullWidth size='lg' onClick={() => handleSubmit(VERIFICATION_SERVICES.WHATSAPP)}>
                    <Text color='white' bold>
                        <Localize i18n_default_text='Get code via WhatsApp' />
                    </Text>
                </Button>
            </div>
        </PhoneVerificationCard>
    );
});

export default ConfirmPhoneNumber;
