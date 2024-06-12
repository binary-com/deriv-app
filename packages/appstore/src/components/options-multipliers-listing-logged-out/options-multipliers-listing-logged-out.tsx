import React from 'react';
import { useStore, observer } from '@deriv/stores';
import { getPlatformSettingsAppstore } from '@deriv/shared';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import OptionsDescription from 'Components/elements/options-description';
import OptionsTitle from 'Components/elements/options-title';
import { BrandConfig } from 'Constants/platform-config';
import { getHasDivider } from 'Constants/utils';
import './options-multipliers-listing-logged-out.scss';

const OptionsAndMultipliersListingLoggedOut = observer(() => {
    const { traders_hub } = useStore();
    const { available_platforms, is_eu_user, setIsDerivGoModalVisible } = traders_hub;

    const logged_out_available_platforms = is_eu_user
        ? available_platforms.filter(platform => ['EU', 'All'].some(region => region === platform.availability))
        : available_platforms.filter(platform => ['Non-EU', 'All'].some(region => region === platform.availability));

    return (
        <ListingContainer
            title={<OptionsTitle is_eu_user={is_eu_user} />}
            description={<OptionsDescription is_eu_user={is_eu_user} />}
        >
            {logged_out_available_platforms.map((available_platform: BrandConfig, index: number) => {
                const is_deriv_go_platform = available_platform?.name === getPlatformSettingsAppstore('go').name;

                return (
                    <TradingAppCard
                        key={`trading_app_card_${available_platform.name}`}
                        {...available_platform}
                        action_type='trade'
                        clickable_icon
                        is_deriv_platform
                        market_type='all'
                        has_divider={!is_eu_user && getHasDivider(index, available_platforms.length, 3)}
                        onAction={
                            is_deriv_go_platform
                                ? () => {
                                      setIsDerivGoModalVisible(true);
                                  }
                                : undefined
                        }
                    />
                );
            })}
        </ListingContainer>
    );
});

export default OptionsAndMultipliersListingLoggedOut;
