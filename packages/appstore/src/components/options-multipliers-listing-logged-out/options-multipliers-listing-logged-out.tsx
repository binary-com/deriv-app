import { useStore, observer } from '@deriv/stores';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import OptionsDescription from 'Components/elements/options-description';
import OptionsTitle from 'Components/elements/options-title';
import { BrandConfig } from 'Constants/platform-config';
import { getHasDivider } from 'Constants/utils';
import { isEuCountry } from '@deriv/shared';
import './options-multipliers-listing-logged-out.scss';

const OptionsAndMultipliersListingLoggedOut = observer(() => {
    const { traders_hub, client } = useStore();
    const { clients_country } = client;
    const { available_platforms, is_eu_user } = traders_hub;

    const logged_out_available_platforms = isEuCountry(clients_country)
        ? available_platforms.filter(platform => ['EU', 'All'].some(region => region === platform.availability))
        : available_platforms.filter(platform => ['Non-EU', 'All'].some(region => region === platform.availability));

    return (
        <ListingContainer
            title={<OptionsTitle is_eu_user={is_eu_user} />}
            description={<OptionsDescription is_eu_user={is_eu_user} />}
        >
            {logged_out_available_platforms.map((available_platform: BrandConfig, index: number) => (
                <TradingAppCard
                    key={`trading_app_card_${available_platform.name}`}
                    {...available_platform}
                    action_type='trade'
                    clickable_icon
                    is_deriv_platform
                    market_type='all'
                    has_divider={!is_eu_user && getHasDivider(index, available_platforms.length, 3)}
                />
            ))}
        </ListingContainer>
    );
});

export default OptionsAndMultipliersListingLoggedOut;
