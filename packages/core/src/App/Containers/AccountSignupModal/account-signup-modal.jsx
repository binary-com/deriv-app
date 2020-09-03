import classNames from 'classnames';
import { Field, Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dialog, PasswordInput, PasswordMeter } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { validateMainPassword } from 'Utils/Validator/declarative-validation-rules';
import { website_name } from 'App/Constants/app-config';
import ResidenceForm from '../SetResidenceModal/set-residence-form.jsx';
import 'Sass/app/modules/account-signup.scss';

const signupInitialValues = { password: '', residence: '' };

const validateSignup = (values, residence_list) => {
    const errors = validateMainPassword(values.password);

    if (!values.residence) {
        errors.residence = true;
    } else {
        const index_of_selection = residence_list.findIndex(
            item => item.text.toLowerCase() === values.residence.toLowerCase()
        );

        if (index_of_selection === -1 || residence_list[index_of_selection].disabled === 'DISABLED') {
            errors.residence = localize('Unfortunately, {{website_name}} is not available in your country.', {
                website_name,
            });
        }
    }

    return errors;
};

class AccountSignup extends React.Component {
    state = {
        has_valid_residence: false,
        pw_input: '',
    };

    updatePassword = string => {
        this.setState({ pw_input: string });
    };

    onResidenceSelection = () => {
        this.setState({ has_valid_residence: true });
    };

    onSignupComplete = error => {
        // Handle lower level modal controls due to overriding modal rendering
        this.props.isModalVisible(false);
        this.props.enableApp();

        // Error would be returned on invalid token (and the like) cases.
        // TODO: Proper error handling (currently we have no place to put the message)
        if (error) {
            throw Error(error);
        }
    };

    render() {
        const { onSignup, residence_list } = this.props;

        const validateSignupPassthrough = values => validateSignup(values, residence_list);
        const onSignupPassthrough = values => {
            const index_of_selection = residence_list.findIndex(
                item => item.text.toLowerCase() === values.residence.toLowerCase()
            );

            const modded_values = { ...values, residence: residence_list[index_of_selection].value };
            onSignup(modded_values, this.onSignupComplete);
        };
        return (
            <div className='account-signup'>
                <Formik
                    initialValues={signupInitialValues}
                    validate={validateSignupPassthrough}
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
                                {!this.state.has_valid_residence ? (
                                    <ResidenceForm
                                        header_text={localize('Thanks for verifying your email')}
                                        class_prefix='account-signup'
                                        errors={errors}
                                        touched={touched}
                                        setFieldTouched={setFieldTouched}
                                        setFieldValue={setFieldValue}
                                        residence_list={residence_list}
                                    >
                                        <Button
                                            className={classNames('account-signup__btn', {
                                                'account-signup__btn--disabled': !values.residence || errors.residence,
                                            })}
                                            type='button'
                                            is_disabled={!values.residence || !!errors.residence}
                                            onClick={this.onResidenceSelection}
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
                                                    input={this.state.pw_input}
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
                                                            if (input) this.updatePassword(input.value);
                                                            handleChange(e);
                                                        }}
                                                    />
                                                </PasswordMeter>
                                            )}
                                        </Field>
                                        <p className='account-signup__subtext'>
                                            <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
                                        </p>

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

AccountSignup.propTypes = {
    onSignup: PropTypes.func,
    residence_list: PropTypes.array,
};

const AccountSignupModal = ({
    enableApp,
    disableApp,
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
                residence_list={residence_list}
                is_eu={is_eu}
                isModalVisible={toggleAccountSignupModal}
                enableApp={enableApp}
            />
        </Dialog>
    );
};

AccountSignupModal.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
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
    is_eu: client.is_eu,
    is_loading: ui.is_loading,
    onSignup: client.onSignup,
    is_logged_in: client.is_logged_in,
    residence_list: client.residence_list,
    logout: client.logout,
}))(AccountSignupModal);
