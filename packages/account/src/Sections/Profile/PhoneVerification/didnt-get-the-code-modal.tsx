import React from 'react';
import { Button, Modal, Text } from '@deriv-com/quill-ui';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { useRequestPhoneNumberOTP } from '@deriv/hooks';
import { convertPhoneTypeDisplay } from 'Helpers/utils';

type TDidntGetTheCodeModal = {
    phone_verification_type: string;
    should_show_didnt_get_the_code_modal: boolean;
    setIsButtonDisabled: (value: boolean) => void;
    setShouldShowDidntGetTheCodeModal: (value: boolean) => void;
    setOtpVerification: (value: { show_otp_verification: boolean; phone_verification_type: string }) => void;
    reInitializeGetSettings: () => void;
};

const DidntGetTheCodeModal = observer(
    ({
        should_show_didnt_get_the_code_modal,
        setShouldShowDidntGetTheCodeModal,
        setIsButtonDisabled,
        reInitializeGetSettings,
        phone_verification_type,
        setOtpVerification,
    }: TDidntGetTheCodeModal) => {
        const { requestOnSMS, requestOnWhatsApp, is_email_verified, ...rest } = useRequestPhoneNumberOTP();
        const { ui } = useStore();
        const { is_mobile } = ui;

        React.useEffect(() => {
            //TODO: will replace error_otp_error once BE error is solved
            if (is_email_verified) reInitializeGetSettings();
        }, [is_email_verified, reInitializeGetSettings]);

        const setDidntGetACodeButtonDisabled = () => {
            setIsButtonDisabled(true);
        };

        const handleResendCode = () => {
            setDidntGetACodeButtonDisabled();
            phone_verification_type === VERIFICATION_SERVICES.SMS ? requestOnSMS() : requestOnWhatsApp();
            setOtpVerification({ show_otp_verification: true, phone_verification_type });
            setShouldShowDidntGetTheCodeModal(false);
        };

        const handleChangeOTPVerification = () => {
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

        const handleChangePhoneNumber = () => {
            setShouldShowDidntGetTheCodeModal(false);
            setOtpVerification({ show_otp_verification: false, phone_verification_type });
        };

        return (
            <Modal
                isMobile={is_mobile}
                showHandleBar
                isOpened={should_show_didnt_get_the_code_modal}
                disableCloseOnOverlay
                showCrossIcon
                toggleModal={() => setShouldShowDidntGetTheCodeModal(false)}
                hasFooter={false}
            >
                <Modal.Body>
                    <div className='phone-verification__get-code-modal--contents'>
                        <Text bold>
                            <Localize i18n_default_text='Get a new code' />
                        </Text>
                        <div className='phone-verification__get-code-modal--contents__buttons'>
                            <Button fullWidth color='black' size='lg' onClick={handleResendCode}>
                                <Text color='white' bold>
                                    <Localize i18n_default_text='Resend code' />
                                </Text>
                            </Button>
                            <Button
                                fullWidth
                                color='black'
                                variant='secondary'
                                size='lg'
                                onClick={handleChangeOTPVerification}
                            >
                                <Text color='white' bold>
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
                                </Text>
                            </Button>
                            <Text>
                                <Localize i18n_default_text='or' />
                            </Text>
                            <Button
                                fullWidth
                                color='black'
                                variant='tertiary'
                                size='lg'
                                onClick={handleChangePhoneNumber}
                            >
                                <Text bold>
                                    <Localize i18n_default_text='Change phone number' />
                                </Text>
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
);

export default DidntGetTheCodeModal;
