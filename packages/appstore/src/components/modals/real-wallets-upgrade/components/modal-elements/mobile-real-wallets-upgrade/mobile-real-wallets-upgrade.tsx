import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import { MobileDialog, ProgressBarTracker, SwipeableWrapper } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { TRealWalletsUpgradeSteps } from 'Types';
import { StepName } from 'Constants/upgrade-wallets-modal';
import WalletSteps from '../wallet_steps';
import './mobile-real-wallets-upgrade.scss';

type TMobileRealWalletsUpgradeFooter = {
    wallet_steps: ReturnType<typeof WalletSteps>;
    current_step: number;
};

const MobileRealWalletsUpgradeFooter = ({ wallet_steps, current_step }: TMobileRealWalletsUpgradeFooter) => (
    <>
        <div className='mobile-real-wallets-upgrade__footer-progress-bar-container'>
            <ProgressBarTracker
                step={current_step + 1}
                steps_list={['progress_bar_wallets_upgrade_step_one', 'progress_bar_wallets_upgrade_step_two']}
                is_transition
            />
        </div>
        {wallet_steps[current_step].footer}
    </>
);

const MobileRealWalletsUpgrade = observer(({ wallet_upgrade_steps }: TRealWalletsUpgradeSteps) => {
    const { traders_hub } = useStore();
    const { is_real_wallets_upgrade_on } = traders_hub;

    const wallet_steps = WalletSteps(wallet_upgrade_steps);
    const { current_step, handleBack, handleNext, handleClose } = wallet_upgrade_steps;

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
        <MobileDialog
            portal_element_id='modal_root'
            visible={is_real_wallets_upgrade_on}
            onClose={handleClose}
            wrapper_classname='mobile-real-wallets-upgrade'
            footer={<MobileRealWalletsUpgradeFooter wallet_steps={wallet_steps} current_step={current_step} />}
        >
            <div className='mobile-real-wallets-upgrade'>
                <SwipeableWrapper
                    onChange={(index: number) => {
                        if (typeof index !== 'number') return; // might be `undefined`
                        if (index > current_step) handleNext();
                        if (index < current_step) handleBack();
                    }}
                >
                    {wallet_steps.map(slide => (
                        <React.Fragment key={slide.name}>{slide.content}</React.Fragment>
                    ))}
                </SwipeableWrapper>
            </div>
        </MobileDialog>
    );
});

export default MobileRealWalletsUpgrade;
