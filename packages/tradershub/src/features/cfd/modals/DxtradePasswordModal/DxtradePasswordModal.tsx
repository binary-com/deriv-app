import React, { useState } from 'react';
import { useQueryParams } from '@/hooks';
import { Modal } from '@deriv-com/ui';
// import DxtradePasswordFooter from './DxtradePasswordFooter';
import DxtradePasswordInput from './DxtradePasswordInput';

const DxtradePasswordModal = () => {
    // const { isDesktop } = useDevice();
    const [password, setPassword] = useState('');
    const { isModalOpen, closeModal } = useQueryParams();

    return (
        <Modal
            className='w-screen h-screen lg:w-auto lg:h-auto bg-system-light-primary-background '
            isOpen={isModalOpen('DxtradePasswordModal')}
            onRequestClose={closeModal}
        >
            <DxtradePasswordInput password={password} setPassword={setPassword} />
        </Modal>
    );
};

export default DxtradePasswordModal;
