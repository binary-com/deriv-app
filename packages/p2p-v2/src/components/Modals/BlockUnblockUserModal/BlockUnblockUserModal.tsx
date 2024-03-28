import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { p2p } from '@deriv/api-v2';
import { Button, Text } from '@deriv-com/ui';
import { customStyles } from '../helpers';
import './BlockUnblockUserModal.scss';

type TBlockUnblockUserModalProps = {
    advertiserName: string;
    id: string;
    isBlocked: boolean;
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const BlockUnblockUserModal = ({
    advertiserName,
    id,
    isBlocked,
    isModalOpen,
    onRequestClose,
}: TBlockUnblockUserModalProps) => {
    const { mutate: blockAdvertiser } = p2p.counterparty.useBlock();
    const { mutate: unblockAdvertiser } = p2p.counterparty.useUnblock();

    useEffect(() => {
        Modal.setAppElement('#v2_modal_root');
    }, []);

    const getModalTitle = () => (isBlocked ? `Unblock ${advertiserName}?` : `Block ${advertiserName}?`);

    const getModalContent = () =>
        isBlocked
            ? `You will be able to see ${advertiserName}'s ads. They'll be able to place orders on your ads, too.`
            : `You won't see ${advertiserName}'s ads anymore and they won't be able to place orders on your ads.`;

    const onClickBlockUnblock = () => {
        if (isBlocked) {
            unblockAdvertiser([parseInt(id)]);
        } else {
            blockAdvertiser([parseInt(id)]);
        }

        onRequestClose();
    };

    return (
        <Modal
            className='p2p-v2-block-unblock-user-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            style={customStyles}
        >
            <Text as='p' weight='bold'>
                {getModalTitle()}
            </Text>
            <Text as='p' className='p2p-v2-block-unblock-user-modal__text' size='sm'>
                {getModalContent()}
            </Text>
            <div className='p2p-v2-block-unblock-user-modal__footer'>
                <Button
                    className='border-2'
                    color='black'
                    onClick={onRequestClose}
                    size='lg'
                    textSize='sm'
                    variant='outlined'
                >
                    Cancel
                </Button>
                <Button onClick={onClickBlockUnblock} size='lg' textSize='sm'>
                    {isBlocked ? 'Unblock' : 'Block'}
                </Button>
            </div>
        </Modal>
    );
};

export default BlockUnblockUserModal;
