import React from 'react';
import { Text, DesktopWrapper, MobileWrapper, Tabs, Icon, Loading } from '@deriv/components';
import { ContentFlag, makeLazyLoader, moduleLoader } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useFeatureFlags, useWalletMigration } from '@deriv/hooks';
import RegulationsSwitcherLoader from 'Components/pre-loader/regulations-switcher-loader';
import BookBanner from 'Components/banners/book-banner';
import AccountTypeDropdown from './account-type-dropdown';
import AssetSummary from './asset-summary';
import RegulatorSwitcher from './regulators-switcher';
import './main-title-bar.scss';

const WalletsBanner = makeLazyLoader(
    () =>
        moduleLoader(
            () => import(/* webpackChunkName: "Components_wallets-banner" */ 'Components/banners/wallets-banner')
        ),
    () => <Loading />
)();

const MainTitleBar = () => {
    const { traders_hub, client } = useStore();
    const { is_landing_company_loaded, is_switching } = client;
    const { state: wallet_migration_state } = useWalletMigration();
    const { selected_region, handleTabItemClick, toggleRegulatorsCompareModal, content_flag } = traders_hub;
    const { is_next_wallet_enabled } = useFeatureFlags();

    const is_low_risk_cr_real_account =
        content_flag === ContentFlag.LOW_RISK_CR_NON_EU || content_flag === ContentFlag.LOW_RISK_CR_EU;
    const show_wallets_banner =
        is_next_wallet_enabled && wallet_migration_state && wallet_migration_state !== 'ineligible';

    const [active_index, setActiveIndex] = React.useState(0);
    React.useEffect(() => {
        setActiveIndex(selected_region === 'Non-EU' ? 0 : 1);
    }, [selected_region]);

    return (
        <React.Fragment>
            <BookBanner />
            {show_wallets_banner && <WalletsBanner />}
            <DesktopWrapper>
                <div className='main-title-bar'>
                    <div className='main-title-bar__right'>
                        <Text size='m' weight='bold' color='prominent'>
                            <Localize i18n_default_text="Trader's Hub" />
                        </Text>
                        <AccountTypeDropdown />
                    </div>
                    {is_low_risk_cr_real_account && is_landing_company_loaded && <RegulatorSwitcher />}
                    <AssetSummary />
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <Text weight='bold' className='main-title-bar__text' color='prominent'>
                    <Localize i18n_default_text="Trader's Hub" />
                </Text>
                <div className='main-title-bar-mobile'>
                    <div className='main-title-bar-mobile--account-type-dropdown'>
                        <AccountTypeDropdown />
                    </div>
                    {is_low_risk_cr_real_account && is_landing_company_loaded ? (
                        <div className='main-title-bar-mobile--regulator'>
                            {!is_switching ? (
                                <>
                                    <div
                                        className='main-title-bar-mobile--regulator--compare-modal'
                                        onClick={() => toggleRegulatorsCompareModal()}
                                    >
                                        <Icon icon='IcInfoOutline' />
                                    </div>
                                    <Tabs
                                        active_index={active_index}
                                        onTabItemClick={(index: number) => {
                                            setActiveIndex(index);
                                            handleTabItemClick(index);
                                        }}
                                        top
                                        is_scrollable
                                        is_overflow_hidden
                                    >
                                        <div label={localize('Non-EU')} />
                                        <div label={localize('EU')} />
                                    </Tabs>
                                </>
                            ) : (
                                <div className='main-title-bar-mobile--regulator__container content-loader'>
                                    <RegulationsSwitcherLoader />
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
                <AssetSummary />
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(MainTitleBar);
