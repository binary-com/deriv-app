import React, { ComponentProps, FC } from 'react';
import { CFD_PLATFORMS, MARKET_TYPE } from '../../features/cfd/constants';
import { THooks, TPlatforms } from '../../types';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import { WalletMarketIcon } from '../WalletMarketIcon';
import './WalletMarketCurrencyIcon.scss';

const mt5MarketTypeIcon = {
    all: 'IcWalletMt5All',
    financial: 'IcWalletMt5Financial',
    synthetic: 'IcWalletMt5Derived',
};

const cfdPlatformIcon = {
    ctrader: 'IcWalletCTrader',
    dxtrade: 'IcWalletDerivX',
};

type TWalletMarketCurrencyIconProps = {
    currency: Exclude<THooks.ActiveWalletAccount['currency'], undefined>;
    isDemo: THooks.ActiveWalletAccount['is_virtual'];
    marketType?: keyof typeof mt5MarketTypeIcon;
    platform?: TPlatforms.All;
};

const WalletMarketCurrencyIcon: FC<TWalletMarketCurrencyIconProps> = ({ currency, isDemo, marketType, platform }) => {
    let MarketTypeIcon: ComponentProps<typeof WalletMarketIcon>['icon'];
    if (marketType === MARKET_TYPE.ALL && platform && platform in cfdPlatformIcon) {
        MarketTypeIcon = cfdPlatformIcon[platform as keyof typeof cfdPlatformIcon];
    } else if (platform === CFD_PLATFORMS.MT5 && marketType && marketType in mt5MarketTypeIcon) {
        MarketTypeIcon = mt5MarketTypeIcon[marketType as keyof typeof mt5MarketTypeIcon];
    } else MarketTypeIcon = 'IcWalletOptionsLight';

    return (
        <div className='wallets-market-currency-icon'>
            <div className='wallets-market-currency-icon__container'>
                <WalletMarketIcon
                    className='wallets-market-currency-icon__market-icon'
                    icon={MarketTypeIcon}
                    size='sm'
                />
                <WalletCurrencyCard
                    className='wallets-market-currency-icon__currency-icon'
                    currency={currency}
                    isDemo={isDemo}
                    size='xs'
                />
            </div>
        </div>
    );
};

export default WalletMarketCurrencyIcon;
