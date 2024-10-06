import React, { ComponentProps } from 'react';
import classNames from 'classnames';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { WalletMarketCurrencyIcon, WalletSuccess } from '../../../../components';
import { WalletGradientBackground } from '../../../../components/WalletGradientBackground';
import { TDisplayBalance, THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS, getMarketTypeDetails, MARKET_TYPE, PlatformDetails } from '../../constants';
import './CFDSuccess.scss';

type TSuccessProps = {
    actionButtons?: ComponentProps<typeof WalletSuccess>['actionButtons'];
    description: React.ReactNode;
    displayBalance:
        | TDisplayBalance.CtraderAccountsList
        | TDisplayBalance.DxtradeAccountsList
        | TDisplayBalance.MT5AccountsList;
    landingCompanyName?: string;
    marketType?: TMarketTypes.SortedMT5Accounts;
    platform?: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
    title: React.ReactNode;
};

const CFDSuccess: React.FC<TSuccessProps> = ({
    actionButtons,
    description,
    displayBalance,
    landingCompanyName,
    marketType,
    platform,
    product,
    title,
}) => {
    const { data } = useActiveWalletAccount();
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const isDemo = data?.is_virtual;

    const isDxtradeOrCtrader =
        marketType === MARKET_TYPE.ALL &&
        (platform === PlatformDetails.dxtrade.platform || platform === PlatformDetails.ctrader.platform);

    let marketTypeTitle = localize('Options');

    if (marketType && platform) {
        const isPlatformValid = Object.keys(PlatformDetails).includes(platform);
        if (isDxtradeOrCtrader && isPlatformValid) {
            marketTypeTitle = PlatformDetails[platform].title;
        } else {
            marketTypeTitle = getMarketTypeDetails(localize, product)[marketType].title;
        }
    }

    const platformTitlePrefix = platform === PlatformDetails.mt5.platform ? CFD_PLATFORMS.MT5.toLocaleUpperCase() : '';

    return (
        <WalletSuccess
            actionButtons={isDesktop ? actionButtons : undefined}
            description={description}
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
                                <Text color='white' size='2xs' weight='bold'>
                                    {isDemo ? localize('Demo') : localize('Real')}
                                </Text>
                            </div>
                            <div className='wallets-cfd-success__market-icon'>
                                <WalletMarketCurrencyIcon
                                    currency={data?.currency ?? 'USD'}
                                    isDemo={isDemo ?? false}
                                    marketType={marketType}
                                    platform={platform}
                                    product={product}
                                />
                            </div>
                            <div className='wallets-cfd-success__info'>
                                <Text size='2xs'>
                                    {platformTitlePrefix} {marketTypeTitle} {!isDemo && landingCompanyName}
                                </Text>
                                <Text color='primary' size='2xs'>
                                    {data?.currency} Wallet
                                </Text>
                                {!displayBalance ? (
                                    <div
                                        className='wallets-skeleton wallets-cfd-success__balance-loader'
                                        data-testid='dt_wallets_cfd_success_skeleton_loader'
                                    />
                                ) : (
                                    <Text size='sm' weight='bold'>
                                        {displayBalance}
                                    </Text>
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
