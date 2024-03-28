import React, { useEffect, useState } from 'react';
import { ProfileContent, Verification } from '@/components';
import { NicknameModal } from '@/components/Modals';
import { useAdvertiserStats, usePoiPoaStatus, useQueryString } from '@/hooks';
import { Loader, Tab, Tabs, useDevice } from '@deriv-com/ui';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileCounterparties } from '../MyProfileCounterparties';
import { MyProfileStats } from '../MyProfileStats';
import { PaymentMethods } from '../PaymentMethods';
import MyProfileMobile from './MyProfileMobile';
import './MyProfile.scss';

const TABS = ['Stats', 'Payment methods', 'Ad details', 'My counterparties'];

const MyProfile = () => {
    const { isMobile } = useDevice();
    const { queryString, setQueryString } = useQueryString();
    const { data } = usePoiPoaStatus();
    const { data: advertiserStats, failureReason, isLoading } = useAdvertiserStats();
    const { isP2PPoaRequired, isPoaVerified, isPoiVerified } = data || {};
    const [isNicknameModalOpen, setIsNicknameModalOpen] = useState<boolean | undefined>(false);

    const currentTab = queryString.tab;

    const tabs = [
        { component: <MyProfileStats />, title: 'Stats' },
        { component: <PaymentMethods />, title: 'Payment methods' },
        { component: <MyProfileAdDetails />, title: 'Ad details' },
        { component: <MyProfileCounterparties />, title: 'My counterparties' },
    ];

    useEffect(() => {
        const isPoaPoiVerified = (!isP2PPoaRequired || isPoaVerified) && isPoiVerified;
        if (isPoaPoiVerified && !!failureReason) setIsNicknameModalOpen(true);
    }, [failureReason, isP2PPoaRequired, isPoaVerified, isPoiVerified]);

    if (isLoading && !advertiserStats) {
        return <Loader />;
    }

    if (!isPoiVerified || !isPoaVerified) {
        return <Verification />;
    }

    if (isMobile) {
        return (
            <div className='p2p-v2-my-profile'>
                <MyProfileMobile />
                <NicknameModal isModalOpen={isNicknameModalOpen} setIsModalOpen={setIsNicknameModalOpen} />
            </div>
        );
    }

    return (
        <div className='p2p-v2-my-profile'>
            <ProfileContent />
            <Tabs
                activeTab={(currentTab !== 'default' && currentTab) || 'Stats'}
                className='p2p-v2-my-profile__tabs'
                onChange={index => {
                    setQueryString({
                        tab: TABS[index],
                    });
                }}
                variant='primary'
            >
                {tabs.map(tab => (
                    <Tab className='p2p-v2-my-profile__tabs-tab' key={tab.title} title={tab.title}>
                        {tab.component}
                    </Tab>
                ))}
            </Tabs>
            <NicknameModal isModalOpen={isNicknameModalOpen} setIsModalOpen={setIsNicknameModalOpen} />
        </div>
    );
};

export default MyProfile;
