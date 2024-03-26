import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { getTextSize } from 'Utils/responsive';

type TMarketRateChangeErrorModal = {
    message?: string;
};

const MarketRateChangeErrorModal = ({ message }: TMarketRateChangeErrorModal) => {
    const { is_modal_open, hideModal } = useModalManagerContext();

    return (
        <Modal is_open={is_modal_open} onExited={hideModal} small>
            <Modal.Body>
                {message ?? (
                    <Text as='p' size={getTextSize('xxs', 'xs')} line_height='s'>
                        <Localize i18n_default_text='The rate of the advert has changed. Please try creating your order again.' />
                    </Text>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={hideModal} text={localize('Try again')} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default MarketRateChangeErrorModal;
