import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TSelectedPaymentMethod } from 'types';
import { PageReturn, PaymentMethodField, PaymentMethodsFormFooter } from '@/components';
import { TFormState } from '@/reducers/types';
import { p2p } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { PaymentMethodFormInput } from './PaymentMethodFormInput';
import { PaymentMethodFormModalRenderer } from './PaymentMethodFormModalRenderer';
import './PaymentMethodForm.scss';

type TPaymentMethodFormProps = {
    formState: TFormState;
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onResetFormState: () => void;
};

/**
 * @component This component is used to display the form to add or edit a payment method
 * @param formState - The current state of the form
 * @returns {JSX.Element}
 * @example <PaymentMethodForm formState={formState} />
 * **/
const PaymentMethodForm = ({ onAdd, onResetFormState, ...rest }: TPaymentMethodFormProps) => {
    const {
        control,
        formState: { isDirty, isSubmitting, isValid },
        handleSubmit,
        reset,
    } = useForm({ mode: 'all' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { actionType, selectedPaymentMethod, title } = rest.formState;
    const { data: availablePaymentMethods } = p2p.paymentMethods.useGet();
    const { create, error: createError, isSuccess: isCreateSuccessful } = p2p.advertiserPaymentMethods.useCreate();
    const { error: updateError, isSuccess: isUpdateSuccessful, update } = p2p.advertiserPaymentMethods.useUpdate();

    const { isMobile } = useDevice();

    useEffect(() => {
        if (isCreateSuccessful) {
            onResetFormState();
        }
    }, [isCreateSuccessful, createError, onResetFormState]);

    useEffect(() => {
        if (isUpdateSuccessful) {
            onResetFormState();
        }
    }, [isUpdateSuccessful, onResetFormState, updateError]);

    const availablePaymentMethodsList = useMemo(() => {
        const listItems = availablePaymentMethods?.map(availablePaymentMethod => ({
            text: availablePaymentMethod?.display_name,
            value: availablePaymentMethod?.id,
        }));
        return listItems || [];
    }, [availablePaymentMethods]);
    const handleGoBack = () => {
        if (isDirty) {
            setIsModalOpen(true);
        } else {
            onResetFormState();
        }
    };

    return (
        <div className='p2p-v2-payment-method-form'>
            <PageReturn
                className='border-2 py-[1.4rem] mb-0'
                hasBorder={isMobile}
                onClick={handleGoBack}
                pageTitle={title}
                size={isMobile ? 'lg' : 'md'}
                weight='bold'
            />
            <form
                className='p2p-v2-payment-method-form__form'
                onSubmit={handleSubmit(data => {
                    const hasData = Object.keys(data).length > 0;
                    if (actionType === 'ADD' && hasData) {
                        create({ ...data, method: String(selectedPaymentMethod?.method) });
                    } else if (actionType === 'EDIT' && hasData) {
                        update(String(selectedPaymentMethod?.id), {
                            ...data,
                            method: String(selectedPaymentMethod?.method),
                        });
                    }
                })}
            >
                <div className='p2p-v2-payment-method-form__fields'>
                    <div className='p2p-v2-payment-method-form__field-wrapper'>
                        <PaymentMethodFormInput
                            actionType={actionType}
                            availablePaymentMethods={availablePaymentMethods}
                            availablePaymentMethodsList={availablePaymentMethodsList}
                            onAdd={onAdd}
                            reset={reset}
                            selectedPaymentMethod={selectedPaymentMethod}
                        />
                    </div>
                    {Object.keys(selectedPaymentMethod?.fields || {})?.map(field => {
                        const paymentMethodField = selectedPaymentMethod?.fields?.[field];
                        return (
                            <PaymentMethodField
                                control={control}
                                defaultValue={paymentMethodField?.value ?? ''}
                                displayName={paymentMethodField?.display_name ?? ''}
                                field={field}
                                key={field}
                                required={!!paymentMethodField?.required}
                            />
                        );
                    })}
                </div>
                {(isMobile || !!selectedPaymentMethod) && (
                    <PaymentMethodsFormFooter
                        actionType={actionType}
                        handleGoBack={handleGoBack}
                        isDirty={isDirty}
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                    />
                )}
            </form>
            <PaymentMethodFormModalRenderer
                actionType={actionType}
                createError={createError}
                isCreateSuccessful={isCreateSuccessful}
                isModalOpen={isModalOpen}
                isUpdateSuccessful={isUpdateSuccessful}
                onResetFormState={onResetFormState}
                setIsModalOpen={setIsModalOpen}
                updateError={updateError}
            />
        </div>
    );
};

export default PaymentMethodForm;
