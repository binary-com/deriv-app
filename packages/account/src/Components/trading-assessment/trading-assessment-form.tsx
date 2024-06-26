import { useState, useEffect, ChangeEvent, Fragment } from 'react';
import clsx from 'clsx';
import { observer, useStore } from '@deriv/stores';
import { Formik, Form, FormikErrors, FormikHelpers } from 'formik';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import TradingAssessmentRadioButton from './trading-assessment-radio-buttons';
import TradingAssessmentDropdown from './trading-assessment-dropdown';
import { getTradingAssessmentQuestions } from '../../Constants/trading-assessment-questions';
import { TTradingAssessmentForm, TQuestion } from 'Types';
import ScrollToFieldWithError from '../forms/scroll-to-field-with-error';
import { MAX_QUESTION_TEXT_LENGTH } from '../../Constants/trading-assessment';
import InlineNoteWithIcon from '../inline-note-with-icon';

type TradingAssessmentFormProps = {
    class_name?: string;
    disabled_items: string[];
    form_value: TTradingAssessmentForm;
    getCurrentStep?: () => number;
    onSubmit: (values?: TTradingAssessmentForm, should_override?: boolean) => void;
    onCancel: (form_data: TTradingAssessmentForm) => void;
    onSave?: (current_step: number, values: TTradingAssessmentForm) => void;
    should_move_to_next: boolean;
    setSubSectionIndex: (index: number) => void;
    is_independent_section: boolean;
    is_responsive?: boolean;
};

