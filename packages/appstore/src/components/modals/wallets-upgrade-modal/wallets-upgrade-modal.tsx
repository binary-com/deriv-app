import React from 'react';
import classNames from 'classnames';
import { Stream } from '@cloudflare/stream-react';
import { Button, Text, Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useWalletMigration } from '@deriv/hooks';
import './wallets-upgrade-modal.scss';

const WalletsUpgradeModal = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade } = traders_hub;
    const { is_mobile, is_desktop } = ui;
    const { is_eligible, startMigration } = useWalletMigration();
    const isWalletMigrationModalClosed = localStorage.getItem('is_wallet_migration_modal_closed');
    const [modalOpen, setModalOpen] = React.useState(!isWalletMigrationModalClosed);

    const closeModal = () => {
        setModalOpen(false);
        localStorage.setItem('is_wallet_migration_modal_closed', 'true');
        toggleWalletsUpgrade(false);
    };

    const handleMigration = () => {
        closeModal();
        startMigration();
    };

    return (
        <Modal
            className='wallets-upgrade-modal'
            is_open={(is_eligible && modalOpen) || is_real_wallets_upgrade_on}
            width={is_mobile ? '32.8rem' : '77.6rem'}
            title=' '
            toggleModal={closeModal}
        >
            <Modal.Body>
                <div className='wallets-upgrade-modal__content'>
                    <div className='wallets-upgrade-modal__media-container'>
                        <Stream
                            autoplay
                            className='wallets-upgrade-modal__video'
                            controls
                            letterboxColor='transparent'
                            loop
                            muted
                            preload='auto'
                            responsive={false}
                            src='25df7df0d0af48090b086cd6f103d8f3'
                            width='100%'
                        />
                    </div>
                    <div className='wallets-upgrade-modal__text'>
                        <Text align='center' size={is_mobile ? 's' : 'm'} weight='bold'>
                            <Localize i18n_default_text='Introducing Wallets' />
                        </Text>
                        <Text align='center' size={is_mobile ? 'xs' : 's'}>
                            <Localize
                                i18n_default_text='Use Wallets to manage your funds across different currencies effortlessly.'
                                components={[<br key={0} />]}
                            />
                        </Text>
                    </div>
                </div>
                <div
                    className={classNames({
                        'wallets-upgrade-modal__footer--desktop': !is_mobile,
                        'wallets-upgrade-modal__footer--mobile': is_mobile,
                    })}
                >
                    <Button large={is_desktop} onClick={handleMigration} primary>
                        <Localize i18n_default_text='Enable now' />
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default WalletsUpgradeModal;
