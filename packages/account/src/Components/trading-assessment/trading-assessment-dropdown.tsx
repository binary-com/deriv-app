import React from 'react';
import clsx from 'clsx';
import { Field } from 'formik';
import { Dropdown, Text, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import { TTradingAssessmentForm, TQuestion } from 'Types';
import { MAX_QUESTION_TEXT_LENGTH } from '../../Constants/trading-assessment';
import { useDevice } from '@deriv-com/ui';

type TradingAssessmentDropdownProps = {
    disabled_items: string[];
    item_list: TQuestion[];
    onChange: (
        e: React.ChangeEvent<HTMLSelectElement>,
        form_control: keyof TTradingAssessmentForm,
        setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void
    ) => void;
    values: TTradingAssessmentForm;
    setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
    setEnableNextSection: (enable: boolean) => void;
};

type TField = {
    field: {
        name: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    };
    meta: {
        error: string;
        touched: string;
    };
};

const TradingAssessmentDropdown = ({
    disabled_items,
    item_list,
    onChange,
    values,
    setFieldValue,
    setEnableNextSection,
}: TradingAssessmentDropdownProps) => {
    React.useEffect(() => {
        checkIfAllFieldsFilled();
    }, [values]);

    const { isDesktop } = useDevice();

    const checkIfAllFieldsFilled = () => {
        if (values) {
            setEnableNextSection(
                Boolean(
                    values.cfd_experience &&
                        values.cfd_frequency &&
                        values.trading_experience_financial_instruments &&
                        values.trading_frequency_financial_instruments
                )
            );
        }
    };

    return (
        <div className='trading-assessment__wrapper__dropdown'>
            {item_list.map(question => (
                <Field name={question.form_control} key={question.form_control}>
                    {({ field, meta }: TField) => {
                        const should_extend_trading_frequency_field =
                            question.form_control === 'trading_frequency_financial_instruments' &&
                            question?.question_text.length > MAX_QUESTION_TEXT_LENGTH;

                        return (
                            <React.Fragment>
                                {isDesktop ? (
                                    <Dropdown
                                        {...field}
                                        classNameDisplay={clsx({
                                            'trading-frequency--field': should_extend_trading_frequency_field,
                                        })}
                                        is_align_text_left
                                        name={question?.form_control}
                                        placeholder={question?.question_text}
                                        list={question?.answer_options}
                                        onChange={e =>
                                            onChange(
                                                e as React.ChangeEvent<HTMLSelectElement>,
                                                question.form_control,
                                                setFieldValue
                                            )
                                        }
                                        value={values[question.form_control]}
                                        disabled={disabled_items.includes(question.form_control)}
                                        error={meta.touched && meta.error}
                                    />
                                ) : (
                                    <React.Fragment>
                                        <Text as='h1' color='prominent' weight='bold' size='xs'>
                                            {question?.question_text}
                                        </Text>
                                        <SelectNative
                                            {...field}
                                            placeholder={localize('Please select')}
                                            label={localize('Please select')}
                                            name={question?.form_control}
                                            list_items={question?.answer_options}
                                            onChange={e => {
                                                onChange(e, question.form_control, setFieldValue);
                                            }}
                                            value={values[question.form_control]}
                                            hide_top_placeholder
                                            disabled={disabled_items.includes(question.form_control)}
                                            error={meta.touched && meta.error}
                                        />
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        );
                    }}
                </Field>
            ))}
        </div>
    );
};

export default TradingAssessmentDropdown;
