import React from 'react';
import { Button, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { FormikWrapper } from '../bot-builder/quick-strategy/quick-strategy';
import { useFormikContext, Form as FormikForm } from 'formik';
import QuickStrategyForm from '../bot-builder/quick-strategy/form';
import { TFormValues } from '../bot-builder/quick-strategy/types';

type TServerQSForm = {
    add_btn_active: boolean;
    setAddBtnActive: (add_btn_active: boolean) => void;
    createBot: () => void;
};

type TInnerServerForm = {
    setAddBtnActive: (add_btn_active: boolean) => void;
    createBot: () => void;
};

const InnerServerForm = ({ setAddBtnActive }: TInnerServerForm) => {
    const { isValid, setFieldValue } = useFormikContext<TFormValues>();

    const handleSubmit = async (action: string) => {
        await setFieldValue('action', action);
        setAddBtnActive(false);
    };

    return (
        <div className='qs__body__content__form'>
            <QuickStrategyForm />
            <div className='qs__body__content__footer'>
                <Button green secondary type='submit' onClick={() => handleSubmit('CREATE')} disabled={!isValid}>
                    {localize('+ Create strategy')}
                </Button>
                <Button green secondary type='submit' onClick={() => handleSubmit('RUN')} disabled={!isValid}>
                    {localize('Create & Run strategy')}
                </Button>
            </div>
        </div>
    );
};

const ServerQSForm = ({ add_btn_active, setAddBtnActive, createBot }: TServerQSForm) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    return (
        <Modal className='modal--strategy' is_open={add_btn_active} width='50rem'>
            <div className='qs server-bot-container'>
                <div className='server-bot__title'>
                    <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                        <Localize i18n_default_text='Quick strategy' />
                    </Text>
                    <Button onClick={() => setAddBtnActive(false)}>{localize('x')}</Button>
                </div>
                <ThemedScrollbars className='qs__form__container' autohide={false}>
                    <FormikWrapper>
                        <FormikForm>
                            <InnerServerForm createBot={createBot} setAddBtnActive={setAddBtnActive} />
                        </FormikForm>
                    </FormikWrapper>
                </ThemedScrollbars>
            </div>
        </Modal>
    );
};

export default ServerQSForm;
