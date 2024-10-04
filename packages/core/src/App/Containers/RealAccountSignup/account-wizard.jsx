import classNames from 'classnames';
import fromEntries from 'object.fromentries';
import PropTypes from 'prop-types';
import React from 'react';

import { DesktopWrapper, FormProgress, MobileWrapper, Text, Wizard } from '@deriv/components';
import { WS, getLocation, toMoment, formatIDVFormValues, shouldHideOccupationField } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import AcceptRiskForm from './accept-risk-form.jsx';
import LoadingModal from './real-account-signup-loader.jsx';
import { getItems } from './account-wizard-form';
import { useResidenceSelfDeclaration, useGrowthbookGetFeatureValue } from '@deriv/hooks';
import 'Sass/details-form.scss';
import { Analytics } from '@deriv-com/analytics';

const STEP_IDENTIFIERS = ['account_currency', 'personal_details', 'address_details', 'terms_of_use'];

const StepperHeader = ({ has_target, has_real_account, items, getCurrentStep, getTotalSteps, sub_section_index }) => {
    const step = getCurrentStep() - 1;
    const step_title = items[step].header ? items[step].header.title : '';

    return (
        <React.Fragment>
            {(!has_real_account || has_target) && (
                <React.Fragment>
                    <DesktopWrapper>
                        <FormProgress steps={items} current_step={step} sub_section_index={sub_section_index} />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <FormProgress steps={items} current_step={step} sub_section_index={sub_section_index} />
                        <div className='account-wizard__header-steps'>
                            <Text
                                as='h4'
                                styles={{ lineHeight: '20px', color: 'var(--brand-red-coral)' }}
                                size='xs'
                                weight='bold'
                                className='account-wizard__header-steps-title'
                            >
                                <Localize
                                    i18n_default_text='Step {{step}}: {{step_title}} ({{step}} of {{steps}})'
                                    values={{
                                        step: step + 1,
                                        steps: getTotalSteps(),
                                        step_title,
                                    }}
                                />
                            </Text>
                        </div>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

const AccountWizard = observer(props => {
    const { client, notifications, ui, traders_hub } = useStore();

    const { is_eu_user } = traders_hub;

    const modifiedProps = {
        ...props,
        account_settings: client.account_settings,
        account_status: client.account_status,
        fetchAccountSettings: client.fetchAccountSettings,
        fetchResidenceList: client.fetchResidenceList,
        fetchStatesList: client.fetchStatesList,
        financial_assessment: client.financial_assessment,
        has_currency: !!client.currency,
        has_real_account: client.has_active_real_account,
        has_residence: client.residence,
        is_fully_authenticated: client.is_fully_authenticated,
        is_virtual: client.is_virtual,
        realAccountSignup: client.realAccountSignup,
        residence_list: client.residence_list,
        residence: client.residence,
        states_list: client.states_list,
        upgrade_info: client.upgrade_info,
        refreshNotifications: notifications.refreshNotifications,
        content_flag: traders_hub.content_flag,
        closeRealAccountSignup: ui.closeRealAccountSignup,
        real_account_signup_target: ui.real_account_signup_target,
        setIsRealAccountSignupModalVisible: ui.setIsRealAccountSignupModalVisible,
        setIsTradingAssessmentForNewUserEnabled: ui.setIsTradingAssessmentForNewUserEnabled,
        setShouldShowAppropriatenessWarningModal: ui.setShouldShowAppropriatenessWarningModal,
        setShouldShowRiskWarningModal: ui.setShouldShowRiskWarningModal,
        setSubSectionIndex: ui.setSubSectionIndex,
        sub_section_index: ui.sub_section_index,
    };

    const {
        real_account_signup_form_data,
        setRealAccountSignupFormData,
        real_account_signup_form_step,
        setRealAccountSignupFormStep,
    } = client;
    const { closeRealAccountSignup, setShouldShowSameDOBPhoneModal } = ui;

    const [finished] = React.useState(undefined);
    const [mounted, setMounted] = React.useState(false);
    const [form_error, setFormError] = React.useState('');
    const [previous_data, setPreviousData] = React.useState([]);
    const [state_items, setStateItems] = React.useState(real_account_signup_form_data ?? []);
    const [should_accept_financial_risk, setShouldAcceptFinancialRisk] = React.useState(false);
    const { is_residence_self_declaration_required } = useResidenceSelfDeclaration();

    const [direct_deposit_flow] = useGrowthbookGetFeatureValue({
        featureFlag: 'direct-deposit-flow',
        defaultValue: false,
    });

    const trackEvent = React.useCallback(
        payload => {
            if (modifiedProps.real_account_signup_target === 'maltainvest') return;

            Analytics.trackEvent('ce_real_account_signup_form', {
                current_step: STEP_IDENTIFIERS[payload.step_num],
                form_source: document.referrer,
                form_name: 'real_account_signup_form',
                landing_company: modifiedProps.real_account_signup_target,
                ...payload,
            });
        },
        [modifiedProps.real_account_signup_target]
    );

    const {
        setIsTradingAssessmentForNewUserEnabled,
        residence_list,
        states_list,
        fetchResidenceList,
        fetchStatesList,
        has_residence,
        setLoading,
    } = modifiedProps;

    const getData = async () => {
        setLoading(true);
        if (!residence_list.length) await fetchResidenceList();
        if (has_residence && !states_list.length) {
            await fetchStatesList();
        }
        setLoading(false);
    };

    const get_items_props = {
        ...modifiedProps,
    };

    React.useEffect(() => {
        setIsTradingAssessmentForNewUserEnabled(true);
        getData();
        setStateItems(previous_state => {
            if (!previous_state.length) {
                return getItems(get_items_props);
            }
            return previous_state;
        });
        if (!state_items?.length) setRealAccountSignupFormData(getItems(get_items_props));

        setPreviousData(fetchFromStorage());
        setMounted(true);
    }, [residence_list, states_list, fetchResidenceList, fetchStatesList, has_residence, setRealAccountSignupFormData]);

    React.useEffect(() => {
        if (previous_data.length > 0) {
            const items = [...state_items];
            previous_data.forEach((item, index) => {
                if (item instanceof Object) {
                    items[index].form_value = item;
                }
            });
            setStateItems(items);
            setRealAccountSignupFormData(items);
            setPreviousData([]);
        }
    }, [previous_data, setRealAccountSignupFormData]);

    React.useEffect(() => {
        if (residence_list.length) {
            const setDefaultPhone = country_code => {
                let items;
                if (state_items.length) {
                    items = state_items;
                } else {
                    items = getItems(get_items_props);
                }

                if (items.length > 1 && 'phone' in items[1]?.form_value) {
                    items[1].form_value.phone = items[1].form_value.phone || country_code || '';
                    setStateItems(items);
                    setRealAccountSignupFormData(items);
                }
            };
            getCountryCode(residence_list).then(setDefaultPhone);
        }
    }, [residence_list, setRealAccountSignupFormData]);

    const fetchFromStorage = () => {
        const stored_items = localStorage.getItem('real_account_signup_wizard');
        try {
            const items = JSON.parse(stored_items);
            return items || [];
        } catch (e) {
            return [];
        } finally {
            localStorage.removeItem('real_account_signup_wizard');
        }
    };

    const getCountryCode = async residences => {
        const response = residences.find(item => item.value === modifiedProps.residence);
        if (!response || !response.phone_idd) return '';
        return `+${response.phone_idd}`;
    };

    const form_values = () => {
        return state_items
            .map(item => item.form_value)
            .reduce((obj, item) => {
                const original_form_values = fromEntries(new Map(Object.entries(item)));
                const values = Object.keys(original_form_values).reduce((acc, current) => {
                    acc[current] =
                        typeof original_form_values[current] === 'string'
                            ? original_form_values[current].trim()
                            : original_form_values[current];
                    return acc;
                }, {});
                if (values.date_of_birth) {
                    values.date_of_birth = toMoment(values.date_of_birth).format('YYYY-MM-DD');
                }
                if (values.place_of_birth) {
                    values.place_of_birth = values.place_of_birth
                        ? getLocation(residence_list, values.place_of_birth, 'value')
                        : '';
                }
                if (values.citizen) {
                    values.citizen = values.citizen ? getLocation(residence_list, values.citizen, 'value') : '';
                }

                if (values.tax_residence) {
                    values.tax_residence = values.tax_residence
                        ? getLocation(residence_list, values.tax_residence, 'value')
                        : values.tax_residence;
                }
                if (values.address_state) {
                    values.address_state = values.address_state
                        ? getLocation(states_list, values.address_state, 'value')
                        : values.address_state;
                }

                return {
                    ...obj,
                    ...values,
                };
            }, {});
    };

    const clearError = () => {
        setFormError('');
    };

    const getFinishedComponent = () => {
        return finished;
    };

    const prevStep = (current_step, goToPreviousStep) => {
        if (current_step - 1 < 0) {
            modifiedProps.onClose();
            return;
        }

        trackEvent({
            action: 'step_back',
            step_num: current_step,
            step_codename: STEP_IDENTIFIERS[current_step],
        });

        goToPreviousStep();
        clearError();
    };

    const processInputData = data => {
        if (data?.risk_tolerance === 'No') {
            return Object.entries(data).reduce((accumulator, [key, val]) => {
                if (val) {
                    return { ...accumulator, [key]: val };
                }
                return { ...accumulator };
            }, {});
        }
        if (shouldHideOccupationField(data?.employment_status)) {
            delete data?.occupation;
        }
        return data;
    };

    const submitForm = (payload = undefined) => {
        let clone = { ...form_values() };
        delete clone?.tax_identification_confirm;
        delete clone?.agreed_tos;
        delete clone?.confirmation_checkbox;

        if (is_residence_self_declaration_required && clone?.resident_self_declaration)
            clone.resident_self_declaration = 1;
        else delete clone.resident_self_declaration;

        // BE does not accept empty strings for TIN
        // so we remove it from the payload if it is empty in case of optional TIN field
        // as the value will be available from the form_values
        if (clone?.tax_identification_number?.length === 0) {
            delete clone.tax_identification_number;
        }

        if (clone?.tnc_acceptance) {
            clone.tnc_acceptance = 1;
        }
        clone = processInputData(clone);
        modifiedProps.setRealAccountFormData(clone);
        if (payload) {
            clone = {
                ...clone,
                ...payload,
            };
        }
        return modifiedProps.realAccountSignup(clone);
    };

    const updateValue = (index, value, setSubmitting, goToNextStep, should_override = false) => {
        // This is to sync clearing of value on change of Employment status personal details and occupation in financial assessment
        if (is_eu_user && index === 1) {
            state_items[5].form_value = { ...state_items[5].form_value, occupation: value.occupation };
            setStateItems(state_items);
        }
        saveFormData(index, value);
        clearError();

        // Check if account wizard is not finished
        if (should_override || index + 1 >= state_items.length) {
            createRealAccount({});

            //to count the last step of the wizard 'terms_of_use' as a step
            const last_step = state_items.length - 1;

            trackEvent({
                action: 'step_passed',
                step_num: last_step,
                step_codename: STEP_IDENTIFIERS[last_step],
            });
        } else {
            trackEvent({
                action: 'step_passed',
                step_num: index,
                step_codename: STEP_IDENTIFIERS[index],
            });
            goToNextStep();
        }
    };

    const saveFormData = (index, value) => {
        const cloned_items = Object.assign([], state_items);
        // This is to sync clearing of value on change of Employment status personal details and occupation in financial assessment
        if (is_eu_user && index === 1) {
            delete value?.occupation;
        }
        cloned_items[index].form_value = value;
        setStateItems(cloned_items);

        setRealAccountSignupFormData(cloned_items);
    };

    const getCurrent = (key, step_index) => {
        return key ? state_items[step_index][key] : state_items[step_index];
    };

    const getPropsForChild = step_index => {
        const passthrough = getCurrent('passthrough', step_index);
        const properties = getCurrent('props', step_index) || {};

        if (passthrough?.length) {
            passthrough.forEach(item => {
                Object.assign(properties, { [item]: modifiedProps[item] });
            });
            properties.bypass_to_personal = previous_data.length > 0;
        }
        return properties;
    };

    const createRealAccount = (payload = undefined) => {
        setLoading(true);
        const form_data = { ...form_values() };
        /**
         * Remove document_type from payload if it is not present (For Non IDV supporting countries)
         */
        if (!form_data?.document_type?.id) {
            delete form_data.document_type;
        }

        trackEvent({
            action: 'save',
        });

        submitForm(payload)
            .then(async response => {
                trackEvent({
                    action: 'real_signup_finished',
                    user_choice: JSON.stringify(response?.echo_req),
                });

                const status = await WS.wait('get_account_status');
                const { get_account_status } = status;

                modifiedProps.setIsRiskWarningVisible(false);

                // check for duplicate DOB (day of birthday) and phone number
                const is_duplicate_dob_phone = get_account_status?.status?.includes('duplicate_dob_phone');
                if (is_duplicate_dob_phone) {
                    closeRealAccountSignup();
                    setShouldShowSameDOBPhoneModal(true);
                } else if (modifiedProps.real_account_signup_target === 'maltainvest') {
                    modifiedProps.onOpenDepositModal();
                } else if (modifiedProps.real_account_signup_target === 'samoa') {
                    modifiedProps.onOpenWelcomeModal(response.new_account_samoa.currency.toLowerCase());
                } else {
                    if (direct_deposit_flow) {
                        modifiedProps.onOpenDepositModal();
                    }
                    modifiedProps.onFinishSuccess(response.new_account_real.currency.toLowerCase());
                }

                const country_code = modifiedProps.account_settings.citizen || modifiedProps.residence;
                /**
                 * If IDV details are present, then submit IDV details
                 */
                if (form_data?.document_type) {
                    const idv_submit_data = {
                        identity_verification_document_add: 1,
                        ...formatIDVFormValues(form_data, country_code),
                    };
                    await WS.send(idv_submit_data);
                }
            })
            .catch(error => {
                trackEvent({
                    action: 'real_signup_error',
                    real_signup_error_message: error,
                });
                if (error.code === 'show risk disclaimer') {
                    modifiedProps.setIsRiskWarningVisible(true);
                    setShouldAcceptFinancialRisk(true);
                } else if (error.code === 'AppropriatenessTestFailed') {
                    if (form_data?.risk_tolerance === 'No') {
                        modifiedProps.fetchAccountSettings();
                        modifiedProps.setShouldShowRiskWarningModal(true);
                    } else {
                        modifiedProps.setShouldShowAppropriatenessWarningModal(true);
                    }
                } else {
                    modifiedProps.onError(error, state_items);
                }
            })
            .finally(() => {
                setLoading(false);
                localStorage.removeItem('current_question_index');
            });
    };

    const onAcceptRisk = () => {
        createRealAccount({ accept_risk: 1 });
    };

    const onDeclineRisk = () => {
        modifiedProps.onClose();
        modifiedProps.setIsRiskWarningVisible(false);
    };

    if (modifiedProps.is_loading) return <LoadingModal />;

    if (should_accept_financial_risk) {
        return <AcceptRiskForm onConfirm={onAcceptRisk} onClose={onDeclineRisk} />;
    }

    if (!mounted) return null;

    if (!finished) {
        const employment_status =
            state_items.find(item => item.form_value.employment_status)?.form_value?.employment_status || '';
        const wizard_steps = state_items.map((step, step_index) => {
            const passthrough = getPropsForChild(step_index);
            const BodyComponent = step.body;
            return (
                <BodyComponent
                    value={getCurrent('form_value', step_index)}
                    index={step_index}
                    onSubmit={updateValue}
                    onCancel={prevStep}
                    onSave={saveFormData}
                    closeRealAccountSignup={modifiedProps.closeRealAccountSignup}
                    is_virtual={modifiedProps.is_virtual}
                    has_currency={modifiedProps.has_currency}
                    form_error={form_error}
                    {...passthrough}
                    key={step_index}
                    employment_status={employment_status}
                />
            );
        });

        let navHeader = <div />;
        if (modifiedProps.real_account_signup_target !== 'samoa') {
            navHeader = (
                <StepperHeader
                    has_real_account={modifiedProps.has_real_account}
                    items={state_items}
                    has_currency={modifiedProps.has_currency}
                    has_target={modifiedProps.real_account_signup_target !== 'manage'}
                    setIsRiskWarningVisible={modifiedProps.setIsRiskWarningVisible}
                    sub_section_index={modifiedProps.sub_section_index}
                />
            );
        }

        return (
            <Wizard
                nav={navHeader}
                className={classNames('account-wizard', {
                    'account-wizard--set-currency': !modifiedProps.has_currency,
                    'account-wizard--deriv-crypto': modifiedProps.real_account_signup_target === 'samoa',
                })}
                initial_step={real_account_signup_form_step}
                onStepChange={state => {
                    setRealAccountSignupFormStep(state?.active_step - 1);
                }}
            >
                {wizard_steps}
            </Wizard>
        );
    }

    const FinishedModalItem = getFinishedComponent();
    return <FinishedModalItem />;
});

AccountWizard.propTypes = {
    account_settings: PropTypes.object,
    account_status: PropTypes.object,
    closeRealAccountSignup: PropTypes.func,
    content_flag: PropTypes.string,
    fetchResidenceList: PropTypes.func,
    fetchAccountSettings: PropTypes.func,
    fetchStatesList: PropTypes.func,
    has_currency: PropTypes.bool,
    has_real_account: PropTypes.bool,
    has_residence: PropTypes.bool,
    is_loading: PropTypes.bool,
    is_virtual: PropTypes.bool,
    onClose: PropTypes.func,
    onError: PropTypes.func,
    onFinishSuccess: PropTypes.func,
    onNewFinishSuccess: PropTypes.func,
    onLoading: PropTypes.func,
    onOpenWelcomeModal: PropTypes.func,
    real_account_signup_target: PropTypes.string,
    realAccountSignup: PropTypes.func,
    residence_list: PropTypes.array,
    residence: PropTypes.string,
    states_list: PropTypes.array,
    setIsTradingAssessmentForNewUserEnabled: PropTypes.func,
    setIsRiskWarningVisible: PropTypes.func,
    setLoading: PropTypes.func,
    setShouldShowRiskWarningModal: PropTypes.func,
    setSubSectionIndex: PropTypes.func,
    sub_section_index: PropTypes.number,
};

export default AccountWizard;
