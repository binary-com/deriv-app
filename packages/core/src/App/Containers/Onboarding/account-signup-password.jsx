import classNames from 'classnames';
import { Field } from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import { getErrorMessages, redirectToSignUp } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import 'Sass/app/modules/account-signup.scss';

const AccountSignupPassword = ({
    onCancel,
    touched,
    error,
    values,
    handleBlur,
    setFieldTouched,
    handleChange,
    is_dashboard,
    is_eu_resident,
    setFieldValue,
    api_error,
    isSubmitting,
}) => {
    const [pw_input, setPWInput] = React.useState('');
    const updatePassword = new_password => {
        setPWInput(new_password);
    };

    return (
        <div className='account-signup__password-selection'>
            <div className='account-signup__password-selection--main'>
                <Text as='p' weight='bold' className='account-signup__heading' align='center'>
                    <Localize i18n_default_text='Keep your account secure with a password' />
                </Text>
                <Field name='password'>
                    {({ field }) => (
                        <PasswordMeter
                            input={pw_input}
                            has_error={!!(touched && error)}
                            custom_feedback_messages={getErrorMessages().password_warnings}
                        >
                            <PasswordInput
                                {...field}
                                className='account-signup__password-field'
                                label={localize('Create a password')}
                                error={touched && error}
                                required
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={e => {
                                    const input = e.target;
                                    setFieldTouched('password', true);
                                    if (input) updatePassword(input.value);
                                    handleChange(e);
                                }}
                                input_id='dt_core_account-signup-modal_account-signup-password-field'
                            />
                        </PasswordMeter>
                    )}
                </Field>

                <Text as='p' size='xxs' className='account-signup__subtext' align='center'>
                    <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
                </Text>
                {is_eu_resident && (
                    <Field name='email_consent'>
                        {({ field }) => (
                            <Checkbox
                                {...field}
                                className='account-signup__receive-update-checkbox'
                                onChange={() => {
                                    setFieldValue('email_consent', !values.email_consent);
                                }}
                                value={values.email_consent}
                                label={localize('I want to receive updates on Deriv products, services, and events.')}
                                withTabIndex='0'
                            />
                        )}
                    </Field>
                )}
            </div>
            <div
                className={classNames('account-signup__password-selection--footer', {
                    'account-signup__password-selection--footer-has-error': api_error,
                })}
            >
                {api_error ? (
                    <React.Fragment>
                        <Text
                            as='p'
                            size='xxs'
                            color='loss-danger'
                            className='account-signup__subtext account-signup__subtext--error'
                            align='center'
                        >
                            {api_error}
                        </Text>
                        <div className='account-signup__error-wrapper'>
                            <Button secondary text={localize('Cancel')} type='button' onClick={onCancel} />
                            <Button
                                primary
                                text={localize('Create new account')}
                                type='button'
                                onClick={() => redirectToSignUp({ is_dashboard })}
                            />
                        </div>
                    </React.Fragment>
                ) : (
                    <Button
                        className={classNames('account-signup__btn', {
                            'account-signup__btn--disabled': !values.password || error || isSubmitting,
                        })}
                        id='dt_core_account-signup-modal_submit-btn'
                        type='submit'
                        is_disabled={!values.password || !!error || isSubmitting}
                        text={localize('Start trading')}
                        primary
                    />
                )}
            </div>
        </div>
    );
};

AccountSignupPassword.propTypes = {
    onCancel: PropTypes.func,
    touched: PropTypes.bool,
    error: PropTypes.string,
    values: PropTypes.object,
    handleBlur: PropTypes.func,
    setFieldTouched: PropTypes.func,
    handleChange: PropTypes.func,
    is_dashboard: PropTypes.bool,
    is_eu_resident: PropTypes.bool,
    setFieldValue: PropTypes.func,
    api_error: PropTypes.bool,
    isSubmitting: PropTypes.bool,
};

export default AccountSignupPassword;
