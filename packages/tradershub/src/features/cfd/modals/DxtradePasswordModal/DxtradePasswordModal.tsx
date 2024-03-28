import React, { useState } from 'react';
import { useQueryParams } from '@/hooks';
import { useAccountStatus } from '@deriv/api-v2';
import { Modal } from '@deriv-com/ui';
import { CreatePassword, EnterPassword } from '../../screens';

const DxtradePasswordModal = () => {
    const [password, setPassword] = useState('');
    const { data: accountStatus } = useAccountStatus();
    const { closeModal, isModalOpen } = useQueryParams();

    const isDxtradePasswordNotSet = accountStatus?.is_dxtrade_password_not_set;

    const PasswordComponent = isDxtradePasswordNotSet ? CreatePassword : EnterPassword;

    return (
        <Modal ariaHideApp={false} isOpen={isModalOpen('DxtradePasswordModal')} onRequestClose={closeModal}>
            <PasswordComponent onPasswordChange={e => setPassword(e.target.value)} password={password} />
        </Modal>
    );
};

export default DxtradePasswordModal;
