import React, { Fragment, useEffect } from 'react';
import { observer, useStore } from '@deriv/stores';
import { Loading, Text } from '@deriv/components';
import {
    CFD_PLATFORMS,
    formatMoney,
    MT5_ACCOUNT_STATUS,
    TRADING_PLATFORM_STATUS,
    makeLazyLoader,
    moduleLoader,
    setPerformanceValue,
} from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import ListingContainer from 'Components/containers/listing-container';
import AddOptionsAccount from 'Components/add-options-account';
import TradingAppCard from 'Components/containers/trading-app-card';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import CompareAccount from 'Components/compare-account';
import CFDsDescription from 'Components/elements/cfds-description';
import { getHasDivider } from 'Constants/utils';
import {
    useMT5SVGEligibleToMigrate,
    useTradingPlatformStatus,
    TradingPlatformStatus,
    useGrowthbookGetFeatureValue,
} from '@deriv/hooks';

import './cfds-listing.scss';

const MigrationBanner = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "cfd_migration-banner" */ '@deriv/cfd/src/Containers/migration-banner/migration-banner'
                )
        ),
    () => <Loading />
)();

const CFDsListing = observer(() => {
    const { isDesktop } = useDevice();
    const {
        client,
        modules: { cfd },
        traders_hub,
        common,
        ui,
    } = useStore();
    const {
        available_dxtrade_accounts,
        available_ctrader_accounts,
        combined_cfd_mt5_accounts,
        selected_region,
        has_any_real_account,
        startTrade,
        is_real,
        getExistingAccounts,
        getAccount,
        selected_account_type,
        is_eu_user,
        is_demo_low_risk,
        no_MF_account,
        toggleAccountTransferModal,
        is_demo,
        showTopUpModal,
        no_CR_account,
        setSelectedAccount,
        CFDs_restricted_countries,
        financial_restricted_countries,
        getDefaultJurisdiction,
    } = traders_hub;
    const {
        setAccountType,
        toggleCTraderTransferModal,
        setAccountUnavailableModal,
        setServerMaintenanceModal,
        setProduct,
        setJurisdictionSelectedShortcode,
    } = cfd;

    const {
        is_landing_company_loaded,
        is_populating_mt5_account_list,
        real_account_creation_unlock_date,
        ctrader_total_balance,
        updateMT5AccountDetails,
    } = client;
    const { setAppstorePlatform } = common;
    const { openDerivRealAccountNeededModal, setShouldShowCooldownModal } = ui;
    const has_no_real_account = !has_any_real_account;
    const accounts_sub_text =
        !is_eu_user || is_demo_low_risk ? localize('Compare accounts') : localize('Account Information');

    const [is_traders_dashboard_tracking_enabled] = useGrowthbookGetFeatureValue({
        featureFlag: 'ce_tradershub_dashboard_tracking',
        defaultValue: false,
    });

    const { has_svg_accounts_to_migrate } = useMT5SVGEligibleToMigrate();

    const { getPlatformStatus } = useTradingPlatformStatus();

    const getTradingPlatformStatus = (platform: TradingPlatformStatus['platform']) => {
        const status = getPlatformStatus(platform);

        switch (status) {
            case TRADING_PLATFORM_STATUS.MAINTENANCE:
                return setServerMaintenanceModal(true);
            case TRADING_PLATFORM_STATUS.UNAVAILABLE:
                return setAccountUnavailableModal(true);
            case TRADING_PLATFORM_STATUS.ACTIVE:
                return getAccount();
            default:
                break;
        }
    };

    const hasUnavailableAccount = combined_cfd_mt5_accounts.some(
        account => account.status === TRADING_PLATFORM_STATUS.UNAVAILABLE
    );
    const hasMaintenanceStatus =
        combined_cfd_mt5_accounts.some(account => account.status === MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE) ||
        combined_cfd_mt5_accounts.some(
            account => getPlatformStatus(account.platform ?? CFD_PLATFORMS.MT5) === TRADING_PLATFORM_STATUS.MAINTENANCE
        );

    const getMT5AccountAuthStatus = (current_acc_status?: string | null, jurisdiction?: string) => {
        if (current_acc_status === 'under_maintenance') {
            return MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE;
        } else if (current_acc_status === 'unavailable') {
            return TRADING_PLATFORM_STATUS.UNAVAILABLE;
        } else if (jurisdiction) {
            switch (current_acc_status) {
                case 'proof_failed':
                case 'poa_failed':
                    return MT5_ACCOUNT_STATUS.FAILED;
                case 'verification_pending':
                    return MT5_ACCOUNT_STATUS.PENDING;
                case 'needs_verification':
                    return MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION;
                case 'migrated_with_position':
                    return MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION;
                case 'migrated_without_position':
                    return MT5_ACCOUNT_STATUS.MIGRATED_WITHOUT_POSITION;
                default:
                    return null;
            }
        }
        return '';
    };

    const no_real_mf_account_eu_regulator = no_MF_account && is_eu_user && is_real;

    const no_real_cr_non_eu_regulator = no_CR_account && !is_eu_user && is_real;

    const AddDerivAccount = () => {
        if (is_real) {
            if (no_CR_account && !is_eu_user) {
                return (
                    <div className='cfd-full-row'>
                        <AddOptionsAccount />
                    </div>
                );
            } else if (no_MF_account && is_eu_user) {
                return (
                    <div className='cfd-full-row'>
                        <AddOptionsAccount />
                    </div>
                );
            }
        }
        return null;
    };

    useEffect(() => {
        if (is_landing_company_loaded && is_populating_mt5_account_list) {
            setPerformanceValue('login_time');
            setPerformanceValue('redirect_from_deriv_com_time');
            setPerformanceValue('switch_currency_accounts_time');
            setPerformanceValue('switch_from_demo_to_real_time');
            setPerformanceValue('switch_from_real_to_demo_time');
        }
        updateMT5AccountDetails();
    }, [is_landing_company_loaded, is_populating_mt5_account_list]);

    return (
        <ListingContainer
            title={
                isDesktop && (
                    <div className='cfd-accounts__title'>
                        <Text size='sm' weight='bold' color='prominent'>
                            {localize('CFDs')}
                        </Text>
                        <CompareAccount accounts_sub_text={accounts_sub_text} is_desktop />
                    </div>
                )
            }
            description={<CFDsDescription />}
        >
            {!isDesktop && <CompareAccount accounts_sub_text={accounts_sub_text} />}
            <AddDerivAccount />
            <div className='cfd-full-row' style={{ paddingTop: '2rem' }}>
                <Text line_height='m' weight='bold' color='prominent'>
                    {localize('Deriv MT5')}
                </Text>
            </div>
            {has_svg_accounts_to_migrate && is_landing_company_loaded && <MigrationBanner />}
            {is_landing_company_loaded && !is_populating_mt5_account_list ? (
                <React.Fragment>
                    {/* MT5 */}
                    {combined_cfd_mt5_accounts.map((existing_account, index: number) => {
                        const list_size = combined_cfd_mt5_accounts.length;

                        const track_account_subtitle = existing_account.tracking_name ?? '';

                        const has_mt5_account_status =
                            existing_account?.status || hasMaintenanceStatus
                                ? getMT5AccountAuthStatus(
                                      existing_account?.status,
                                      existing_account?.landing_company_short
                                  )
                                : '';
                        return (
                            <TradingAppCard
                                action_type={existing_account.action_type}
                                availability={selected_region}
                                clickable_icon
                                is_new
                                icon={existing_account.icon}
                                sub_title={existing_account?.sub_title}
                                name={!has_mt5_account_status ? existing_account?.name : ''}
                                short_code_and_region={existing_account?.short_code_and_region}
                                platform={existing_account.platform}
                                description={existing_account.description}
                                key={existing_account.key}
                                has_divider={(!is_eu_user || is_demo) && getHasDivider(index, list_size, 3)}
                                onAction={(e?: React.MouseEvent<HTMLButtonElement>) => {
                                    if (existing_account.action_type === 'get') {
                                        if (is_traders_dashboard_tracking_enabled) {
                                            Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                action: 'account_get',
                                                form_name: 'traders_hub_default',
                                                account_mode: selected_account_type,
                                                account_name: track_account_subtitle,
                                            });
                                        }
                                        if (hasUnavailableAccount || hasMaintenanceStatus)
                                            return setServerMaintenanceModal(true);

                                        if (real_account_creation_unlock_date && no_real_mf_account_eu_regulator) {
                                            setShouldShowCooldownModal(true);
                                        } else if (no_real_cr_non_eu_regulator || no_real_mf_account_eu_regulator) {
                                            openDerivRealAccountNeededModal();
                                        } else {
                                            setAccountType({
                                                category: selected_account_type,
                                                type: existing_account.market_type,
                                            });
                                            setProduct(existing_account.product);
                                            setAppstorePlatform(existing_account.platform);
                                            setJurisdictionSelectedShortcode(getDefaultJurisdiction());
                                            getTradingPlatformStatus(existing_account.platform);
                                        }
                                    } else if (existing_account.action_type === 'multi-action') {
                                        const button_name = e?.currentTarget?.name;
                                        setProduct(existing_account.product);
                                        if (button_name === 'transfer-btn') {
                                            if (is_traders_dashboard_tracking_enabled) {
                                                Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                    action: 'account_transfer',
                                                    form_name: 'traders_hub_default',
                                                    account_mode: selected_account_type,
                                                    account_name: track_account_subtitle,
                                                });
                                            }

                                            toggleAccountTransferModal();
                                            setSelectedAccount(existing_account);
                                        } else if (button_name === 'topup-btn') {
                                            if (is_traders_dashboard_tracking_enabled) {
                                                Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                    action: 'account_topup',
                                                    form_name: 'traders_hub_default',
                                                    account_mode: selected_account_type,
                                                    account_name: track_account_subtitle,
                                                });
                                            }

                                            showTopUpModal(existing_account);
                                            setAppstorePlatform(existing_account.platform);
                                        } else {
                                            if (is_traders_dashboard_tracking_enabled) {
                                                Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                    action: 'account_open',
                                                    form_name: 'traders_hub_default',
                                                    account_mode: selected_account_type,
                                                    account_name: track_account_subtitle,
                                                });
                                            }

                                            startTrade(existing_account.platform, existing_account);
                                        }
                                    }
                                }}
                                mt5_acc_auth_status={has_mt5_account_status}
                                selected_mt5_jurisdiction={{
                                    platform: existing_account.platform,
                                    category: selected_account_type,
                                    type: existing_account.market_type,
                                    jurisdiction: existing_account.landing_company_short,
                                    product: existing_account.product,
                                }}
                                market_type={existing_account?.market_type}
                            />
                        );
                    })}
                </React.Fragment>
            ) : (
                <PlatformLoader />
            )}

            {/* cTrader */}
            {!is_eu_user && !CFDs_restricted_countries && !financial_restricted_countries && (
                <Fragment>
                    <div className='cfd-full-row'>
                        <hr className='divider' />
                    </div>
                    <div className='cfd-full-row' style={{ paddingTop: '2rem' }}>
                        <Text weight='bold'>{localize('Deriv cTrader')}</Text>
                    </div>
                    {is_landing_company_loaded ? (
                        available_ctrader_accounts.map(account => {
                            const existing_accounts = getExistingAccounts(account.platform, account.market_type);
                            const has_existing_accounts = existing_accounts.length > 0;
                            const track_account_name = is_demo ? `${account.name} ${'Demo'}` : account.name;
                            return has_existing_accounts ? (
                                existing_accounts.map(existing_account => (
                                    <TradingAppCard
                                        action_type='multi-action'
                                        availability={selected_region}
                                        clickable_icon
                                        icon={account.icon}
                                        sub_title={account.name}
                                        name={`${formatMoney(
                                            existing_account.currency,
                                            is_demo ? existing_account.display_balance : ctrader_total_balance,
                                            true
                                        )} ${existing_account.currency}`}
                                        description={existing_account.display_login}
                                        platform={account.platform}
                                        key={`trading_app_card_${existing_account.display_login}`}
                                        onAction={(e?: React.MouseEvent<HTMLButtonElement>) => {
                                            const button_name = e?.currentTarget?.name;
                                            setProduct();
                                            if (button_name === 'transfer-btn') {
                                                if (is_traders_dashboard_tracking_enabled) {
                                                    Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                        action: 'account_transfer',
                                                        form_name: 'traders_hub_default',
                                                        account_mode: selected_account_type,
                                                        account_name: track_account_name,
                                                    });
                                                }

                                                toggleCTraderTransferModal();
                                            } else if (button_name === 'topup-btn') {
                                                if (is_traders_dashboard_tracking_enabled) {
                                                    Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                        action: 'account_topup',
                                                        form_name: 'traders_hub_default',
                                                        account_mode: selected_account_type,
                                                        account_name: track_account_name,
                                                    });
                                                }

                                                showTopUpModal(existing_account);
                                                setAppstorePlatform(account.platform);
                                            } else {
                                                if (is_traders_dashboard_tracking_enabled) {
                                                    Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                        action: 'account_open',
                                                        form_name: 'traders_hub_default',
                                                        account_mode: selected_account_type,
                                                        account_name: track_account_name,
                                                    });
                                                }

                                                startTrade(account.platform, existing_account);
                                            }
                                        }}
                                    />
                                ))
                            ) : (
                                <TradingAppCard
                                    action_type='get'
                                    availability={selected_region}
                                    clickable_icon
                                    icon={account.icon}
                                    name={account.name}
                                    platform={account.platform}
                                    description={account.description}
                                    onAction={() => {
                                        setProduct();
                                        if (is_traders_dashboard_tracking_enabled) {
                                            Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                action: 'account_get',
                                                form_name: 'traders_hub_default',
                                                account_mode: selected_account_type,
                                                account_name: track_account_name,
                                            });
                                        }
                                        if ((has_no_real_account || no_CR_account) && is_real) {
                                            openDerivRealAccountNeededModal();
                                        } else {
                                            setAccountType({
                                                category: selected_account_type,
                                                type: account.market_type,
                                            });
                                            setAppstorePlatform(account.platform);
                                            getTradingPlatformStatus(account.platform);
                                        }
                                    }}
                                    key={`trading_app_card_${account.name}`}
                                    is_new
                                />
                            );
                        })
                    ) : (
                        <PlatformLoader />
                    )}
                    <React.Fragment>
                        <div className='cfd-full-row'>
                            <hr className='divider' />
                        </div>

                        <div className='cfd-full-row'>
                            <Text line_height='m' weight='bold' color='prominent'>
                                {localize('Deriv X')}
                            </Text>
                        </div>
                    </React.Fragment>
                    {/* dxtrade */}
                    {is_landing_company_loaded ? (
                        available_dxtrade_accounts?.map(account => {
                            const existing_accounts = getExistingAccounts(account.platform, account.market_type);
                            const has_existing_accounts = existing_accounts.length > 0;
                            const track_account_name = is_demo ? `${account.name} ${'Demo'}` : account.name;

                            return has_existing_accounts ? (
                                existing_accounts.map(existing_account => (
                                    <TradingAppCard
                                        action_type='multi-action'
                                        availability={selected_region}
                                        clickable_icon
                                        icon={account.icon}
                                        sub_title={account.name}
                                        name={`${formatMoney(
                                            existing_account.currency,
                                            existing_account.display_balance,
                                            true
                                        )} ${existing_account.currency}`}
                                        description={existing_account.login}
                                        platform={account.platform}
                                        key={`trading_app_card_${existing_account.login}`}
                                        onAction={(e?: React.MouseEvent<HTMLButtonElement>) => {
                                            const button_name = e?.currentTarget?.name;
                                            setProduct();
                                            if (button_name === 'transfer-btn') {
                                                if (is_traders_dashboard_tracking_enabled) {
                                                    Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                        action: 'account_transfer',
                                                        form_name: 'traders_hub_default',
                                                        account_mode: selected_account_type,
                                                        account_name: track_account_name,
                                                    });
                                                }

                                                toggleAccountTransferModal();
                                                setSelectedAccount(existing_account);
                                            } else if (button_name === 'topup-btn') {
                                                if (is_traders_dashboard_tracking_enabled) {
                                                    Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                        action: 'account_topup',
                                                        form_name: 'traders_hub_default',
                                                        account_mode: selected_account_type,
                                                        account_name: track_account_name,
                                                    });
                                                }

                                                showTopUpModal(existing_account);
                                                setAppstorePlatform(account.platform);
                                            } else {
                                                if (is_traders_dashboard_tracking_enabled) {
                                                    Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                        action: 'account_open',
                                                        form_name: 'traders_hub_default',
                                                        account_mode: selected_account_type,
                                                        account_name: track_account_name,
                                                    });
                                                }

                                                startTrade(account.platform, existing_account);
                                            }
                                        }}
                                    />
                                ))
                            ) : (
                                <TradingAppCard
                                    action_type='get'
                                    availability={selected_region}
                                    clickable_icon
                                    icon={account.icon}
                                    name={account.name}
                                    platform={account.platform}
                                    description={account.description}
                                    onAction={() => {
                                        setProduct();
                                        if (is_traders_dashboard_tracking_enabled) {
                                            Analytics.trackEvent('ce_tradershub_dashboard_form', {
                                                action: 'account_get',
                                                form_name: 'traders_hub_default',
                                                account_mode: selected_account_type,
                                                account_name: track_account_name,
                                            });
                                        }
                                        if ((has_no_real_account || no_CR_account) && is_real) {
                                            openDerivRealAccountNeededModal();
                                        } else {
                                            setAccountType({
                                                category: selected_account_type,
                                                type: account.market_type,
                                            });
                                            setAppstorePlatform(account.platform);
                                            getTradingPlatformStatus(account.platform);
                                        }
                                    }}
                                    key={`trading_app_card_${account.name}`}
                                />
                            );
                        })
                    ) : (
                        <PlatformLoader />
                    )}
                </Fragment>
            )}
        </ListingContainer>
    );
});

export default CFDsListing;
