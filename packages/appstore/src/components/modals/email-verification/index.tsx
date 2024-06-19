import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { localize, Localize } from '@deriv/translations';
import { Text, Modal, MobileFullPageModal, Icon, Button, Loading } from '@deriv/components';
import { useStore } from '@deriv/stores';
import Email from '../../../assets/svgs/email.svg';
import './email-verification.scss';
import { useVerifyEmail } from '@deriv/api';
import { useIsEmailVerified } from '@deriv/hooks';
import ResendEmail from './resent-email';

const EmailVerificationModal = () => {
    const { ui, client } = useStore();
    const is_email_verified = useIsEmailVerified();
    const [resend_email, setResendEmail] = useState(false);

    const { toggleEmailVerificationModal } = ui;
    const { mutate, isLoading } = useVerifyEmail();

    const sendVerificationEmail = useCallback(() => {
        mutate({ verify_email: client.email, type: 'account_verification' });
    }, [client.email, mutate]);

    const handleResendEmail = useCallback(() => setResendEmail(true), []);

    useEffect(() => {
        if (is_email_verified || !client.email) return;

        sendVerificationEmail();
    }, [client.email, is_email_verified, sendVerificationEmail]);

    return (
        <MobileFullPageModal
            className='email-verification-modal_mobile'
            is_modal_open
            has_close_icon
            height_offset='80px'
            page_header_text=' '
            is_flex
            renderPageHeaderTrailingIcon={() => (
                <Icon icon='IcCross' onClick={() => toggleEmailVerificationModal(false)} />
            )}
            renderPageFooterChildren={() =>
                resend_email ? (
                    <ResendEmail disabled={isLoading} onClick={sendVerificationEmail} />
                ) : (
                    <Button
                        is_disabled={isLoading}
                        secondary
                        large
                        type='button'
                        className='email-verification-modal_mobile--submit-btn'
                        onClick={handleResendEmail}
                    >
                        Didn’t receive the email?
                    </Button>
                )
            }
        >
            {isLoading && <Loading />}
            {!isLoading && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1.4rem',
                        padding: '0 1.6rem',
                    }}
                >
                    {!resend_email && (
                        <Fragment>
                            <Email />
                            <Text as='h2' weight='bold' size='s'>
                                <Localize i18n_default_text='Check your inbox' />
                            </Text>
                            <Text align='center' size='xs'>
                                Please check your email {client.email} for the verification link. Click on the link to
                                confirm your email address to continue creating your Deriv account.
                            </Text>
                        </Fragment>
                    )}
                    {resend_email && (
                        <Fragment>
                            <Email />
                            <Text as='h2' weight='bold' size='s'>
                                <Localize i18n_default_text='Didn’t receive the email?' />
                            </Text>
                            <ul>
                                <Text as='li' size='xs'>
                                    Spam folder: Sometimes emails are there.
                                </Text>
                                <Text as='li' size='xs'>
                                    Email address: Make sure it’s spelled correctly.
                                </Text>
                                <Text as='li' size='xs'>
                                    Email settings: Your email might be blocked by firewalls or filters.
                                </Text>
                            </ul>
                        </Fragment>
                    )}
                </div>
            )}
        </MobileFullPageModal>
    );
};

export default EmailVerificationModal;