const TradingAssessmentForm = observer(
    ({
        class_name,
        disabled_items,
        form_value,
        getCurrentStep,
        onSubmit,
        onCancel,
        onSave,
        should_move_to_next,
        setSubSectionIndex,
        is_independent_section,
        is_responsive,
    }: TradingAssessmentFormProps) => {
        const { traders_hub } = useStore();
        const { is_eu_user } = traders_hub;
        const assessment_questions = getTradingAssessmentQuestions();
        const stored_items = parseInt(localStorage.getItem('current_question_index') ?? '0');
        const [is_section_filled, setIsSectionFilled] = useState(false);
        const [current_question_details, setCurrentQuestionDetails] = useState({
            current_question_index: 0,
            current_question: assessment_questions[stored_items],
        });
        const [form_data, setFormData] = useState<TTradingAssessmentForm>({ ...form_value });
        const last_question_index = assessment_questions.length - 1;
        const should_display_previous_button = is_independent_section
            ? current_question_details.current_question_index !== 0
            : true;

        type TField = keyof typeof form_value;

        useEffect(() => {
            setCurrentQuestionDetails(prevState => {
                return {
                    ...prevState,
                    current_question_index: stored_items || 0,
                    current_question: stored_items
                        ? assessment_questions[stored_items]
                        : assessment_questions[prevState.current_question_index],
                };
            });
            if (!is_independent_section) {
                setSubSectionIndex(stored_items);
            }
            setFormData(form_value);
        }, []);

        useEffect(() => {
            if (should_move_to_next) displayNextPage();
        }, [should_move_to_next]);

        const displayNextPage = () => {
            if (form_data.risk_tolerance === 'No') {
                // onSubmit hold reference to a function that takes 2 params - values, should_override
                onSubmit(form_data, true);
            } else {
                const next_question = current_question_details.current_question_index + 1;

                if (next_question < assessment_questions.length) {
                    setCurrentQuestionDetails(prev_state_question => {
                        const next_state_question_index = prev_state_question.current_question_index + 1;
                        localStorage.setItem('current_question_index', String(next_state_question_index));
                        // Sub section form progress is not required when the section is independent
                        if (!is_independent_section) {
                            setSubSectionIndex(next_state_question_index);
                        }
                        return {
                            current_question_index: next_state_question_index,
                            current_question: assessment_questions[next_state_question_index],
                        };
                    });
                }
            }
        };

        const displayPreviousPage = () => {
            const prev_question = current_question_details.current_question_index - 1;
            if (prev_question >= 0) {
                setCurrentQuestionDetails(prev_state_question => {
                    const prev_state_question_index = prev_state_question.current_question_index - 1;
                    localStorage.setItem('current_question_index', String(prev_state_question_index));
                    if (!is_independent_section) {
                        setSubSectionIndex(prev_state_question_index);
                    }
                    return {
                        current_question_index: prev_state_question_index,
                        current_question: assessment_questions[prev_state_question_index],
                    };
                });
            } else {
                onCancel(form_data);
            }
        };

        const handleValueSelection = (
            e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>,
            form_control: keyof TTradingAssessmentForm,
            callBackFn: (form_control: keyof TTradingAssessmentForm, value: string) => void
        ) => {
            if (typeof e.persist === 'function') e.persist();
            callBackFn(form_control, e.target.value);
            setFormData(prev_form => ({ ...prev_form, [form_control]: e.target.value }));
        };

        const isAssessmentCompleted = (answers: TTradingAssessmentForm) =>
            Object.values(answers).every(answer => Boolean(answer));

        const nextButtonHandler = (
            values: TTradingAssessmentForm,
            { setTouched }: FormikHelpers<TTradingAssessmentForm>
        ) => {
            if (is_section_filled) {
                if (isAssessmentCompleted(values) && stored_items === last_question_index) {
                    onSubmit(values);
                } else {
                    setTouched({});
                    displayNextPage();
                }
            }
        };

        const handleValidate = (values: TTradingAssessmentForm) => {
            const current_step = (getCurrentStep?.() || 1) - 1;
            onSave?.(current_step, values);

            const errors: FormikErrors<TTradingAssessmentForm> = {};

            if (!values.risk_tolerance && current_question_details.current_question.section === 'risk_tolerance') {
                errors.risk_tolerance = 'error';
            }
            if (
                !values.source_of_experience &&
                current_question_details.current_question.section === 'source_of_experience'
            ) {
                errors.source_of_experience = 'error';
            }
            if (current_question_details.current_question.section === 'trading_experience') {
                const trading_experience_required_fields: (keyof TTradingAssessmentForm)[] = [
                    'cfd_experience',
                    'cfd_frequency',
                    'trading_experience_financial_instruments',
                    'trading_frequency_financial_instruments',
                ];
                trading_experience_required_fields.forEach(field => {
                    if (!values[field]) {
                        errors[field] = localize('Please select an option');
                    }
                });
            }
            if (current_question_details.current_question.section === 'trading_knowledge') {
                const trading_knowledge_required_fields: (keyof TTradingAssessmentForm)[] = [
                    'cfd_trading_definition',
                    'leverage_impact_trading',
                    'leverage_trading_high_risk_stop_loss',
                    'required_initial_margin',
                ];
                trading_knowledge_required_fields.forEach(field => {
                    if (!values[field] && current_question_details.current_question.form_control === field) {
                        errors[field] = 'error';
                    }
                });
            }

            return errors;
        };

        return (
            <div className={clsx('trading-assessment', class_name)}>
                {is_eu_user ? (
                    <div className='details-form__banner-container'>
                        <InlineNoteWithIcon
                            icon='IcAlertWarning'
                            message={localize(
                                'To assess your trading experience and if our products are suitable for you. Please provide accurate and complete answers, as they may affect the outcome of this assessment.'
                            )}
                            title={localize('Why do we collect this?')}
                        />
                    </div>
                ) : (
                    <Text as='p' color='prominent' size='xxs' className='trading-assessment__side-note'>
                        <Localize i18n_default_text='In providing our services to you, we are required to obtain information from you in order to assess whether a given product or service is appropriate for you.' />
                    </Text>
                )}
                <Formik initialValues={{ ...form_value }} validate={handleValidate} onSubmit={nextButtonHandler}>
                    {({ errors, setFieldValue, values, setErrors, touched }) => {
                        const { question_text, form_control, answer_options, questions } =
                            current_question_details.current_question;
                        const has_long_question = questions?.some(
                            question => question.question_text.length > MAX_QUESTION_TEXT_LENGTH
                        );
                        const is_section_required = Object.keys(values).some(
                            field => !!errors[field as TField] && !!touched[field as TField]
                        );

                        return (
                            <Fragment>
                                <Text weight='bold' size='xs' className='trading-assessment__question-counter'>
                                    <Localize
                                        i18n_default_text='Question {{ current }} of {{ total }}'
                                        values={{
                                            current: current_question_details.current_question_index + 1,
                                            total: last_question_index + 1,
                                        }}
                                    />
                                    <Text color='loss-danger' size='xxs'>
                                        {is_section_required && <Localize i18n_default_text={'* This is required'} />}
                                    </Text>
                                </Text>
                                <section className={'trading-assessment__form'}>
                                    <Form noValidate className='trading-assessment__form--layout'>
                                        <ScrollToFieldWithError should_recollect_inputs_names={is_section_filled} />
                                        <div
                                            className={clsx('trading-assessment__form--fields', {
                                                'field-layout': has_long_question,
                                            })}
                                        >
                                            {questions?.length ? (
                                                <TradingAssessmentDropdown
                                                    item_list={questions as TQuestion[]}
                                                    onChange={handleValueSelection}
                                                    values={values}
                                                    setFieldValue={setFieldValue}
                                                    setEnableNextSection={setIsSectionFilled}
                                                    disabled_items={disabled_items ?? []}
                                                />
                                            ) : (
                                                <TradingAssessmentRadioButton
                                                    text={question_text}
                                                    list={answer_options ?? []}
                                                    onChange={e => {
                                                        handleValueSelection(
                                                            e,
                                                            form_control as keyof TTradingAssessmentForm,
                                                            setFieldValue
                                                        );
                                                    }}
                                                    values={values}
                                                    form_control={form_control as keyof TTradingAssessmentForm}
                                                    setEnableNextSection={setIsSectionFilled}
                                                    disabled_items={disabled_items ?? []}
                                                />
                                            )}
                                        </div>
                                        <Modal.Footer
                                            has_separator
                                            is_bypassed={is_responsive}
                                            className='trading-assessment__existing_btn '
                                        >
                                            <Button.Group className='trading-assessment__btn-group'>
                                                {should_display_previous_button && (
                                                    <Button
                                                        has_effect
                                                        onClick={() => {
                                                            setErrors({});
                                                            displayPreviousPage();
                                                        }}
                                                        text={localize('Previous')}
                                                        type='button'
                                                        secondary
                                                        large
                                                        className='trading-assessment__btn-group--btn'
                                                    />
                                                )}
                                                <Button
                                                    has_effect
                                                    text={localize('Next')}
                                                    large
                                                    primary
                                                    className='trading-assessment__btn-group--btn'
                                                    name='Next'
                                                />
                                            </Button.Group>
                                        </Modal.Footer>
                                    </Form>
                                </section>
                            </Fragment>
                        );
                    }}
                </Formik>
            </div>
        );
    }
);

export default TradingAssessmentForm;
