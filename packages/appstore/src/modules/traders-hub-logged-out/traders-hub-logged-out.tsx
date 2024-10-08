import React from 'react';
import classNames from 'classnames';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { Div100vhContainer, Loading, Text } from '@deriv/components';
import { isEuCountry } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import Disclaimer from 'Components/disclaimer';
import OrderedPlatformSections from 'Components/ordered-platform-sections';
import GetStartedTradingBanner from 'Components/banners/get-started-trading-banner';
import TabsOrTitle from 'Components/tabs-or-title';
import './traders-hub-logged-out.scss';

const TradersHubLoggedOut = observer(() => {
    const { isDesktop } = useDevice();
    const { traders_hub, client } = useStore();
    const { clients_country } = client;
    const { setTogglePlatformType, selectRegion, is_eu_user } = traders_hub;

    React.useEffect(() => {
        if (clients_country) {
            if (isEuCountry(clients_country)) {
                setTogglePlatformType('cfd');
                selectRegion('EU');
            } else {
                selectRegion('Non-EU');
            }
        }
    }, [clients_country, setTogglePlatformType]);

    if (!clients_country) return <Loading is_fullscreen />;

    return (
        <React.Fragment>
            <Div100vhContainer className='traders-hub-logged-out__mobile' height_offset='50px' is_disabled={isDesktop}>
                <div
                    className={classNames('traders-hub-logged-out', {
                        'traders-hub-logged-out__eu-user': is_eu_user,
                    })}
                >
                    <GetStartedTradingBanner />
                    <Text size={isDesktop ? 'm' : 'xsm'} weight='bold' color='prominent'>
                        <Localize i18n_default_text="Trader's Hub" />
                    </Text>
                    {isDesktop ? (
                        <OrderedPlatformSections isDesktop />
                    ) : (
                        <React.Fragment>
                            <TabsOrTitle />
                            <OrderedPlatformSections />
                        </React.Fragment>
                    )}
                </div>
            </Div100vhContainer>

            {is_eu_user && <Disclaimer />}
        </React.Fragment>
    );
});

export default TradersHubLoggedOut;
