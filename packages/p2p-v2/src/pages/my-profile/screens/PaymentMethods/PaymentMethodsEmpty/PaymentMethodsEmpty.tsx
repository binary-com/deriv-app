import React from 'react';
import { FullPageMobileWrapper } from '@/components';
import { useQueryString } from '@/hooks';
import { DerivLightIcPaymentMethodsWalletIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './PaymentMethodsEmpty.scss';

type TPaymentMethodsEmptyProps = {
    onAddPaymentMethod: () => void;
};

/**
 * @component This component is used to display the empty state of the PaymentMethods screen
 * @param {Function} onAddPaymentMethod - Callback to open the form to add a new payment method
 * @returns {JSX.Element}
 * @example <PaymentMethodsEmpty onAddPaymentMethod={onAddPaymentMethod} />
 * **/
const PaymentMethodsEmpty = ({ onAddPaymentMethod }: TPaymentMethodsEmptyProps) => {
    const { isMobile } = useDevice();
    const { setQueryString } = useQueryString();

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='absolute top-16'
                onBack={() => {
                    setQueryString({
                        tab: 'default',
                    });
                }}
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        Payment Methods
                    </Text>
                )}
            >
                <div className='p2p-v2-payment-methods-empty'>
                    <DerivLightIcPaymentMethodsWalletIcon height='16rem' />
                    {/* TODO: Remember to localize the text below */}
                    <Text className='p2p-v2-payment-methods-empty__heading' size='lg' weight='bold'>
                        You haven’t added any payment methods yet
                    </Text>
                    <Text size='lg'>Hit the button below to add payment methods.</Text>
                    <Button
                        className='p2p-v2-payment-methods-empty__button'
                        onClick={() => {
                            onAddPaymentMethod();
                        }}
                    >
                        Add payment methods
                    </Button>
                </div>
            </FullPageMobileWrapper>
        );
    }

    return (
        <div className='p2p-v2-payment-methods-empty'>
            <DerivLightIcPaymentMethodsWalletIcon height='16rem' />
            {/* TODO: Remember to localize the text below */}
            <Text className='p2p-v2-payment-methods-empty__heading' weight='bold'>
                You haven’t added any payment methods yet
            </Text>
            <Text>Hit the button below to add payment methods.</Text>
            <Button
                className='p2p-v2-payment-methods-empty__button'
                onClick={() => {
                    onAddPaymentMethod();
                }}
            >
                Add payment methods
            </Button>
        </div>
    );
};
export default PaymentMethodsEmpty;
