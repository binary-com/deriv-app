import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { DesktopRealWalletsUpgrade, MobileRealWalletsUpgrade } from './components/modal-elements';
import { useWalletMigration } from '@deriv/hooks';

const RealWalletsUpgrade = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade } = traders_hub;
    const { is_mobile } = ui;
    const { startMigration, is_in_progress, is_ineligible, is_migrated, is_migrating } = useWalletMigration();

    const [current_step, setCurrentStep] = React.useState(0);

    React.useEffect(() => {
        if (is_migrating || is_in_progress || is_ineligible || is_migrated) {
            toggleWalletsUpgrade(false);
        }
    }, [is_in_progress, is_ineligible, is_migrated, is_migrating, toggleWalletsUpgrade]);

    React.useEffect(() => {
        if (!is_real_wallets_upgrade_on) {
            setCurrentStep(0);
        }
    }, [is_real_wallets_upgrade_on]);

    const handleNext = () => setCurrentStep(prev_step => prev_step + 1);

    const handleBack = () => setCurrentStep(prev_step => prev_step - 1);

    const handleClose = () => toggleWalletsUpgrade(false);

    const upgradeToWallets = () => {
        startMigration();
    };

    const wallet_upgrade_steps = {
        current_step,
        handleBack,
        handleClose,
        handleNext,
        is_migrating,
        upgradeToWallets,
    };

    return (
        <React.Fragment>
            {is_mobile ? (
                <MobileRealWalletsUpgrade wallet_upgrade_steps={wallet_upgrade_steps} />
            ) : (
                <DesktopRealWalletsUpgrade wallet_upgrade_steps={wallet_upgrade_steps} />
            )}
        </React.Fragment>
    );
});

export default RealWalletsUpgrade;
