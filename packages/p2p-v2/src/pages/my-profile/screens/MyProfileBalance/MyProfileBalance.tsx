import React, { useMemo, useState } from 'react';
import { useActiveAccount } from '@deriv/api';
import { Loader, Text, useDevice } from '@deriv-com/ui';
import { AvailableP2PBalanceModal, DailyLimitModal } from '../../../../components';
import { useAdvertiserStats } from '../../../../hooks';
import InfoOutlineIcon from '../../../../public/ic-info-outline.svg';
import { numberToCurrencyText } from '../../../../utils';
import { MyProfileDailyLimit } from '../MyProfileDailyLimit';
import './MyProfileBalance.scss';

const MyProfileBalance = () => {
    const { data: advertiserInfo, isLoading } = useAdvertiserStats();
    const { data: activeAccount } = useActiveAccount();
    const { isDesktop } = useDevice();
    const [shouldShowDailyLimitModal, setShouldShowDailyLimitModal] = useState(false);
    const [shouldShowAvailableBalanceModal, setShouldShowAvailableBalanceModal] = useState(false);

    const currency = activeAccount?.currency || 'USD';
    const dailyLimits = useMemo(
        () => [
            {
                available: `${numberToCurrencyText(advertiserInfo?.dailyAvailableBuyLimit || 0)} ${currency}`,
                dailyLimit: `${advertiserInfo?.daily_buy_limit} ${currency}`,
                type: 'Buy',
            },
            {
                available: `${numberToCurrencyText(advertiserInfo?.dailyAvailableSellLimit || 0)} ${currency}`,
                dailyLimit: `${advertiserInfo?.daily_sell_limit} ${currency}`,
                type: 'Sell',
            },
        ],
        [
            advertiserInfo?.dailyAvailableBuyLimit,
            advertiserInfo?.dailyAvailableSellLimit,
            advertiserInfo?.daily_buy_limit,
            advertiserInfo?.daily_sell_limit,
            currency,
        ]
    );

    if (isLoading || !advertiserInfo) return <Loader />;

    return (
        <>
            <AvailableP2PBalanceModal
                isModalOpen={shouldShowAvailableBalanceModal}
                onRequestClose={() => setShouldShowAvailableBalanceModal(false)}
            />
            <DailyLimitModal
                currency={currency}
                isModalOpen={shouldShowDailyLimitModal}
                onRequestClose={() => setShouldShowDailyLimitModal(false)}
            />
            <div className='p2p-v2-my-profile-balance'>
                <div className='p2p-v2-my-profile-balance__amount'>
                    <div>
                        <Text color='less-prominent' size={isDesktop ? 'sm' : 'md'}>
                            Available Deriv P2P Balance
                        </Text>
                        <InfoOutlineIcon
                            className='cursor-pointer'
                            onClick={() => setShouldShowAvailableBalanceModal(true)}
                        />
                    </div>
                    <Text size='xl' weight='bold'>
                        {numberToCurrencyText(advertiserInfo.balance_available || 0)} USD
                    </Text>
                </div>
                <div className='flex flex-col gap-[1.6rem]'>
                    <div className='p2p-v2-my-profile-balance__items'>
                        {dailyLimits.map(({ available, dailyLimit, type }) => (
                            <div className='p2p-v2-my-profile-balance__item' key={type}>
                                <Text size='sm'>{type}</Text>
                                <div className='p2p-v2-my-profile-balance__item-limits'>
                                    <div>
                                        <Text color='less-prominent' size='sm'>
                                            Daily limit
                                        </Text>
                                        <Text className='p2p-v2-my-profile-balance__label' size='sm' weight='bold'>
                                            {dailyLimit}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text color='less-prominent' size='sm'>
                                            Available
                                        </Text>
                                        <Text className='p2p-v2-my-profile-balance__label' size='sm' weight='bold'>
                                            {available}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {advertiserInfo.isEligibleForLimitUpgrade && (
                        <div className='w-fit'>
                            <MyProfileDailyLimit />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyProfileBalance;
