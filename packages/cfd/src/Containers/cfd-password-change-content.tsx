import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { DesktopWrapper, Modal, Button, Icon, Text, MobileDialog, MobileOrTabletWrapper } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TCFDPasswordChangeContentProps = {
    closeModal: () => void;
    password_value: string;
};

const CFDPasswordChangeContent = observer(({ closeModal, password_value }: TCFDPasswordChangeContentProps) => {
    const { modules } = useStore();
    const { cfd } = modules;
    const { submitMt5Password, is_mt5_password_changed_modal_visible } = cfd;

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await submitMt5Password({
            password: password_value,
        });
        setIsSubmitting(false);
    };

    const password_changed_success__body = (
        <div className='cfd-password-change__password-success'>
            <Icon className='cfd-password-change__icon' icon='IcSuccessResetTradingPassword' size={128} />
            <Text as='p' weight='bold' className='cfd-password-change__heading'>
                <Localize i18n_default_text='Success' />
            </Text>
            <Text align='center' as='p' size='xs' className='cfd-password-change__subtext'>
                <Localize i18n_default_text='You have a new Deriv MT5 password to log in to your Deriv MT5 accounts on the web and mobile apps.' />
            </Text>
        </div>
    );

    const password_changed_success__footer = (
        <div className='cfd-password-change-modal-description--footer'>
            <Button
                className='cfd-password-change-modal-description--button'
                type='button'
                is_loading={isSubmitting}
                onClick={handleSubmit}
                primary
                large
            >
                <Localize i18n_default_text='Next' />
            </Button>
        </div>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='cfd-password-modal'
                    has_close_icon
                    is_open={is_mt5_password_changed_modal_visible}
                    toggleModal={closeModal}
                    should_header_stick_body
                    width='auto'
                >
                    <Modal.Body>{password_changed_success__body}</Modal.Body>
                    <Modal.Footer className='cfd-password-change__content-center'>
                        {password_changed_success__footer}
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    wrapper_classname='cfd-password-modal'
                    visible={is_mt5_password_changed_modal_visible}
                    onClose={closeModal}
                    has_full_height
                    has_close_icon={false}
                    footer={password_changed_success__footer}
                >
                    {password_changed_success__body}
                </MobileDialog>
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
});

export default CFDPasswordChangeContent;
