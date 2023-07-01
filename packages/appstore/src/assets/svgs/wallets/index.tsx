import React from 'react';
import ReadyToUpgradeWalletsImage from './ready_to_upgrade_wallets_image.svg';
import UpgradeDesktopImage from 'Assets/svgs/wallets/wallets-upgrade-desktop.svg';
import UpgradeMobileImage from 'Assets/svgs/wallets/wallets-upgrade-mobile.svg';
import ReadyDesktopImage from 'Assets/svgs/wallets/wallets-ready-desktop.svg';
import ReadyDesktopEuImage from 'Assets/svgs/wallets/wallets-ready-desktop-eu.svg';
import ReadyMobileImage from 'Assets/svgs/wallets/wallets-ready-mobile.svg';
import ReadyMobileEuImage from 'Assets/svgs/wallets/wallets-ready-mobile-eu.svg';
import IntroducingWallets from 'Assets/svgs/wallets/introducing-wallets.svg';
import IntroducingWalletsEU from 'Assets/svgs/wallets/introducing-wallets-eu.svg';
import HowItWorks from 'Assets/svgs/wallets/how-it-works.svg';
import TradingAccounts from 'Assets/svgs/wallets/trading-accounts.svg';
import TradingAccountsEU from 'Assets/svgs/wallets/trading-accounts-eu.svg';
import { TImageTestID, TWalletsImagesListKeys, WalletsImageProps } from './image-types';

export const WalletsImagesList = {
    upgrade_desktop: UpgradeDesktopImage,
    upgrade_mobile: UpgradeMobileImage,
    upgrading_desktop: ReadyDesktopImage,
    upgrading_desktop_eu: ReadyDesktopEuImage,
    upgrading_mobile: ReadyMobileImage,
    upgrading_mobile_eu: ReadyMobileEuImage,
    ready_desktop: ReadyDesktopImage,
    ready_desktop_eu: ReadyDesktopEuImage,
    ready_mobile: ReadyMobileImage,
    ready_mobile_eu: ReadyMobileEuImage,
    introducing_wallets: IntroducingWallets,
    introducing_wallets_eu: IntroducingWalletsEU,
    how_it_works: HowItWorks,
    trading_accounts: TradingAccounts,
    trading_accounts_eu: TradingAccountsEU,
    ready_to_upgrade_wallets_image: ReadyToUpgradeWalletsImage,
} as const;

const WalletsImage = ({ image, className, width }: WalletsImageProps<TWalletsImagesListKeys>) => {
    const Component = WalletsImagesList[image] as React.ElementType;
    const data_testid: TImageTestID = `dt_${image}`;

    return <Component className={className} style={{ width }} data-testid={data_testid} />;
};

export default WalletsImage;
