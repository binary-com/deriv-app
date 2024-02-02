import React from 'react';
import { Tab, Tabs, useDevice } from '@deriv-com/ui';
import { useQueryString } from '../../../../hooks';
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

    const currentTab = queryString.get('tab');

    if (isMobile) {
        return (
            <div className='p2p-v2-my-profile'>
                <MyProfileMobile />
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
        </div>
    );
};

export default MyProfile;
