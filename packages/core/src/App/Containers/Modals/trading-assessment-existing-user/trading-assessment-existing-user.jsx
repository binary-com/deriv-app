import React from 'react';
import { Modal, MobileDialog } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import TradingAssessmentForm from '@deriv/account/src/Components/trading-assessment/trading-assessment-form';
import tradingAssessmentConfig from '@deriv/account/src/Configs/trading-assessment-config';
import RiskToleranceWarningModal from '@deriv/account/src/Components/trading-assessment/risk-tolerance-warning-modal';
import TradingExperienceModal from '../trading-experience-modal';
import './trading-assessment-existing-user.scss';
import { observer, useStore } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';

const TradingAssessmentExistingUser = observer(() => {
    // Get the Trading assessment questions and initial_value
    const { client, ui } = useStore();
    const { isDesktop } = useDevice();
    const {
        setFinancialAndTradingAssessment,
        updateAccountStatus,
        landing_company_shortcode: active_account_landing_company,
    } = client;
    const {
        should_show_risk_warning_modal,
        setShouldShowRiskWarningModal,
        setShouldShowWarningModal,
        should_show_trade_assessment_form,
        setShouldShowTradeAssessmentForm,
        setShouldShowAssessmentCompleteModal,
        setIsTradingAssessmentForExistingUserEnabled,
        setIsTradingAssessmentForNewUserEnabled,
        setShouldShowTradingAssessmentModal,
        setSubSectionIndex,
    } = ui;
    const [form_values, setFormValue] = React.useState({});
    const [assessment_questions, setAssessmentQuestions] = React.useState({});
    const [should_move_to_next, setShouldMoveToNext] = React.useState(false);

    React.useEffect(() => {
        localStorage.removeItem('current_question_index');
        setIsTradingAssessmentForExistingUserEnabled(true);
        const { form_value, props } = tradingAssessmentConfig(
            { real_account_signup_target: active_account_landing_company },
            null
        );
        setFormValue(form_value);
        setAssessmentQuestions(props.assessment_questions ?? []);
        return () => setIsTradingAssessmentForExistingUserEnabled(false);
    }, []);

    const handleSubmit = async values => {
        if (values.risk_tolerance === 'No') {
            setShouldShowTradeAssessmentForm(false);
            setShouldShowRiskWarningModal(true);
        } else {
            const form_payload = {
                trading_experience_regulated: { ...values },
            };
            const response = await setFinancialAndTradingAssessment(form_payload);
            const { trading_score } = response.set_financial_assessment ?? {};
            await updateAccountStatus();
            setShouldShowTradeAssessmentForm(false);
            if (trading_score === 0) {
                setShouldShowWarningModal(true);
            } else {
                setShouldShowAssessmentCompleteModal(true);
            }
            setIsTradingAssessmentForNewUserEnabled(true);
        }
    };

    const handleAcceptRisk = () => {
        setFormValue(prev_state => ({ ...prev_state, risk_tolerance: 'Yes' }));
        setShouldMoveToNext(true);
        setShouldShowRiskWarningModal(false);
        setShouldShowTradeAssessmentForm(true);
    };

    const handleCancel = () => {
        setShouldShowTradingAssessmentModal(true);
        setShouldShowTradeAssessmentForm(false);
    };

    if (should_show_risk_warning_modal) {
        return (
            <RiskToleranceWarningModal
                show_risk_modal={should_show_risk_warning_modal}
                title={localize('Risk Tolerance Warning')}
                button_text={localize('Yes, I understand the risk.')}
                handleAcceptRisk={handleAcceptRisk}
                body_content={
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money. <0/><0/> To continue, you must confirm that you understand your capital is at risk.'
                        components={[<br key={0} />]}
                    />
                }
                has_icon
                has_sub_header
            />
        );
    } else if (should_show_trade_assessment_form) {
        return (
            <React.Fragment>
                {isDesktop ? (
                    <Modal
                        is_open={should_show_trade_assessment_form}
                        title={localize('Trading Experience Assessment')}
                        width='904px'
                        has_close_icon={false}
                        height='688px'
                        className='real-account-signup-modal'
                    >
                        <TradingAssessmentForm
                            assessment_questions={assessment_questions}
                            form_value={form_values}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            setSubSectionIndex={setSubSectionIndex}
                            class_name='trading-assessment--existing-user'
                            should_move_to_next={should_move_to_next}
                        />
                    </Modal>
                ) : (
                    <MobileDialog
                        visible={should_show_trade_assessment_form}
                        title={localize('Trading Experience Assessment')}
                        portal_element_id='modal_root'
                        has_close_icon={false}
                    >
                        <TradingAssessmentForm
                            assessment_questions={assessment_questions}
                            form_value={form_values}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            setSubSectionIndex={setSubSectionIndex}
                            class_name='trading-assessment--existing-user'
                            should_move_to_next={should_move_to_next}
                            is_responsive={!isDesktop}
                        />
                    </MobileDialog>
                )}
            </React.Fragment>
        );
    }
    return <TradingExperienceModal />;
});

export default TradingAssessmentExistingUser;
