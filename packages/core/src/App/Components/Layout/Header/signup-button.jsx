import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '@deriv/components';
import { redirectToSignUp } from '@deriv/shared';
import { localize } from '@deriv/translations';

const SignupButton = ({ className }) => (
    <Button
        id='dt_signup_button'
        className={className}
        has_effect
        text={localize('Sign up')}
        onClick={() => redirectToSignUp()}
        primary
    />
);

SignupButton.propTypes = {
    className: PropTypes.string,
};

export { SignupButton };
