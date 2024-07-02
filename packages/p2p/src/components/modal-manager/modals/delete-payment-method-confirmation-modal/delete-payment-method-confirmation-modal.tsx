import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { useDevice } from '@deriv-com/ui';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TDeletePaymentMethodConfirmationModalProps = {
    payment_method_id: number;
    payment_method_name: string;
};

const DeletePaymentMethodConfirmationModal = ({
    payment_method_id,
    payment_method_name,
}: TDeletePaymentMethodConfirmationModalProps) => {
    const { isDesktop } = useDevice();
    const { hideModal, showModal } = useModalManagerContext();
    const { delete: delete_payment_method, mutation } = useP2PAdvertiserPaymentMethods();
    const { error: mutation_error, status: mutation_status } = mutation;

    const handleDelete = async () => {
        delete_payment_method(payment_method_id);
    };

    React.useEffect(() => {
        if (mutation_status === 'success') {
            hideModal();
        } else if (mutation_status === 'error') {
            showModal(
                {
                    key: 'DeletePaymentMethodErrorModal',
                    props: {
                        error_message: mutation_error.message,
                    },
                },
                { should_stack_modal: !isDesktop }
            );
        }
    }, [mutation_error, mutation_status]);

    return (
        <Modal
            is_open
            small
            has_close_icon={false}
            title={
                <Text color='prominent' weight='bold'>
                    <Localize
                        i18n_default_text='Delete {{payment_method_name}}?'
                        values={{
                            payment_method_name,
                        }}
                    />
                </Text>
            }
        >
            <Modal.Body className='delete-payment-method-confirmation-modal'>
                <Text as='p' size='xs' color='prominent'>
                    <Localize i18n_default_text='Are you sure you want to remove this payment method?' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('Yes, remove')} onClick={handleDelete} secondary large />
                <Button has_effect text={localize('No')} onClick={hideModal} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default DeletePaymentMethodConfirmationModal;
