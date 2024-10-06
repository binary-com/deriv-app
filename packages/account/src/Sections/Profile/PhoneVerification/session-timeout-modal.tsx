import { useHistory } from 'react-router';
import { usePhoneNumberVerificationSessionTimer } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize, useTranslations } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { useEffect } from 'react';

const SessionTimeoutModal = observer(() => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { localize } = useTranslations();
    const { should_show_session_timeout_modal } = usePhoneNumberVerificationSessionTimer();
    const { ui } = useStore();
    const { is_phone_verification_completed, setShouldShowPhoneNumberOTP, setIsForcedToExitPnv } = ui;

    useEffect(() => {
        if (should_show_session_timeout_modal) {
            setIsForcedToExitPnv(true);
        }
    }, [should_show_session_timeout_modal]);

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
