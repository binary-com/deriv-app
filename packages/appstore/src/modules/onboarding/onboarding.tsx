import React from 'react';
import { Redirect } from 'react-router-dom';
import { routes, ContentFlag } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import OnboardingSkeleton from '../../components/loader';
import TradingPlatformIcon from 'Assets/svgs/trading-platform';
import './onboarding.scss';

const Onboarding = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const { is_landing_company_loaded, is_logged_in, setPrevAccountType } = client;
    const { content_flag, is_demo_low_risk, selectAccountType, toggleIsTourOpen } = traders_hub;
    const { is_from_signup_account } = ui;

    if (is_logged_in) {
        if (!is_landing_company_loaded) {
            return <OnboardingSkeleton />;
        }
        if (is_from_signup_account && content_flag !== ContentFlag.EU_DEMO) {
            toggleIsTourOpen(true);
        }

        if (is_demo_low_risk) {
            selectAccountType('real');
            setPrevAccountType('demo');
        }

        return <Redirect to={routes.traders_hub} />;
    }

    return (
        <div className='onboarding'>
            <div className='onboarding__logo' data-testid='dt_onboarding_logo'>
                <TradingPlatformIcon icon='DerivLogo' />
            </div>
        </div>
    );
});

export default Onboarding;
