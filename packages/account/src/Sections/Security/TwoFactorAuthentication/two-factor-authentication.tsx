import React from 'react';
import { getPropertyValue, WS } from '@deriv/shared';
import LoadErrorMessage from '../../../Components/load-error-message';
import { observer, useStore } from '@deriv/stores';
import { Loading } from '@deriv/components';
import TwoFactorEnabled from './two-factor-enabled';
import TwoFactorDisabled from './two-factor-disabled';

const TwoFactorAuthentication = observer(() => {
    const { client } = useStore();
    const { email_address, getTwoFAStatus, has_enabled_two_fa, is_switching } = client;

    const [is_loading, setLoading] = React.useState(true);
    const [is_qr_loading, setQrLoading] = React.useState(false);
    const [error_message, setErrorMessage] = React.useState('');
    const [secret_key, setSecretKey] = React.useState('');
    const [qr_secret_key, setQrSecretKey] = React.useState('');

    const generateQrCode = React.useCallback(async () => {
        setQrLoading(true);
        const generate_response = await WS.authorized.accountSecurity({
            account_security: 1,
            totp_action: 'generate',
        });
        setLoading(false);

        if (generate_response?.error) {
            setErrorMessage(generate_response.error.message);
            return;
        }
        const secret_key_value = getPropertyValue(generate_response, ['account_security', 'totp', 'secret_key']);
        const qr_secret_key_value = `otpauth://totp/${email_address}?secret=${secret_key_value}&issuer=Deriv.com`;

        setSecretKey(secret_key_value);
        setQrSecretKey(qr_secret_key_value);
        setQrLoading(false);
    }, [email_address]);

    const getDigitStatus = React.useCallback(async () => {
        const status_response = await getTwoFAStatus();
        // status_response can be boolean or an error object
        if (typeof status_response !== 'boolean') {
            setErrorMessage(status_response?.error?.message);
            setLoading(false);
            return;
        }

        if (!status_response) generateQrCode();

        setLoading(false);
    }, [getTwoFAStatus, generateQrCode]);

    React.useEffect(() => {
        getDigitStatus();
    }, [getDigitStatus, has_enabled_two_fa]);

    if (is_loading || is_switching) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (error_message) return <LoadErrorMessage error_message={error_message} />;

    return (
        <section className='two-factor'>
            <div className='two-factor__wrapper'>
                {has_enabled_two_fa ? (
                    <TwoFactorEnabled />
                ) : (
                    <TwoFactorDisabled
                        secret_key={secret_key}
                        qr_secret_key={qr_secret_key}
                        is_qr_loading={is_qr_loading}
                    />
                )}
            </div>
        </section>
    );
});

export default TwoFactorAuthentication;
