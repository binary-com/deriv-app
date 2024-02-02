import React, { useState } from 'react';
import { useActiveAccount } from '@deriv/api';
import { Button, Text, useDevice } from '@deriv-com/ui';
import DailyLimitModal from '../../../../components/Modals/DailyLimitModal/DailyLimitModal';
import { useAdvertiserStats } from '../../../../hooks';
import './MyProfileDailyLimit.scss';

const MyProfileDailyLimit = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isMobile } = useDevice();
    const { data: advertiserStats } = useAdvertiserStats();
    const { data: activeAccount } = useActiveAccount();

    return (
        <>
            <div className='p2p-v2-my-profile-daily-limit'>
                <Text color='less-prominent' lineHeight='sm' size='xs'>
                    Want to increase your daily limits to{' '}
                    <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                        {advertiserStats?.daily_buy_limit} {activeAccount?.currency || 'USD'}{' '}
                    </Text>{' '}
                    (buy) and{' '}
                    <Text color='less-prominent' lineHeight='sm' size='xs' weight='bold'>
                        {advertiserStats?.daily_sell_limit} {activeAccount?.currency || 'USD'}{' '}
                    </Text>{' '}
                    (sell)?
                </Text>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    size='xs'
                    textSize={isMobile ? 'sm' : 'xs'}
                    variant='ghost'
                >
                    Increase my limits
                </Button>
            </div>
            <DailyLimitModal
                currency={activeAccount?.currency || 'USD'}
                isModalOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default MyProfileDailyLimit;
