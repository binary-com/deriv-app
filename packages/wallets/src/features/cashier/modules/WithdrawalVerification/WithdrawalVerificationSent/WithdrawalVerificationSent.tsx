import React, { useState } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button } from '@deriv-com/ui';
import EmailSent from '../../../../../public/images/email-sent.svg';
import './WithdrawalVerificationSent.scss';

type TProps = {
    counter: number;
    sendEmail: () => void;
};

const WithdrawalVerificationSent: React.FC<TProps> = ({ counter, sendEmail }) => {
    const [showResend, setShowResend] = useState(false);
    const { localize } = useTranslations();

    return (
        <div className='wallets-withdrawal-verification-sent'>
            <ActionScreen
                actionButtons={
                    !showResend ? (
                        <Button
                            borderWidth='sm'
                            color='primary-transparent'
                            onClick={() => {
                                sendEmail();
                                setShowResend(!showResend);
                            }}
                            size='lg'
                            textSize='md'
                            variant='ghost'
                        >
                            <Localize i18n_default_text="Didn't receive the email?" />
                        </Button>
                    ) : undefined
                }
                description={localize('Please check your email for the verification link to complete the process.')}
                icon={
                    <div
                        className='wallets-withdrawal-verification-sent__icon'
                        data-testid='dt_withdrawal_verification_sent_icon'
                    >
                        <EmailSent />
                    </div>
                }
                title={<Localize i18n_default_text="We've sent you an email." />}
            />
            <div className='wallets-withdrawal-verification-sent__resend'>
                {showResend && (
                    <ActionScreen
                        actionButtons={
                            <Button disabled={!!counter} onClick={sendEmail} size='lg' textSize='md'>
                                {counter ? (
                                    <Localize i18n_default_text='Resend email in {{counter}}s' values={{ counter }} />
                                ) : (
                                    <Localize i18n_default_text='Resend email' />
                                )}
                            </Button>
                        }
                        description={localize(
                            "Check your spam or junk folder. If it's not there, try resending the email."
                        )}
                        title={<Localize i18n_default_text="Didn't receive the email?" />}
                    />
                )}
            </div>
        </div>
    );
};

export default WithdrawalVerificationSent;
