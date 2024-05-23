import React from 'react';
import { Modal } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { TRealWalletsUpgradeSteps } from 'Types';
import WalletSteps from '../wallet_steps';
import './desktop-real-wallets-upgrade.scss';

const DesktopRealWalletsUpgrade = observer(({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const { traders_hub } = useStore();
    const { is_real_wallets_upgrade_on } = traders_hub;

    const wallet_steps = WalletSteps(wallet_upgrade_steps);
    const { current_step, handleClose } = wallet_upgrade_steps;

    return (
        <Modal
            className='desktop-real-wallets-upgrade'
            is_open={is_real_wallets_upgrade_on}
            toggleModal={handleClose}
            height='734px'
            should_header_stick_body={false}
            has_close_icon
            title=' '
        >
            <Modal.Body>{wallet_steps[current_step].content}</Modal.Body>
            {wallet_steps[current_step].footer}
        </Modal>
    );
});

export default DesktopRealWalletsUpgrade;
