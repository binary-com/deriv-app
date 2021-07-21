/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import fromEntries from 'object.fromentries';
import React from 'react';
import { DesktopWrapper, MobileWrapper, FormProgress, Wizard, Text } from '@deriv/components';
import { toMoment, getLocation, makeCancellablePromise } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import LoadingModal from './real-account-signup-loader.jsx';
import AcceptRiskForm from './accept-risk-form.jsx';
import { getItems } from './account-wizard-form';
import 'Sass/details-form.scss';

const StepperHeader = ({ has_target, has_real_account, items, getCurrentStep, getTotalSteps }) => {
    const step = getCurrentStep() - 1;
    const step_title = items[step].header.title;
    return (
        <React.Fragment>
            {(!has_real_account || has_target) && (
                <React.Fragment>
                    <DesktopWrapper>
                        <FormProgress steps={items} current_step={step} />
                    </DesktopWrapper>
                    <MobileWrapper>
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

const AccountWizard = props => {
    const [finished] = React.useState(undefined);
    const [mounted, setMounted] = React.useState(false);
    const [form_error, setFormError] = React.useState('');
    const [previous_data, setPreviousData] = React.useState([]);
    const [state_items, setStateItems] = React.useState([]);
    const [should_accept_financial_risk, setShouldAcceptFinancialRisk] = React.useState(false);
    const is_financial_risk_accepted_ref = React.useRef(false);

    React.useEffect(() => {
        props.fetchStatesList();
        const { cancel, promise } = makeCancellablePromise(props.fetchResidenceList());
        const { cancel: cancelFinancialAssessment, promise: financial_assessment_promise } = makeCancellablePromise(
            props.fetchFinancialAssessment()
        );

        Promise.all([promise, financial_assessment_promise]).then(() => {
            setStateItems(previous_state => {
                if (!previous_state.length) {
                    return getItems(props);
                }
                return previous_state;
            });
            setPreviousData(fetchFromStorage());
            setMounted(true);
        });

        return () => {
            cancel();
            cancelFinancialAssessment();
        };
    }, []);

    React.useEffect(() => {
        if (previous_data.length > 0) {
            const items = [...state_items];
            previous_data.forEach((item, index) => {
                if (item instanceof Object) {
                    items[index].form_value = item;
                }
            });
            setStateItems(items);
            setPreviousData([]);
        }
    }, [previous_data]);

    React.useEffect(() => {
        if (props.residence_list.length) {
            const setDefaultPhone = country_code => {
                let items;
                if (state_items.length) {
                    items = state_items;
                } else {
                    items = getItems(props);
                }

                if (items.length > 1 && 'phone' in items[1]?.form_value) {
                    items[1].form_value.phone = items[1].form_value.phone || country_code || '';
                    setStateItems(items);
                }
            };
            getCountryCode(props.residence_list).then(setDefaultPhone);
        }
    }, [props.residence_list]);

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

    const getCountryCode = async residence_list => {
        const response = residence_list.find(item => item.value === props.residence);
        if (!response || !response.phone_idd) return '';
        return `+${response.phone_idd}`;
    };

    const form_values = () => {
        return state_items
            .map(item => item.form_value)
            .reduce((obj, item) => {
                const values = fromEntries(new Map(Object.entries(item)));
                if (values.date_of_birth) {
                    values.date_of_birth = toMoment(values.date_of_birth).format('YYYY-MM-DD');
                }
                if (values.place_of_birth) {
                    values.place_of_birth = values.place_of_birth
                        ? getLocation(props.residence_list, values.place_of_birth, 'value')
                        : '';
                }
                if (values.citizen) {
                    values.citizen = values.citizen ? getLocation(props.residence_list, values.citizen, 'value') : '';
                }

                if (values.tax_residence) {
                    values.tax_residence = values.tax_residence
                        ? getLocation(props.residence_list, values.tax_residence, 'value')
                        : values.tax_residence;
                }

                return {
                    ...obj,
                    ...values,
                };
            });
    };

    const clearError = () => {
        setFormError('');
    };

    const getFinishedComponent = () => {
        return finished;
    };

    const prevStep = (current_step, goToPreviousStep) => {
        if (current_step - 1 < 0) {
            props.onClose();
            return;
        }

        goToPreviousStep();
        clearError();
    };

    const submitForm = () => {
        const clone = { ...form_values() };
        delete clone?.tax_identification_confirm; // This is a manual field and it does not require to be sent over

        if (is_financial_risk_accepted_ref.current) {
            clone.accept_risk = 1;
        }

        return props.realAccountSignup(clone);
    };

    const updateValue = (index, value, setSubmitting, goToNextStep) => {
        saveFormData(index, value);
        clearError();

        // Check if account wizard is not finished
        if (index + 1 >= state_items.length) {
            createRealAccount();
        } else {
            goToNextStep();
        }
    };

    const saveFormData = (index, value) => {
        const cloned_items = Object.assign([], state_items);
        cloned_items[index].form_value = value;
        setStateItems(cloned_items);
    };

    const getCurrent = (key, step_index) => {
        return key ? state_items[step_index][key] : state_items[step_index];
    };

    const getPropsForChild = step_index => {
        const passthrough = getCurrent('passthrough', step_index);
        const properties = getCurrent('props', step_index) || {};

        if (passthrough && passthrough.length) {
            passthrough.forEach(item => {
                Object.assign(properties, { [item]: props[item] });
            });
            properties.bypass_to_personal = previous_data.length > 0;
        }
        return properties;
    };

    const createRealAccount = () => {
        props.setLoading(true);
        submitForm()
            .then(response => {
                if (props.real_account_signup_target === 'maltainvest') {
                    props.onFinishSuccess(response.new_account_maltainvest.currency.toLowerCase());
                } else if (props.real_account_signup_target === 'samoa') {
                    props.onOpenWelcomeModal(response.new_account_samoa.currency.toLowerCase());
                } else {
                    props.onFinishSuccess(response.new_account_real.currency.toLowerCase());
                }
            })
            .catch(error => {
                if (error.code === 'show risk disclaimer') {
                    setShouldAcceptFinancialRisk(true);
                } else {
                    props.onError(error, state_items);
                }
            })
            .finally(() => props.setLoading(false));
    };

    const onAcceptRisk = () => {
        is_financial_risk_accepted_ref.current = true;
        createRealAccount();
    };

    if (props.is_loading) return <LoadingModal />;
    if (should_accept_financial_risk) return <AcceptRiskForm onConfirm={onAcceptRisk} onClose={props.onClose} />;
    if (!mounted) return null;
    if (!finished) {
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
                    has_currency={props.has_currency}
                    form_error={form_error}
                    {...passthrough}
                    key={step_index}
                />
            );
        });

        let navHeader = <div />;
        if (props.real_account_signup_target !== 'samoa') {
            navHeader = (
                <StepperHeader
                    has_real_account={props.has_real_account}
                    items={state_items}
                    has_currency={props.has_currency}
                    has_target={props.real_account_signup_target !== 'manage'}
                />
            );
        }

        return (
            <Wizard
                nav={navHeader}
                className={classNames('account-wizard', {
                    'account-wizard--set-currency': !props.has_currency,
                    'account-wizard--deriv-crypto': props.real_account_signup_target === 'samoa',
                })}
            >
                {wizard_steps}
            </Wizard>
        );
    }

    const FinishedModalItem = getFinishedComponent();
    return <FinishedModalItem />;
};

AccountWizard.propTypes = {
    fetchResidenceList: PropTypes.func,
    has_currency: PropTypes.bool,
    has_real_account: PropTypes.bool,
    onError: PropTypes.func,
    onLoading: PropTypes.func,
    onFinishSuccess: PropTypes.func,
    onOpenWelcomeModal: PropTypes.func,
    realAccountSignup: PropTypes.func,
    residence: PropTypes.string,
    residence_list: PropTypes.array,
};

export default connect(({ client, ui }) => ({
    account_settings: client.account_settings,
    is_fully_authenticated: client.is_fully_authenticated,
    realAccountSignup: client.realAccountSignup,
    has_real_account: client.has_active_real_account,
    upgrade_info: client.upgrade_info,
    real_account_signup_target: ui.real_account_signup_target,
    has_currency: !!client.currency,
    residence: client.residence,
    residence_list: client.residence_list,
    states_list: client.states_list,
    fetchStatesList: client.fetchStatesList,
    fetchResidenceList: client.fetchResidenceList,
    refreshNotifications: client.refreshNotifications,
    fetchFinancialAssessment: client.fetchFinancialAssessment,
    needs_financial_assessment: client.needs_financial_assessment,
    financial_assessment: client.financial_assessment,
}))(AccountWizard);
