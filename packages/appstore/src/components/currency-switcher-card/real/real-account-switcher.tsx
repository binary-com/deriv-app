import React from 'react';
import { getStatusBadgeConfig } from '@deriv/account';
import { StatusBadge, Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import CurrencySwitcherLoader from 'Components/pre-loader/currency-switcher-loader';
import { useStore, observer } from '@deriv/stores';
import RealAccountCard from './real-account-card';
import './real-account-switcher.scss';
import { IsIconCurrency } from 'Assets/svgs/currency';
import { useMFAccountStatus } from '@deriv/hooks';

const AccountNeedsVerification = observer(() => {
    const mf_account_status = useMFAccountStatus();
    const { client, traders_hub, common } = useStore();
    const { account_list, loginid } = client;
    const { openModal, setVerificationModalOpen } = traders_hub;
    const { setAppstorePlatform } = common;

    const account = account_list?.find((acc: { loginid?: string }) => loginid === acc?.loginid);
    const icon_title = account?.title;

    const onClickBanner = () => {
        setAppstorePlatform('');
        setVerificationModalOpen(true);
    };

    const {
        text: badge_text,
        icon: badge_icon,
        icon_size: badge_icon_size,
    } = getStatusBadgeConfig(mf_account_status, onClickBanner);

    return (
        <CurrencySwitcherContainer
            className='real-account-switcher__container'
            title={
                <Text size='xs' line_height='s'>
                    {icon_title}
                </Text>
            }
            icon={IsIconCurrency(icon_title) ? icon_title : 'USD'}
            onClick={() => {
                return openModal('currency_selection');
            }}
        >
            <StatusBadge
                account_status={mf_account_status}
                icon={badge_icon}
                text={badge_text}
                icon_size={badge_icon_size}
                onClick={onClickBanner}
            />
        </CurrencySwitcherContainer>
    );
});

const RealAccountSwitcher = observer(() => {
    const { client, traders_hub } = useStore();
    const mf_account_status = useMFAccountStatus();
    const { is_logging_in, is_switching, has_maltainvest_account } = client;
    const { is_eu_user, no_CR_account, no_MF_account } = traders_hub;

    const eu_account = is_eu_user && !no_MF_account;
    const cr_account = !is_eu_user && !no_CR_account;

    //dont show loader if user has no respective regional account
    if ((is_switching || is_logging_in) && (eu_account || cr_account)) {
        return (
            <div className='real-account-switcher__container content-loader'>
                <CurrencySwitcherLoader />
            </div>
        );
    }

    if (mf_account_status && is_eu_user) {
        return <AccountNeedsVerification />;
    }

    if (has_maltainvest_account && is_eu_user) {
        return <RealAccountCard />;
    } else if (!no_CR_account && !is_eu_user) {
        return <RealAccountCard />;
    }
    return null;
});

export default RealAccountSwitcher;
