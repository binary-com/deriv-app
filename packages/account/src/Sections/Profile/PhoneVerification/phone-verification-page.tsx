import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Loading } from '@deriv/components';
import { useGrowthbookGetFeatureValue, useIsPhoneNumberVerified, useSendOTPVerificationCode } from '@deriv/hooks';
import { LabelPairedArrowLeftCaptionFillIcon } from '@deriv/quill-icons';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Text, IconButton } from '@deriv-com/quill-ui';
import { useDevice } from '@deriv-com/ui';
import { Localize } from '@deriv-com/translations';
import ConfirmPhoneNumber from './confirm-phone-number';
import CancelPhoneVerificationModal from './cancel-phone-verification-modal';
import OTPVerification from './otp-verification';
import SessionTimeoutModal from './session-timeout-modal';
import VerificationLinkExpiredModal from './verification-link-expired-modal';
import './phone-verification.scss';
import PhoneVerificationCard from './phone-verification-card';

const PhoneVerificationPage = observer(() => {
    const history = useHistory();
    const [otp_verification, setOtpVerification] = useState({
        show_otp_verification: true,
        phone_verification_type: '',
    });
    const phone_verification_code = sessionStorage.getItem('phone_number_verification_code');
    const [is_loading, setIsLoading] = useState(false);
    const [should_show_verification_link_expired_modal, setShouldShowVerificationLinkExpiredModal] = useState(false);
    const handleBackButton = () => {
        history.push(routes.personal_details);
    };
    const { sendEmailOTPVerification, email_otp_error, is_email_verified } = useSendOTPVerificationCode();
    const { is_phone_number_verified } = useIsPhoneNumberVerified();
    const [isPhoneNumberVerificationEnabled, isPhoneNumberVerificationGBLoaded] = useGrowthbookGetFeatureValue({
        featureFlag: 'phone_number_verification',
    });
    const { isDesktop } = useDevice();
    const { client, ui } = useStore();
    const { is_redirected_from_email, setRedirectFromEmail, setIsForcedToExitPnv } = ui;
    const {
        verification_code: { phone_number_verification: phone_number_verification_code },
        is_authorize,
        is_virtual,
        setVerificationCode,
    } = client;

    useEffect(() => {
        if (
            (isPhoneNumberVerificationGBLoaded && !isPhoneNumberVerificationEnabled) ||
            is_virtual ||
            is_phone_number_verified
        ) {
            setIsForcedToExitPnv(true);
            history.push(routes.personal_details);
        }
    }, [
        isPhoneNumberVerificationGBLoaded,
        isPhoneNumberVerificationEnabled,
        is_virtual,
        history,
        is_phone_number_verified,
    ]);

    useEffect(() => {
        if (is_redirected_from_email || phone_verification_code) {
            setIsLoading(true);
            if (email_otp_error) {
                setIsLoading(false);
                setIsForcedToExitPnv(true);
                setShouldShowVerificationLinkExpiredModal(true);
                setRedirectFromEmail(false);
                sessionStorage.removeItem('phone_number_verification_code');
            } else if (is_email_verified) {
                setIsLoading(false);
                setOtpVerification({
                    show_otp_verification: false,
                    phone_verification_type: '',
                });
                setRedirectFromEmail(false);
                sessionStorage.removeItem('phone_number_verification_code');
            } else if ((phone_number_verification_code || phone_verification_code) && is_authorize) {
                if (phone_verification_code) setVerificationCode(phone_verification_code, 'phone_number_verification');
                sendEmailOTPVerification(phone_verification_code || phone_number_verification_code);
            }
        }
    }, [
        email_otp_error,
        is_email_verified,
        phone_number_verification_code,
        is_authorize,
        is_redirected_from_email,
        phone_verification_code,
    ]);

    if (is_loading || !isPhoneNumberVerificationGBLoaded) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div>
            <VerificationLinkExpiredModal
                should_show_verification_link_expired_modal={should_show_verification_link_expired_modal}
                setShouldShowVerificationLinkExpiredModal={setShouldShowVerificationLinkExpiredModal}
            />
            {!should_show_verification_link_expired_modal && <SessionTimeoutModal />}
            <CancelPhoneVerificationModal />
            {isDesktop && (
                <div className='phone-verification__redirect_button'>
                    <IconButton
                        color='black-white'
                        variant='tertiary'
                        onClick={handleBackButton}
                        icon={
                            <LabelPairedArrowLeftCaptionFillIcon
                                width={24}
                                height={24}
                                data-testid='dt_phone_verification_back_btn'
                                className='phone-verification__redirect_button--icon'
                            />
                        }
                    />
                    <Text className='phone-verification__redirect_button--text' bold>
                        <Localize i18n_default_text='Back to personal details' />
                    </Text>
                </div>
            )}
            <PhoneVerificationCard is_small_card={otp_verification.show_otp_verification}>
                {otp_verification.show_otp_verification ? (
                    <OTPVerification
                        phone_verification_type={otp_verification.phone_verification_type}
                        setOtpVerification={setOtpVerification}
                    />
                ) : (
                    <ConfirmPhoneNumber
                        show_confirm_phone_number={!otp_verification.show_otp_verification}
                        setOtpVerification={setOtpVerification}
                    />
                )}
            </PhoneVerificationCard>
        </div>
    );
});

export default PhoneVerificationPage;
