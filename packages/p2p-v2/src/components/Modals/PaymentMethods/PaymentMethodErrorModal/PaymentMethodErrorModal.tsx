import React from 'react';
import { Button, Modal, Text, useDevice } from '@deriv-com/ui';
import './PaymentMethodErrorModal.scss';

type TPaymentMethodErrorModalProps = {
    errorMessage: string;
    isModalOpen: boolean;
    onConfirm: () => void;
    title: string;
};

const PaymentMethodErrorModal = ({ errorMessage, isModalOpen, onConfirm, title }: TPaymentMethodErrorModalProps) => {
    const { isMobile } = useDevice();

    // TODO: Remember to translate these strings
    return (
        <Modal
            ariaHideApp={false}
            className='p2p-v2-payment-method-error-modal'
            contentLabel={title}
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
        >
            <Modal.Header className='p2p-v2-payment-method-error-modal__header' hideBorder hideCloseIcon>
                <Text weight='bold'>{title}</Text>
            </Modal.Header>
            <Modal.Body className='p2p-v2-payment-method-error-modal__body'>
                <Text size='sm'>{errorMessage}</Text>
            </Modal.Body>
            <Modal.Footer className='p2p-v2-payment-method-error-modal__footer' hideBorder>
                <Button onClick={onConfirm} size='lg' textSize={isMobile ? 'md' : 'sm'}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentMethodErrorModal;
