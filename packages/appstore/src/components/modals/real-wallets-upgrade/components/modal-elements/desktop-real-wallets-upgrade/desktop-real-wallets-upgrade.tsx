import React from 'react';
import { Modal } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { TRealWalletsUpgradeSteps } from 'Types';
import WalletSteps from '../wallet_steps';

const DesktopRealWalletsUpgrade = observer(({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const { traders_hub: is_real_wallets_upgrade_on } = useStore();

    const wallet_steps = WalletSteps(wallet_upgrade_steps);
    const { current_step, handleClose } = wallet_upgrade_steps;

    return (
        <Modal
            is_open={is_real_wallets_upgrade_on}
            toggleModal={handleClose}
            height='734px'
            width='1200px'
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
