import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { MyProfileBalance } from '../MyProfileBalance';
import { AdvertiserName, AdvertiserNameToggle } from '../../../../components';
import './MyProfileContent.scss';

const MyProfileContent = () => {
    const { isMobile } = useDevice();
    return (
        <>
            <div className='p2p-v2-my-profile-content'>
                <AdvertiserName />
                <MyProfileBalance />
            </div>
            {isMobile && <AdvertiserNameToggle />}
        </>
    );
};

export default MyProfileContent;
