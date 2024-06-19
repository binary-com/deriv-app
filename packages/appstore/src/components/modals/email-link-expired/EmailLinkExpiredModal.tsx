import React, { useCallback } from 'react';
import { Localize, localize } from '@deriv/translations';
import { Modal, FormSubmitButton, Text } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import './email-link-expired.scss';

const EmailLinkExpiredModal = observer(() => {
    const {
        client: { is_logged_in, is_email_verified },
        ui: {
            is_email_verification_code_expired_modal_visible,
            toggleEmailVerificationCodeExpiredModal,
            toggleEmailVerificationModal,
        },
    } = useStore();

    const handleResendEmail = useCallback(() => {
        if (!is_logged_in || is_email_verified) return;
        toggleEmailVerificationCodeExpiredModal(false);
        toggleEmailVerificationModal(true);
    }, [is_email_verified, is_logged_in, toggleEmailVerificationCodeExpiredModal, toggleEmailVerificationModal]);

    return (
        <Modal
            id='email-link-expired-modal'
            portalId='modal_root_absolute'
            is_open={is_email_verification_code_expired_modal_visible}
            title={<Localize i18n_default_text='Email verification link expired' />}
            toggleModal={() => toggleEmailVerificationCodeExpiredModal(false)}
        >
            <div className='email-link-expired-modal'>
                <div className='email-link-expired-modal__content-wrapper'>
                    <Text size='xs' as='p' align='left' className='email-link-expired-modal__content'>
                        <Localize i18n_default_text='Please request a new one.' />
                    </Text>
                </div>
                <FormSubmitButton
                    label={localize('Resend email')}
                    className='email-link-expired-modal__button'
                    onClick={handleResendEmail}
                />
            </div>
        </Modal>
    );
});

export default EmailLinkExpiredModal;
