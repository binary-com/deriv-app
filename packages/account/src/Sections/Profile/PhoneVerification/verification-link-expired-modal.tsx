import React from 'react';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useHistory } from 'react-router';
import { observer, useStore } from '@deriv/stores';
import { LabelPairedCircleXmarkLgRegularIcon } from '@deriv/quill-icons';
import { useVerifyEmail } from '@deriv/hooks';

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
        const handleCancelButton = () => {
            setShouldShowVerificationLinkExpiredModal(false);
            history.goBack();
        };
        const { send } = useVerifyEmail('phone_number_verification');
        const handleSendNewLinkButton = () => {
            send();
            setShouldShowVerificationLinkExpiredModal(false);
        };
        const { ui } = useStore();
        const { is_mobile } = ui;

        return (
            <Modal
                isMobile={is_mobile}
                showHandleBar
                isOpened={should_show_verification_link_expired_modal}
                primaryButtonCallback={handleSendNewLinkButton}
                primaryButtonLabel={<Localize i18n_default_text='Send new link' />}
                disableCloseOnOverlay
                showSecondaryButton
                secondaryButtonLabel={<Localize i18n_default_text='Cancel' />}
                secondaryButtonCallback={handleCancelButton}
            >
                <Modal.Header
                    className='phone-verification__cancel-modal--header'
                    image={<LabelPairedCircleXmarkLgRegularIcon fill='#C40000' height={96} width={96} />}
                />
                <Modal.Body>
                    <div className='phone-verification__cancel-modal--contents'>
                        <Text bold>
                            <Localize i18n_default_text='Verification link expired' />
                        </Text>
                        <Text>
                            <Localize i18n_default_text='Get another link to verify your number.' />
                        </Text>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
);

export default VerificationLinkExpiredModal;
