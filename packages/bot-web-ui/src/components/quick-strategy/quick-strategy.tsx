import React from 'react';
import { Form as FormikForm, Formik } from 'formik';
import * as Yup from 'yup';

import { ApiHelpers } from '@deriv/bot-skeleton';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper, Modal } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';

import { useDBotStore } from 'Stores/useDBotStore';

import DesktopFormWrapper from './form-wrappers/desktop-form-wrapper';
import MobileFormWrapper from './form-wrappers/mobile-form-wrapper';
import { SIZE_MIN, STRATEGIES } from './config';
import Form from './form';
import { TConfigItem, TDurationItemRaw, TFormData } from './types';

import './quick-strategy.scss';

type TFormikWrapper = {
    children: React.ReactNode;
};

const FormikWrapper: React.FC<TFormikWrapper> = observer(({ children }) => {
    const { quick_strategy_store_1 } = useDBotStore();
    const [duration, setDuration] = React.useState<TDurationItemRaw | null>(null);
    const { selected_strategy, form_data, onSubmit } = quick_strategy_store_1;
    const config: TConfigItem[][] = STRATEGIES[selected_strategy]?.fields;

    const initial_value: { [key: string]: string } = {
        symbol: '1HZ100V',
        tradetype: '',
        durationtype: 't',
        stake: '1',
        loss: '0',
        profit: '0',
        size: String(SIZE_MIN),
        duration: '1',
        unit: '0',
    };

    React.useEffect(() => {
        const data = JSON.parse(localStorage.getItem('qs-fields') || '{}');
        Object.keys(data).forEach(key => {
            initial_value[key] = data[key];
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const getDurations = async () => {
            const { contracts_for } = ApiHelpers.instance;
            const durations = await contracts_for.getDurations(form_data.symbol, form_data.tradetype);
            const d = durations.find((duration: TDurationItemRaw) => duration.unit === form_data.durationtype);
            setDuration(d);
        };
        getDurations();
    }, [form_data.symbol, form_data.tradetype, form_data.durationtype]);

    const getErrors = () => {
        const sub_schema: Record<string, any> = {};
        config.forEach(group => {
            if (!group?.length) return null;
            group.forEach(field => {
                if (field?.validation?.length && field?.name) {
                    if (field.validation.includes('number')) {
                        let schema: Record<string, any> = Yup.number().typeError(localize('Must be a number'));
                        let min = 0;
                        let max = 10;
                        if (field.name === 'duration' && duration) {
                            min = duration.min;
                            max = duration.max;
                        }
                        field.validation.forEach(validation => {
                            if (typeof validation === 'string') {
                                switch (validation) {
                                    case 'required':
                                        schema = schema.required(localize('Field cannot be empty'));
                                        break;
                                    case 'min':
                                        schema = schema.min(
                                            min,
                                            localize('Minimum duration: {{ value }}', { value: min })
                                        );
                                        break;
                                    case 'max':
                                        schema = schema.max(
                                            max,
                                            localize('Maximum duration {{ value }}', { value: max })
                                        );
                                        break;
                                    case 'ceil':
                                        schema = schema.round('ceil');
                                        break;
                                    case 'floor':
                                        schema = schema.round('floor');
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
                        sub_schema[field.name] = schema;
                    }
                }
            });
        });
        return Yup.object().shape(sub_schema);
    };

    const handleSubmit = (form_data: TFormData) => {
        onSubmit(form_data, true); // true to load and run the bot
        localStorage.setItem('qs-fields', JSON.stringify(form_data));
    };

    return (
        <Formik initialValues={initial_value} validationSchema={getErrors()} onSubmit={handleSubmit}>
            {children}
        </Formik>
    );
});

const QuickStrategy = observer(() => {
    const { quick_strategy_store_1 } = useDBotStore();
    const { is_open, setFormVisibility } = quick_strategy_store_1;

    const handleClose = () => {
        setFormVisibility(false);
    };

    return (
        <FormikWrapper>
            <FormikForm>
                <MobileWrapper>
                    <MobileFullPageModal
                        is_modal_open={is_open}
                        className='quick-strategy__wrapper'
                        header={localize('Quick Strategy')}
                        onClickClose={handleClose}
                        height_offset='8rem'
                    >
                        <MobileFormWrapper>
                            <Form />
                        </MobileFormWrapper>
                    </MobileFullPageModal>
                </MobileWrapper>
                <DesktopWrapper>
                    <Modal className='modal--strategy' is_open={is_open} width={'99.6rem'}>
                        <DesktopFormWrapper>
                            <Form />
                        </DesktopFormWrapper>
                    </Modal>
                </DesktopWrapper>
            </FormikForm>
        </FormikWrapper>
    );
});

export default QuickStrategy;
