import React from 'react';
import { TAdvertiserPaymentMethods, TSelectedPaymentMethod } from 'types';
import { FullPageMobileWrapper } from '../../../../../components';
import { PaymentMethodsHeader } from '../../../../../components/PaymentMethodsHeader';
import { useDevice } from '../../../../../hooks';
import { TFormState } from '../../../../../reducers/types';
import AddNewButton from './AddNewButton';
import PaymentMethodsListContent from './PaymentMethodsListContent';
import './PaymentMethodsList.scss';

type TPaymentMethodsListProps = {
    formState: TFormState;
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onDelete: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onEdit: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onRestFormState: () => void;
    p2pAdvertiserPaymentMethods: TAdvertiserPaymentMethods;
};

/**
 * @component This component is used to display the list of payment methods if they exist, otherwise it will display the empty state
 * @param formState - The form state of the payment method form
 * @returns {JSX.Element}
 * @example <PaymentMethodsList formState={formState} />
 * **/
const PaymentMethodsList = ({
    formState,
    onAdd,
    onDelete,
    onEdit,
    onRestFormState,
    p2pAdvertiserPaymentMethods,
}: TPaymentMethodsListProps) => {
    const { isMobile } = useDevice();

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                renderFooter={() => <AddNewButton isMobile={isMobile} onAdd={onAdd} />}
                // TODO: Remember to translate the title
                renderHeader={() => <PaymentMethodsHeader title='Payment methods' />}
            >
                <PaymentMethodsListContent
                    formState={formState}
                    isMobile={isMobile}
                    onAdd={onAdd}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onRestFormState={onRestFormState}
                    p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
                />
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
            onRestFormState={onRestFormState}
            p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
        />
    );
};

export default PaymentMethodsList;
