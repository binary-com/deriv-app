import React from 'react';
import type { TGenericSizes, THooks } from '../../types';
import { AppCardBadge } from '../AppCardBadge';
import { WalletText } from '../Base';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletsAppLinkedWithWalletIcon } from '../WalletsAppLinkedWithWalletIcon';
import './AppCard.scss';

type TProps = {
    activeWalletCurrency?: THooks.ActiveWalletAccount['currency'];
    appIcon: React.ComponentProps<typeof WalletsAppLinkedWithWalletIcon>['appIcon'];
    appName?: string;
    balance?: string;
    cardSize: Extract<TGenericSizes, 'lg' | 'md' | 'sm'>;
    device: 'desktop' | 'mobile';
    isDemoWallet?: THooks.ActiveWalletAccount['is_virtual'];
    walletName?: string;
};

const AppCard: React.FC<TProps> = ({
    activeWalletCurrency,
    appIcon,
    appName,
    balance,
    cardSize = 'md',
    device = 'desktop',
    isDemoWallet = false,
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
                        <WalletsAppLinkedWithWalletIcon
                            appIcon={appIcon}
                            currency={activeWalletCurrency ?? ''}
                            isDemo={isDemoWallet}
                            size='small'
                        />
                    </div>
                    {cardSize !== 'sm' && (
                        <div className='wallets-app-card__bottom'>
                            <WalletText size='2xs'>{appName}</WalletText>
                            <WalletText color='less-prominent' size='2xs'>
                                {walletName}
                            </WalletText>
                            <WalletText size='sm' weight='bold'>
                                {balance}
                            </WalletText>
                        </div>
                    )}
                </div>
            </WalletGradientBackground>
        </div>
    );
};

export default AppCard;
