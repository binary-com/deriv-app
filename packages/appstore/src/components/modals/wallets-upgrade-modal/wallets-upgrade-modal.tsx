import React from 'react';
import { Text, Button, Modal } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import WalletsImage from 'Assets/svgs/wallets';
import './wallets-upgrade-modal.scss';
import { useWalletMigration } from '@deriv/api';

const WalletsUpgradeModal = () => {
    const { traders_hub, ui } = useStore();
    const { toggleWalletsUpgrade } = traders_hub;
    const { is_mobile, is_desktop } = ui;
    const { is_eligible } = useWalletMigration();
    const isWalletMigrationModalClosed = sessionStorage.getItem('is_wallet_migration_modal_closed');
    const [modalOpen, setModalOpen] = React.useState(!isWalletMigrationModalClosed);

    const closeModal = () => {
        setModalOpen(false);
        sessionStorage.setItem('is_wallet_migration_modal_closed', 'true');
    };

    const image = is_mobile ? 'upgrade_mobile' : 'upgrade_modal_desktop';

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
                        <Text size={is_mobile ? 's' : 'm'}>
                            <Localize
                                i18n_default_text='Enjoy smoother and more secure transactions in multiple currencies with Wallets – <1></1>our new and improved Cashier.'
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
                <WalletsImage image={image} className='wallets-upgrade-modal__image' />
            </Modal.Body>
        </Modal>
    );
};

export default WalletsUpgradeModal;
