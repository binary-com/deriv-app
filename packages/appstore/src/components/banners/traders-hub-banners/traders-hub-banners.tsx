import React from 'react';
import { Loading } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { useGrowthbookGetFeatureValue, useStoreHasAccountDeposited } from '@deriv/hooks';
import BookBanner from 'Components/banners/book-banner';
import WalletsBanner from 'Components/banners/wallets-banner';

const RealAccountCreationBanner = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "Components_banners_real-account-creation-banner" */ 'Components/banners/real-account-creation-banner'
                )
        ),
    () => <Loading />
)();

const DepositNowBanner = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "Components_banners_deposit-now-banner" */ 'Components/banners/deposit-now-banner'
                )
        ),
    () => <Loading />
)();

const TradersHubBanners = observer(() => {
    const { client, traders_hub } = useStore();
    const { is_landing_company_loaded, has_any_real_account, is_eu } = client;
    const { is_real } = traders_hub;
    const { hasDeposited, hasTransferred, isLoaded } = useStoreHasAccountDeposited();

    const [ff_real_account_creation_banner] = useGrowthbookGetFeatureValue({
        featureFlag: 'traders-hub-real-account-banner',
        defaultValue: false,
    });

    const [ff_deposit_now_banner] = useGrowthbookGetFeatureValue({
        featureFlag: 'traders_hub_first_deposit_banner',
        defaultValue: false,
    });

    const should_add_empty_div_for_get_started_trading_banner_clever_tap = has_any_real_account;
    const should_show_real_account_creation_banner =
        ff_real_account_creation_banner && !has_any_real_account && !is_eu && is_landing_company_loaded;
    const should_show_deposit_now_banner =
        ff_deposit_now_banner && is_real && isLoaded && !hasDeposited && !hasTransferred;

    return (
        <React.Fragment>
            {should_add_empty_div_for_get_started_trading_banner_clever_tap && (
                <div className='get-started-trading-banner-ct' />
            )}
            {should_show_real_account_creation_banner && <RealAccountCreationBanner />}
            {should_show_deposit_now_banner && <DepositNowBanner />}
            <BookBanner />
            <WalletsBanner />
        </React.Fragment>
    );
});

export default TradersHubBanners;
