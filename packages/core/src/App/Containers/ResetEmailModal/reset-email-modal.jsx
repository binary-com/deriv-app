import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { Button, Dialog, Text, Input } from '@deriv/components';
import { validEmail, getErrorMessages } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { ConfirmEmailModal } from './confirm-email-modal.jsx';

const ResetEmailModal = ({
    disableApp,
    email,
    enableApp,
    is_loading,
    is_visible,
    verification_code,
    toggleResetEmailModal,
}) => {
    const [is_confirm_email_modal_open, setIsConfirmResetEmailModal] = React.useState(false);
    const [email_error_msg, setEmailErrorMsg] = React.useState(null);
    const [new_Email, setNewEmail] = React.useState(null);
    const [has_error, setHasError] = React.useState(false);

    const handleSubmit = values => {
        setNewEmail(values.email);
        setIsConfirmResetEmailModal(true);
    };

    const validateReset = values => {
        const errors = {};

        if (!values.email) {
            errors.email = localize('The email input should not be empty.');
        } else if (!validEmail(values.email)) {
            errors.email = getErrorMessages().email();
        }

        return errors;
    };

    const reset_initial_values = { email: '' };

    if (is_confirm_email_modal_open) {
        return (
            <ConfirmEmailModal
                is_open={is_confirm_email_modal_open}
                verification_code={verification_code}
                onClose={() => setIsConfirmResetEmailModal(false)}
                new_Email={new_Email}
                prev_Email={email}
                setEmailError={setHasError}
                setErrorMessage={setEmailErrorMsg}
            />
        );
    }

    return (
        <Formik
            initialValues={reset_initial_values}
            initialStatus={{ reset_complete: false, error_msg: '' }}
            validate={validateReset}
            onSubmit={handleSubmit}
        >
            {({ errors, values, touched, isSubmitting, handleChange, setFieldTouched, status }) => (
                <Dialog
                    is_visible={is_visible}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_loading={is_loading}
                    dismissable={status.error_msg}
                    onConfirm={() => toggleResetEmailModal(false)}
                    is_closed_on_cancel={false}
                >
                    <div className='reset-email'>
                        <Form>
                            <React.Fragment>
                                {status.reset_complete ? (
                                    <div className='reset-email__email-selection'>
                                        <Text as='p' weight='bold' className='reset-email__heading'>
                                            <Localize i18n_default_text='Your password has been changed' />
                                        </Text>
                                        <Text align='center' as='p' size='xxs' className='reset-email__subtext'>
                                            <Localize i18n_default_text='We will now redirect you to the login page.' />
                                        </Text>
                                    </div>
                                ) : (
                                    <div className='reset-email__email-selection'>
                                        <Text as='p' align='left' weight='bold' className='reset-email__heading'>
                                            <Localize i18n_default_text='Enter a new email address' />
                                        </Text>
                                        <Text
                                            as='p'
                                            color='prominent'
                                            size='xs'
                                            align='left'
                                            className='reset-email__descripton'
                                        >
                                            <Localize i18n_default_text="You'll log in to your Deriv account with this email address." />
                                        </Text>
                                        <fieldset className='reset-email__fieldset'>
                                            <Input
                                                data-lpignore='true'
                                                type='text'
                                                name='email'
                                                id={'email'}
                                                placeholder={localize('Email address')}
                                                value={values.email}
                                                required
                                                disabled={false}
                                                error={(touched.email && errors.email) || status.error_msg}
                                                onChange={e => {
                                                    setFieldTouched('email', true);
                                                    handleChange(e);
                                                }}
                                            />
                                        </fieldset>
                                        <Text align='center' as='p' size='xxs' className='reset-email__subtext'>
                                            {has_error ? (
                                                <Localize
                                                    i18n_default_text='{{error_msg}}'
                                                    values={{ error_msg: email_error_msg }}
                                                />
                                            ) : null}
                                        </Text>
                                        <Button
                                            className={classNames('reset-email__btn', {
                                                'reset-email__btn--disabled':
                                                    !values.email || errors.email || isSubmitting,
                                            })}
                                            type='submit'
                                            is_disabled={!values.email || !!errors.email || isSubmitting}
                                            primary
                                            large
                                        >
                                            <Localize i18n_default_text='Confirm' />
                                        </Button>
                                    </div>
                                )}
                            </React.Fragment>
                        </Form>
                    </div>
                </Dialog>
            )}
        </Formik>
    );
};

ResetEmailModal.propTypes = {
    disableApp: PropTypes.func,
    email: PropTypes.string,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    verification_code: PropTypes.string,
    toggleResetEmailModal: PropTypes.func,
};

export default connect(({ ui, client }) => ({
    disableApp: ui.disableApp,
    email: client.email,
    enableApp: ui.enableApp,
    is_loading: ui.is_loading,
    is_visible: ui.is_reset_email_modal_visible,
    toggleResetEmailModal: ui.toggleResetEmailModal,
    verification_code: client.verification_code.request_email,
}))(ResetEmailModal);
