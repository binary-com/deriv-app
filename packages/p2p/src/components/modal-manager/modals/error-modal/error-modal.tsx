import React from 'react';
import classNames from 'classnames';
import { Button, Modal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TErrorModalProps = {
    error_message: React.ReactNode;
    error_modal_button_text?: string;
    error_modal_title?: string;
    has_close_icon?: boolean;
    onClose?: () => void;
    text_size?: string;
};

const ErrorModal = ({
    error_message,
    error_modal_button_text = 'OK',
    error_modal_title,
    has_close_icon,
    onClose,
    text_size = 's',
}: TErrorModalProps) => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            className='error-modal'
            has_close_icon={has_close_icon}
            is_open={is_modal_open}
            title={error_modal_title}
            toggleModal={onClose ?? hideModal}
            width={is_mobile ? '90rem' : '40rem'}
        >
            <Modal.Body
                className={classNames('error-modal__body', {
                    'error-modal__body--has-title': error_modal_title,
                })}
            >
                <Text size={text_size}>
                    <Localize i18n_default_text={error_message} />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button large primary onClick={onClose ?? hideModal}>
                    <Localize i18n_default_text={error_modal_button_text} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(ErrorModal);
