import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TOrderTimeTooltipModalProps = {
    order_time_info_message: string;
};

const OrderTimeTooltipModal = ({ order_time_info_message }: TOrderTimeTooltipModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal has_close_icon={false} is_open={is_modal_open} small>
            <Modal.Body>
                <Text color='prominent' size='xxs' line_height='xs'>
                    <Localize i18n_default_text={order_time_info_message} />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button primary large onClick={hideModal}>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderTimeTooltipModal;
