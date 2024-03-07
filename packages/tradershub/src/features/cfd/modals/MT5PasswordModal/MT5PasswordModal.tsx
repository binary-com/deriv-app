import React, { useState } from 'react';
import { useQueryParams } from '@/hooks';
import { Category, PlatformDetails } from '@cfd/constants';
import { useActiveTradingAccount, useMT5AccountsList } from '@deriv/api-v2';
import { Modal, useDevice } from '@deriv-com/ui';
import MT5PasswordFooter from './MT5PasswordFooter';
import MT5PasswordInput from './MT5PasswordInput';

const MT5PasswordModal = () => {
    const [password, setPassword] = useState('');
    const { data: activeTrading } = useActiveTradingAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { closeModal, isModalOpen } = useQueryParams();
    const { isDesktop } = useDevice();

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeTrading?.is_virtual;

    const ModalHeaderTitle = `${hasMT5Account ? 'Add' : 'Create'} a ${isDemo ? Category.DEMO : Category.REAL} ${
        PlatformDetails.mt5.title
    } account`;

    return (
        <Modal isOpen={isModalOpen('MT5PasswordModal')} onRequestClose={closeModal}>
            <Modal.Header onRequestClose={closeModal} title={ModalHeaderTitle} />
            <Modal.Body>
                <MT5PasswordInput password={password} setPassword={setPassword} />
            </Modal.Body>
            {!isDesktop && (
                <Modal.Footer>
                    <MT5PasswordFooter password={password} />
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default MT5PasswordModal;
