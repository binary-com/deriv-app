import React from 'react';
import { THooks, TSelectedPaymentMethod } from 'types';
import { Dropdown } from '@/components';
import { TFormState } from '@/reducers/types';
import { Button, Input, Text } from '@deriv-com/ui';
import CloseCircle from '../../../public/ic-close-circle.svg';

type TPaymentMethodFormInputProps = {
    actionType: TFormState['actionType'];
    availablePaymentMethods?: THooks.PaymentMethods.Get;
    availablePaymentMethodsList: { text: string; value: string }[];
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    reset: () => void;
    selectedPaymentMethod: TFormState['selectedPaymentMethod'];
};

const PaymentMethodFormInput = ({
    actionType,
    availablePaymentMethods,
    availablePaymentMethodsList,
    onAdd,
    reset,
    selectedPaymentMethod,
}: TPaymentMethodFormInputProps) => {
    if (selectedPaymentMethod) {
        // TODO: Remember to translate this
        return (
            <Input
                defaultValue={selectedPaymentMethod?.display_name}
                disabled
                label='Choose your payment method'
                rightPlaceholder={
                    actionType === 'EDIT' ? null : (
                        <CloseCircle
                            className='p2p-v2-payment-method-form__icon--close'
                            data-testid='dt_p2p_v2_payment_methods_form_close_icon'
                            fill='#999999'
                            height={15.7}
                            onClick={() => {
                                onAdd();
                                reset();
                            }}
                            width={15.7}
                        />
                    )
                }
            />
        );
    }
    return (
        <>
            <Dropdown
                label='Payment method'
                list={availablePaymentMethodsList}
                name='Payment method'
                onSelect={(value: string) => {
                    const selectedPaymentMethod = availablePaymentMethods?.find(p => p.id === value);
                    if (selectedPaymentMethod) {
                        onAdd({
                            displayName: selectedPaymentMethod?.display_name,
                            fields: selectedPaymentMethod?.fields,
                            method: value,
                        });
                    }
                }}
                // TODO: Remember to translate this
                value={selectedPaymentMethod?.display_name ?? ''}
                variant='comboBox'
            />
            <div className='mt-[0.2rem] ml-[1.6rem]'>
                {/* TODO: Remember to translate these */}
                <Text color='less-prominent' size='xs'>
                    Don’t see your payment method?
                </Text>
                <Button
                    className='p2p-v2-payment-method-form__button'
                    color='primary'
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        const paymentMethod = availablePaymentMethods?.find(p => p.id === 'other');
                        if (paymentMethod) {
                            onAdd({
                                displayName: paymentMethod?.display_name,
                                fields: paymentMethod?.fields,
                                method: 'other',
                            });
                        }
                    }}
                    size='sm'
                    textSize='xs'
                    variant='ghost'
                >
                    Add new.
                </Button>
            </div>
        </>
    );
};

export default PaymentMethodFormInput;
