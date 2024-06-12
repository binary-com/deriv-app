import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { Div100vhContainer, DesktopWrapper, MobileWrapper, Loading, Text } from '@deriv/components';
import { isEuCountry, makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import OrderedPlatformSections from 'Components/ordered-platform-sections';
import GetStartedTradingBanner from 'Components/get-started-trading-banner';
import TabsOrTitle from 'Components/tabs-or-title';
import './traders-hub-logged-out.scss';

const DerivGoModal = makeLazyLoader(
    () =>
        moduleLoader(
            () => import(/* webpackChunkName: "modal_deriv-go-modal" */ '../../components/modals/deriv-go-modal')
        ),
    () => <Loading />
)();

const TradersHubLoggedOut = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const { is_desktop } = ui;
    const { clients_country } = client;
    const { setTogglePlatformType, selectRegion, is_eu_user, is_deriv_go_modal_visible } = traders_hub;

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
        <Div100vhContainer className='traders-hub-logged-out__mobile' height_offset='50px' is_disabled={is_desktop}>
            <div
                className={classNames('traders-hub-logged-out', {
                    'traders-hub-logged-out__eu-user': is_eu_user,
                })}
            >
                <GetStartedTradingBanner />
                <Text size={is_desktop ? 'm' : 'xsm'} weight='bold' color='prominent'>
                    <Localize i18n_default_text="Trader's Hub" />
                </Text>
                <DesktopWrapper>
                    <OrderedPlatformSections isDesktop />
                </DesktopWrapper>
                <MobileWrapper>
                    <TabsOrTitle />
                    <OrderedPlatformSections />
                </MobileWrapper>
                {is_deriv_go_modal_visible && <DerivGoModal />}
            </div>
        </Div100vhContainer>
    );
});

export default TradersHubLoggedOut;
