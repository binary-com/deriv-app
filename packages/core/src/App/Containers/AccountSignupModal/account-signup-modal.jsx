import classNames from 'classnames';
import { Field, Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dialog, Loading, PasswordInput, PasswordMeter } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getLocation } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { validLength, validPassword, getPreBuildDVRs } from 'Utils/Validator/declarative-validation-rules';
import { WS } from 'Services';
import { website_name } from 'App/Constants/app-config';
import { redirectToSignUp } from '_common/base/login';
import ResidenceForm from '../SetResidenceModal/set-residence-form.jsx';
import 'Sass/app/modules/account-signup.scss';

const AccountSignup = ({ ...props }) => {
    const [api_error, setApiError] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const [country, setCountry] = React.useState('');
    const [pw_input, setPWInput] = React.useState('');
    const [has_valid_residence, setHasValidResidence] = React.useState(false);

    const { clients_country, enableApp, fetchResidenceList, isModalVisible, onSignup, residence_list } = props;

    React.useEffect(() => {
        WS.wait('website_status').then(async () => {
            await fetchResidenceList();
            if (clients_country) {
                setCountry(getLocation(residence_list, clients_country, 'text'));
            }
            setIsLoading(false);
        });
    }, [clients_country, fetchResidenceList, residence_list]);

    const updatePassword = string => {
        setPWInput(string);
    };

    const onResidenceSelection = React.useCallback(() => {
        setHasValidResidence(true);
    }, [setHasValidResidence]);

    const onSignupComplete = React.useCallback(
        error => {
            if (error) {
                setApiError(error);
            } else {
                isModalVisible(false);
                enableApp();
            }
        },
        [enableApp, isModalVisible]
    );

    const validateSignup = (values, list) => {
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
            errors.password = getPreBuildDVRs().password.message;
        }

        if (!values.residence) {
            errors.residence = true;
        } else {
            const index_of_selection = list.findIndex(
                item => item.text.toLowerCase() === values.residence.toLowerCase()
            );

            if (index_of_selection === -1 || list[index_of_selection].disabled === 'DISABLED') {
                errors.residence = localize('Unfortunately, {{website_name}} is not available in your country.', {
                    website_name,
                });
            }
        }
        return errors;
    };

    const onSignupPassthrough = React.useCallback(
        values => {
            const index_of_selection = residence_list.findIndex(
                item => item.text.toLowerCase() === values.residence.toLowerCase()
            );
            const modded_values = { ...values, residence: residence_list[index_of_selection].value };
            onSignup(modded_values, onSignupComplete);
        },
        [residence_list, onSignup, onSignupComplete]
    );

    return (
        <div className='account-signup'>
            {is_loading ? (
                <Loading is_fullscreen={false} />
            ) : (
                <Formik
                    initialValues={{ password: '', residence: '' }}
                    validate={values => validateSignup(values, residence_list)}
                    onSubmit={onSignupPassthrough}
                >
                    {({
                        isSubmitting,
                        handleBlur,
                        errors,
                        handleChange,
                        values,
                        setFieldValue,
                        setFieldTouched,
                        touched,
                    }) => (
                        <Form>
                            <React.Fragment>
                                {!has_valid_residence ? (
                                    <ResidenceForm
                                        header_text={localize('Thanks for verifying your email')}
                                        class_prefix='account-signup'
                                        errors={errors}
                                        touched={touched}
                                        setFieldTouched={setFieldTouched}
                                        setFieldValue={setFieldValue}
                                        residence_list={residence_list}
                                        default_value={country}
                                    >
                                        <Button
                                            className={classNames('account-signup__btn', {
                                                'account-signup__btn--disabled': !values.residence || errors.residence,
                                            })}
                                            type='button'
                                            is_disabled={!values.residence || !!errors.residence}
                                            onClick={onResidenceSelection}
                                            primary
                                            text={localize('Next')}
                                        />
                                    </ResidenceForm>
                                ) : (
                                    <div className='account-signup__password-selection'>
                                        <p className='account-signup__heading'>
                                            <Localize i18n_default_text='Keep your account secure with a password' />
                                        </p>
                                        <Field name='password'>
                                            {({ field }) => (
                                                <PasswordMeter
                                                    input={pw_input}
                                                    has_error={!!(touched.password && errors.password)}
                                                >
                                                    <PasswordInput
                                                        {...field}
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
                                                    />
                                                </PasswordMeter>
                                            )}
                                        </Field>
                                        <p className='account-signup__subtext'>
                                            <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
                                        </p>
                                        {api_error ? (
                                            <React.Fragment>
                                                <p className='account-signup__subtext account-signup__subtext--error'>
                                                    {api_error}
                                                </p>
                                                <div className='account-signup__error-wrapper'>
                                                    <Button
                                                        secondary
                                                        text={localize('Cancel')}
                                                        type='button'
                                                        onClick={() => isModalVisible(false)}
                                                    />
                                                    <Button
                                                        primary
                                                        text={localize('New sign up')}
                                                        type='button'
                                                        onClick={redirectToSignUp}
                                                    />
                                                </div>
                                            </React.Fragment>
                                        ) : (
                                            <Button
                                                className={classNames('account-signup__btn', {
                                                    'account-signup__btn--disabled':
                                                        !values.password || errors.password || isSubmitting,
                                                })}
                                                type='submit'
                                                is_disabled={!values.password || !!errors.password || isSubmitting}
                                                text={localize('Start trading')}
                                                primary
                                            />
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

AccountSignup.propTypes = {
    onSignup: PropTypes.func,
    residence_list: PropTypes.array,
};

const AccountSignupModal = ({
    enableApp,
    clients_country,
    disableApp,
    fetchResidenceList,
    is_eu,
    is_loading,
    is_visible,
    is_logged_in,
    logout,
    onSignup,
    residence_list,
    toggleAccountSignupModal,
}) => {
    React.useEffect(() => {
        // a logged in user should not be able to create a new account
        if (is_visible && is_logged_in) {
            logout();
        }
    }, [is_visible, is_logged_in, logout]);

    return (
        <Dialog
            is_visible={is_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading || !residence_list.length}
            is_mobile_full_width={false}
            is_content_centered
        >
            <AccountSignup
                onSignup={onSignup}
                clients_country={clients_country}
                residence_list={residence_list}
                fetchResidenceList={fetchResidenceList}
                is_eu={is_eu}
                isModalVisible={toggleAccountSignupModal}
                enableApp={enableApp}
            />
        </Dialog>
    );
};

AccountSignupModal.propTypes = {
    clients_country: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    fetchResidenceList: PropTypes.func,
    is_eu: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    onSignup: PropTypes.func,
    residence_list: PropTypes.arrayOf(PropTypes.object),
};

export default connect(({ ui, client }) => ({
    is_visible: ui.is_account_signup_modal_visible,
    toggleAccountSignupModal: ui.toggleAccountSignupModal,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    clients_country: client.clients_country,
    fetchResidenceList: client.fetchResidenceList,
    is_eu: client.is_eu,
    is_loading: ui.is_loading,
    onSignup: client.onSignup,
    is_logged_in: client.is_logged_in,
    residence_list: client.residence_list,
    logout: client.logout,
}))(AccountSignupModal);
