import React from 'react';
import WalletsBannerUpgrade from './wallets-banner-upgrade';
import WalletsBannerUpgrading from './wallets-banner-upgrading';
import WalletsBannerReady from './wallets-banner-ready';
import { useWalletMigration } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';

const WalletsBanner = observer(() => {
    const { is_eligible, is_failed, is_in_progress, is_migrated } = useWalletMigration();
    const { traders_hub } = useStore();
    const { is_eu_user } = traders_hub;

    // TODO: Uncomment this when implementing banner ready component
    // if (is_migrated) return <WalletsBannerReady is_eu={is_eu_user} />;

    if (is_eligible || is_failed) return <WalletsBannerUpgrade />;

    // TODO: Uncomment this when implementing upgrading banner component
    //if (is_in_progress) return <WalletsBannerUpgrading is_eu={is_eu_user} />;

    return null;
});

export default WalletsBanner;
