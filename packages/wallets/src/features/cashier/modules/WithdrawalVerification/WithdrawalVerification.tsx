import React, { useCallback, useEffect, useState } from 'react';
import { useCountdown } from 'usehooks-ts';
import { useSettings, useVerifyEmail } from '@deriv/api-v2';
import { WithdrawalVerificationRequest } from './WithdrawalVerificationRequest';
import { WithdrawalVerificationSent } from './WithdrawalVerificationSent';

type TProps = {
    resendEmail?: boolean;
};

const WithdrawalVerification: React.FC<TProps> = ({ resendEmail = false }) => {
    const [emailSent, setEmailSent] = useState(false);
    const { data } = useSettings();
    const { mutate } = useVerifyEmail();
    const [count, { resetCountdown, startCountdown }] = useCountdown({
        countStart: 60,
        intervalMs: 1000,
    });

    const handleSendEmail = useCallback(async () => {
        if (data.email) {
            await mutate({
                type: 'payment_withdraw',
                verify_email: data.email,
            });
            setEmailSent(true);
            resetCountdown();
            startCountdown();
        }
    }, [data.email, mutate, resetCountdown, startCountdown]);

    useEffect(() => {
        if (resendEmail && !emailSent) {
            handleSendEmail();
        }
    }, [emailSent, handleSendEmail, resendEmail]);

    if (emailSent) return <WithdrawalVerificationSent counter={count} sendEmail={handleSendEmail} />;
    return <WithdrawalVerificationRequest sendEmail={handleSendEmail} />;
};

export default WithdrawalVerification;
