import React from 'react';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import { observer, useStore } from '@deriv/stores';
import { LabelPairedCircleXmarkLgRegularIcon } from '@deriv/quill-icons';

type TCancelPhoneVerificationModal = {
    should_show_cancel_verification_modal: boolean;
    setShouldShowCancelVerificationModal: (value: boolean) => void;
};

const CancelPhoneVerificationModal = observer(
    ({
        should_show_cancel_verification_modal,
        setShouldShowCancelVerificationModal,
    }: TCancelPhoneVerificationModal) => {
        const history = useHistory();
        const handleCancelButton = () => {
            setShouldShowCancelVerificationModal(false);
            history.goBack();
        };
        const { ui } = useStore();
        const { is_mobile } = ui;

        return (
            <Modal
                isMobile={is_mobile}
                showHandleBar
                isOpened={should_show_cancel_verification_modal}
                primaryButtonCallback={() => setShouldShowCancelVerificationModal(false)}
                primaryButtonLabel={<Localize i18n_default_text='Go back' />}
                disableCloseOnOverlay
                showSecondaryButton
                secondaryButtonLabel={<Localize i18n_default_text='Yes, cancel' />}
                secondaryButtonCallback={handleCancelButton}
            >
                <Modal.Header
                    className='phone-verification__cancel-modal--header'
                    image={<LabelPairedCircleXmarkLgRegularIcon fill='#C40000' height={96} width={96} />}
                />
                <Modal.Body>
                    <div className='phone-verification__cancel-modal--contents'>
                        <Text bold>
                            <Localize i18n_default_text='Cancel phone number verification?' />
                        </Text>
                        <Text>
                            <Localize i18n_default_text='All details entered will be lost.' />
                        </Text>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
);

export default CancelPhoneVerificationModal;
