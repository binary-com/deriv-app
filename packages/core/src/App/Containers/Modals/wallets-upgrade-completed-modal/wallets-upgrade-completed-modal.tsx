import React, { useState } from 'react';
import { Button, Icon, MobileDialog, Modal, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import './wallets-upgrade-completed-modal.scss';

const WalletsUpgradeCompletedModal = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.removeItem('should_show_wallets_upgrade_completed_modal');
    };

    const Wrapper = ({ children, footer }: React.PropsWithChildren & { footer: React.ReactNode }) =>
        is_mobile ? (
            <MobileDialog
                portal_element_id='modal_root'
                visible={isOpen}
                onClose={handleClose}
                footer={footer}
                has_close_icon={false}
            >
                {children}
            </MobileDialog>
        ) : (
            <Modal is_open={isOpen} has_close_icon={false}>
                {children}
                {footer}
            </Modal>
        );

    const Footer = () => (
        <Modal.Footer has_separator>
            <Button primary large className='wallets-upgrade-completed-modal__button' onClick={handleClose}>
                <Localize i18n_default_text='Get started' />
            </Button>
        </Modal.Footer>
    );

    return (
        <Wrapper footer={<Footer />}>
            <div className='wallets-upgrade-completed-modal'>
                <Icon icon='IcWalletUpgradeCompleted' className='wallets-upgrade-completed-modal__pic' />
                <div className='wallets-upgrade-completed-modal__text-container'>
                    <Localize
                        i18n_default_text='<0>Your Wallets are ready!</0>'
                        components={[<Text key={0} align='center' size={is_mobile ? 'xsm' : 'm'} weight='bold' />]}
                    />
                    <Localize
                        i18n_default_text='<0>Explore the exciting new features that your Wallet offers.</0>'
                        components={[<Text key={0} align='center' size={is_mobile ? 'xs' : 's'} />]}
                    />
                </div>
            </div>
        </Wrapper>
    );
});

export default WalletsUpgradeCompletedModal;
