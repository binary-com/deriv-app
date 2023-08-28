import React from 'react';
import { EmptyState } from '@deriv/components';
import { useVerifyEmail } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import EmailVerificationEmptyState from '../../../components/email-verification-empty-state';
import Error from '../../../components/error';
import ErrorStore from '../../../stores/error-store';

const WithdrawalVerificationEmail = observer(() => {
    const verify = useVerifyEmail('payment_withdraw');
    const { ui } = useStore();
    const { is_mobile } = ui;

    if (verify.error) return <Error error={verify.error as ErrorStore} />;

    if (verify.has_been_sent) return <EmailVerificationEmptyState type={'payment_withdraw'} />;

    return (
        <EmptyState
            icon='IcWithdrawRequestVerification'
            title={localize('Please help us verify your withdrawal request.')}
            description={
                <>
                    <Localize
                        i18n_default_text="{{click_text}} the button below and we'll send you an email with a link. Click that link to verify your withdrawal request."
                        values={{ click_text: is_mobile ? 'Tap' : 'Click' }}
                    />
                    <br />
                    <br />
                    <Localize i18n_default_text='This is to protect your account from unauthorised withdrawals.' />
                </>
            }
            action={{
                label: localize('Send email'),
                onClick: () => verify.send(),
            }}
        />
    );
});

export default WithdrawalVerificationEmail;
