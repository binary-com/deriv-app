import * as React from 'react';
import { isMobile } from '@deriv/shared';
import { Loading, Tabs } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import BuySell from './buy-sell/buy-sell.jsx';
import Dp2pBlocked from './dp2p-blocked';
import { localize } from './i18next';
import MyAds from './my-ads/my-ads.jsx';
import MyProfile from './my-profile';
import NicknameForm from './nickname-form';
import Orders from './orders/orders.jsx';
import TemporarilyBarredHint from './temporarily-barred-hint';
import UnsupportedAccount from './unsupported-account';
import Verification from './verification/verification.jsx';

const AppContent = () => {
    const { general_store } = useStores();

    if (general_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (general_store.is_unsupported_account) {
        return <UnsupportedAccount />;
    }

    if (general_store.should_show_dp2p_blocked) {
        return <Dp2pBlocked />;
    }

    if (general_store.should_show_popup) {
        return <NicknameForm />;
    }

    if (general_store.props.should_show_verification) {
        return <Verification should_wrap />;
    }

    return (
        <Tabs
            active_index={general_store.active_index}
            className='p2p-cashier__tabs'
            header_fit_content={!isMobile()}
            is_100vw={isMobile()}
            is_scrollable
            is_overflow_hidden
            onTabItemClick={general_store.handleTabClick}
            top
        >
            <div label={localize('Buy / Sell')}>
                <TemporarilyBarredHint />
                <BuySell />
            </div>
            <div count={general_store.notification_count} label={localize('Orders')}>
                <Orders />
            </div>
            <div label={localize('My ads')}>
                <TemporarilyBarredHint />
                <MyAds />
            </div>
            {general_store.is_advertiser && (
                <div label={localize('My profile')}>
                    <MyProfile />
                </div>
            )}
        </Tabs>
    );
};

export default observer(AppContent);
