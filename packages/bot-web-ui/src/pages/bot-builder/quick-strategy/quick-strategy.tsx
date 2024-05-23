import React, { useRef, useState } from 'react';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';
import { config as qs_config } from '@deriv/bot-skeleton';
import { MobileFullPageModal, Modal } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderStackSendQsCloseEvent } from './analytics/rudderstack-quick-strategy';
import DesktopFormWrapper from './form-wrappers/desktop-form-wrapper';
import MobileFormWrapper from './form-wrappers/mobile-form-wrapper';
import LossThresholdWarningDialog from './parts/loss-threshold-warning-dialog';
import { STRATEGIES } from './config';
import Form from './form';
import { TConfigItem, TFormData, TFormValues } from './types';
import './quick-strategy.scss';

type TFormikWrapper = {
    children: React.ReactNode;
};

const getErrorMessage = (dir: 'MIN' | 'MAX', value: number, type = 'DEFAULT') => {
    const errors: { [key: string]: { MIN: string; MAX: string } } = {
        DURATION: {
            MIN: localize('Minimum duration: {{ value }}', { value }),
            MAX: localize('Maximum duration: {{ value }}', { value }),
        },
        LAST_DIGIT_PREDICTION: {
            MIN: localize('Enter a value from {{ value }} to 9.', { value }),
            MAX: localize('Enter a value from 0 to {{ value }}.', { value }),
        },
        DEFAULT: {
            MIN: localize('The value must be equal or greater than {{ value }}', { value }),
            MAX: localize('The value must be equal or less than {{ value }}', { value }),
        },
    };
    return errors[type][dir];
};

