import React from 'react';
import { TPaymentMethod } from 'types';
import { LightDivider } from '@/components';
import { sortPaymentMethodsWithAvailability } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';
import { PaymentMethodCard } from '../../PaymentMethodCard';

type TBuySellPaymentSectionProps = {
    availablePaymentMethods: (TPaymentMethod & { isAvailable?: boolean })[];
    onSelectPaymentMethodCard?: (paymentMethodId: number) => void;
    selectedPaymentMethodIds: number[];
};

const BuySellPaymentSection = ({
    availablePaymentMethods,
    onSelectPaymentMethodCard,
    selectedPaymentMethodIds,
}: TBuySellPaymentSectionProps) => {
    const { isMobile } = useDevice();
    const sortedList = sortPaymentMethodsWithAvailability(availablePaymentMethods);
    //TODO: below section to be modified to handle payment method addition after handling of modal provider
    // const [formState, dispatch] = useReducer(advertiserPaymentMethodsReducer, {});

    // const handleAddPaymentMethod = (selectedPaymentMethod?: TSelectedPaymentMethod) => {
    //     dispatch({
    //         payload: {
    //             selectedPaymentMethod,
    //         },
    //         type: 'ADD',
    //     });
    // };

    // const handleResetFormState = useCallback(() => {
    //     dispatch({ type: 'RESET' });
    // }, []);

    // if (formState?.isVisible) {
    //     return (
    //         <PaymentMethodForm
    //             displayFullPage={isMobile}
    //             displayModal={!isMobile}
    //             formState={formState}
    //             isDisabled
    //             onAdd={handleAddPaymentMethod}
    //             onResetFormState={handleResetFormState}
    //         />
    //     );
    // }

    return (
        <>
            <div className='flex px-[2.4rem] flex-col py-[2.4rem]'>
                <Text color='less-prominent' size={isMobile ? 'sm' : 'xs'}>
                    Receive payment to
                </Text>
                <Text size={isMobile ? 'md' : 'sm'}>
                    {sortedList && sortedList.length > 0
                        ? 'You may choose up to 3.'
                        : 'To place an order, add one of the advertiser’s preferred payment methods:'}
                </Text>
                <div className='flex gap-[0.8rem] flex-wrap'>
                    {sortedList?.map(paymentMethod => (
                        <PaymentMethodCard
                            key={paymentMethod?.id}
                            medium
                            onClickAdd={() => undefined}
                            onSelectPaymentMethodCard={onSelectPaymentMethodCard}
                            paymentMethod={paymentMethod}
                            selectedPaymentMethodIds={selectedPaymentMethodIds}
                        />
                    ))}
                </div>
            </div>
            <LightDivider />
        </>
    );
};

export default BuySellPaymentSection;
