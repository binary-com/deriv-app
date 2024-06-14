import React from 'react';
import classNames from 'classnames';
import { Field } from 'formik';

import { Button, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import { getErrorMessages, redirectToSignUp } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';

import SignupSeparatorContainer from '../AccountSignupModal/signup-separator-container.jsx';

import 'Sass/app/modules/account-signup.scss';

const PasswordSelectionModal = observer(
    ({
        api_error,
        errors,
        handleBlur,
        handleChange,
        isModalVisible,
        isSubmitting,
        touched,
        pw_input,
        setFieldTouched,
        updatePassword,
        values,
    }) => {
        const { ui } = useStore();
        const { is_mobile_or_tablet } = ui;

        React.useEffect(() => {
            Analytics.trackEvent('ce_virtual_signup_form', {
                action: 'password_screen_opened',
                form_name: is_mobile_or_tablet
                    ? 'virtual_signup_web_mobile_default'
                    : 'virtual_signup_web_desktop_default',
            });

            //eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <div className='account-signup__password-selection'>
                <Text
                    as='p'
                    size={is_mobile_or_tablet ? 'xs' : 's'}
                    weight='bold'
                    className='account-signup__heading'
                    align='center'
                >
                    <Localize i18n_default_text='Keep your account secure with a password' />
                </Text>
                <Field name='password'>
                    {({ field }) => (
                        <PasswordMeter
                            input={pw_input}
                            has_error={!!(touched.password && errors.password)}
                            custom_feedback_messages={getErrorMessages().password_warnings}
                        >
                            <PasswordInput
                                {...field}
                                autoComplete='new-password'
                                className='account-signup__password-field'
                                label={localize('Create a password')}
                                error={touched.password && errors.password}
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
                <SignupSeparatorContainer />
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
                            <Button
                                large
                                secondary
                                text={localize('Cancel')}
                                type='button'
                                onClick={() => isModalVisible(false)}
                            />
                            <Button
                                large
                                primary
                                text={localize('Create new account')}
                                type='button'
                                onClick={() => redirectToSignUp()}
                            />
                        </div>
                    </React.Fragment>
                ) : (
                    <div className='account-signup__footer'>
                        <Button
                            className={classNames('account-signup__btn', {
                                'account-signup__btn--disabled': !values.password || errors.password || isSubmitting,
                            })}
                            id='dt_core_account-signup-modal_submit-btn'
                            type='submit'
                            is_disabled={!values.password || !!errors.password || isSubmitting}
                            text={localize('Start trading')}
                            large
                            primary
                        />
                    </div>
                )}
            </div>
        );
    }
);

export default PasswordSelectionModal;
