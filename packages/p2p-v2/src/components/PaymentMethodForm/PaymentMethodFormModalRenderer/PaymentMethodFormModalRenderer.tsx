import React from 'react';
import { PaymentMethodErrorModal, PaymentMethodModal } from '@/components/Modals';
import { TFormState } from '@/reducers/types';
import { TSocketError } from '@deriv/api-v2/types';

type TPaymentMethodFormModalRendererProps = {
    actionType: TFormState['actionType'];
    createError: TSocketError<'p2p_advertiser_payment_methods'> | null;
    isCreateSuccessful: boolean;
    isModalOpen: boolean;
    isUpdateSuccessful: boolean;
    onResetFormState: () => void;
    setIsModalOpen: (isModalOpen: boolean) => void;
    updateError: TSocketError<'p2p_advertiser_payment_methods'> | null;
};

const PaymentMethodFormModalRenderer = ({
    actionType,
    createError,
    isCreateSuccessful,
    isModalOpen,
    isUpdateSuccessful,
    onResetFormState,
    setIsModalOpen,
    updateError,
}: TPaymentMethodFormModalRendererProps) => {
    if (actionType === 'ADD' && (!isCreateSuccessful || !createError) && isModalOpen) {
        return (
            <PaymentMethodModal
                description='If you choose to cancel, the changes you’ve made will be lost.'
                isModalOpen={isModalOpen}
                onConfirm={onResetFormState}
                onReject={() => {
                    setIsModalOpen(false);
                }}
                primaryButtonLabel='Go back'
                secondaryButtonLabel='Cancel'
                title='Cancel adding this payment method?'
            />
        );
    }

    if (actionType === 'EDIT' && (!isUpdateSuccessful || !updateError) && isModalOpen) {
        return (
            <PaymentMethodModal
                description='If you choose to cancel, the details you’ve entered will be lost.'
                isModalOpen={isModalOpen}
                onConfirm={onResetFormState}
                onReject={() => {
                    setIsModalOpen(false);
                }}
                primaryButtonLabel="Don't cancel"
                secondaryButtonLabel='Cancel'
                title='Cancel your edits?'
            />
        );
    }

    // TODO: Remember to translate these strings
    if (createError || updateError) {
        return (
            <PaymentMethodErrorModal
                errorMessage={String(createError?.error?.message || updateError?.error?.message)}
                isModalOpen={true}
                onConfirm={() => {
                    onResetFormState();
                }}
                title='Something’s not right'
            />
        );
    }

    return null;
};

export default PaymentMethodFormModalRenderer;
