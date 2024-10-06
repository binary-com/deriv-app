import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { usePhoneNumberVerificationSetTimer, useSettings, useVerifyEmail } from '@deriv/hooks';
import { Modal, Text } from '@deriv-com/quill-ui';
import { routes } from '@deriv/shared';
import { Localize, useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';

type TVerificationLinkExpiredModal = {
    should_show_verification_link_expired_modal: boolean;
    setShouldShowVerificationLinkExpiredModal: (value: boolean) => void;
};

const VerificationLinkExpiredModal = observer(
    ({
        should_show_verification_link_expired_modal,
        setShouldShowVerificationLinkExpiredModal,
    }: TVerificationLinkExpiredModal) => {
        const history = useHistory();
        const { ui } = useStore();
        const { setIsForcedToExitPnv } = ui;
        //@ts-expect-error ignore this until we add it in GetSettings api types
        const { sendPhoneNumberVerifyEmail, WS } = useVerifyEmail('phone_number_verification');
        const { next_email_otp_request_timer, is_email_otp_timer_loading, setNextEmailOtpRequestTimer } =
            usePhoneNumberVerificationSetTimer();
        const { invalidate } = useSettings();
        const { isMobile } = useDevice();
        const { localize } = useTranslations();

        const handleCancelButton = () => {
            setIsForcedToExitPnv(false);
            setShouldShowVerificationLinkExpiredModal(false);
            history.push(routes.personal_details);
        };

        const handleSendNewLinkButton = () => {
            sendPhoneNumberVerifyEmail();
            setNextEmailOtpRequestTimer(undefined);
            setIsForcedToExitPnv(false);
        };

        const sendNewLinkTimer = () => {
            let sendNewLinkTimer = '';
            if (next_email_otp_request_timer) {
                next_email_otp_request_timer < 60
                    ? (sendNewLinkTimer = `${localize(' in ')}${next_email_otp_request_timer}s`)
                    : (sendNewLinkTimer = `${localize(' in ')}${Math.round(next_email_otp_request_timer / 60)}m`);
            } else {
                sendNewLinkTimer = '';
            }

            return sendNewLinkTimer;
        };

        useEffect(() => {
            if (WS.isSuccess) invalidate('get_settings').then(() => setShouldShowVerificationLinkExpiredModal(false));
        }, [WS.isSuccess, invalidate]);

        return (
            <Modal
                isMobile={isMobile}
                isOpened={should_show_verification_link_expired_modal}
                isPrimaryButtonDisabled={!!next_email_otp_request_timer || is_email_otp_timer_loading}
                buttonColor='coral'
                isNonExpandable
                shouldCloseModalOnSwipeDown
                primaryButtonCallback={handleSendNewLinkButton}
                primaryButtonLabel={
                    <Localize
                        i18n_default_text='Send new link{{next_email_attempt_timestamp}}'
                        values={{ next_email_attempt_timestamp: sendNewLinkTimer() }}
                    />
                }
                toggleModal={() => setShouldShowVerificationLinkExpiredModal(false)}
                showSecondaryButton
                secondaryButtonLabel={<Localize i18n_default_text='Cancel' />}
                secondaryButtonCallback={handleCancelButton}
            >
                <Modal.Header title={<Localize i18n_default_text='Link expired' />} />
                <Modal.Body>
                    <div className='phone-verification__cancel-modal--contents'>
                        <Text>
                            <Localize i18n_default_text='Request a new verification link via email.' />
                        </Text>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
);

export default VerificationLinkExpiredModal;
