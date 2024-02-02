import React, { memo, useState } from 'react';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { UserAvatar } from '../../../../../components';
import { BlockUnblockUserModal } from '../../../../../components/Modals/BlockUnblockUserModal';
import './MyProfileCounterpartiesTableRow.scss';

type TMyProfileCounterpartiesTableRowProps = {
    id: string;
    isBlocked: boolean;
    nickname: string;
};

const MyProfileCounterpartiesTableRow = ({ id, isBlocked, nickname }: TMyProfileCounterpartiesTableRowProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();

    return (
        <>
            <div className='p2p-v2-my-profile-counterparties-table-row'>
                <div className='p2p-v2-my-profile-counterparties-table-row__nickname-wrapper'>
                    <UserAvatar nickname={nickname} />
                    <Text size={isMobile ? 'md' : 'sm'}>{nickname}</Text>
                </div>
                {/* TODO: variant to be replaced after available in @deriv-com/ui */}
                <Button onClick={() => setIsModalOpen(true)} variant={isBlocked ? 'outlined' : 'ghost'}>
                    {isBlocked ? 'Unblock' : 'Block'}
                </Button>
            </div>
            {/* TODO: to be replaced by deriv-com/ui modal component */}
            <BlockUnblockUserModal
                advertiserName={nickname}
                id={id}
                isBlocked={isBlocked}
                isModalOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default memo(MyProfileCounterpartiesTableRow);
