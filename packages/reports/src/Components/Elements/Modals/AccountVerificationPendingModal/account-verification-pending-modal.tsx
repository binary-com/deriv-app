import React from 'react';
import { Button, Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TAccountVerificationPendingModalProps = {
    is_visible: boolean;
    onConfirm: () => void;
};

const AccountVerificationPendingModal = ({ is_visible, onConfirm }: TAccountVerificationPendingModalProps) => (
    <Modal
        small
        is_open={is_visible}
        title={<Localize i18n_default_text='Pending verification' />}
        toggleModal={onConfirm}
        className='account-verification-pending-modal'
    >
        <Modal.Body>
            <Localize i18n_default_text='You cannot trade as your documents are still under review. We will notify you by email once your verification is approved.' />
        </Modal.Body>
        <Modal.Footer>
            <Button has_effect onClick={onConfirm} primary large>
                <Localize i18n_default_text='OK' />
            </Button>
        </Modal.Footer>
    </Modal>
);

export default AccountVerificationPendingModal;
