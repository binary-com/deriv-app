import React from 'react';
import { Text, Button, Modal } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import WalletsImage from 'Assets/svgs/wallets';
import { useWalletMigration } from '@deriv/hooks';
import './wallets-upgrade-modal.scss';

const WalletsUpgradeModal = () => {
    const { traders_hub, ui } = useStore();
    const { toggleWalletsUpgrade } = traders_hub;
    const { is_mobile, is_desktop } = ui;
    const { is_eligible } = useWalletMigration();
    const isWalletMigrationModalClosed = localStorage.getItem('is_wallet_migration_modal_closed');
    const [modalOpen, setModalOpen] = React.useState(!isWalletMigrationModalClosed);

    const closeModal = () => {
        setModalOpen(false);
        localStorage.setItem('is_wallet_migration_modal_closed', 'true');
    };

    return (
        <Modal
            className='wallets-upgrade-modal'
            is_open={is_eligible && modalOpen}
            width='60rem'
            title=' '
            toggleModal={closeModal}
        >
            <Modal.Body>
                <div className='wallets-upgrade-modal__content'>
                    <div className='wallets-upgrade-modal__description'>
                        <Text size={is_mobile ? 's' : 'm'} weight='bold'>
                            <Localize i18n_default_text='Introducing Wallets' />
                        </Text>
                        <Text size={is_mobile ? 'xs' : 'sm'}>
                            <Localize
                                i18n_default_text='Enjoy smoother and more secure transactions in multiple currencies with Wallets – <0></0>our new and improved Cashier.'
                                components={[<br key={0} />]}
                            />
                        </Text>
                    </div>
                    <Button
                        large={is_desktop}
                        onClick={() => {
                            // TODO: Uncomment this when wallet migration modal ready
                            // toggleWalletsUpgrade(true);
                            closeModal();
                        }}
                        primary
                        text={localize('Upgrade now')}
                    />
                </div>
                <WalletsImage image='upgrade_modal' className='wallets-upgrade-modal__image' />
            </Modal.Body>
        </Modal>
    );
};

export default WalletsUpgradeModal;
