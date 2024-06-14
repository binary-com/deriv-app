import React from 'react';
import Icon from '../icon';
import DesktopWrapper from '../desktop-wrapper';
import MobileOrTabletWrapper from '../mobile-wrapper';
import Modal from '../modal';
import Text from '../text';
import Button from '../button';
import MobileDialog from '../mobile-dialog';
import { getDefaultError } from '@deriv/shared';

const ModalContent = () => (
    <div className='unhandled-error'>
        <Icon icon='IcAccountError' size={96} />
        <Text
            className='da-icon-with-message__text'
            as='p'
            size='s'
            color='general'
            line_height='xxl'
            align='center'
            weight='bold'
        >
            {getDefaultError().header}
        </Text>
        <Text
            className='da-icon-with-message__text__desc'
            as='p'
            size='xs'
            color='general'
            line_height='xxs'
            align='center'
        >
            {getDefaultError().description}
        </Text>
        <Button onClick={() => location.reload()} has_effect primary large text={getDefaultError().cta_label} />
    </div>
);

const UnhandledErrorModal = () => {
    const [is_page_error_modal_open, setPageErrorModalOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        setPageErrorModalOpen(true);
    }, []);

    const togglePageErrorModal = () => {
        setPageErrorModalOpen(!is_page_error_modal_open);
    };

    return (
        <Modal
            has_close_icon
            width='440px'
            height='284px'
            is_open={is_page_error_modal_open}
            toggleModal={togglePageErrorModal}
        >
            <DesktopWrapper>
                <Modal.Body>
                    <ModalContent />
                </Modal.Body>
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    has_close_icon
                    visible={is_page_error_modal_open}
                    onClose={togglePageErrorModal}
                >
                    <Modal.Body>
                        <ModalContent />
                    </Modal.Body>
                </MobileDialog>
            </MobileOrTabletWrapper>
        </Modal>
    );
};

export default UnhandledErrorModal;
