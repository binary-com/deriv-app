import React from 'react';
import { observer } from 'mobx-react-lite';
import EmailVerificationEmptyState from 'Components/email-verification-empty-state';
import PaymentAgentWithdrawForm from '../payment-agent-withdraw-form';
import PaymentAgentWithdrawalLocked from '../payment-agent-withdrawal-locked';
import { useStore, useVerifyEmail } from '../../../hooks';

const WithdrawalTab = () => {
    const verify = useVerifyEmail('paymentagent_withdraw');
    const { client, modules } = useStore();
    const { payment_agent } = modules.cashier;
    const verification_code = client.verification_code.payment_agent_withdraw;

    React.useEffect(() => {
        if (payment_agent.active_tab_index && !verification_code) {
            verify.send();
        }
    }, [payment_agent.active_tab_index, verification_code, verify]);

    if (verify.error && 'code' in verify.error) return <PaymentAgentWithdrawalLocked error={verify.error} />;
    if (verify.has_been_sent) return <EmailVerificationEmptyState type={'paymentagent_withdraw'} />;
    if (verification_code || payment_agent.is_withdraw)
        return <PaymentAgentWithdrawForm verification_code={verification_code} />;

    return null;
};

export default observer(WithdrawalTab);
