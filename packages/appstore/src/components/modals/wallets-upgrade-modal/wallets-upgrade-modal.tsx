import React from 'react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import { useWalletMigration } from '@deriv/hooks';
import { Button, Icon, Text, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import './wallets-upgrade-modal.scss';

const MODAL_TRANSITION_TIMEOUT_MS = 250; // matching the default one

const trackAnalyticsEvent = (
    action: TEvents['ce_tradershub_popup']['action'],
    account_mode: TEvents['ce_tradershub_popup']['account_mode']
) => {
    Analytics.trackEvent('ce_tradershub_popup', {
        action,
        form_name: 'ce_tradershub_popup',
        account_mode,
        popup_name: 'wallets',
        popup_type: 'with_cta',
    });
};

const WalletsUpgradeModal = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_demo, toggleWalletsUpgrade } = traders_hub;
    const { is_mobile, is_desktop } = ui;
    const { is_eligible } = useWalletMigration();
    const account_mode = is_demo ? 'demo' : 'real';
    const isWalletMigrationModalClosed = localStorage.getItem('is_wallet_migration_modal_closed');
    const [modalOpen, setModalOpen] = React.useState(!isWalletMigrationModalClosed);

    React.useEffect(() => {
        trackAnalyticsEvent('open', account_mode);
    }, [account_mode]);

    const closeModal = () => {
        setModalOpen(false);
        localStorage.setItem('is_wallet_migration_modal_closed', 'true');
    };

    const onWalletsUpgradeHandler = () => {
        closeModal();
        // let this modal close before opening the next one
        setTimeout(() => {
            toggleWalletsUpgrade(true);
            trackAnalyticsEvent('click_cta', account_mode);
        }, MODAL_TRANSITION_TIMEOUT_MS);
    };

    const onToggleModalHandler = () => {
        closeModal();
        trackAnalyticsEvent('close', account_mode);
    };

    return (
        <Modal
            className='wallets-upgrade-modal'
            is_open={is_eligible && modalOpen}
            width='60rem'
            title=' '
            toggleModal={onToggleModalHandler}
            transition_timeout={MODAL_TRANSITION_TIMEOUT_MS}
        >
            <Modal.Body>
                <div className='wallets-upgrade-modal__content'>
                    <Icon
                        icon={`IcAppstoreWalletsUpgradeCoins${is_mobile ? 'Horizontal' : ''}`}
                        width={is_mobile ? 190 : 300}
                        height={is_mobile ? 80 : 300}
                        className='wallets-upgrade-modal__image'
                        data_testid={`dt_wallets_upgrade_coins${is_mobile ? '_horizontal' : ''}`}
                    />
                    <div className='wallets-upgrade-modal__description'>
                        <Text align={is_mobile ? 'center' : 'left'} size={is_mobile ? 's' : 'm'} weight='bold'>
                            <Localize i18n_default_text='Introducing Wallets' />
                        </Text>
                        <Text align={is_mobile ? 'center' : 'left'} size={is_mobile ? 'xs' : 's'}>
                            <Localize
                                i18n_default_text='Enjoy seamless transactions across multiple currencies and an intuitive user interface with funds segregation.'
                                components={[<br key={0} />]}
                            />
                        </Text>
                    </div>
                    <Button
                        large={is_desktop}
                        onClick={onWalletsUpgradeHandler}
                        primary
                        text={localize('Enable now')}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default WalletsUpgradeModal;
