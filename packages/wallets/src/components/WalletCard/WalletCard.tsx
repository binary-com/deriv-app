import React, { ComponentProps } from 'react';
import classNames from 'classnames';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import useAllBalanceSubscription from '../../hooks/useAllBalanceSubscription';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import './WalletCard.scss';

type TProps = {
    balance: JSX.Element | string;
    currency: string;
    iconSize?: ComponentProps<typeof WalletCurrencyIcon>['size'];
    isCarouselContent?: boolean;
    isDemo?: boolean;
    onClick?: () => void;
};

const WalletCard: React.FC<TProps> = ({
    balance,
    currency,
    iconSize = 'lg',
    isCarouselContent = false,
    isDemo,
    onClick,
}) => {
    const { isLoading: isBalanceLoading } = useAllBalanceSubscription();
    const isDemoCarouselContent = isDemo && isCarouselContent;

    return (
        <button
            className={classNames('wallets-card', { 'wallets-card__carousel-content': isCarouselContent })}
            data-testid='dt_wallets_wallet_card'
            onClick={onClick}
        >
            <div className='wallets-card__container'>
                <WalletGradientBackground
                    currency={isDemo ? 'Demo' : currency}
                    device='mobile'
                    hasShine
                    isDemo={isDemo}
                    type='card'
                >
                    <div
                        className={classNames({
                            'wallets-card__carousel-content-details': isCarouselContent,
                            'wallets-card__details': !isCarouselContent,
                        })}
                        data-testid='dt_wallet_card_details'
                    >
                        <div
                            className={classNames('wallets-card__details-top', {
                                'wallets-card__carousel-content-details-top': isCarouselContent,
                            })}
                        >
                            <WalletCurrencyIcon currency={isDemo ? 'DEMO' : currency} size={iconSize} />
                        </div>
                        <div className='wallets-card__details-bottom'>
                            <Text color={isDemo ? 'white' : 'general'} size={isCarouselContent ? 'md' : '2xs'}>
                                {isDemoCarouselContent ? (
                                    <Localize i18n_default_text='{{currency}} Demo Wallet' values={{ currency }} />
                                ) : (
                                    <Localize i18n_default_text='{{currency}} Wallet' values={{ currency }} />
                                )}
                            </Text>
                            {isBalanceLoading ? (
                                <div
                                    className='wallets-skeleton wallets-card__balance-loader'
                                    data-testid='dt_wallet_card_balance_loader'
                                />
                            ) : (
                                <Text
                                    color={isDemo ? 'white' : 'general'}
                                    size={isCarouselContent ? 'lg' : 'sm'}
                                    weight='bold'
                                >
                                    {balance}
                                </Text>
                            )}
                        </div>
                    </div>
                </WalletGradientBackground>
            </div>
        </button>
    );
};

export default WalletCard;
