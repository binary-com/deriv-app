import React from 'react';
import { Modal, DesktopWrapper, MobileOrTabletWrapper } from '@deriv/components';
import { withRouter } from 'react-router';
import './warning-scam-message-modal.scss';
import WarningScamMessageModal from './warning-scam-message-modal';
import { observer, useStore } from '@deriv/stores';

const WarningScamMessage = observer(() => {
    const { ui } = useStore();
    const { is_warning_scam_message_modal_visible, setScamMessageLocalStorage } = ui;
    const [is_message_read, setIsMessageRead] = React.useState(false);
    const toggleModal = () => false;

    const acknowledgeMessage = () => setIsMessageRead(!is_message_read);

    /* Check whether the account is logged_in, and client from country 'br' = Brazil, and have not yet read the scam message warning pop up */
    if (is_warning_scam_message_modal_visible) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <Modal
                        id='warning_scam_message_modal'
                        className='warning-scam-message-modal'
                        is_open={is_warning_scam_message_modal_visible}
                        small
                        toggleModal={toggleModal}
                    >
                        <WarningScamMessageModal
                            acknowledgeMessage={acknowledgeMessage}
                            setLocalStorage={setScamMessageLocalStorage}
                            is_message_read={!is_message_read}
                        />
                    </Modal>
                </DesktopWrapper>
                <MobileOrTabletWrapper>
                    <Modal
                        id='warning_scam_message'
                        className='warning-scam-message'
                        is_open={is_warning_scam_message_modal_visible}
                        small
                        toggleModal={toggleModal}
                    >
                        <WarningScamMessageModal
                            acknowledgeMessage={acknowledgeMessage}
                            setLocalStorage={setScamMessageLocalStorage}
                            is_message_read={!is_message_read}
                        />
                    </Modal>
                </MobileOrTabletWrapper>
            </React.Fragment>
        );
    }
    return null;
});

export default withRouter(WarningScamMessage);
