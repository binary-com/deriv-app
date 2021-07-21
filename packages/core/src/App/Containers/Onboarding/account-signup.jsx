import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { withRouter } from 'react-router-dom';
import { Dialog, Loading } from '@deriv/components';
import {
    validPassword,
    getLocation,
    validLength,
    website_name,
    getErrorMessages,
    PlatformContext,
    routes,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import AccountSignupResident from './account-signup-resident.jsx';
import AccountSignupPassword from './account-signup-password.jsx';
import 'Sass/app/modules/account-signup.scss';

const signupInitialValues = { password: '', residence: '', email_consent: false };

const validateSignup = (values, residence_list) => {
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

const AccountSignup = ({
    enableApp,
    clients_country,
    onSignup,
    residence_list,
    isEuCountrySelected,
    selected_residence,
    setSelectedResidence,
    onNext,
    onCancel,
}) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const [api_error, setApiError] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const [country, setCountry] = React.useState('');
    const [is_eu_resident, setIsEuResident] = React.useState(false);

    React.useEffect(() => {
        WS.wait('website_status', 'residence_list').then(() => {
            if (clients_country && residence_list) {
                setCountry(getLocation(residence_list, clients_country, 'text'));
            }
            setIsLoading(false);
        });
    }, []);

    const onResidenceSelection = values => {
        const residence = values;
        setSelectedResidence(residence);
        if (residence) {
            const selected_country = residence_list.find(item => item.text.toLowerCase() === residence.toLowerCase())
                .value;
            if (isEuCountrySelected(selected_country)) {
                setIsEuResident(true);
            } else {
                setIsEuResident(false);
            }
        }
    };

    const onSignupComplete = error => {
        if (error) {
            setApiError(error);
        } else {
            onNext();
            enableApp();
        }
    };

    const validateSignupPassthrough = values => validateSignup(values, residence_list);

    const onSignupPassthrough = values => {
        const index_of_selection = residence_list.findIndex(
            item => item.text.toLowerCase() === values.residence.toLowerCase()
        );

        if (!is_eu_resident) {
            values.email_consent = true;
        }

        const modded_values = {
            ...values,
            residence: residence_list[index_of_selection].value,
        };

        onSignup(modded_values, onSignupComplete);
    };

    return (
        <div className='account-signup'>
            {is_loading ? (
                <Loading is_fullscreen={false} />
            ) : (
                <Formik
                    initialValues={signupInitialValues}
                    validate={validateSignupPassthrough}
                    onSubmit={onSignupPassthrough}
                    is_eu_resident={is_eu_resident}
                    residence_list={residence_list}
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
                            {!selected_residence ? (
                                <AccountSignupResident
                                    errors={errors}
                                    touched={touched}
                                    setFieldTouched={setFieldTouched}
                                    setFieldValue={setFieldValue}
                                    country={country}
                                    residence_list={residence_list}
                                    values={values}
                                    onResidenceSelection={onResidenceSelection}
                                />
                            ) : (
                                <AccountSignupPassword
                                    touched={touched.password}
                                    errors={errors.password}
                                    values={values}
                                    handleBlur={handleBlur}
                                    setFieldTouched={setFieldTouched}
                                    handleChange={handleChange}
                                    is_dashboard={is_dashboard}
                                    is_eu_resident={is_eu_resident}
                                    setFieldValue={setFieldValue}
                                    api_error={api_error}
                                    isSubmitting={isSubmitting}
                                    onCancel={onCancel}
                                />
                            )}
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

AccountSignup.propTypes = {
    enableApp: PropTypes.func,
    onSignup: PropTypes.func,
    residence_list: PropTypes.array,
    isModalVisible: PropTypes.func,
};

const AccountSignupModal = ({
    enableApp,
    disableApp,
    clients_country,
    is_loading,
    isEuCountrySelected,
    onSignup,
    residence_list,
    toggleAccountSignupModal,
    fetchResidenceList,
    onNext,
    history,
}) => {
    const [selected_residence, setSelectedResidence] = React.useState('');

    React.useEffect(() => {
        fetchResidenceList();
    }, [fetchResidenceList]);

    return (
        <Dialog
            is_visible
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading}
            is_mobile_full_width={false}
            is_content_centered
            title={!selected_residence ? localize('Thanks for verifying your email') : ''}
            header_icon='IcVerify'
            className='account-signup-wrapper'
        >
            <AccountSignup
                clients_country={clients_country}
                onSignup={onSignup}
                residence_list={residence_list}
                isModalVisible={toggleAccountSignupModal}
                isEuCountrySelected={isEuCountrySelected}
                enableApp={enableApp}
                selected_residence={selected_residence}
                setSelectedResidence={setSelectedResidence}
                onNext={onNext}
                onCancel={() => {
                    history.push({
                        pathname: routes.root,
                    });
                }}
            />
        </Dialog>
    );
};

AccountSignupModal.propTypes = {
    clients_country: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    onSignup: PropTypes.func,
    residence_list: PropTypes.arrayOf(PropTypes.object),
};

export default withRouter(
    connect(({ ui, client }) => ({
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
        enableApp: ui.enableApp,
        disableApp: ui.disableApp,
        is_loading: ui.is_loading,
        onSignup: client.onSignup,
        is_logged_in: client.is_logged_in,
        residence_list: client.residence_list,
        clients_country: client.clients_country,
        isEuCountrySelected: client.isEuCountrySelected,
        logout: client.logout,
        fetchResidenceList: client.fetchResidenceList,
    }))(AccountSignupModal)
);
