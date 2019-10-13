import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import { Button }     from 'deriv-components';
import { goToSignUp } from '_common/base/login';
import { localize }   from 'App/i18n';

const SignupButton = ({ className }) => (
    <Button
        id='dt_signup_button'
        className={classNames(className, 'btn--primary--default')}
        has_effect
        text={localize('Sign up')}
        onClick={goToSignUp}
    />
);

SignupButton.propTypes = {
    className: PropTypes.string,
};

export { SignupButton };
