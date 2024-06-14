import React from 'react';
import { Analytics } from '@deriv-com/analytics';
import classNames from 'classnames';
import { Button, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { useMT5SVGEligibleToMigrate } from '@deriv/hooks';
import {
    JURISDICTION_MARKET_TYPES,
    getFormattedJurisdictionMarketTypes,
    getCFDPlatformNames,
    CFD_PLATFORMS,
} from '@deriv/shared';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import MigrationBannerImage from './migration-banner-image';
import './migration-banner.scss';

type TMigrationBannerProps = {
    is_trade_modal?: boolean;
};
const MigrationBanner = observer(({ is_trade_modal = false }: TMigrationBannerProps) => {
    const { ui } = useStore();
    const { is_dark_mode_on, toggleMT5MigrationModal, is_mobile_or_tablet } = ui;
    const { setMT5MigrationError, is_mt5_trade_modal_visible, toggleMT5TradeModal } = useCfdStore();
    const { has_derived_mt5_to_migrate, has_derived_and_financial_mt5 } = useMT5SVGEligibleToMigrate();
    const openMT5MigrationModal = () => {
        if (is_mt5_trade_modal_visible) toggleMT5TradeModal();
        setMT5MigrationError('');
        Analytics.trackEvent('ce_upgrade_mt5_banner', {
            action: 'push_cta_upgrade',
        });
        toggleMT5MigrationModal(true);
    };
    const is_desktop_trade_modal = is_trade_modal && !is_mobile_or_tablet;
    return (
        <div
            className={classNames('mt5-migration-banner', {
                'mt5-migration-banner__trade-modal': is_trade_modal,
            })}
        >
            <div
                className={classNames('mt5-migration-banner__description', {
                    'mt5-migration-banner__description--trade-modal': is_desktop_trade_modal,
                })}
            >
                <div className='mt5-migration-banner__description-text'>
                    {has_derived_and_financial_mt5 ? (
                        <Text size='xs'>
                            <Localize
                                i18n_default_text='Upgrade your <0>{{account_1}}</0> <1/>and <0>{{account_2}} {{platform}} </0> account(s)'
                                values={{
                                    account_1: getFormattedJurisdictionMarketTypes(JURISDICTION_MARKET_TYPES.DERIVED),
                                    account_2: getFormattedJurisdictionMarketTypes(JURISDICTION_MARKET_TYPES.FINANCIAL),
                                    platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                                }}
                                components={[<strong key={0} />, is_desktop_trade_modal ? null : <br key={1} />]}
                            />
                        </Text>
                    ) : (
                        <Text size='xs'>
                            <Localize
                                i18n_default_text='Upgrade your <0/><1>{{account_title}} {{platform}} </1> account(s)'
                                values={{
                                    account_title: getFormattedJurisdictionMarketTypes(
                                        has_derived_mt5_to_migrate
                                            ? JURISDICTION_MARKET_TYPES.DERIVED
                                            : JURISDICTION_MARKET_TYPES.FINANCIAL
                                    ),
                                    platform: getCFDPlatformNames(CFD_PLATFORMS.MT5),
                                }}
                                components={[is_desktop_trade_modal ? null : <br key={0} />, <strong key={1} />]}
                            />
                        </Text>
                    )}
                </div>
                <Button primary_light onClick={openMT5MigrationModal}>
                    <Localize i18n_default_text='Upgrade' />
                </Button>
            </div>
            <MigrationBannerImage image={is_dark_mode_on ? 'migrate_card_dark' : 'migrate_card'} />
        </div>
    );
});

export default MigrationBanner;
