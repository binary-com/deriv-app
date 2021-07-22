import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Formik, Form } from 'formik';
import { useHistory } from 'react-router-dom';
import { Button, Dialog, Icon, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import { getErrorMessages, validPassword, validLength, WS, getCFDPlatformLabel } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';

const ResetTradingPassword = ({ setDialogTitleFunc, toggleResetTradingPasswordModal, verification_code, platform }) => {
    const handleSubmit = (values, actions) => {
        actions.setSubmitting(true);

        const params = {
            new_password: values.password,
            verification_code,
            platform,
        };

        WS.tradingPlatformPasswordReset(params).then(async response => {
            if (response.error) {
                actions.setStatus({ error_msg: response.error.message, error_code: response.error.code });
                setDialogTitleFunc(true);
            } else {
                actions.resetForm({ password: '' });
                actions.setStatus({ reset_complete: true });
            }
            actions.setSubmitting(false);
        });
    };

    const validateReset = values => {
        const errors = {};

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
        } else if (!validPassword(values.password)) {
            errors.password = getErrorMessages().password();
        }

        return errors;
    };

    const reset_initial_values = { password: '' };

    return (
        <div className='reset-trading-password'>
            <Formik
                initialValues={reset_initial_values}
                initialStatus={{ reset_complete: false, error_msg: '', error_code: '' }}
                validate={validateReset}
                onSubmit={handleSubmit}
            >
                {({ handleBlur, errors, values, touched, isSubmitting, setFieldTouched, handleChange, status }) => (
                    <Form>
                        <React.Fragment>
                            {status.error_msg && (
                                <div className='reset-trading-password__error'>
                                    <Icon icon='IcMt5Expired' size={128} />
                                    <Text
                                        as='p'
                                        size='xs'
                                        weight='bold'
                                        align='center'
                                        className='reset-trading-password__lead'
                                    >
                                        {status.error_msg}
                                    </Text>
                                    {status.error_code === 'InvalidToken' && (
                                        <Text
                                            as='p'
                                            color='prominent'
                                            size='xs'
                                            align='center'
                                            className='reset-trading-password__description--is-centered'
                                        >
                                            <Localize i18n_default_text='Please request a new password and check your email for the new token.' />
                                        </Text>
                                    )}
                                    <Button
                                        className='reset-trading-password__confirm-button'
                                        primary
                                        large
                                        onClick={() => toggleResetTradingPasswordModal(false)}
                                    >
                                        <Localize i18n_default_text='Ok' />
                                    </Button>
                                </div>
                            )}
                            {status.reset_complete && (
                                <div className='reset-trading-password__password-success'>
                                    <Icon
                                        className='reset-trading-password__icon'
                                        icon='IcSuccessResetTradingPassword'
                                        size={128}
                                    />
                                    <Text as='p' weight='bold' className='reset-trading-password__heading'>
                                        <Localize i18n_default_text='Success' />
                                    </Text>
                                    <Text align='center' as='p' size='xs' className='reset-trading-password__subtext'>
                                        {localize(
                                            'You have a new {{platform}} password to log in to your {{platform}} accounts on the web and mobile apps.',
                                            {
                                                platform: getCFDPlatformLabel(platform),
                                            }
                                        )}
                                    </Text>
                                    <Button
                                        type='button'
                                        onClick={() => toggleResetTradingPasswordModal(false)}
                                        primary
                                        large
                                    >
                                        <Localize i18n_default_text='Done' />
                                    </Button>
                                </div>
                            )}
                            {!status.error_msg && !status.reset_complete && (
                                <div className='reset-trading-password__set-password'>
                                    <Text as='p' weight='bold' className='reset-trading-password__heading'>
                                        <Localize
                                            i18n_default_text='Create a new {{platform}} password'
                                            values={{
                                                platform: getCFDPlatformLabel(platform),
                                            }}
                                        />
                                    </Text>
                                    <fieldset className='reset-trading-password__input-field'>
                                        <PasswordMeter
                                            input={values.password}
                                            has_error={!!(touched.password && errors.password)}
                                            custom_feedback_messages={getErrorMessages().password_warnings}
                                        >
                                            <PasswordInput
                                                autoComplete='new-password'
                                                className='reset-trading-password__password-field'
                                                name='password'
                                                label={localize('{{platform}} password', {
                                                    platform: getCFDPlatformLabel(platform),
                                                })}
                                                onChange={e => {
                                                    setFieldTouched('password', true);
                                                    handleChange(e);
                                                }}
                                                onBlur={handleBlur}
                                                error={touched.password && errors.password}
                                                value={values.password}
                                                data-lpignore='true'
                                                required
                                            />
                                        </PasswordMeter>
                                    </fieldset>
                                    <Text as='p' size='xs' className='reset-trading-password__hint'>
                                        {status.error_msg ? (
                                            <Localize
                                                i18n_default_text='{{error_msg}}'
                                                values={{ error_msg: status.error_msg }}
                                            />
                                        ) : (
                                            <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
                                        )}
                                    </Text>
                                    <Button
                                        className={classNames('reset-trading-password__btn', {
                                            'reset-trading-password__btn--disabled':
                                                !values.password || errors.password || isSubmitting,
                                        })}
                                        type='submit'
                                        is_disabled={!values.password || !!errors.password || isSubmitting}
                                        primary
                                        large
                                    >
                                        <Localize i18n_default_text='Confirm' />
                                    </Button>
                                </div>
                            )}
                        </React.Fragment>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

ResetTradingPassword.propTypes = {
    is_dxtrade_allowed: PropTypes.bool,
    setDialogTitleFunc: PropTypes.func,
    toggleResetTradingPasswordModal: PropTypes.func,
    verification_code: PropTypes.string,
    platform: PropTypes.string,
};

const ResetTradingPasswordModal = ({
    disableApp,
    enableApp,
    is_loading,
    is_visible,
    toggleResetTradingPasswordModal,
    verification_code,
    platform,
}) => {
    const [dialog_title, setDialogTitle] = React.useState('');
    const history = useHistory();
    React.useEffect(() => {
        history.replace({
            search: '',
        });
    }, [history]);

    const setDialogTitleFunc = is_invalid_token => {
        setDialogTitle(is_invalid_token ? localize('Reset trading password') : '');
    };

    return (
        <Dialog
            className='reset-trading-password__dialog'
            disableApp={disableApp}
            enableApp={enableApp}
            has_close_icon={!!dialog_title}
            is_loading={is_loading}
            is_visible={is_visible}
            onConfirm={() => toggleResetTradingPasswordModal(false)}
            title={dialog_title}
        >
            <ResetTradingPassword
                toggleResetTradingPasswordModal={toggleResetTradingPasswordModal}
                verification_code={verification_code}
                setDialogTitleFunc={setDialogTitleFunc}
                platform={platform}
            />
        </Dialog>
    );
};

ResetTradingPasswordModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    toggleResetTradingPasswordModal: PropTypes.func,
    verification_code: PropTypes.string,
    platform: PropTypes.string,
};

export default ResetTradingPasswordModal;
