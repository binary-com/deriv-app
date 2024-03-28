import React, { useState } from 'react';
import { useCountdown } from 'usehooks-ts';
import { useSettings, useVerifyEmail } from '@deriv/api-v2';
import { WithdrawalVerificationRequest } from './WithdrawalVerificationRequest';
import { WithdrawalVerificationSent } from './WithdrawalVerificationSent';

type TProps = {
    withdrawalType: 'payment_withdraw' | 'paymentagent_withdraw';
};

const WithdrawalVerification: React.FC<TProps> = ({ withdrawalType }) => {
    const [emailSent, setEmailSent] = useState(false);
    const { data } = useSettings();
    const { mutate } = useVerifyEmail();
    const [count, { resetCountdown, startCountdown }] = useCountdown({
        countStart: 60,
        intervalMs: 1000,
    });

    const handleSendEmail = async () => {
        if (data.email) {
            await mutate({
                type: withdrawalType,
                verify_email: data.email,
            });
            setEmailSent(true);
            resetCountdown();
            startCountdown();
        }
    };

    if (emailSent) return <WithdrawalVerificationSent counter={count} sendEmail={handleSendEmail} />;
    return <WithdrawalVerificationRequest sendEmail={handleSendEmail} />;
};

export default WithdrawalVerification;
