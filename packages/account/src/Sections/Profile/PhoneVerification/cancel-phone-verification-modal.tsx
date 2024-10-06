import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { observer, useStore } from '@deriv/stores';
import { useGrowthbookGetFeatureValue, useIsPhoneNumberVerified, usePhoneVerificationAnalytics } from '@deriv/hooks';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';

const CancelPhoneVerificationModal = observer(() => {
    const history = useHistory();
    const location = useLocation();
    const [show_modal, setShowModal] = useState(false);
    const [next_location, setNextLocation] = useState(location.pathname);
    const { ui, client } = useStore();
    const { setShouldShowPhoneNumberOTP, is_forced_to_exit_pnv } = ui;
    const { setVerificationCode, is_virtual } = client;
    const { isMobile } = useDevice();
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();
    const { is_phone_number_verified } = useIsPhoneNumberVerified();
    const [isPhoneNumberVerificationEnabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'phone_number_verification',
    });

    useEffect(() => {
        const unblock = history.block((location: Location) => {
            if (
                !show_modal &&
                !is_virtual &&
                !is_forced_to_exit_pnv &&
                !is_phone_number_verified &&
                isPhoneNumberVerificationEnabled
            ) {
                setShowModal(true);
                setNextLocation(location.pathname);
                return false;
            }
            return true;
        });

        return () => unblock();
    }, [
        history,
        show_modal,
        is_virtual,
        is_forced_to_exit_pnv,
        is_phone_number_verified,
        isPhoneNumberVerificationEnabled,
    ]);

    const handleStayAtPhoneVerificationPage = () => {
        setShowModal(false);
        setNextLocation(location.pathname);
    };

    const handleLeavePhoneVerificationPage = () => {
        if (next_location) {
            setVerificationCode('', 'phone_number_verification');
            setShouldShowPhoneNumberOTP(false);
            setShowModal(false);
            trackPhoneVerificationEvents({
                action: 'back',
            });
            history.push(next_location);
        }
    };

    return (
        <Modal
            isMobile={isMobile}
            showHandleBar
            isOpened={show_modal}
            isNonExpandable
            shouldCloseModalOnSwipeDown
            shouldCloseOnPrimaryButtonClick
            primaryButtonLabel={<Localize i18n_default_text='Continue verification' />}
            buttonColor='coral'
            showSecondaryButton
            showCrossIcon
            toggleModal={handleStayAtPhoneVerificationPage}
            secondaryButtonLabel={<Localize i18n_default_text='Cancel' />}
            secondaryButtonCallback={handleLeavePhoneVerificationPage}
        >
            <Modal.Header title={<Localize i18n_default_text='Cancel phone number verification?' />} />
            <Modal.Body>
                <div className='phone-verification__cancel-modal--contents'>
                    <Text>
                        <Localize i18n_default_text="If you cancel, you'll lose all progress." />
                    </Text>
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default CancelPhoneVerificationModal;
