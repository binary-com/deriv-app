import React from 'react';
import classNames from 'classnames';
import { Formik, Form, FormikHelpers, FormikErrors } from 'formik';
import { Button, Dialog, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import {
    redirectToLogin,
    validPassword,
    validLength,
    getErrorMessages,
    WS,
    removeActionParam,
    validMT5Password,
} from '@deriv/shared';
import { getLanguage, localize, Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { TSocketError, TSocketRequest, TSocketResponse } from '@deriv/api/types';
import { useDevice } from '@deriv-com/ui';

type TResetPasswordModalValues = {
    password: string;
};

const ResetPasswordModal = observer(() => {
    const { ui, client } = useStore();
    const { logout: logoutClient, verification_code, setVerificationCode } = client;
    const {
        disableApp,
        enableApp,
        is_loading,
        is_reset_password_modal_visible: is_visible,
        toggleResetPasswordModal,
        toggleLinkExpiredModal,
    } = ui;

    const { isDesktop } = useDevice();
    const onResetComplete = (
        error: TSocketError<'reset_password'>['error'] | null,
        actions: FormikHelpers<TResetPasswordModalValues>
    ) => {
        actions.setSubmitting(false);
        const error_code = error?.code;
        // Error would be returned on invalid token (and the like) cases.
        if (error_code) {
            if (error_code === 'InvalidToken') {
                toggleResetPasswordModal(false);
                toggleLinkExpiredModal(true);
            } else {
                actions.resetForm({
                    values: {
                        password: '',
                    },
                });
                actions.setStatus({ error_msg: error?.message });
            }
            return;
        }

        actions.setStatus({ reset_complete: true });
        logoutClient().then(() => {
            redirectToLogin(false, getLanguage(), false);
        });
    };

    const handleSubmit = (values: TResetPasswordModalValues, actions: FormikHelpers<TResetPasswordModalValues>) => {
        const api_request: TSocketRequest<'reset_password'> = {
            reset_password: 1,
            new_password: values.password,
            verification_code: verification_code.reset_password,
        };
        WS.resetPassword(api_request).then(
            async (response: TSocketResponse<'reset_password'> & TSocketError<'reset_password'>) => {
                if (response.error) {
                    onResetComplete(response?.error, actions);
                } else {
                    onResetComplete(null, actions);
                }
                setVerificationCode('', 'reset_password');
            }
        );
    };

    const validateReset = (values: TResetPasswordModalValues) => {
        const errors: FormikErrors<TResetPasswordModalValues> = {};

        if (
            !validLength(values.password, {
                min: 8,
                max: 25,
            })
        ) {
            errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                min_number: 8,
                max_number: 25,
            });
        } else if (!validMT5Password(values.password)) {
            errors.password = getErrorMessages().special_characters();
        } else if (!validPassword(values.password)) {
            errors.password = getErrorMessages().password();
        }
        return errors;
    };

    const reset_initial_values: TResetPasswordModalValues = { password: '' };

    const closeResetPasswordModal = () => {
        toggleResetPasswordModal(false);
        removeActionParam('reset_password');
    };

    return (
        <Formik
            initialValues={reset_initial_values}
            initialStatus={{ reset_complete: false, error_msg: '' }}
            validate={validateReset}
            onSubmit={handleSubmit}
        >
            {({ handleBlur, errors, values, touched, isSubmitting, handleChange, status }) => (
                <Dialog
                    className='reset-password__spaced-container'
                    is_visible={is_visible}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_loading={is_loading}
                    dismissable={status.error_msg}
                    onConfirm={closeResetPasswordModal}
                    title={localize('Reset your password')}
                    has_close_icon
                    is_closed_on_cancel={false}
                >
                    <div className='reset-password'>
                        <Form>
                            {status.reset_complete ? (
                                <div className='reset-password__password-set'>
                                    <Text align='center' as='p' weight='bold' className='reset-password__heading'>
                                        <Localize i18n_default_text='Your password has been changed' />
                                    </Text>
                                    <Text align='center' as='p' size='xxs' className='reset-password__subtext'>
                                        <Localize i18n_default_text='We will now redirect you to the login page.' />
                                    </Text>
                                </div>
                            ) : (
                                <div className='reset-password__password-selection'>
                                    <fieldset className='reset-password__fieldset'>
                                        <PasswordMeter
                                            input={values.password}
                                            has_error={!!((touched.password && errors.password) || status.error_msg)}
                                            custom_feedback_messages={
                                                getErrorMessages().password_warnings as unknown as Record<
                                                    string,
                                                    string
                                                >
                                            }
                                        >
                                            <PasswordInput
                                                autoComplete='new-password'
                                                className='reset-password__password-field'
                                                name='password'
                                                label={localize('Create a password')}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={(touched.password && errors.password) || status.error_msg}
                                                value={values.password}
                                                data-lpignore='true'
                                                required
                                            />
                                        </PasswordMeter>
                                    </fieldset>
                                    <Text align='center' as='p' size='xxs' className='reset-password__subtext'>
                                        {status.error_msg ? (
                                            <Localize
                                                i18n_default_text='{{error_msg}}'
                                                values={{ error_msg: status.error_msg }}
                                            />
                                        ) : (
                                            <Localize i18n_default_text='Strong passwords contain at least 8 characters. combine uppercase and lowercase letters, numbers, and symbols.' />
                                        )}
                                    </Text>
                                    {isDesktop && <div className='reset-password__divider' />}
                                    <Button
                                        className={classNames('reset-password__btn', {
                                            'reset-password__btn--disabled':
                                                !values.password || errors.password || isSubmitting,
                                        })}
                                        type='submit'
                                        is_disabled={!values.password || !!errors.password || isSubmitting}
                                        primary
                                    >
                                        <Localize i18n_default_text='Reset my password' />
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </div>
                </Dialog>
            )}
        </Formik>
    );
});

export default ResetPasswordModal;
