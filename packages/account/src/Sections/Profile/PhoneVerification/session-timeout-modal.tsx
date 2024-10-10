import { useHistory } from 'react-router';
import { usePhoneNumberVerificationSessionTimer, usePhoneVerificationAnalytics } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize, useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { useEffect } from 'react';

const SessionTimeoutModal = observer(({ is_at_otp_verification }: { is_at_otp_verification: boolean }) => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { localize } = useTranslations();
    const { should_show_session_timeout_modal } = usePhoneNumberVerificationSessionTimer();
    const { ui } = useStore();
    const {
        is_phone_verification_completed,
        setShouldShowPhoneNumberOTP,
        setIsForcedToExitPnv,
        should_show_phone_number_otp,
    } = ui;
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();

    const getSubformName = () => {
        if (is_at_otp_verification) {
            return should_show_phone_number_otp ? 'verify_phone_otp_screen' : 'verify_email_screen';
        }
        return 'verify_phone_screen';
    };

    useEffect(() => {
        if (should_show_session_timeout_modal) {
            setIsForcedToExitPnv(true);
            trackPhoneVerificationEvents({
                action: 'open_session_expired_popup',
                subform_name: getSubformName(),
            });
        }
    }, [should_show_session_timeout_modal, trackPhoneVerificationEvents]);

    const redirectBackToPersonalDetails = () => {
        setIsForcedToExitPnv(false);
        setShouldShowPhoneNumberOTP(false);
        history.push(routes.personal_details);
    };

    return (
        <Modal
            isMobile={isMobile}
            isOpened={should_show_session_timeout_modal && !is_phone_verification_completed}
            showCrossIcon={false}
            showHandleBar={false}
            isNonExpandable
            primaryButtonCallback={redirectBackToPersonalDetails}
            primaryButtonLabel={<Localize i18n_default_text='OK' />}
            buttonColor='coral'
            title={localize('Session Expired')}
            disableCloseOnOverlay
        >
            <Modal.Header title={<Localize i18n_default_text='Session expired' />} />
            <Modal.Body>
                <Text>
                    <Localize i18n_default_text='Restart your phone number verification.' />
                </Text>
            </Modal.Body>
        </Modal>
    );
});

export default SessionTimeoutModal;
