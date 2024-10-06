import React, { FC, Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCountdown } from 'usehooks-ts';
import {
    DerivLightIcEmailSentIcon,
    DerivLightIcEmailSentPasskeyIcon,
    DerivLightIcFirewallEmailPasskeyIcon,
    DerivLightIcSpamEmailPasskeyIcon,
    DerivLightIcTypoEmailPasskeyIcon,
    DerivLightIcWrongEmailPasskeyIcon,
} from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ActionScreen, Button, Text, useDevice } from '@deriv-com/ui';
import { PlatformDetails } from '../../features/cfd/constants';
import useSendPasswordResetEmail from '../../hooks/useSendPasswordResetEmail';
import { TPlatforms } from '../../types';
import { WalletError } from '../WalletError';
import './SentEmailContent.scss';

type SentEmailContentProps = {
    description?: string;
    isChangePassword?: boolean; // NOTE: This prop is ONLY used for rendering different email icons between either Change Password/Forgot password email modal
    isForgottenPassword?: boolean;
    isInvestorPassword?: boolean;
    onErrorButtonClick?: () => void;
    platform?: TPlatforms.All;
};

// NOTE: key field is not from BE or requirements, its only used for key prop
const emailReasons = [
    {
        content: <Localize i18n_default_text='The email is in your spam folder (Sometimes things get lost there).' />,
        icon: <DerivLightIcSpamEmailPasskeyIcon height='36px' width='36px' />,
        key: 'EmailInSpamFolder',
    },
    {
        content: (
            <Localize i18n_default_text='You accidentally gave us another email address (Usually a work or a personal one instead of the one you meant).' />
        ),
        icon: <DerivLightIcWrongEmailPasskeyIcon height='36px' width='36px' />,
        key: 'AnotherEmailAddress',
    },
    {
        content: (
            <Localize i18n_default_text='The email address you entered had a mistake or typo (happens to the best of us).' />
        ),
        icon: <DerivLightIcTypoEmailPasskeyIcon height='36px' width='36px' />,
        key: 'TypoEmailAddress',
    },
    {
        content: (
            <Localize i18n_default_text="We can't deliver the email to this address (Usually because of firewalls or filtering)." />
        ),
        icon: <DerivLightIcFirewallEmailPasskeyIcon height='36px' width='36px' />,
        key: 'UnableToDeliverEmailAddress',
    },
];

const SentEmailContent: FC<SentEmailContentProps> = ({
    description,
    isChangePassword = false,
    isForgottenPassword = false,
    isInvestorPassword = false,
    onErrorButtonClick,
    platform,
}) => {
    const [shouldShowResendEmailReasons, setShouldShowResendEmailReasons] = useState(false);
    const [hasCountdownStarted, setHasCountdownStarted] = useState(false);
    const { error: resetPasswordError, sendEmail } = useSendPasswordResetEmail();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();

    const mt5Platform = PlatformDetails.mt5.platform;
    const { title } = PlatformDetails[platform ?? mt5Platform];
    const titleSize = 'md';
    const descriptionSize = 'sm';
    const emailButtonTextSize = isDesktop ? 'sm' : 'md';
    const emailReasonsSize = isDesktop ? 'xs' : 'sm';
    const [count, { resetCountdown, startCountdown }] = useCountdown({
        countStart: 60,
        intervalMs: 1000,
    });

    const EmailSentIcon =
        isChangePassword || isInvestorPassword ? DerivLightIcEmailSentIcon : DerivLightIcEmailSentPasskeyIcon;

    const resendEmail = () => {
        sendEmail({ isInvestorPassword, platform });
        resetCountdown();
        startCountdown();
        setHasCountdownStarted(true);
    };

    useEffect(() => {
        if (count === 0) setHasCountdownStarted(false);
    }, [count]);

    if (resetPasswordError) {
        return (
            <WalletError
                errorMessage={resetPasswordError?.error.message}
                onClick={onErrorButtonClick}
                title={resetPasswordError?.error?.code}
            />
        );
    }

    return (
        <div
            className={classNames('wallets-sent-email-content', {
                'wallets-sent-email-content--scrollable': isForgottenPassword,
            })}
        >
            <ActionScreen
                actionButtons={
                    <Button
                        color='primary-transparent'
                        disabled={shouldShowResendEmailReasons}
                        onClick={() => {
                            setShouldShowResendEmailReasons(true);
                        }}
                        size='lg'
                        variant='ghost'
                    >
                        <Text color='error' size={emailButtonTextSize} weight='bold'>
                            <Localize i18n_default_text="Didn't receive the email?" />
                        </Text>
                    </Button>
                }
                description={
                    description ??
                    localize('Please click on the link in the email to change your {{title}} password.', { title })
                }
                descriptionSize={descriptionSize}
                icon={<EmailSentIcon width={133} />}
                title={<Localize i18n_default_text="We've sent you an email" />}
                titleSize={titleSize}
            />
            {shouldShowResendEmailReasons && (
                <Fragment>
                    <div className='wallets-sent-email-content__reasons-container'>
                        {emailReasons.map(emailReason => {
                            return (
                                <div className='wallets-sent-email-content__reasons' key={emailReason.key}>
                                    {emailReason.icon}
                                    <Text align='start' lineHeight='sm' size={emailReasonsSize}>
                                        {emailReason.content}
                                    </Text>
                                </div>
                            );
                        })}
                    </div>
                    <Button
                        color='primary'
                        disabled={hasCountdownStarted}
                        onClick={resendEmail}
                        size='lg'
                        textSize={emailButtonTextSize}
                        variant='contained'
                    >
                        {hasCountdownStarted ? (
                            <Localize i18n_default_text='Resend email in {{count}} seconds' values={{ count }} />
                        ) : (
                            <Localize i18n_default_text='Resend email' />
                        )}
                    </Button>
                </Fragment>
            )}
        </div>
    );
};

export default SentEmailContent;
