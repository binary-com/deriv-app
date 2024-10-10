import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import { redirectToSignUp, mobileOSDetectAsync, isSafari } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';

const SignupButton = ({ className }) => {
    const [trigger_os_signup] = useGrowthbookGetFeatureValue({
        featureFlag: 'trigger_os_signup',
        defaultValue: false,
    });

    const handleOutSystemsRedirection = () => {
        switch (process.env.NODE_ENV) {
            case 'production':
                return 'https://hub.deriv.com/tradershub/signup';
            case 'staging':
                return 'https://staging-hub.deriv.com/tradershub/signup';
            default:
                return 'https://dev-hub.deriv.com/tradershub/signup';
        }
    };

    const handleSignup = async () => {
        const os = await mobileOSDetectAsync();

        if (trigger_os_signup) {
            if (os === 'iOS' || isSafari()) {
                redirectToSignUp();
            } else window.open(handleOutSystemsRedirection());
        } else redirectToSignUp();
    };

    return (
        <Button
            id='dt_signup_button'
            className={className}
            has_effect
            text={localize('Sign up')}
            onClick={handleSignup}
            primary
        />
    );
};

SignupButton.propTypes = {
    className: PropTypes.string,
};

export { SignupButton };
