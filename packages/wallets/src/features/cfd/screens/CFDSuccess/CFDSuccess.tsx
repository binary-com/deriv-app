import React, { ComponentProps } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { WalletMarketCurrencyIcon, WalletSuccess, WalletText } from '../../../../components';
import { WalletGradientBackground } from '../../../../components/WalletGradientBackground';
import useDevice from '../../../../hooks/useDevice';
import { TDisplayBalance, TMarketTypes, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS, MARKET_TYPE, MarketTypeDetails, PlatformDetails } from '../../constants';
import './CFDSuccess.scss';

type TSuccessProps = {
    description: string;
    displayBalance:
        | TDisplayBalance.CtraderAccountsList
        | TDisplayBalance.DxtradeAccountsList
        | TDisplayBalance.MT5AccountsList;
    marketType?: TMarketTypes.SortedMT5Accounts;
    platform?: TPlatforms.All;
    renderButton?: ComponentProps<typeof WalletSuccess>['renderButtons'];
    title: string;
};

const CFDSuccess: React.FC<TSuccessProps> = ({
    description,
    displayBalance,
    marketType,
    platform,
    renderButton,
    title,
}) => {
    const { data } = useActiveWalletAccount();
    const { isDesktop } = useDevice();
    const isDemo = data?.is_virtual;

    const isDxtradeOrCtrader =
        marketType === MARKET_TYPE.ALL &&
        (platform === PlatformDetails.dxtrade.platform || platform === PlatformDetails.ctrader.platform);

    let marketTypeTitle = 'Options';

    if (marketType && platform) {
        const isPlatformValid = Object.keys(PlatformDetails).includes(platform);
        if (isDxtradeOrCtrader && isPlatformValid) {
            marketTypeTitle = PlatformDetails[platform].title;
        } else {
            marketTypeTitle = MarketTypeDetails[marketType].title;
        }
    }

    const platformTitlePrefix = platform === PlatformDetails.mt5.platform ? CFD_PLATFORMS.MT5.toLocaleUpperCase() : '';

    return (
        <WalletSuccess
            description={description}
            renderButtons={isDesktop ? renderButton : undefined}
            renderIcon={() => (
                <WalletGradientBackground
                    bodyClassName='wallets-cfd-success__gradient'
                    currency={data?.currency ?? 'USD'}
                    hasShine
                    theme='grey'
                >
                    <div className='wallets-cfd-success'>
                        <div className='wallets-cfd-success__icon'>
                            <div
                                className={classNames(
                                    'wallets-cfd-success__badge',
                                    `wallets-cfd-success__badge--${isDemo ? 'demo' : 'real'}`
                                )}
                            >
                                <WalletText color='white' size='2xs' weight='bold'>
                                    {isDemo ? 'Demo' : 'Real'}
                                </WalletText>
                            </div>
                            <div className='wallets-cfd-success__market-icon'>
                                <WalletMarketCurrencyIcon
                                    currency={data?.currency ?? 'USD'}
                                    isDemo={isDemo ?? false}
                                    marketType={marketType}
                                    platform={platform}
                                />
                            </div>
                            <div className='wallets-cfd-success__info'>
                                <WalletText size='2xs'>
                                    {platformTitlePrefix} {marketTypeTitle}
                                </WalletText>
                                <WalletText color='primary' size='2xs'>
                                    {data?.currency} Wallet
                                </WalletText>
                                {!displayBalance ? (
                                    <div className='wallets-skeleton wallets-cfd-success__balance-loader' />
                                ) : (
                                    <WalletText size='sm' weight='bold'>
                                        {displayBalance}
                                    </WalletText>
                                )}
                            </div>
                        </div>
                    </div>
                </WalletGradientBackground>
            )}
            title={title}
        />
    );
};

export default CFDSuccess;
