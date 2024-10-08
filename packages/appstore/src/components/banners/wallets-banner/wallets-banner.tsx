import React from 'react';
import { observer } from '@deriv/stores';
import { Loading } from '@deriv/components';
import { useWalletMigration } from '@deriv/hooks';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import './wallets-banner.scss';

const WalletsBannerUpgrade = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "wallets-banner-upgrade" */ './wallets-banner-upgrade')),
    () => <Loading />
)();

const WalletsBannerUpgrading = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "wallets-banner-upgrading" */ './wallets-banner-upgrading')),
    () => <Loading />
)();

const WalletsBannerUnsuccessful = makeLazyLoader(
    () =>
        moduleLoader(
            () => import(/* webpackChunkName: "wallets-banner-unsuccessful" */ './wallets-banner-unsuccessful')
        ),
    () => <Loading />
)();

const WalletsBanner = observer(() => {
    const { is_eligible, is_failed, is_in_progress, is_migrating } = useWalletMigration();

    const is_upgrading = is_in_progress || is_migrating;

    if (is_upgrading) return <WalletsBannerUpgrading />;

    if (is_failed) return <WalletsBannerUnsuccessful />;

    if (is_eligible) return <WalletsBannerUpgrade is_upgrading={is_upgrading} />;

    return null;
});

export default WalletsBanner;
