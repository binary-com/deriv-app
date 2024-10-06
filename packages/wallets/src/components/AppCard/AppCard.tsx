import React from 'react';
import { Text } from '@deriv-com/ui';
import type { TGenericSizes, THooks } from '../../types';
import { AppCardBadge } from '../AppCardBadge';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletMarketCurrencyIcon } from '../WalletMarketCurrencyIcon';
import './AppCard.scss';

type TProps = {
    activeWalletCurrency?: THooks.ActiveWalletAccount['currency'];
    appName?: JSX.Element | string;
    balance?: JSX.Element | string;
    cardSize: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    device: 'desktop' | 'mobile';
    isDemoWallet?: THooks.ActiveWalletAccount['is_virtual'];
    marketType?: React.ComponentProps<typeof WalletMarketCurrencyIcon>['marketType'];
    platform?: React.ComponentProps<typeof WalletMarketCurrencyIcon>['platform'];
    product?: React.ComponentProps<typeof WalletMarketCurrencyIcon>['product'];
    walletName?: JSX.Element | string;
};

const AppCard: React.FC<TProps> = ({
    activeWalletCurrency,
    appName,
    balance,
    cardSize = 'md',
    device = 'desktop',
    isDemoWallet = false,
    marketType,
    platform,
    product,
    walletName,
}) => {
    return (
        <div
            className={`wallets-app-card wallets-app-card--border-radius--${cardSize}`}
            data-testid='dt_wallets_app_card'
        >
            <WalletGradientBackground currency='' hasShine theme='grey'>
                {cardSize !== 'sm' && (
                    <div className='wallets-app-card__badge'>
                        <AppCardBadge isDemo={isDemoWallet} />
                    </div>
                )}
                <div className={`wallets-app-card__content wallets-app-card__content--${device}--${cardSize}`}>
                    <div className='wallets-app-card__top'>
                        <WalletMarketCurrencyIcon
                            currency={activeWalletCurrency ?? ''}
                            isDemo={isDemoWallet}
                            marketType={marketType}
                            platform={platform}
                            product={product}
                        />
                    </div>
                    {cardSize !== 'sm' && (
                        <div className='wallets-app-card__bottom'>
                            <Text size='2xs'>{appName}</Text>
                            <Text color='less-prominent' size='2xs'>
                                {walletName}
                            </Text>
                            <Text size='sm' weight='bold'>
                                {balance}
                            </Text>
                        </div>
                    )}
                </div>
            </WalletGradientBackground>
        </div>
    );
};

export default AppCard;
