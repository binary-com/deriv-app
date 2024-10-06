import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router';

type TCoolDownPeriodModal = {
    show_cool_down_period_modal: boolean;
    setShowCoolDownPeriodModal: (value: boolean) => void;
};

const CoolDownPeriodModal = observer(
    ({ show_cool_down_period_modal, setShowCoolDownPeriodModal }: TCoolDownPeriodModal) => {
        const { ui } = useStore();
        const history = useHistory();
        const { isMobile } = useDevice();
        const { setIsForcedToExitPnv, setShouldShowPhoneNumberOTP } = ui;
        const handleCloseCoolDownPeriodModal = () => {
            setShouldShowPhoneNumberOTP(false);
            setIsForcedToExitPnv(false);
            setShowCoolDownPeriodModal(false);
            history.push(routes.personal_details);
        };
        return (
            <Modal
                isOpened={show_cool_down_period_modal}
                isMobile={isMobile}
                showCrossIcon={false}
                showHandleBar={false}
                isNonExpandable
                primaryButtonLabel={<Localize i18n_default_text='OK' />}
                primaryButtonCallback={handleCloseCoolDownPeriodModal}
                disableCloseOnOverlay
                buttonColor='coral'
            >
                <Modal.Header title={<Localize i18n_default_text='OTP limit reached' />} />
                <Modal.Body>
                    <Text>
                        <Localize i18n_default_text='Request a new OTP after 10 minutes.' />
                    </Text>
                </Modal.Body>
            </Modal>
        );
    }
);

export default CoolDownPeriodModal;
