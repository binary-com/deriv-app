import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { TAdvertiserPaymentMethods, TSelectedPaymentMethod } from 'types';
import { FullPageMobileWrapper } from '../../../../../components';
import { PaymentMethodsHeader } from '../../../../../components/PaymentMethodsHeader';
import { useQueryString } from '../../../../../hooks';
import { TFormState } from '../../../../../reducers/types';
import AddNewButton from './AddNewButton';
import PaymentMethodsListContent from './PaymentMethodsListContent';
import './PaymentMethodsList.scss';

type TPaymentMethodsListProps = {
    formState: TFormState;
    onAdd: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onDelete: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onEdit: (selectedPaymentMethod?: TSelectedPaymentMethod) => void;
    onResetFormState: () => void;
    p2pAdvertiserPaymentMethods: TAdvertiserPaymentMethods;
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
                onBack={() =>
                    setQueryString({
                        tab: 'default',
                    })
                }
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
                    onResetFormState={onResetFormState}
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
            onResetFormState={onResetFormState}
            p2pAdvertiserPaymentMethods={p2pAdvertiserPaymentMethods}
        />
    );
};

export default PaymentMethodsList;
