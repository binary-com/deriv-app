import React from 'react';
import DxtradeSuccess from '@/features/cfd/modals/DxtradePasswordModal/DxtradeSuccess';
import { useQueryParams } from '@/hooks';
import { Modal } from '@deriv-com/ui';

const MT5SuccessModal = () => {
    const { isModalOpen, closeModal } = useQueryParams();
    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('DxtradeSuccessModal')} onRequestClose={closeModal}>
            <Modal.Body>
                <DxtradeSuccess />
            </Modal.Body>
        </Modal>
    );
};

export default MT5SuccessModal;
