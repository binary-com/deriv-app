import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Button, Dialog, PasswordInput, PasswordMeter } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { validateMainPassword } from 'Utils/Validator/declarative-validation-rules';
import { redirectToLogin } from '_common/base/login';
import { WS } from 'Services/index';

const resetInitialValues = { password: '' };

class ResetPassword extends React.Component {
    onResetComplete = (error_msg, actions) => {
        actions.setSubmitting(false);
        actions.resetForm({ password: '' });
        // Error would be returned on invalid token (and the like) cases.
        // TODO: Proper error handling (currently we have no place to put the message)
        if (error_msg) {
            // eslint-disable-next-line no-console
            console.error(error_msg);
            actions.setStatus({ error_msg });
            return;
        }

        actions.setStatus({ reset_complete: true });

        this.props.logoutClient().then(() => {
            redirectToLogin();
        });
    };

    handleSubmit = (values, actions) => {
        const { verification_code } = this.props;
        const api_request = {
            reset_password: 1,
            new_password: values.password,
            verification_code,
        };

        WS.resetPassword(api_request).then(async response => {
            if (response.error) {
                this.onResetComplete(response.error.message, actions);
            } else {
                this.onResetComplete(null, actions);
            }
        });
    };

    validateReset = values => {
        const errors = validateMainPassword(values.password);

        return errors;
    };

    render() {
        return (
            <div className='reset-password'>
                <Formik
                    initialValues={resetInitialValues}
                    initialStatus={{ reset_complete: false, error_msg: '' }}
                    validate={this.validateReset}
                    onSubmit={this.handleSubmit}
                >
                    {({ handleBlur, errors, values, touched, isSubmitting, handleChange, status }) => (
                        <Form>
                            <React.Fragment>
                                {status.reset_complete ? (
                                    <div className='reset-password__password-selection'>
                                        <p className='reset-password__heading'>
                                            <Localize i18n_default_text='Your password has been changed' />
                                        </p>
                                        <p className='reset-password__subtext'>
                                            <Localize i18n_default_text='We will now redirect you to the login page.' />
                                        </p>
                                    </div>
                                ) : (
                                    <div className='reset-password__password-selection'>
                                        <p className='reset-password__heading'>
                                            <Localize i18n_default_text='Choose a new password' />
                                        </p>
                                        <fieldset className='reset-password__fieldset'>
                                            <PasswordMeter
                                                input={values.password}
                                                has_error={!!(touched.password && errors.password)}
                                            >
                                                <PasswordInput
                                                    className='reset-password__password-field'
                                                    name='password'
                                                    label={localize('Create a password')}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.password && errors.password}
                                                    value={values.password}
                                                    data-lpignore='true'
                                                    required
                                                />
                                            </PasswordMeter>
                                        </fieldset>
                                        <p className='reset-password__subtext'>
                                            {status.error_msg ? (
                                                <Localize
                                                    i18n_default_text='{{error_msg}}'
                                                    values={{ error_msg: status.error_msg }}
                                                />
                                            ) : (
                                                <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
                                            )}
                                        </p>

                                        <Button
                                            className={classNames('reset-password__btn', {
                                                'reset-password__btn--disabled':
                                                    !values.password || errors.password || isSubmitting,
                                            })}
                                            type='submit'
                                            is_disabled={!values.password || errors.password || isSubmitting}
                                            primary
                                        >
                                            <Localize i18n_default_text='Reset my password' />
                                        </Button>
                                    </div>
                                )}
                            </React.Fragment>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

ResetPassword.propTypes = {
    enableApp: PropTypes.func,
    isModalVisible: PropTypes.func,
    verification_code: PropTypes.string,
};

const ResetPasswordModal = ({
    enableApp,
    disableApp,
    is_loading,
    is_visible,
    logoutClient,
    verification_code,
    toggleResetPasswordModal,
}) => {
    return (
        <Dialog is_visible={is_visible} disableApp={disableApp} enableApp={enableApp} is_loading={is_loading}>
            <ResetPassword
                verification_code={verification_code}
                isModalVisible={toggleResetPasswordModal}
                enableApp={enableApp}
                logoutClient={logoutClient}
            />
        </Dialog>
    );
};

ResetPasswordModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    logoutClient: PropTypes.func,
    toggleResetPasswordModal: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ ui, client }) => ({
    is_visible: ui.is_reset_password_modal_visible,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    is_loading: ui.is_loading,
    logoutClient: client.logout,
    toggleResetPasswordModal: ui.toggleResetPasswordModal,
    verification_code: client.verification_code.reset_password,
}))(ResetPasswordModal);
