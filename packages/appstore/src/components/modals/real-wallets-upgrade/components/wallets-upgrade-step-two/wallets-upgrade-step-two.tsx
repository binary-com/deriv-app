import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import './wallets-upgrade-step-two.scss';

type TWalletsUpgradeStepTwoFooter = {
    handleBack: VoidFunction;
    is_migrating: boolean;
    upgradeToWallets: (value: boolean) => void;
};

const WalletsUpgradeStepTwoContent = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <div className='wallets-upgrade-step-two__content'>
            <Icon
                icon='IcAppstoreWalletsUpgradeStepTwo'
                width={is_mobile ? 150 : 240}
                height={is_mobile ? 170 : 270}
                className='wallets-upgrade-step-two__image'
                data_testid='dt_wallets_upgrade_step_two'
            />
            <div className='wallets-upgrade-step-two__text'>
                <Text size={is_mobile ? 'xsm' : 'l'} align='center' weight='bold' line_height={is_mobile ? 'm' : 'xs'}>
                    <Localize i18n_default_text='Ready to enable Wallets' />
                </Text>
                <div className='wallets-upgrade-step-two__description'>
                    <Text size={is_mobile ? 'xs' : 's'} align='center' line_height='m'>
                        <Localize i18n_default_text='Wallets will become your dedicated fund management tool, allowing you to transfer funds between Wallets and trading accounts instantly.' />
                    </Text>
                </div>
            </div>
            <div className='wallets-upgrade-step-two__info-section'>
                <Icon className='wallets-upgrade-step-two__info-section-icon' icon='ic-info-blue' size={16} />
                <Text size={is_mobile ? 'xxs' : 'xs'} line_height='m'>
                    <Localize i18n_default_text='Your open trading positions will not be affected while we are setting up your wallets.' />
                </Text>
            </div>
        </div>
    );
});

const WalletsUpgradeStepTwoFooter = ({ handleBack, is_migrating, upgradeToWallets }: TWalletsUpgradeStepTwoFooter) => {
    const { ui } = useStore();
    const { is_desktop } = ui;

    return (
        <Modal.Footer className='wallets-upgrade-step-two__footer' has_separator>
            {is_desktop && (
                <Button secondary large className='wallets-upgrade-step-two__footer-button' onClick={handleBack}>
                    <Localize i18n_default_text='Back' />
                </Button>
            )}
            <Button
                primary
                large
                className='wallets-upgrade-step-two__footer-button'
                disabled={is_migrating}
                onClick={upgradeToWallets}
                is_loading={is_migrating}
            >
                <Localize i18n_default_text='Enable' />
            </Button>
        </Modal.Footer>
    );
};

export { WalletsUpgradeStepTwoContent, WalletsUpgradeStepTwoFooter };
