import React from 'react';
import { WalletsUpgradeStepOneContent, WalletsUpgradeStepOneFooter } from '../wallets-upgrade-step-one';
import { WalletsUpgradeStepTwoContent, WalletsUpgradeStepTwoFooter } from '../wallets-upgrade-step-two';
import { TWalletSteps } from 'Types';

const WalletSteps = ({
    handleBack,
    handleClose,
    handleNext,
    is_disabled,
    toggleCheckbox,
    upgradeToWallets,
}: TWalletSteps) => [
    {
        name: 'wallets_upgrade_step_one',
        content: <WalletsUpgradeStepOneContent />,
        footer: <WalletsUpgradeStepOneFooter handleClose={handleClose} handleNext={handleNext} />,
    },
    {
        name: 'wallets_upgrade_step_one',
        content: <WalletsUpgradeStepTwoContent value={is_disabled} toggleCheckbox={toggleCheckbox} />,
        footer: (
            <WalletsUpgradeStepTwoFooter
                handleBack={handleBack}
                is_disabled={is_disabled}
                upgradeToWallets={upgradeToWallets}
            />
        ),
    },
];

export default WalletSteps;
