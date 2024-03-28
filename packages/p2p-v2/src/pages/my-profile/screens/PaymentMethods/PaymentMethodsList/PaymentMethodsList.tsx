import React from 'react';
import { THooks, TSelectedPaymentMethod } from 'types';
import { FullPageMobileWrapper } from '@/components';
import { useQueryString } from '@/hooks';
import { TFormState } from '@/reducers/types';
import { Text, useDevice } from '@deriv-com/ui';
import AddNewButton from './AddNewButton';
import { PaymentMethodsListContent } from './PaymentMethodsListContent';
import './PaymentMethodsList.scss';

type TPaymentMethodsListProps = {
    formState: TFormState;
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onDelete: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onEdit: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onResetFormState: () => void;
    p2pAdvertiserPaymentMethods: THooks.AdvertiserPaymentMethods.Get;
};

/**
 * @component This component is used to display the list of advertiser payment methods
 * @param formState - The form state of the payment method form
 * @returns {JSX.Element}
 * @example <PaymentMethodsList formState={formState} />
 * **/
const PaymentMethodsList = ({
    formState,
    onAdd,
    onDelete,
    onEdit,
    onResetFormState,
    p2pAdvertiserPaymentMethods,
}: TPaymentMethodsListProps) => {
    const { isMobile } = useDevice();
    const { setQueryString } = useQueryString();

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='p2p-v2-payment-methods-list__mobile-wrapper'
                onBack={() =>
                    setQueryString({
                        tab: 'default',
                    })
                }
                renderFooter={() => <AddNewButton isMobile={isMobile} onAdd={onAdd} />}
                // TODO: Remember to translate the title
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        Payment methods
                    </Text>
                )}
            >
                {!!p2pAdvertiserPaymentMethods?.length && (
                    <PaymentMethodsListContent
                        formState={formState}
                        isMobile={isMobile}
                        onAdd={onAdd}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onResetFormState={onResetFormState}
                        p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
                    />
                )}
            </FullPageMobileWrapper>
        );
    }

    return p2pAdvertiserPaymentMethods?.length === 0 ? null : (
        <PaymentMethodsListContent
            formState={formState}
            isMobile={isMobile}
            onAdd={onAdd}
            onDelete={onDelete}
            onEdit={onEdit}
            onResetFormState={onResetFormState}
            p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
        />
    );
};

export default PaymentMethodsList;
