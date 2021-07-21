import React from 'react';
import { routes } from '@deriv/shared';
import { connect } from 'Stores/connect';
import Platforms from './cfds-platforms.jsx';
import AccountSignup from './account-signup.jsx';
import Welcome from './welcome.jsx';

const Onboarding = ({
    should_show_cr_onboarding,
    is_logged_in,
    history,
    is_landing_company_loaded,
    verification_code,
}) => {
    const [step, setStep] = React.useState('signup');

    React.useEffect(() => {
        if (is_logged_in && is_landing_company_loaded && !should_show_cr_onboarding) {
            history.push({
                pathname: routes.root,
            });
        }
    }, [is_logged_in, should_show_cr_onboarding, is_landing_company_loaded, history]);

    React.useEffect(() => {
        if (!verification_code) {
            history.push({
                pathname: routes.root,
            });
        }
    }, [verification_code, history]);

    return (
        <>
            {step === 'signup' && <AccountSignup onNext={() => setStep('welcome')} />}
            {step === 'welcome' && should_show_cr_onboarding && <Welcome onNext={() => setStep('platforms')} />}
            {step === 'platforms' && <Platforms />}
        </>
    );
};

export default connect(({ client }) => ({
    should_show_cr_onboarding: client.should_show_cr_onboarding,
    is_logged_in: client.is_logged_in,
    is_landing_company_loaded: client.is_landing_company_loaded,
    verification_code: client.verification_code.signup,
}))(Onboarding);
