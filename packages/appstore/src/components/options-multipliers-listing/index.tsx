import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Text, StaticUrl } from '@deriv/components';
import { ContentFlag, getPlatformSettingsAppstore, setPerformanceValue } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import { getHasDivider } from 'Constants/utils';
import { Analytics } from '@deriv-com/analytics';

const OptionsAndMultipliersListing = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const {
        available_platforms,
        is_eu_user,
        is_real,
        no_MF_account,
        no_CR_account,
        is_demo,
        selected_account_type,
        content_flag,
        setIsDerivGoModalVisible,
    } = traders_hub;
    const { has_maltainvest_account, is_eu, real_account_creation_unlock_date, is_landing_company_loaded } = client;

    const { setShouldShowCooldownModal, openRealAccountSignup, is_mobile } = ui;

    const low_risk_cr_non_eu = content_flag === ContentFlag.LOW_RISK_CR_NON_EU;

    const low_risk_cr_eu = content_flag === ContentFlag.LOW_RISK_CR_EU;

    const high_risk_cr = content_flag === ContentFlag.HIGH_RISK_CR;

    const cr_demo = content_flag === ContentFlag.CR_DEMO;

    const analyticsAction = (available_platform: typeof available_platforms[number]) => {
        Analytics.trackEvent('ce_tradershub_dashboard_form', {
            action: 'account_open',
            form_name: 'traders_hub_default',
            account_mode: selected_account_type,
            account_name: is_demo ? `${available_platform.name} ${localize('Demo')}` : available_platform.name,
        });
    };

    const OptionsTitle = () => {
        if (is_mobile) return null;
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
            description={
                low_risk_cr_non_eu || high_risk_cr || cr_demo ? (
                    <Text size='xs' line_height='s'>
                        <Localize
                            i18n_default_text='Buy or sell at a specific time for a specific price. <0>Learn more</0>'
                            components={[
                                <StaticUrl
                                    key={0}
                                    className='options'
                                    href='trade-types/options/digital-options/up-and-down/'
                                />,
                            ]}
                        />
                    </Text>
                ) : (
                    <Text size='xs' line_height='s'>
                        <Localize
                            i18n_default_text='Multipliers let you trade with leverage and limit your risk to your stake. <0>Learn more</0>'
                            components={[<StaticUrl key={0} className='options' href='trade-types/multiplier/' />]}
                        />
                    </Text>
                )
            }
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
            {available_platforms?.map((available_platform, index) => {
                const is_deriv_go_platform = available_platform?.name === getPlatformSettingsAppstore('go').name;

                return (
                    <TradingAppCard
                        key={`trading_app_card_${available_platform.name}`}
                        {...available_platform}
                        clickable_icon
                        action_type={
                            is_demo ||
                            (!no_CR_account && !is_eu_user) ||
                            (has_maltainvest_account && is_eu_user) ||
                            is_deriv_go_platform
                                ? 'trade'
                                : 'none'
                        }
                        is_deriv_platform
                        has_divider={(!is_eu_user || is_demo) && getHasDivider(index, available_platforms.length, 3)}
                        onAction={
                            is_deriv_go_platform
                                ? () => {
                                      analyticsAction(available_platform);
                                      setIsDerivGoModalVisible(true);
                                  }
                                : () => {
                                      analyticsAction(available_platform);
                                  }
                        }
                    />
                );
            })}
        </ListingContainer>
    );
});

export default OptionsAndMultipliersListing;
