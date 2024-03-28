import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TAdCancelModalProps = {
    message: string;
    onConfirm?: () => void;
    title: string;
};

const AdCancelModal = ({ message, onConfirm, title }: TAdCancelModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal has_close_icon={false} is_open={is_modal_open} small title={localize(title)}>
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    <Localize i18n_default_text={message} />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={localize('Cancel')}
                    onClick={() => {
                        hideModal();
                        onConfirm?.();
                    }}
                    secondary
                    large
                />
                <Button has_effect text={localize("Don't cancel")} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default AdCancelModal;
