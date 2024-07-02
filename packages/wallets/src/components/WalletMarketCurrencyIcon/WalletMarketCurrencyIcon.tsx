import React, { ComponentProps, FC } from 'react';
import { CFDPlatformIcons, MT5MarketIcons } from '../../constants/icons';
import { CFD_PLATFORMS, MARKET_TYPE } from '../../features/cfd/constants';
import { THooks, TPlatforms } from '../../types';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import { WalletMarketIcon } from '../WalletMarketIcon';
import './WalletMarketCurrencyIcon.scss';

type TWalletMarketCurrencyIconProps = {
    currency: Exclude<THooks.ActiveWalletAccount['currency'], undefined>;
    isDemo: THooks.ActiveWalletAccount['is_virtual'];
    marketType?: keyof typeof MT5MarketIcons;
    platform?: TPlatforms.All;
    size?: ComponentProps<typeof WalletCurrencyCard>['size'];
};

const WalletMarketCurrencyIcon: FC<TWalletMarketCurrencyIconProps> = ({
    currency,
    isDemo,
    marketType,
    platform,
    size = 'sm',
}) => {
    let MarketTypeIcon;
    if (marketType === MARKET_TYPE.ALL && platform && platform in CFDPlatformIcons) {
        MarketTypeIcon = platform;
    } else if (platform === CFD_PLATFORMS.MT5 && marketType && marketType in MT5MarketIcons) {
        MarketTypeIcon = marketType;
    } else MarketTypeIcon = 'standard';

    return (
        <div className='wallets-market-currency-icon' data-testid='dt_wallet_market_icon'>
            <div className='wallets-market-currency-icon__container'>
                <WalletMarketIcon
                    className='wallets-market-currency-icon__market-icon'
                    icon={MarketTypeIcon as ComponentProps<typeof WalletMarketIcon>['icon']}
                    size={size}
                />
                <WalletCurrencyCard
                    className='wallets-market-currency-icon__currency-icon'
                    currency={currency}
                    isDemo={isDemo}
                    size={size}
                />
            </div>
        </div>
    );
};

export default WalletMarketCurrencyIcon;
