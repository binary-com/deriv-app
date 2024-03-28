import React from 'react';
import { Button, Modal } from '@deriv/components';

type TPasskeyModal = {
    header?: React.ReactElement;
    description?: React.ReactElement | string;
    button_text?: React.ReactElement;
    onButtonClick: React.MouseEventHandler<HTMLButtonElement>;
    is_modal_open: boolean;
    className?: string;
    transition_timeout?: number;
    has_close_icon?: boolean;
    toggleModal?: () => void;
};

const PasskeyModal = ({
    is_modal_open,
    header,
    description,
    button_text,
    onButtonClick,
    className,
    transition_timeout,
    has_close_icon,
    toggleModal,
}: TPasskeyModal) => (
    <Modal
        portalId='modal_root'
        transition_timeout={transition_timeout}
        header={header}
        is_open={is_modal_open}
        toggleModal={toggleModal}
        has_close_icon={has_close_icon}
        className={className}
    >
        <Modal.Body>{description}</Modal.Body>
        <Modal.Footer>
            {button_text && (
                <Button onClick={onButtonClick} large primary>
                    {button_text}
                </Button>
            )}
        </Modal.Footer>
    </Modal>
);

export default PasskeyModal;
