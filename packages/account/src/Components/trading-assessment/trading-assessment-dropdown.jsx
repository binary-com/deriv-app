import React from 'react';
import { Field } from 'formik';
import { DesktopWrapper, Dropdown, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';

const TradingAssessmentDropdown = ({ item_list, onChange, values, setFieldValue, setEnableNextSection }) => {
    React.useEffect(() => {
        checkIfAllFieldsFilled();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const checkIfAllFieldsFilled = () => {
        let is_next_section_enabled = false;
        if (
            values.cfd_experience &&
            values.cfd_frequency &&
            values.trading_experience_financial_instruments &&
            values.trading_frequency_financial_instruments
        ) {
            is_next_section_enabled = true;
        }
        setEnableNextSection(is_next_section_enabled);
    };

    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item_list.map((question, index) => (
                <Field name={question.form_control} key={index}>
                    {() => {
                        return (
                            <React.Fragment>
                                <DesktopWrapper>
                                    <Dropdown
                                        classNameDisplay='trading-assessment__wrapper__dropdown--mobile--display'
                                        is_align_text_left
                                        name={question?.question_text}
                                        placeholder={question?.question_text}
                                        list={question?.answer_options}
                                        onChange={e => onChange(e, question.form_control, setFieldValue)}
                                        value={values[question.form_control]}
                                    />
                                </DesktopWrapper>
                                <MobileWrapper>
                                    <Text as='h1' color='prominent' weight='bold' size='xs'>
                                        {question?.question_text}
                                    </Text>
                                    <SelectNative
                                        placeholder={localize('Please select')}
                                        label={question?.answer_options[0].text}
                                        name={question?.question_text}
                                        list_items={question?.answer_options}
                                        onChange={e => {
                                            onChange(e, question.form_control, setFieldValue);
                                        }}
                                        value={values[question.form_control]}
                                        hide_placeholder={true}
                                    />
                                </MobileWrapper>
                            </React.Fragment>
                        );
                    }}
                </Field>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdown;
