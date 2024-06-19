import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { Modal } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { TRealWalletsUpgradeSteps } from 'Types';
import { StepName } from 'Constants/upgrade-wallets-modal';
import WalletSteps from '../wallet_steps';
import './desktop-real-wallets-upgrade.scss';

const DesktopRealWalletsUpgrade = observer(({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const { traders_hub } = useStore();
    const { is_real_wallets_upgrade_on } = traders_hub;

    const wallet_steps = WalletSteps(wallet_upgrade_steps);
    const { current_step, handleClose } = wallet_upgrade_steps;

    React.useEffect(() => {
        if (is_real_wallets_upgrade_on) {
            Analytics.trackEvent('ce_wallets_migration_form', {
                action: 'open',
                form_name: 'ce_wallets_migration_form',
                step_num: current_step,
                step_codename: StepName[current_step],
            });
        }
        // remove `current_step` from deps array, because we want to track open event only once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_real_wallets_upgrade_on]);

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
