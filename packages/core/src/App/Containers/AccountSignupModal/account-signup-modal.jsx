import React from 'react';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';

import { Button, Checkbox, Dialog, Loading, Text } from '@deriv/components';
import { getLocation, SessionStore, setPerformanceValue, shuffleArray } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';

import { WS } from 'Services';
import { observer, useStore } from '@deriv/stores';

import CitizenshipForm from '../CitizenshipModal/set-citizenship-form.jsx';
import PasswordSelectionModal from '../PasswordSelectionModal/password-selection-modal.jsx';
import QuestionnaireModal from '../QuestionnaireModal';
import ResidenceForm from '../SetResidenceModal/set-residence-form.jsx';

import validateSignupFields from './validate-signup-fields.jsx';

import 'Sass/app/modules/account-signup.scss';

const AccountSignup = ({
    enableApp,
    is_mobile,
    isModalVisible,
    clients_country,
    onSignup,
    residence_list,
    setIsFromSignupAccount,
}) => {
    const signupInitialValues = { citizenship: '', password: '', residence: '' };
    const [api_error, setApiError] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const [country, setCountry] = React.useState('');
    const history_value = React.useRef();
    const [pw_input, setPWInput] = React.useState('');
    const [is_password_modal, setIsPasswordModal] = React.useState(false);
    const [is_disclaimer_accepted, setIsDisclaimerAccepted] = React.useState(false);
    const [is_questionnaire, setIsQuestionnaire] = React.useState(false);
    const [ab_questionnaire, setABQuestionnaire] = React.useState();
    const [modded_state, setModdedState] = React.useState({});
    const language = getLanguage();

    const checkResidenceIsBrazil = selected_country =>
        selected_country && residence_list[indexOfSelection(selected_country)]?.value?.toLowerCase() === 'br';

    const disableButton = (values, errors) =>
        !(checkResidenceIsBrazil(values.residence) ? is_disclaimer_accepted : true) ||
        !values.residence ||
        !!errors.residence ||
        !values.citizenship ||
        !!errors.citizenship;

    const updatePassword = new_password => {
        setPWInput(new_password);
    };

    // didMount lifecycle hook
    React.useEffect(() => {
        WS.wait('website_status', 'residence_list').then(() => {
            if (clients_country && residence_list) {
                setCountry(getLocation(residence_list, clients_country, 'text'));
            }
            setIsLoading(false);
        });
        // need to modify data from ab testing platform to reach translation and tracking needs
        const fetchQuestionnarieData = () => {
            let ab_value = Analytics.getFeatureValue('questionnaire-config', 'inactive') || 'inactive';
            const default_ab_value = ab_value;
            ab_value = ab_value?.[language] ?? ab_value?.EN ?? ab_value;
            if (ab_value?.show_answers_in_random_order) {
                ab_value = [
                    { ...default_ab_value?.default },
                    {
                        ...ab_value,
                        answers: shuffleArray(ab_value?.answers),
                    },
                ];
            } else if (ab_value !== 'inactive') ab_value = [{ ...default_ab_value?.default }, { ...ab_value }];
            return ab_value;
        };
        setABQuestionnaire(fetchQuestionnarieData());

        Analytics.trackEvent('ce_virtual_signup_form', {
            action: 'signup_confirmed',
            form_name: is_mobile ? 'virtual_signup_web_mobile_default' : 'virtual_signup_web_desktop_default',
        });

        Analytics.trackEvent('ce_virtual_signup_form', {
            action: 'country_selection_screen_opened',
            form_name: is_mobile ? 'virtual_signup_web_mobile_default' : 'virtual_signup_web_desktop_default',
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const validateSignupPassthrough = values => validateSignupFields(values, residence_list);

    const indexOfSelection = selected_country =>
        residence_list.findIndex(item => item.text.toLowerCase() === selected_country?.toLowerCase());

    const handleSignup = () => onSignup(modded_state, onSignupComplete);

    const onSignupPassthrough = values => {
        const index_of_selected_residence = indexOfSelection(values.residence);
        const index_of_selected_citizenship = indexOfSelection(values.citizenship);

        const modded_values = {
            ...values,
            residence: residence_list[index_of_selected_residence].value,
            citizenship: residence_list[index_of_selected_citizenship].value,
        };
        setModdedState(modded_values);

        // a/b test
        ab_questionnaire === 'inactive'
            ? onSignup(modded_values, onSignupComplete)
            : setIsQuestionnaire(!!ab_questionnaire);
    };

    const onSignupComplete = error => {
        if (error) {
            setApiError(error);

            Analytics.trackEvent('ce_virtual_signup_form', {
                action: 'signup_flow_error',
                form_name: is_mobile ? 'virtual_signup_web_mobile_default' : 'virtual_signup_web_desktop_default',
                error_message: error,
            });
        } else {
            setIsFromSignupAccount(true);
            isModalVisible(false);
            SessionStore.remove('signup_query_param');
            enableApp();

            Analytics.trackEvent('ce_virtual_signup_form', {
                action: 'signup_done',
                form_name: is_mobile ? 'virtual_signup_web_mobile_default' : 'virtual_signup_web_desktop_default',
            });
        }
    };

    if (!is_loading) setPerformanceValue('signup_time');

    return (
        <div className='account-signup'>
            {is_loading ? (
                <Loading is_fullscreen={false} />
            ) : (
                <Formik
                    initialValues={signupInitialValues}
                    validate={validateSignupPassthrough}
                    onSubmit={onSignupPassthrough}
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
                            {!is_password_modal ? (
                                <div className='account-signup__location-selection'>
                                    <Text
                                        as='h1'
                                        size={is_mobile ? 'xs' : 's'}
                                        weight='bold'
                                        className='account-signup__heading'
                                    >
                                        {localize('Select your country and citizenship:')}
                                    </Text>
                                    <ResidenceForm
                                        class_prefix='account-signup'
                                        errors={errors}
                                        touched={touched}
                                        onResidenceSelectionChanged={() => setIsDisclaimerAccepted(false)}
                                        setFieldTouched={setFieldTouched}
                                        setFieldValue={setFieldValue}
                                        residence_list={residence_list}
                                        default_value={country}
                                        history_value={history_value.current}
                                    />
                                    <CitizenshipForm
                                        class_prefix='account-signup'
                                        errors={errors}
                                        touched={touched}
                                        setFieldTouched={setFieldTouched}
                                        setFieldValue={setFieldValue}
                                        citizenship_list={residence_list}
                                    />
                                    {checkResidenceIsBrazil(values.residence) && (
                                        <Checkbox
                                            checked={is_disclaimer_accepted}
                                            onChange={() => setIsDisclaimerAccepted(!is_disclaimer_accepted)}
                                            className='account-signup__checkbox'
                                            classNameLabel='account-signup__label'
                                            label={localize(
                                                'I hereby confirm that my request for opening an account with Deriv to trade OTC products issued and offered exclusively outside Brazil was initiated by me. I fully understand that Deriv is not regulated by CVM and by approaching Deriv I intend to set up a relation with a foreign company.'
                                            )}
                                        />
                                    )}
                                    <div className='account-signup__footer'>
                                        <Button
                                            className='account-signup__btn'
                                            is_disabled={disableButton(values, errors)}
                                            type='button'
                                            onClick={() => {
                                                history_value.current = values;
                                                setIsPasswordModal(true);
                                            }}
                                            primary
                                            large
                                            text={localize('Next')}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <React.Fragment>
                                    {is_questionnaire ? (
                                        <QuestionnaireModal
                                            ab_questionnaire={ab_questionnaire}
                                            handleSignup={handleSignup}
                                        />
                                    ) : (
                                        <PasswordSelectionModal
                                            api_error={api_error}
                                            errors={errors}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            isModalVisible={isModalVisible}
                                            isSubmitting={isSubmitting}
                                            touched={touched}
                                            pw_input={pw_input}
                                            setFieldTouched={setFieldTouched}
                                            updatePassword={updatePassword}
                                            values={values}
                                        />
                                    )}
                                </React.Fragment>
                            )}
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

AccountSignup.propTypes = {
    clients_country: PropTypes.string,
    enableApp: PropTypes.func,
    onSignup: PropTypes.func,
    residence_list: PropTypes.array,
    is_mobile: PropTypes.bool,
    isModalVisible: PropTypes.func,
    setIsFromSignupAccount: PropTypes.func,
};

const AccountSignupModal = observer(() => {
    const { ui, client } = useStore();
    const { onSignup, is_logged_in, residence_list, clients_country, logout } = client;
    const {
        is_account_signup_modal_visible: is_visible,
        toggleAccountSignupModal,
        enableApp,
        disableApp,
        is_loading,
        is_mobile,
        setIsFromSignupAccount,
    } = ui;

    React.useEffect(() => {
        // a logged in user should not be able to create a new account
        if (is_visible && is_logged_in) {
            logout();
        }
    }, [is_visible, is_logged_in, logout]);

    return (
        <Dialog
            className='account-signup__dialog'
            is_visible={is_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading || !residence_list.length}
            is_mobile_full_width={false}
        >
            <AccountSignup
                clients_country={clients_country}
                onSignup={onSignup}
                residence_list={residence_list}
                is_mobile={is_mobile}
                isModalVisible={toggleAccountSignupModal}
                enableApp={enableApp}
                setIsFromSignupAccount={setIsFromSignupAccount}
            />
        </Dialog>
    );
});

export default AccountSignupModal;
