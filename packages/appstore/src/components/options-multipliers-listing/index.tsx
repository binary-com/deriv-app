import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Text, StaticUrl } from '@deriv/components';
import { ContentFlag, setPerformanceValue } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Localize, useLocalize } from '@deriv/translations';
import { useDevice } from '@deriv-com/ui';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import { BrandConfig } from 'Constants/platform-config';
import { getHasDivider } from 'Constants/utils';
import { Analytics } from '@deriv-com/analytics';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import OptionsDescription from 'Components/elements/options-description';

const OptionsAndMultipliersListing = observer(() => {
    const { localize } = useLocalize();
    const { isDesktop } = useDevice();
    const { traders_hub, client, ui } = useStore();
    const {
        available_platforms,
        is_eu_user,
        is_real,
        no_MF_account,
        no_CR_account,
        is_demo,
        content_flag,
        selected_account_type,
    } = traders_hub;
    const { is_landing_company_loaded, is_eu, has_maltainvest_account, real_account_creation_unlock_date } = client;

    const { setShouldShowCooldownModal, openRealAccountSignup } = ui;

    const low_risk_cr_non_eu = content_flag === ContentFlag.LOW_RISK_CR_NON_EU;

    const low_risk_cr_eu = content_flag === ContentFlag.LOW_RISK_CR_EU;

    const high_risk_cr = content_flag === ContentFlag.HIGH_RISK_CR;

    const cr_demo = content_flag === ContentFlag.CR_DEMO;

    const OptionsTitle = () => {
        if (!isDesktop) return null;
        if (low_risk_cr_non_eu || high_risk_cr || cr_demo) {
            return (
                <Text size='sm' weight='bold'>
                    <Localize i18n_default_text='Options' />
                </Text>
            );
        } else if (low_risk_cr_eu || is_eu) {
            return (
                <Text size='sm' weight='bold' color='prominent'>
                    <Localize i18n_default_text='Multipliers' />
                </Text>
            );
        }
        return null;
    };

    useEffect(() => {
        if (is_landing_company_loaded) {
            setPerformanceValue('option_multiplier_section_loading_time');
        }
    }, [is_landing_company_loaded]);

    return (
        <ListingContainer
            title={<OptionsTitle />}
            description={<OptionsDescription is_eu_user={!(low_risk_cr_non_eu || high_risk_cr || cr_demo)} />}
            is_deriv_platform
        >
            {is_real && (no_CR_account || no_MF_account) && (
                <div className='full-row'>
                    <TradingAppCard
                        action_type='get'
                        availability='All'
                        clickable_icon
                        name={localize('Deriv account')}
                        description={
                            is_eu_user
                                ? localize('To trade multipliers, get a Deriv Apps account first.')
                                : localize('To trade options and multipliers, get a Deriv Apps account first.')
                        }
                        icon='Options'
                        onAction={() => {
                            if (no_MF_account) {
                                if (real_account_creation_unlock_date) {
                                    setShouldShowCooldownModal(true);
                                } else {
                                    openRealAccountSignup('maltainvest');
                                }
                            } else {
                                openRealAccountSignup('svg');
                            }
                        }}
                    />
                </div>
            )}

            {!available_platforms.length && <PlatformLoader />}
            {available_platforms.map((available_platform: BrandConfig, index: number) => (
                <TradingAppCard
                    key={`trading_app_card_${available_platform.name}`}
                    {...available_platform}
                    clickable_icon
                    action_type={
                        is_demo || (!no_CR_account && !is_eu_user) || (has_maltainvest_account && is_eu_user)
                            ? 'trade'
                            : 'none'
                    }
                    is_deriv_platform
                    onAction={() => {
                        Analytics.trackEvent('ce_tradershub_dashboard_form', {
                            action: 'account_open',
                            form_name: 'traders_hub_default',
                            account_mode: selected_account_type,
                            account_name: is_demo ? `${available_platform.name} Demo` : available_platform.name,
                        });
                    }}
                    has_divider={(!is_eu_user || is_demo) && getHasDivider(index, available_platforms.length, 3)}
                />
            ))}
        </ListingContainer>
    );
});

export default OptionsAndMultipliersListing;
