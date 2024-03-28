import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';

const CFDAccountDisabledModal = () => {
    const { traders_hub } = useStore();
    const { is_account_disabled_modal_visible, setAccountDisabledModalVisibility } = traders_hub;
    const handleLivechat = () => {
        window.LC_API?.open_chat_window();
        setAccountDisabledModalVisibility(false);
    };
    return (
        <Modal is_open={is_account_disabled_modal_visible} title={localize('Account disabled')} width='440px'>
            <Modal.Body>
                <Text size='xs' line_height='s'>
                    {localize('Your account has been disabled. Please contact live chat for more info.')}
                </Text>
            </Modal.Body>
            <Modal.Footer className='account-type-card__footer-button'>
                <Button secondary onClick={() => setAccountDisabledModalVisibility(false)}>
                    {localize('Close')}
                </Button>
                <Button primary onClick={() => handleLivechat()}>
                    {localize('Live Chat')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default observer(CFDAccountDisabledModal);
