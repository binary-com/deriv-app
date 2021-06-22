import classNames from 'classnames';
import React from 'react';
import { Formik } from 'formik';
import { useHistory, useLocation, withRouter } from 'react-router';
import {
    FormSubmitErrorMessage,
    Loading,
    Button,
    Dropdown,
    Modal,
    Icon,
    DesktopWrapper,
    MobileWrapper,
    SelectNative,
    Text,
} from '@deriv/components';
import { getPlatformRedirect, isMobile, isDesktop, PlatformContext, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import LeaveConfirm from 'Components/leave-confirm';
import IconMessageContent from 'Components/icon-message-content';
import DemoMessage from 'Components/demo-message';
import LoadErrorMessage from 'Components/load-error-message';
import FormBody from 'Components/form-body';
import FormBodySection from 'Components/form-body-section';
import FormSubHeader from 'Components/form-sub-header';
import FormFooter from 'Components/form-footer';
import {
    getAccountTurnoverList,
    getEducationLevelList,
    getEmploymentIndustryList,
    getEmploymentStatusList,
    getEstimatedWorthList,
    getIncomeSourceList,
    getNetIncomeList,
    getOccupationList,
    getSourceOfWealthList,
    getBinaryOptionsTradingExperienceList,
    getBinaryOptionsTradingFrequencyList,
    getCfdTradingExperienceList,
    getCfdTradingFrequencyList,
    getForexTradingExperienceList,
    getForexTradingFrequencyList,
    getOtherInstrumentsTradingExperienceList,
    getOtherInstrumentsTradingFrequencyList,
} from './financial-information-list';

const ConfirmationContent = ({ className }) => {
    return (
        <React.Fragment>
            <Text as='p' size='xs' className={className}>
                <Localize
                    i18n_default_text='In providing our services to you, we are required to obtain information from you in order to assess whether a given product or service is appropriate for you (that is, whether you possess the experience and knowledge to understand the risks involved).<0/><1/>'
                    components={[<br key={0} />, <br key={1} />]}
                />
                <Localize
                    i18n_default_text='On the basis of the information provided in relation to your knowledge and experience, we consider that the investments available via this website are not appropriate for you.<0/><1/>'
                    components={[<br key={0} />, <br key={1} />]}
                />
                <Localize i18n_default_text='By clicking Accept below and proceeding with the Account Opening you should note that you may be exposing yourself to risks (which may be significant, including the risk of loss of the entire sum invested) that you may not have the knowledge and experience to properly assess or mitigate.' />
            </Text>
        </React.Fragment>
    );
};

const ConfirmationModal = ({ is_visible, toggleModal, onSubmit }) => (
    <Modal
        className='financial-assessment-confirmation'
        is_open={is_visible}
        small
        toggleModal={() => toggleModal(false)}
        title={localize('Appropriateness Test, WARNING:')}
    >
        <Modal.Body>
            <ConfirmationContent />
        </Modal.Body>
        <Modal.Footer>
            <Button large text={localize('Decline')} onClick={() => toggleModal(false)} secondary />
            <Button
                large
                text={localize('Accept')}
                onClick={() => {
                    onSubmit();
                    toggleModal(false);
                }}
                primary
            />
        </Modal.Footer>
    </Modal>
);

const ConfirmationPage = ({ toggleModal, onSubmit }) => (
    <div className='account__confirmation-page'>
        <Text
            size='xs'
            weight='bold'
            styles={{ color: 'var(--brand-red-coral)' }}
            className='account__confirmation-page-title'
        >
            {localize('Notice')}
        </Text>
        <ConfirmationContent className='account__confirmation-page-content' />
        <div className='account__confirmation-page-footer'>
            <Button large text={localize('Back')} onClick={() => toggleModal(false)} secondary />
            <Button
                large
                text={localize('Accept')}
                onClick={() => {
                    onSubmit();
                    toggleModal(false);
                }}
                primary
            />
        </div>
    </div>
);

const SubmittedPage = ({ app_routing_history, routeBackInApp }) => {
    const history = useHistory();
    const location = useLocation();
    const from_platform = getPlatformRedirect(app_routing_history);

    // Passing "custom_button_options" object in "location.state" allows
    // another app/route to determine which button the user will see after
    // submitting their financial assessment.
    const button_text = location.state?.custom_button_options
        ? location.state.custom_button_options.button_text
        : localize('Continue');
    const icon_text = location.state?.custom_button_options?.icon_text
        ? location.state.custom_button_options.icon_text
        : localize('Let’s continue with providing proofs of address and identity.');
    const route_to_path = location.state?.custom_button_options?.route_to_path
        ? location.state.custom_button_options.route_to_path
        : routes.proof_of_address;

    const onClickButton = () => {
        if (from_platform?.route) {
            routeBackInApp(history, [from_platform?.route]);
        } else if (location.state?.custom_button_options?.is_hard_redirect) {
            window.location.href = window.location.origin + route_to_path;
        } else {
            history.push(route_to_path);
        }
    };

    return (
        <IconMessageContent
            className='submit-success'
            message={localize('Financial assessment submitted successfully')}
            text={icon_text}
            icon={<Icon icon='IcSuccess' width={96} height={90} />}
        >
            <div className='account-management-flex-wrapper account-management-submit-success'>
                <Button type='button' has_effect text={button_text} onClick={onClickButton} primary large />
            </div>
        </IconMessageContent>
    );
};

class FinancialAssessment extends React.Component {
    static contextType = PlatformContext;
    is_mounted = false;
    state = {
        is_loading: true,
        is_confirmation_visible: false,
        has_trading_experience: false,
        show_form: true,
        income_source: '',
        employment_status: '',
        employment_industry: '',
        occupation: '',
        source_of_wealth: '',
        education_level: '',
        net_income: '',
        estimated_worth: '',
        account_turnover: '',
        binary_options_trading_experience: '',
        binary_options_trading_frequency: '',
        cfd_trading_experience: '',
        cfd_trading_frequency: '',
        forex_trading_experience: '',
        forex_trading_frequency: '',
        other_instruments_trading_experience: '',
        other_instruments_trading_frequency: '',
    };

    componentDidMount() {
        this.is_mounted = true;
        if (this.props.is_virtual) {
            this.setState({ is_loading: false });
        } else {
            WS.authorized.storage.getFinancialAssessment().then(data => {
                // TODO: Find a better solution for handling no-op instead of using is_mounted flags
                if (this.is_mounted) {
                    WS.wait('get_account_status').then(() => {
                        const has_trading_experience =
                            (this.props.is_financial_account || this.props.is_trading_experience_incomplete) &&
                            !this.props.is_svg;

                        const needs_financial_assessment =
                            this.props.is_financial_information_incomplete ||
                            this.props.is_high_risk ||
                            has_trading_experience ||
                            this.props.is_financial_account;
                        this.setState({ has_trading_experience });

                        if (data.error) {
                            this.setState({ api_initial_load_error: data.error.message });
                            return;
                        } else if (!needs_financial_assessment) {
                            // Additional layer of error handling if non high risk user somehow manages to reach FA page
                            // need to redirect to default route for account to prevent app crash
                            this.props.history.push(routes.personal_details);
                        }
                        this.setState({ ...data.get_financial_assessment, is_loading: false });
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        this.is_mounted = false;
    }

    onSubmit = (values, { setSubmitting, setStatus }) => {
        setStatus({ msg: '' });
        this.setState({ is_btn_loading: true });
        WS.setFinancialAssessment(values).then(data => {
            this.setState({ is_btn_loading: false });
            if (data.error) {
                setStatus({ msg: data.error.message });
            } else {
                WS.authorized.storage.getFinancialAssessment().then(res_data => {
                    this.setState({
                        ...res_data.get_financial_assessment,
                        is_submit_success: true,
                    });

                    if (isDesktop()) {
                        setTimeout(() => this.setState({ is_submit_success: false }), 3000);
                    }

                    this.props.removeNotificationMessage({ key: 'risk' });
                    this.props.removeNotificationByKey({ key: 'risk' });
                });
            }
            setSubmitting(false);
        });
    };

    validateFields = values => {
        this.setState({ is_submit_success: false });
        const errors = {};
        Object.keys(values).forEach(field => {
            if (values[field] !== undefined && !values[field]) {
                errors[field] = localize('This field is required');
            }
        });
        return errors;
    };

    showForm = show_form => this.setState({ show_form, is_confirmation_visible: false });

    toggleConfirmationModal = value => {
        const new_state = { is_confirmation_visible: value };
        if (isMobile()) {
            new_state.show_form = !value;
        }

        this.setState(new_state);
    };

    onClickSubmit = handleSubmit => {
        const is_confirmation_needed = this.state.has_trading_experience && this.props.is_trading_experience_incomplete;

        if (is_confirmation_needed) {
            this.toggleConfirmationModal(true);
        } else {
            handleSubmit();
        }
    };

    render() {
        const {
            api_initial_load_error,
            income_source,
            employment_status,
            employment_industry,
            occupation,
            source_of_wealth,
            education_level,
            net_income,
            estimated_worth,
            account_turnover,
            binary_options_trading_experience,
            binary_options_trading_frequency,
            cfd_trading_experience,
            cfd_trading_frequency,
            forex_trading_experience,
            forex_trading_frequency,
            other_instruments_trading_experience,
            other_instruments_trading_frequency,
            show_form,
            is_loading,
            is_btn_loading,
            is_submit_success,
            is_confirmation_visible,
            has_trading_experience,
        } = this.state;
        const { is_dashboard } = this.context;

        if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
        if (api_initial_load_error) return <LoadErrorMessage error_message={api_initial_load_error} />;
        if (this.props.is_virtual) return <DemoMessage has_demo_icon={is_dashboard} has_button={is_dashboard} />;
        if (isMobile() && is_submit_success)
            return (
                <SubmittedPage
                    app_routing_history={this.props.app_routing_history}
                    routeBackInApp={this.props.routeBackInApp}
                />
            );

        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        income_source,
                        employment_status,
                        employment_industry,
                        occupation,
                        source_of_wealth,
                        education_level,
                        net_income,
                        estimated_worth,
                        account_turnover,
                        ...(has_trading_experience && {
                            binary_options_trading_experience,
                            binary_options_trading_frequency,
                            cfd_trading_experience,
                            cfd_trading_frequency,
                            forex_trading_experience,
                            forex_trading_frequency,
                            other_instruments_trading_experience,
                            other_instruments_trading_frequency,
                        }),
                    }}
                    enableReinitialize={true}
                    validate={this.validateFields}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        status,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        dirty,
                    }) => (
                        <>
                            {!is_dashboard && isMobile() && is_confirmation_visible && (
                                <ConfirmationPage toggleModal={this.toggleConfirmationModal} onSubmit={handleSubmit} />
                            )}
                            {(isDesktop() || is_dashboard) && (
                                <ConfirmationModal
                                    is_visible={is_confirmation_visible}
                                    toggleModal={this.toggleConfirmationModal}
                                    onSubmit={handleSubmit}
                                />
                            )}
                            <LeaveConfirm onDirty={isMobile() ? this.showForm : null} />
                            {show_form && (
                                <form
                                    className='account-form account-form__financial-assessment'
                                    onSubmit={handleSubmit}
                                >
                                    <FormBody scroll_offset={isMobile() ? (is_dashboard ? '160px' : '200px') : '80px'}>
                                        <FormSubHeader
                                            title={localize('Financial information')}
                                            subtitle={`(${localize('All fields are required')})`}
                                        />
                                        <FormBodySection
                                            has_side_note={is_dashboard}
                                            side_note={localize(
                                                'We’re legally obliged to ask for your financial information.'
                                            )}
                                        >
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        placeholder={localize('Source of income')}
                                                        is_align_text_left
                                                        name='income_source'
                                                        list={getIncomeSourceList()}
                                                        value={values.income_source}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        error={touched.income_source && errors.income_source}
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='income_source'
                                                        label={localize('Source of income')}
                                                        list_items={getIncomeSourceList()}
                                                        value={values.income_source}
                                                        error={touched.income_source && errors.income_source}
                                                        onChange={handleChange}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        placeholder={localize('Employment status')}
                                                        is_align_text_left
                                                        name='employment_status'
                                                        list={getEmploymentStatusList()}
                                                        value={values.employment_status}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        error={touched.employment_status && errors.employment_status}
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='employment_status'
                                                        label={localize('Employment status')}
                                                        list_items={getEmploymentStatusList()}
                                                        value={values.employment_status}
                                                        error={touched.employment_status && errors.employment_status}
                                                        onChange={handleChange}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        placeholder={localize('Industry of employment')}
                                                        is_align_text_left
                                                        name='employment_industry'
                                                        list={getEmploymentIndustryList()}
                                                        value={values.employment_industry}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        error={
                                                            touched.employment_industry && errors.employment_industry
                                                        }
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='employment_industry'
                                                        label={localize('Industry of employment')}
                                                        list_items={getEmploymentIndustryList()}
                                                        value={values.employment_industry}
                                                        error={
                                                            touched.employment_industry && errors.employment_industry
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        className='account-form__occupation'
                                                        placeholder={localize('Occupation')}
                                                        is_align_text_left
                                                        name='occupation'
                                                        list={getOccupationList()}
                                                        value={values.occupation}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        error={touched.occupation && errors.occupation}
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='occupation'
                                                        label={localize('Occupation')}
                                                        list_items={getOccupationList()}
                                                        value={values.occupation}
                                                        error={touched.occupation && errors.occupation}
                                                        onChange={handleChange}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        placeholder={localize('Source of wealth')}
                                                        is_align_text_left
                                                        name='source_of_wealth'
                                                        list={getSourceOfWealthList()}
                                                        value={values.source_of_wealth}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        error={touched.source_of_wealth && errors.source_of_wealth}
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='source_of_wealth'
                                                        label={localize('Source of wealth')}
                                                        list_items={getSourceOfWealthList()}
                                                        value={values.source_of_wealth}
                                                        error={touched.source_of_wealth && errors.source_of_wealth}
                                                        onChange={handleChange}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        placeholder={localize('Level of education')}
                                                        is_align_text_left
                                                        name='education_level'
                                                        list={getEducationLevelList()}
                                                        value={values.education_level}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        error={touched.education_level && errors.education_level}
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='education_level'
                                                        label={localize('Level of education')}
                                                        list_items={getEducationLevelList()}
                                                        value={values.education_level}
                                                        error={touched.education_level && errors.education_level}
                                                        onChange={handleChange}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        placeholder={localize('Net annual income')}
                                                        is_align_text_left
                                                        name='net_income'
                                                        list={getNetIncomeList()}
                                                        value={values.net_income}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        error={touched.net_income && errors.net_income}
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='net_income'
                                                        label={localize('Net annual income')}
                                                        list_items={getNetIncomeList()}
                                                        value={values.net_income}
                                                        error={touched.net_income && errors.net_income}
                                                        onChange={handleChange}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        placeholder={localize('Estimated net worth')}
                                                        is_alignment_top
                                                        is_align_text_left
                                                        name='estimated_worth'
                                                        list={getEstimatedWorthList()}
                                                        value={values.estimated_worth}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        error={touched.estimated_worth && errors.estimated_worth}
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='estimated_worth'
                                                        label={localize('Estimated net worth')}
                                                        list_items={getEstimatedWorthList()}
                                                        value={values.estimated_worth}
                                                        error={touched.estimated_worth && errors.estimated_worth}
                                                        onChange={handleChange}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            <fieldset className='account-form__fieldset'>
                                                <DesktopWrapper>
                                                    <Dropdown
                                                        placeholder={localize('Anticipated account turnover')}
                                                        is_alignment_top
                                                        is_align_text_left
                                                        name='account_turnover'
                                                        list={getAccountTurnoverList()}
                                                        value={values.account_turnover}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                        error={touched.account_turnover && errors.account_turnover}
                                                    />
                                                </DesktopWrapper>
                                                <MobileWrapper>
                                                    <SelectNative
                                                        placeholder={localize('Please select')}
                                                        name='account_turnover'
                                                        label={localize('Anticipated account turnover')}
                                                        list_items={getAccountTurnoverList()}
                                                        value={values.account_turnover}
                                                        error={touched.account_turnover && errors.account_turnover}
                                                        onChange={handleChange}
                                                    />
                                                </MobileWrapper>
                                            </fieldset>
                                            {/* Trading experience fieldset */}
                                        </FormBodySection>
                                        {has_trading_experience && (
                                            <>
                                                <FormSubHeader
                                                    title={localize('Trading experience')}
                                                    subtitle={`(${localize('All fields are required')})`}
                                                />
                                                <FormBodySection
                                                    has_side_note={is_dashboard}
                                                    side_note={localize('Tell us about your trading experience.')}
                                                >
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Forex trading experience')}
                                                                is_align_text_left
                                                                name='forex_trading_experience'
                                                                list={getForexTradingExperienceList()}
                                                                value={values.forex_trading_experience}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.forex_trading_experience &&
                                                                    errors.forex_trading_experience
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                name='forex_trading_experience'
                                                                label={localize('Forex trading experience')}
                                                                list_items={getForexTradingExperienceList()}
                                                                value={values.forex_trading_experience}
                                                                error={
                                                                    touched.forex_trading_experience &&
                                                                    errors.forex_trading_experience
                                                                }
                                                                onChange={handleChange}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('Forex trading frequency')}
                                                                is_align_text_left
                                                                name='forex_trading_frequency'
                                                                list={getForexTradingFrequencyList()}
                                                                value={values.forex_trading_frequency}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.forex_trading_frequency &&
                                                                    errors.forex_trading_frequency
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                name='forex_trading_frequency'
                                                                label={localize('Forex trading frequency')}
                                                                list_items={getForexTradingFrequencyList()}
                                                                value={values.forex_trading_frequency}
                                                                error={
                                                                    touched.forex_trading_frequency &&
                                                                    errors.forex_trading_frequency
                                                                }
                                                                onChange={handleChange}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize(
                                                                    'Binary options trading experience'
                                                                )}
                                                                is_align_text_left
                                                                name='binary_options_trading_experience'
                                                                list={getBinaryOptionsTradingExperienceList()}
                                                                value={values.binary_options_trading_experience}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.binary_options_trading_experience &&
                                                                    errors.binary_options_trading_experience
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                name='binary_options_trading_experience'
                                                                label={localize('Binary options trading experience')}
                                                                list_items={getBinaryOptionsTradingExperienceList()}
                                                                value={values.binary_options_trading_experience}
                                                                error={
                                                                    touched.binary_options_trading_experience &&
                                                                    errors.binary_options_trading_experience
                                                                }
                                                                onChange={handleChange}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize(
                                                                    'Binary options trading frequency'
                                                                )}
                                                                is_align_text_left
                                                                name='binary_options_trading_frequency'
                                                                list={getBinaryOptionsTradingFrequencyList()}
                                                                value={values.binary_options_trading_frequency}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.binary_options_trading_frequency &&
                                                                    errors.binary_options_trading_frequency
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                name='binary_options_trading_frequency'
                                                                label={localize('Binary options trading frequency')}
                                                                list_items={getBinaryOptionsTradingFrequencyList()}
                                                                value={values.binary_options_trading_frequency}
                                                                error={
                                                                    touched.binary_options_trading_frequency &&
                                                                    errors.binary_options_trading_frequency
                                                                }
                                                                onChange={handleChange}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('CFD trading experience')}
                                                                is_align_text_left
                                                                name='cfd_trading_experience'
                                                                list={getCfdTradingExperienceList()}
                                                                value={values.cfd_trading_experience}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.cfd_trading_experience &&
                                                                    errors.cfd_trading_experience
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                name='cfd_trading_experience'
                                                                label={localize('CFD trading experience')}
                                                                list_items={getCfdTradingExperienceList()}
                                                                value={values.cfd_trading_experience}
                                                                error={
                                                                    touched.cfd_trading_experience &&
                                                                    errors.cfd_trading_experience
                                                                }
                                                                onChange={handleChange}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize('CFD trading frequency')}
                                                                is_align_text_left
                                                                name='cfd_trading_frequency'
                                                                list={getCfdTradingFrequencyList()}
                                                                value={values.cfd_trading_frequency}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.cfd_trading_frequency &&
                                                                    errors.cfd_trading_frequency
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                name='cfd_trading_frequency'
                                                                label={localize('CFD trading frequency')}
                                                                list_items={getCfdTradingFrequencyList()}
                                                                value={values.cfd_trading_frequency}
                                                                error={
                                                                    touched.cfd_trading_frequency &&
                                                                    errors.cfd_trading_frequency
                                                                }
                                                                onChange={handleChange}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize(
                                                                    'Other trading instruments experience'
                                                                )}
                                                                is_align_text_left
                                                                name='other_instruments_trading_experience'
                                                                list={getOtherInstrumentsTradingExperienceList()}
                                                                value={values.other_instruments_trading_experience}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.other_instruments_trading_experience &&
                                                                    errors.other_instruments_trading_experience
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                name='other_instruments_trading_experience'
                                                                label={localize('Other trading instruments experience')}
                                                                list_items={getOtherInstrumentsTradingExperienceList()}
                                                                value={values.other_instruments_trading_experience}
                                                                error={
                                                                    touched.other_instruments_trading_experience &&
                                                                    errors.other_instruments_trading_experience
                                                                }
                                                                onChange={handleChange}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                    <fieldset className='account-form__fieldset'>
                                                        <DesktopWrapper>
                                                            <Dropdown
                                                                placeholder={localize(
                                                                    'Other trading instruments frequency'
                                                                )}
                                                                is_alignment_top
                                                                is_align_text_left
                                                                name='other_instruments_trading_frequency'
                                                                list={getOtherInstrumentsTradingFrequencyList()}
                                                                value={values.other_instruments_trading_frequency}
                                                                onChange={handleChange}
                                                                handleBlur={handleBlur}
                                                                error={
                                                                    touched.other_instruments_trading_frequency &&
                                                                    errors.other_instruments_trading_frequency
                                                                }
                                                            />
                                                        </DesktopWrapper>
                                                        <MobileWrapper>
                                                            <SelectNative
                                                                placeholder={localize('Please select')}
                                                                name='other_instruments_trading_frequency'
                                                                label={localize('Other trading instruments frequency')}
                                                                list_items={getOtherInstrumentsTradingFrequencyList()}
                                                                value={values.other_instruments_trading_frequency}
                                                                error={
                                                                    touched.other_instruments_trading_frequency &&
                                                                    errors.other_instruments_trading_frequency
                                                                }
                                                                onChange={handleChange}
                                                            />
                                                        </MobileWrapper>
                                                    </fieldset>
                                                </FormBodySection>
                                            </>
                                        )}
                                    </FormBody>
                                    <FormFooter>
                                        {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                        {isMobile() && !is_dashboard && (
                                            <Text
                                                align='center'
                                                size='xxs'
                                                className='account-form__footer-all-fields-required'
                                            >
                                                {localize('All fields are required')}
                                            </Text>
                                        )}
                                        <Button
                                            type='button'
                                            className={classNames('account-form__footer-btn', {
                                                'dc-btn--green': is_submit_success,
                                            })}
                                            onClick={() => this.onClickSubmit(handleSubmit)}
                                            is_disabled={isSubmitting || !dirty || Object.keys(errors).length > 0}
                                            has_effect
                                            is_loading={is_btn_loading}
                                            is_submit_success={is_submit_success}
                                            text={is_dashboard ? localize('Save') : localize('Submit')}
                                            large
                                            primary
                                        />
                                    </FormFooter>
                                </form>
                            )}
                        </>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}

// FinancialAssessment.propTypes = {};
export default connect(({ client, common, ui }) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    is_virtual: client.is_virtual,
    is_high_risk: client.is_high_risk,
    is_financial_account: client.is_financial_account,
    is_trading_experience_incomplete: client.is_trading_experience_incomplete,
    is_financial_information_incomplete: client.is_financial_information_incomplete,
    is_svg: client.is_svg,
    removeNotificationMessage: ui.removeNotificationMessage,
    removeNotificationByKey: ui.removeNotificationByKey,
    routeBackInApp: common.routeBackInApp,
}))(withRouter(FinancialAssessment));
