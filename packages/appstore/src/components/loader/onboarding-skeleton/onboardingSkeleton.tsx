import { Fragment } from 'react';
import CfdAppSkeleton from '../cfd-app-skeleton/cfdAppSkeleton';
import CFDToggleSkeleton from '../cfd-toggle-skeleton/cfdToggleSkeleton';
import HeaderSkeleton from '../header-skeleton/headerSkeleton';
import Mt5TitleSkeleton from '../mt5-title-skeleton/mt5TitleSkeleton';
import OptionsAndMultipliersSkeleton from '../options-and-multipliers-skeleton/optionsAndMultipliers';
import TitleSkeleton from '../title-skeleton/titleSkeleton';
import TotalAssetSkeleton from '../total-asset-skeleton/totalAssetSkeleton';
import TradingAppCardSkeleton from '../trading-app-skeleton/tradingAppSkeleton';
import './onbordingSkeleton.scss';

const TradingAppCardSkeletonBox = () => (
    <Fragment>
        <TradingAppCardSkeleton />
        <TradingAppCardSkeleton />
        <TradingAppCardSkeleton />
    </Fragment>
);
const OnboardingSkeleton = () => (
    <div className='onboarding-skeleton'>
        <div className='onboarding-skeleton__header'>
            <HeaderSkeleton />
        </div>
        <div className='onboarding-skeleton__content'>
            <div className='onboarding-skeleton__content--title-bar'>
                <TitleSkeleton />
                <TotalAssetSkeleton />
                <CFDToggleSkeleton />
            </div>
            <div className='onboarding-skeleton__content--options'>
                <OptionsAndMultipliersSkeleton />
                <div className='onboarding-skeleton__content--options--platforms'>
                    <TradingAppCardSkeletonBox />
                </div>
            </div>
            <div className='onboarding-skeleton__content--cfds'>
                <CfdAppSkeleton />
                <Mt5TitleSkeleton />
                <div className='onboarding-skeleton__content--cfds--platforms'>
                    <TradingAppCardSkeletonBox />
                </div>
            </div>
        </div>
    </div>
);

export default OnboardingSkeleton;
