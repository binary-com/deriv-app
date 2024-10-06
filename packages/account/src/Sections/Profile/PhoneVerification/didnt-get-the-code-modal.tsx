import { useEffect } from 'react';
import { TSocketError } from '@deriv/api/types';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { useTranslations, Localize } from '@deriv-com/translations';
import { Modal } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';
import { convertPhoneTypeDisplay } from '../../../Helpers/utils';

type TDidntGetTheCodeModal = {
    phone_verification_type: string;
    should_show_didnt_get_the_code_modal: boolean;
    setIsButtonDisabled: (value: boolean) => void;
    setShouldShowDidntGetTheCodeModal: (value: boolean) => void;
    requestOnSMS: () => void;
    requestOnWhatsApp: () => void;
    clearOtpValue: () => void;
    is_email_verified: boolean;
    email_otp_error: TSocketError<'phone_number_challenge'> | null;
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
    reInitializeGetSettings: () => void;
};

const DidntGetTheCodeModal = ({
    should_show_didnt_get_the_code_modal,
    setShouldShowDidntGetTheCodeModal,
    setIsButtonDisabled,
    reInitializeGetSettings,
    requestOnSMS,
    requestOnWhatsApp,
    clearOtpValue,
    phone_verification_type,
    is_email_verified,
    email_otp_error,
    setOtpVerification,
}: TDidntGetTheCodeModal) => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();

    useEffect(() => {
        if (is_email_verified || email_otp_error) reInitializeGetSettings();
    }, [is_email_verified, email_otp_error, reInitializeGetSettings]);

    const setDidntGetACodeButtonDisabled = () => {
        setIsButtonDisabled(true);
    };

    const handleResendCode = () => {
        clearOtpValue();
        setDidntGetACodeButtonDisabled();
        phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnSMS() : requestOnWhatsApp();
        setOtpVerification({ show_otp_verification: true, phone_verification_type });
        setShouldShowDidntGetTheCodeModal(false);
    };

    const handleChangeOTPVerification = () => {
        clearOtpValue();
        setDidntGetACodeButtonDisabled();
        const changed_phone_verification_type =
            phone_verification_type === VERIFICATION_SERVICES.SMS
                ? VERIFICATION_SERVICES.WHATSAPP
                : VERIFICATION_SERVICES.SMS;

        phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnWhatsApp() : requestOnSMS();

        setOtpVerification({
            show_otp_verification: true,
            phone_verification_type: changed_phone_verification_type,
        });
        setShouldShowDidntGetTheCodeModal(false);
    };

    return (
        <Modal
            isMobile={isMobile}
            showHandleBar
            isOpened={should_show_didnt_get_the_code_modal}
            isNonExpandable
            shouldCloseModalOnSwipeDown
            showSecondaryButton
            primaryButtonCallback={handleResendCode}
            secondaryButtonCallback={handleChangeOTPVerification}
            primaryButtonLabel={<Localize i18n_default_text='Resend code' />}
            buttonColor='coral'
            secondaryButtonLabel={
                <Localize
                    i18n_default_text='Send code via {{phone_verification_type}}'
                    values={{
                        phone_verification_type: localize(
                            convertPhoneTypeDisplay(
                                phone_verification_type === VERIFICATION_SERVICES.SMS
                                    ? VERIFICATION_SERVICES.WHATSAPP
                                    : VERIFICATION_SERVICES.SMS
                            )
                        ),
                    }}
                />
            }
            showCrossIcon
            toggleModal={() => setShouldShowDidntGetTheCodeModal(false)}
        >
            <Modal.Header title={<Localize i18n_default_text="Didn't receive a code?" />} />
        </Modal>
    );
};

export default DidntGetTheCodeModal;
