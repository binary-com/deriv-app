import React from 'react';
import { observer } from '@deriv/stores';
import { useWalletMigration } from '@deriv/hooks';
import WalletsBannerUpgrade from './wallets-banner-upgrade';
import WalletsBannerUpgrading from './wallets-banner-upgrading';
import WalletsBannerUnsuccessful from './wallets-banner-unsuccessful';
import './wallets-banner.scss';

const WalletsBanner = observer(() => {
    const { is_eligible, is_failed, is_in_progress } = useWalletMigration();

    if (is_eligible) return <WalletsBannerUpgrade />;

    if (is_failed) return <WalletsBannerUnsuccessful />;

    if (is_in_progress) return <WalletsBannerUpgrading />;

    return null;
});

export default WalletsBanner;
