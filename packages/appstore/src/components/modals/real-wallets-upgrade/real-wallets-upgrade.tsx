import React from 'react';
import { useWalletMigration } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { DesktopRealWalletsUpgrade, MobileRealWalletsUpgrade } from './components/modal-elements';

const RealWalletsUpgrade = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_real_wallets_upgrade_on, toggleWalletsUpgrade } = traders_hub;
    const { is_mobile } = ui;

    const [current_step, setCurrentStep] = React.useState(0);
    const [is_disabled, setIsDisabled] = React.useState(false);

    React.useEffect(() => {
        if (!is_real_wallets_upgrade_on) {
            setCurrentStep(0);
            setIsDisabled(false);
        }
    }, [is_real_wallets_upgrade_on]);

    const handleNext = () => setCurrentStep(prev_step => prev_step + 1);

    const handleBack = () => setCurrentStep(prev_step => prev_step - 1);

    const handleClose = () => toggleWalletsUpgrade(false);

    const { startMigration } = useWalletMigration();

    const upgradeToWallets = () => {
        startMigration();
        toggleWalletsUpgrade(false);
    };

    const toggleCheckbox = () => {
        setIsDisabled(prevDisabled => !prevDisabled);
    };

    const wallet_upgrade_steps = {
        current_step,
        handleBack,
        handleClose,
        handleNext,
        is_disabled,
        toggleCheckbox,
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
