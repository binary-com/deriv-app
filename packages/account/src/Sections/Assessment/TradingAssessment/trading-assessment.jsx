import React from 'react';
import { localize, Localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import FormSubHeader from 'Components/form-sub-header';
import { RiskToleranceWarningModal, TestWarningModal } from 'Components/trading-assessment';
import { getTradingAssessmentQuestions } from 'Constants/trading-assessment-questions';
import { Dropdown, SelectNative, Text, FormSubmitButton, Button, Loading } from '@deriv/components';
import FormFooter from 'Components/form-footer';
import { routes, WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useHistory, withRouter } from 'react-router';
import { Formik, Form } from 'formik';
import { useDevice } from '@deriv-com/ui';

const populateData = form_data => {
    return {
        risk_tolerance: form_data.risk_tolerance,
        source_of_experience: form_data.source_of_experience,
        cfd_experience: form_data.cfd_experience,
        cfd_frequency: form_data.cfd_frequency,
        trading_experience_financial_instruments: form_data.trading_experience_financial_instruments,
        trading_frequency_financial_instruments: form_data.trading_frequency_financial_instruments,
        cfd_trading_definition: form_data.cfd_trading_definition,
        leverage_impact_trading: form_data.leverage_impact_trading,
        leverage_trading_high_risk_stop_loss: form_data.leverage_trading_high_risk_stop_loss,
        required_initial_margin: form_data.required_initial_margin,
    };
};
const TradingAssessment = observer(() => {
    const { isDesktop } = useDevice();
    const { client } = useStore();
    const { is_virtual, setFinancialAndTradingAssessment } = client;
    const history = useHistory();
    const [is_loading, setIsLoading] = React.useState(true);
    const [is_btn_loading, setIsBtnLoading] = React.useState(false);
    const [is_submit_success, setIsSubmitSuccess] = React.useState(false);
    const [initial_form_values, setInitialFormValues] = React.useState({});
    const [should_accept_risk, setShouldAcceptRisk] = React.useState(false);
    const [should_show_warning_modal, setShouldShowWarningModal] = React.useState(false);
    const [form_data, setFormData] = React.useState({});

    React.useEffect(() => {
        if (is_virtual) {
            setIsLoading(false);
            history.push(routes.personal_details);
        } else {
            WS.authorized.storage.getFinancialAssessment().then(data => {
                // set initial form data
                setInitialFormValues(() => populateData(data.get_financial_assessment));
                setIsLoading(false);
                setIsSubmitSuccess(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async values => {
        setFormData(values);
        setIsBtnLoading(false);
        setIsSubmitSuccess(true);
        if (values.risk_tolerance === 'No') {
            setShouldAcceptRisk(true);
        } else {
            setIsBtnLoading(true);
            const response = await WS.authorized.storage.getFinancialAssessment();
            const { trading_score: prev_score } = response?.get_financial_assessment;
            const form_payload = {
                trading_experience_regulated: {
                    cfd_experience: values.cfd_experience,
                    cfd_frequency: values.cfd_frequency,
                    cfd_trading_definition: values.cfd_trading_definition,
                    leverage_impact_trading: values.leverage_impact_trading,
                    leverage_trading_high_risk_stop_loss: values.leverage_trading_high_risk_stop_loss,
                    required_initial_margin: values.required_initial_margin,
                    risk_tolerance: values.risk_tolerance,
                    source_of_experience: values.source_of_experience,
                    trading_experience_financial_instruments: values.trading_experience_financial_instruments,
                    trading_frequency_financial_instruments: values.trading_frequency_financial_instruments,
                },
            };
            const data = await setFinancialAndTradingAssessment(form_payload);
            const { trading_score } = data?.set_financial_assessment;
            setShouldShowWarningModal(prev_score > 0 && trading_score === 0);

            WS.authorized.storage.getFinancialAssessment().then(res_data => {
                setInitialFormValues(res_data.get_financial_assessment);
            });
            setIsBtnLoading(false);
            setTimeout(() => setIsSubmitSuccess(false), 10000);
        }
    };

    const handleAcceptRisk = async () => {
        await handleSubmit({ ...form_data, risk_tolerance: 'Yes' });
        setShouldAcceptRisk(false);
        setIsBtnLoading(false);
        setIsSubmitSuccess(false);
    };

    if (is_loading) return <Loading is_fullscreen={false} className='account__initial-loader' />;
    if (should_accept_risk) {
        return (
            <RiskToleranceWarningModal
                show_risk_modal
                title={localize('Risk Tolerance Warning')}
                button_text={localize('Yes, I understand the risk.')}
                handleAcceptRisk={handleAcceptRisk}
                body_content={
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money. <0/><0/> To continue, you must confirm that you understand your capital is at risk.'
                        components={[<br key={0} />]}
                    />
                }
            />
        );
    }
    if (should_show_warning_modal) {
        return (
            <TestWarningModal
                show_risk_modal={should_show_warning_modal}
                body_content={
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='In providing our services to you, we are required to ask you for some information to assess if a given product or service is appropriate for you and whether you have the experience and knowledge to understand the risks involved.<0/><0/>'
                            components={[<br key={0} />]}
                        />
                        <Localize
                            i18n_default_text='Based on your answers, it looks like you have insufficient knowledge and experience in trading CFDs. CFD trading is risky and you could potentially lose all of your capital.<0/><0/>'
                            components={[<br key={0} />]}
                        />
                        <Localize i18n_default_text='Please note that by clicking ‘OK’, you may be exposing yourself to risks. You may not have the knowledge or experience to properly assess or mitigate these risks, which may be significant, including the risk of losing the entire sum you have invested.' />
                    </Text>
                }
                footer_content={
                    <Button
                        type='button'
                        large
                        text={localize('OK')}
                        primary
                        onClick={() => setShouldShowWarningModal(false)}
                    />
                }
            />
        );
    }

    return (
        <Formik
            initialValues={initial_form_values}
            enableReinitialize
            initialTouched={false}
            onSubmit={values => {
                handleSubmit(values);
            }}
        >
            {({ values, dirty, isSubmitting, handleChange, handleBlur }) => {
                return (
                    <Form className='account-form account-form__trading-assessment'>
                        <FormBody scroll_offset={isDesktop ? '80px' : '150px'}>
                            <FormSubHeader
                                title={localize('Trading Experience')}
                                subtitle={localize('All fields are required')}
                            />
                            {getTradingAssessmentQuestions().map(item => {
                                const form_control = item.form_control;
                                if (item.field_type === 'radio') {
                                    return (
                                        <fieldset className='account-form__question' key={form_control}>
                                            {isDesktop ? (
                                                <React.Fragment>
                                                    <Text
                                                        as='h1'
                                                        color='prominent'
                                                        weight='bold'
                                                        size='xs'
                                                        className='account-form__question--text'
                                                    >
                                                        {item.question_text}
                                                    </Text>
                                                    <Dropdown
                                                        is_align_text_left
                                                        name={form_control}
                                                        value={values[form_control]}
                                                        list={item?.answer_options}
                                                        onChange={handleChange}
                                                        handleBlur={handleBlur}
                                                    />
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <Text
                                                        as='h1'
                                                        color='prominent'
                                                        weight='bold'
                                                        size='xs'
                                                        line_height='xl'
                                                        className='account-form__question--text'
                                                    >
                                                        {item?.question_text}
                                                    </Text>
                                                    <SelectNative
                                                        value={values[form_control]}
                                                        name={form_control}
                                                        list_items={item?.answer_options}
                                                        onChange={e => handleChange(e)}
                                                        should_show_empty_option={false}
                                                    />
                                                </React.Fragment>
                                            )}
                                        </fieldset>
                                    );
                                    // eslint-disable-next-line no-else-return
                                } else {
                                    return (
                                        <div key={`${form_control}_dropdown`}>
                                            {item.questions.map(items => {
                                                const sub_form_control = items.form_control;
                                                return (
                                                    <fieldset key={sub_form_control} className='account-form__question'>
                                                        {isDesktop ? (
                                                            <React.Fragment>
                                                                <Text
                                                                    as='h1'
                                                                    color='prominent'
                                                                    weight='bold'
                                                                    size='xs'
                                                                    className='account-form__question--text'
                                                                >
                                                                    {items.question_text}
                                                                </Text>
                                                                <Dropdown
                                                                    is_align_text_left
                                                                    name={sub_form_control}
                                                                    value={values[sub_form_control]}
                                                                    list={items?.answer_options}
                                                                    onChange={handleChange}
                                                                    handleBlur={handleBlur}
                                                                />
                                                            </React.Fragment>
                                                        ) : (
                                                            <React.Fragment>
                                                                <Text
                                                                    as='h1'
                                                                    color='prominent'
                                                                    weight='bold'
                                                                    size='xs'
                                                                    line_height='xl'
                                                                    className='account-form__question--text'
                                                                >
                                                                    {items?.question_text}
                                                                </Text>
                                                                <SelectNative
                                                                    value={values[sub_form_control]}
                                                                    name={sub_form_control}
                                                                    list_items={items?.answer_options}
                                                                    onChange={e => handleChange(e)}
                                                                    should_show_empty_option={false}
                                                                />
                                                            </React.Fragment>
                                                        )}
                                                    </fieldset>
                                                );
                                            })}
                                        </div>
                                    );
                                }
                            })}
                        </FormBody>
                        <FormFooter>
                            <FormSubmitButton
                                is_disabled={isSubmitting || !dirty || is_btn_loading}
                                is_loading={is_btn_loading}
                                has_effect
                                is_absolute={!isDesktop}
                                is_submit_success={is_submit_success && !dirty}
                                green={is_submit_success && !dirty}
                                label={localize('Submit')}
                            />
                        </FormFooter>
                    </Form>
                );
            }}
        </Formik>
    );
});

export default withRouter(TradingAssessment);
