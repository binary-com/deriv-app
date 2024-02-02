import React from 'react';
import { Loader, Text, useDevice } from '@deriv-com/ui';
import { useAdvertiserStats } from '../../hooks';
import { UserAvatar } from '../UserAvatar';
import AdvertiserNameBadges from './AdvertiserNameBadges';
import AdvertiserNameStats from './AdvertiserNameStats';
import AdvertiserNameToggle from './AdvertiserNameToggle';
import './AdvertiserName.scss';

const AdvertiserName = () => {
    const { data: advertiserStats, isLoading } = useAdvertiserStats();
    const { isDesktop } = useDevice();

    if (isLoading || !advertiserStats) return <Loader />;

    return (
        <div className='p2p-v2-advertiser-name'>
            <UserAvatar nickname={advertiserStats.name!} size={isDesktop ? 64 : 42} textSize='lg' />
            <div className='p2p-v2-advertiser-name__details'>
                <Text size='md' weight='bold'>
                    {advertiserStats.name}{' '}
                    {advertiserStats.show_name && (
                        <Text color='less-prominent' size='sm'>
                            ({advertiserStats.fullName})
                        </Text>
                    )}
                </Text>
                <AdvertiserNameStats />
                <AdvertiserNameBadges />
            </div>
            {isDesktop && <AdvertiserNameToggle />}
        </div>
    );
};
AdvertiserName.displayName = 'AdvertiserName';

export default AdvertiserName;
