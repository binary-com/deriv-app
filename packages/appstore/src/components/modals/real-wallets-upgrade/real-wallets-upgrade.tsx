import React from 'react';
import { Analytics, TEvents } from '@deriv-com/analytics';
import { observer, useStore } from '@deriv/stores';
import { DesktopRealWalletsUpgrade, MobileRealWalletsUpgrade } from './components/modal-elements';
import { useWalletMigration } from '@deriv/hooks';
import { StepName } from 'Constants/upgrade-wallets-modal';

const trackAnalyticsEvent = (action: TEvents['ce_wallets_migration_form']['action'], step_num: number) => {
    Analytics.trackEvent('ce_wallets_migration_form', {
        action,
        form_name: 'ce_wallets_migration_form',
        step_num,
        step_codename: StepName[step_num],
    });
};

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

    const handleNext = () => {
        setCurrentStep(prev_step => prev_step + 1);
        trackAnalyticsEvent('step_passed', current_step);
    };

    const handleBack = () => {
        setCurrentStep(prev_step => prev_step - 1);
        trackAnalyticsEvent('step_back', current_step);
    };

    const handleClose = () => {
        toggleWalletsUpgrade(false);
        trackAnalyticsEvent('close', current_step);
    };

    const upgradeToWallets = () => {
        startMigration();
        trackAnalyticsEvent('step_passed', current_step);
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
