import React from 'react';
import { localize, useTranslations } from '@deriv-com/translations';
import { Divider, Text, Tooltip } from '@deriv-com/ui';
import InfoIcon from '../../../../public/images/ic-info-outline.svg';
import { THooks, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS, MARKET_TYPE, PRODUCT } from '../../constants';
import { ACCOUNT_ICONS, MARKET_TYPE_SHORTCODE } from './constants';
import './CompareAccountsTitleIcon.scss';

type TMarketType = THooks.AvailableMT5Accounts['market_type'];

type TCompareAccountsTitleIcon = {
    isDemo: boolean;
    marketType: TMarketType;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const getAccountIcon = (
    platform: TPlatforms.All,
    marketType: TMarketType,
    product?: THooks.AvailableMT5Accounts['product']
) => {
    if (platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER) {
        return ACCOUNT_ICONS[platform];
    }
    return (
        (product === PRODUCT.ZEROSPREAD && ACCOUNT_ICONS[product]) ||
        (marketType && ACCOUNT_ICONS[marketType]) ||
        ACCOUNT_ICONS.default
    );
};

type TMarketWithShortCode = `${TMarketType}_${string}`;

const getAccountCardTitle = (shortCode: TMarketWithShortCode | TPlatforms.OtherAccounts, isDemo?: boolean) => {
    switch (shortCode) {
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_SVG:
            return isDemo ? localize('Standard Demo') : localize('Standard - SVG');
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_BVI:
            return localize('Standard - BVI');
        case MARKET_TYPE_SHORTCODE.SYNTHETIC_VANUATU:
            return localize('Standard - Vanuatu');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_SVG:
            return isDemo ? localize('Financial Demo') : localize('Financial - SVG');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_BVI:
            return localize('Financial - BVI');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_VANUATU:
            return localize('Financial - Vanuatu');
        case MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN:
            return localize('Financial - Labuan');
        case MARKET_TYPE_SHORTCODE.ALL_SWAP_FREE_SVG:
            return isDemo ? localize('Swap-Free Demo') : localize('Swap-Free - SVG');
        case MARKET_TYPE_SHORTCODE.ALL_ZERO_SPREAD_BVI:
            return isDemo ? localize('Zero Spread Demo') : localize('Zero Spread - BVI');
        case CFD_PLATFORMS.DXTRADE:
            return isDemo ? localize('Deriv X Demo') : localize('Deriv X');
        case CFD_PLATFORMS.CTRADER:
            return isDemo ? localize('Deriv cTrader Demo') : localize('Deriv cTrader');
        default:
            return isDemo ? localize('CFDs Demo') : localize('CFDs');
    }
};

const CompareAccountsTitleIcon = ({ isDemo, marketType, platform, product, shortCode }: TCompareAccountsTitleIcon) => {
    const { localize } = useTranslations();
    const marketTypeShortCode: TMarketWithShortCode =
        platform === CFD_PLATFORMS.MT5 && marketType === MARKET_TYPE.ALL
            ? `${marketType}_${product}_${shortCode}`
            : `${marketType}_${shortCode}`;

    const jurisdictionCardIcon = getAccountIcon(platform, marketType, product);

    const jurisdictionCardTitle =
        platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER
            ? getAccountCardTitle(platform, isDemo)
            : getAccountCardTitle(marketTypeShortCode, isDemo);
    const labuanJurisdictionMessage = localize(
        'Choosing this jurisdiction will give you a Financial STP account. Your trades will go directly to the market and have tighter spreads.'
    );

    return (
        <React.Fragment>
            <div className='wallets-compare-accounts-title'>
                {jurisdictionCardIcon}
                <div className='wallets-compare-accounts-title__separator'>
                    <Text align='center' as='h1' size='sm' weight='bold'>
                        {jurisdictionCardTitle}
                    </Text>
                    {marketTypeShortCode === MARKET_TYPE_SHORTCODE.FINANCIAL_LABUAN && (
                        <Tooltip
                            as='div'
                            data-testid='dt_wallets_compare_accounts_title__tooltip'
                            tooltipContainerClassName='wallets-compare-accounts-title__tooltip'
                            tooltipContent={labuanJurisdictionMessage}
                            tooltipPosition='bottom-start'
                        >
                            <InfoIcon />
                        </Tooltip>
                    )}
                </div>
            </div>
            <Divider color='var(--general-main-3)' height={0.5} margin='0.4rem 2.8rem' />
        </React.Fragment>
    );
};

export default CompareAccountsTitleIcon;
