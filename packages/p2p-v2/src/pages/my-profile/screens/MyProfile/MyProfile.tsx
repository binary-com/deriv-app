import React, { useEffect, useState } from 'react';
import { Loader, Tab, Tabs } from '@deriv-com/ui';
import { NicknameModal } from '../../../../components/Modals/NicknameModal';
import { Verification } from '../../../../components/Verification';
import { useAdvertiserStats, useDevice, usePoiPoaStatus, useQueryString } from '../../../../hooks';
import { MyProfileAdDetails } from '../MyProfileAdDetails';
import { MyProfileContent } from '../MyProfileContent';
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

    const currentTab = queryString.get('tab');

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
            <MyProfileContent />
            <Tabs
                activeTab={(currentTab !== 'default' && currentTab) || 'Stats'}
                onChange={index => {
                    setQueryString({
                        tab: TABS[index],
                    });
                }}
                variant='primary'
                wrapperClassName='p2p-v2-my-profile__tabs'
            >
                <Tab title='Stats'>
                    <MyProfileStats />
                </Tab>
                <Tab title='Payment methods'>
                    <PaymentMethods />
                </Tab>
                <Tab title='Ad details'>
                    <MyProfileAdDetails />
                </Tab>
                <Tab title='My counterparties'>
                    <MyProfileCounterparties />
                </Tab>
            </Tabs>
            <NicknameModal isModalOpen={isNicknameModalOpen} setIsModalOpen={setIsNicknameModalOpen} />
        </div>
    );
};

export default MyProfile;
