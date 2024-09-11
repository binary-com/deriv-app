import React from 'react';
import { Text, useOnClickOutside, Modal, Button } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import './wallets-migration-failed.scss';

const WalletsMigrationFailed = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_wallet_migration_failed, setWalletsMigrationFailedPopup } = traders_hub;
    const { is_mobile } = ui;

    const wallets_migration_failed_ref = React.useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setWalletsMigrationFailedPopup(false);
    };

    const handleLivechatButtonClick = () => {
        window.LiveChatWidget.call('maximize');
        setWalletsMigrationFailedPopup(false);
    };

    const validateClickOutside = (e: MouseEvent) => {
        return is_wallet_migration_failed && !wallets_migration_failed_ref?.current?.contains(e.target as Node);
    };

    useOnClickOutside(wallets_migration_failed_ref, handleClose, validateClickOutside);

    return (
        <Modal
            is_open={is_wallet_migration_failed}
            toggleModal={handleClose}
            width={is_mobile ? '32.3rem' : '44rem'}
            should_header_stick_body={false}
            has_close_icon={false}
        >
            <div ref={wallets_migration_failed_ref}>
                <Modal.Body className='wallets-migration-failed'>
                    <Text
                        as='h1'
                        size={is_mobile ? 'xs' : 's'}
                        color='prominent'
                        weight='bold'
                        className='wallets-migration-failed__title'
                    >
                        <Localize i18n_default_text='Sorry for the interruption' />
                    </Text>
                    <Text size={is_mobile ? 'xxs' : 'xs'}>
                        <Localize i18n_default_text='We’re unable to complete with the Wallet upgrade. Please try again later or contact us via live chat.' />
                    </Text>
                </Modal.Body>
                <Modal.Footer className='wallets-migration-failed__footer'>
                    <Button secondary large onClick={handleLivechatButtonClick}>
                        <Localize i18n_default_text='Go to live chat' />
                    </Button>
                    <Button primary large onClick={handleClose} classNameSpan='wallets-migration-failed__text'>
                        <Localize i18n_default_text='Back to Trader’s Hub' />
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
});

export default WalletsMigrationFailed;