const FormikWrapper: React.FC<TFormikWrapper> = observer(({ children }) => {
    const { quick_strategy } = useDBotStore();
    const { selected_strategy, form_data, setValue, current_duration_min_max, initializeLossThresholdWarningData } =
        quick_strategy;
    const config: TConfigItem[][] = STRATEGIES[selected_strategy]?.fields;
    const [dynamic_schema, setDynamicSchema] = useState(Yup.object().shape({}));
    const is_mounted = useRef(true);

    const initial_value: TFormData = {
        symbol: qs_config.QUICK_STRATEGY.DEFAULT.symbol,
        tradetype: '',
        durationtype: qs_config.QUICK_STRATEGY.DEFAULT.durationtype,
        stake: '1',
        loss: '',
        profit: '',
        size: String(qs_config.QUICK_STRATEGY.DEFAULT.size),
        duration: '1',
        unit: String(qs_config.QUICK_STRATEGY.DEFAULT.unit),
        action: 'RUN',
        max_stake: 10,
        boolean_max_stake: false,
        last_digit_prediction: 1,
    };

    React.useEffect(() => {
        return () => {
            is_mounted.current = false;
        };
    }, []);

    React.useEffect(() => {
        const data = JSON.parse(localStorage.getItem('qs-fields') || '{}');
        Object.keys(data).forEach(key => {
            initial_value[key as keyof TFormData] = data[key];
            setValue(key, data[key]);
        });
        initializeLossThresholdWarningData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getErrors = (formikData: TFormData) => {
        const sub_schema: Record<string, any> = {};
        config.forEach(group => {
            if (!group?.length) return null;
            group.forEach(field => {
                if (field?.validation?.length && field?.name) {
                    if (field.validation.includes('number')) {
                        let schema: Record<string, any> = Yup.number().typeError(localize('Must be a number'));
                        let min = 0;
                        let max = 10;
                        let min_error = getErrorMessage('MIN', min);
                        let max_error = getErrorMessage('MAX', max);
                        let integer_error_message = '';
                        if (field.name === 'duration' && current_duration_min_max) {
                            min = current_duration_min_max.min;
                            max = current_duration_min_max.max;
                            min_error = getErrorMessage('MIN', min, 'DURATION');
                            max_error = getErrorMessage('MAX', max, 'DURATION');
                        }
                        const should_validate = field.should_have
                            ? field.should_have?.every(item => {
                                  const item_value = formikData?.[item.key]?.toString();
                                  if (item.multiple) return item.multiple.includes(item_value);
                                  return formikData?.[item.key] === item.value;
                              })
                            : true;
                        if (should_validate && field.name === 'max_stake') {
                            min = +form_data?.stake;
                            if (isNaN(min)) {
                                min = +initial_value.stake;
                            }
                            min_error = getErrorMessage('MIN', min);
                        }
                        if (should_validate && field.name === 'last_digit_prediction') {
                            min = 0;
                            max = 9;
                            max_error = getErrorMessage('MAX', max, 'LAST_DIGIT_PREDICTION');
                            integer_error_message = 'Enter a value from 0 to 9.';
                        }
                        if (should_validate) {
                            field.validation.forEach(validation => {
                                if (typeof validation === 'string') {
                                    switch (validation) {
                                        case 'required':
                                            schema = schema.required(localize('Field cannot be empty'));
                                            break;
                                        case 'min':
                                            schema = schema.min(min, min_error);
                                            break;
                                        case 'max':
                                            schema = schema.max(max, max_error);
                                            break;
                                        case 'ceil':
                                            schema = schema.round('ceil');
                                            break;
                                        case 'floor':
                                            schema = schema.round('floor');
                                            break;
                                        case 'integer':
                                            schema = schema.integer(integer_error_message);
                                            break;
                                        default:
                                            break;
                                    }
                                } else if (typeof validation === 'object') {
                                    if (validation?.type) {
                                        schema = schema[validation.type](
                                            validation.value,
                                            localize(validation.getMessage(validation.value))
                                        );
                                    }
                                }
                            });
                        }
                        sub_schema[field.name] = schema;
                    }
                }
            });
        });
        if (is_mounted.current) {
            setDynamicSchema(Yup.object().shape(sub_schema));
        }
    };

    const handleSubmit = (form_data: TFormData) => {
        getErrors(form_data);
        localStorage?.setItem('qs-fields', JSON.stringify(form_data));
        return form_data;
    };

    return (
        <Formik
            initialValues={initial_value}
            validationSchema={dynamic_schema}
            onSubmit={handleSubmit}
            validate={values => getErrors(values)}
            validateOnChange={false}
        >
            {children}
        </Formik>
    );
});

const QuickStrategy = observer(() => {
    const { quick_strategy } = useDBotStore();
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { is_open, setFormVisibility, form_data, selected_strategy } = quick_strategy;

    const active_tab_ref = useRef<HTMLDivElement>(null);

    const sendRudderStackQsFormCloseData = () => {
        const active_tab =
            active_tab_ref.current?.querySelector('.active')?.textContent?.toLowerCase() === 'learn more'
                ? 'learn more'
                : 'trade parameters';
        rudderStackSendQsCloseEvent({
            quick_strategy_tab: active_tab,
            selected_strategy,
            form_values: form_data as TFormValues,
        });
    };

    const handleClose = () => {
        sendRudderStackQsFormCloseData();
        setFormVisibility(false);
    };

    return (
        <FormikWrapper>
            <FormikForm>
                <LossThresholdWarningDialog />
                {is_mobile ? (
                    <MobileFullPageModal
                        is_modal_open={is_open}
                        className='quick-strategy__wrapper'
                        header={localize('Quick Strategy')}
                        onClickClose={handleClose}
                        height_offset='8rem'
                    >
                        <MobileFormWrapper active_tab_ref={active_tab_ref}>
                            <Form />
                        </MobileFormWrapper>
                    </MobileFullPageModal>
                ) : (
                    <Modal className='modal--strategy' is_open={is_open} width='72rem'>
                        <DesktopFormWrapper onClickClose={handleClose} active_tab_ref={active_tab_ref}>
                            <Form />
                        </DesktopFormWrapper>
                    </Modal>
                )}
            </FormikForm>
        </FormikWrapper>
    );
});

export default QuickStrategy;
