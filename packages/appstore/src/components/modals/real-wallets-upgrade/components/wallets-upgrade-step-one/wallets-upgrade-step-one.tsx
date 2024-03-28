import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { useStore } from '@deriv/stores';
import './wallets-upgrade-step-one.scss';

type TWalletsUpgradeStepOneFooter = {
    handleClose: VoidFunction;
    handleNext: VoidFunction;
};

const WalletsUpgradeStepOneBullets = () => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const bullets = [
        localize('Better funds segregation'),
        localize('Instant transfers between Wallets and trading accounts'),
        localize('Multiple currency support'),
    ];

    return (
        <div className='wallets-upgrade-step-one__bullet-list-container'>
            {bullets.map(bullet => (
                <div key={bullet} className='wallets-upgrade-step-one__bullet'>
                    <div className='wallets-upgrade-step-one__bullet-row'>
                        <Icon
                            icon='IcAppstoreTick'
                            className='wallets-upgrade-step-one__bullet-icon'
                            size={is_mobile ? 12 : 16}
                        />
                        <Text
                            as='p'
                            color='prominent'
                            align='center'
                            className='wallets-upgrade-step-one__bullet-text'
                            size={is_mobile ? 'xs' : 's'}
                            line_height={is_mobile ? 's' : 'm'}
                        >
                            {bullet}
                        </Text>
                    </div>
                </div>
            ))}
        </div>
    );
};
const WalletsUpgradeStepOneContent = () => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <div className='wallets-upgrade-step-one__content'>
            <div className='wallets-upgrade-step-one__image-container'>
                <Icon
                    icon='IcAppstoreWalletsUpgradeStepOne'
                    width={is_mobile ? 150 : 240}
                    height={is_mobile ? 170 : 270}
                    data_testid='dt_wallets_upgrade_step_one'
                />
            </div>
            <Text
                as='h1'
                color='prominent'
                weight='bold'
                align='center'
                size={is_mobile ? 'xsm' : 'l'}
                className='wallets-upgrade-step-one__title'
                line_height={is_mobile ? 'm' : 'xs'}
            >
                <Localize i18n_default_text='Why Wallets' />
            </Text>
            <Text
                as='p'
                color='prominent'
                size={is_mobile ? 's' : 'm'}
                align='center'
                className='wallets-upgrade-step-one__description'
                line_height='m'
            >
                <Localize i18n_default_text='Deposit, transfer, trade' />
            </Text>
            <WalletsUpgradeStepOneBullets />
        </div>
    );
};

const WalletsUpgradeStepOneFooter = ({ handleNext }: TWalletsUpgradeStepOneFooter) => {
    const { ui } = useStore();
    const { is_desktop } = ui;

    return is_desktop ? (
        <Modal.Footer className='wallets-upgrade-step-one__footer' has_separator>
            <Button primary large className='wallets-upgrade-step-one__footer-button' onClick={handleNext}>
                <Localize i18n_default_text='Next' />
            </Button>
        </Modal.Footer>
    ) : null;
};

export { WalletsUpgradeStepOneContent, WalletsUpgradeStepOneFooter };
