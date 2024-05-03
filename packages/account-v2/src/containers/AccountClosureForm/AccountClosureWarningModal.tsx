import React from 'react';
import { Modal, Text } from '@deriv-com/ui';
import { API_ERROR_CODES } from 'src/constants';
import { TAccountClosureError } from 'src/types';
import { ClosingAccountHasPendingConditions } from './ClosingAccountHasPendingConditions';

type TAccountClosureWarningModalProps = {
    error?: TAccountClosureError;
    handleClose: () => void;
    isModalOpen: boolean;
};

export const AccountClosureWarningModal = ({ error, handleClose, isModalOpen }: TAccountClosureWarningModalProps) => {
    // [TODO] - Add remaining Warning conditions
    return (
        <Modal className='md:w-[440px] sm:w-[312px]' isOpen={isModalOpen} shouldCloseOnEsc shouldCloseOnOverlayClick>
            <Modal.Header hideBorder onRequestClose={handleClose}>
                <Text as='h3' size='md' weight='bold'>
                    {error?.code === API_ERROR_CODES.pendingCondition.code && API_ERROR_CODES.pendingCondition.message}
                </Text>
            </Modal.Header>
            <Modal.Body className='px-24'>
                {error?.code === API_ERROR_CODES.pendingCondition.code && (
                    <ClosingAccountHasPendingConditions error={error} />
                )}
            </Modal.Body>
        </Modal>
    );
};
