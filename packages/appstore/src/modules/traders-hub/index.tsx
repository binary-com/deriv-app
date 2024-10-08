import React from 'react';
import { ButtonToggle, Div100vhContainer, Text } from '@deriv/components';
import { routes, checkServerMaintenance, startPerformanceEventTimer } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useContentFlag } from '@deriv/hooks';
import { useDevice } from '@deriv-com/ui';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import AfterSignupFlow from 'Components/after-signup-flow';
import Disclaimer from 'Components/disclaimer';
import TradersHubBanners from 'Components/banners/traders-hub-banners';
import BusinessClosureBanner from 'Components/banners/business-closure-banner';
import classNames from 'classnames';
import './traders-hub.scss';

type OrderedPlatformSectionsProps = {
    is_cfd_visible?: boolean;
    is_options_and_multipliers_visible?: boolean;
};

const OrderedPlatformSections = observer(
    ({ is_cfd_visible = true, is_options_and_multipliers_visible = true }: OrderedPlatformSectionsProps) => {
        const {
            traders_hub: { selected_region, is_eu_user },
        } = useStore();

        return (
            <div
                data-testid='dt_traders_hub'
                className={classNames('traders-hub__main-container', {
                    'traders-hub__main-container-reversed': is_eu_user || selected_region === 'EU',
                })}
            >
                {is_options_and_multipliers_visible && <OptionsAndMultipliersListing />}
                {is_cfd_visible && <CFDsListing />}
            </div>
        );
    }
);

const TradersHub = observer(() => {
    const { isDesktop } = useDevice();
    const { traders_hub, client, ui } = useStore();
    const { notification_messages_ui: Notifications } = ui;
    const {
        is_landing_company_loaded,
        is_logged_in,
        is_switching,
        is_logging_in,
        is_account_setting_loaded,
        is_mt5_allowed,
        website_status,
    } = client;

    const { is_eu_demo, is_eu_real } = useContentFlag();
    const { selected_platform_type, setTogglePlatformType, is_eu_user } = traders_hub;
    const traders_hub_ref = React.useRef<HTMLDivElement>(null);

    const can_show_notify =
        (!is_switching && !is_logging_in && is_account_setting_loaded && is_landing_company_loaded) ||
        checkServerMaintenance(website_status);

    React.useEffect(() => {
        if (is_eu_user) {
            setTogglePlatformType('cfd');
        }
    }, [is_eu_user, setTogglePlatformType]);

    React.useEffect(() => {
        if (is_eu_user) setTogglePlatformType('cfd');
    }, [is_eu_user, setTogglePlatformType]);

    React.useLayoutEffect(() => {
        startPerformanceEventTimer('option_multiplier_section_loading_time');
    }, []);

    const eu_title = is_eu_demo || is_eu_real || is_eu_user;
    const getPlatformToggleOptions = () => [
        { text: eu_title ? localize('Multipliers') : localize('Options'), value: 'options' },
        { text: localize('CFDs'), value: 'cfd' },
    ];
    const platform_toggle_options = getPlatformToggleOptions();
    const platform_toggle_options_eu = getPlatformToggleOptions().reverse();

    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        setTogglePlatformType(event.target.value);
    };
    if (!is_logged_in) return null;

    const getOrderedPlatformSections = () => {
        if (is_mt5_allowed) {
            return (
                <OrderedPlatformSections
                    is_cfd_visible={selected_platform_type === 'cfd'}
                    is_options_and_multipliers_visible={selected_platform_type === 'options'}
                />
            );
        }
        return <OrderedPlatformSections is_cfd_visible={false} is_options_and_multipliers_visible={true} />;
    };

    const desktopContent = !is_landing_company_loaded ? (
        <OrderedPlatformSections />
    ) : (
        <OrderedPlatformSections is_cfd_visible={is_mt5_allowed} />
    );

    const mobileTabletContent = (
        <React.Fragment>
            {is_landing_company_loaded ? (
                is_mt5_allowed && (
                    <ButtonToggle
                        buttons_arr={is_eu_user ? platform_toggle_options_eu : platform_toggle_options}
                        className='traders-hub__button-toggle'
                        has_rounded_button
                        is_traders_hub={window.location.pathname === routes.traders_hub}
                        name='platform_type'
                        onChange={platformTypeChange}
                        value={selected_platform_type}
                    />
                )
            ) : (
                <ButtonToggleLoader />
            )}
            {is_landing_company_loaded && !is_mt5_allowed && (
                <div className='traders-hub--mt5-not-allowed'>
                    <Text size='s' weight='bold' color='prominent'>
                        <Localize i18n_default_text='Multipliers' />
                    </Text>
                </div>
            )}
            {getOrderedPlatformSections()}
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <AfterSignupFlow />
            <BusinessClosureBanner />
            <Div100vhContainer className='traders-hub--mobile' height_offset='50px' is_disabled={isDesktop}>
                {can_show_notify && <Notifications />}
                <div
                    id='traders-hub'
                    className={classNames('traders-hub', {
                        'traders-hub--eu-user': is_eu_user && is_mt5_allowed,
                        'traders-hub--eu-user-without-mt5': is_eu_user && !is_mt5_allowed,
                    })}
                    ref={traders_hub_ref}
                >
                    <TradersHubBanners />
                    <MainTitleBar />
                    {isDesktop ? desktopContent : mobileTabletContent}
                    <ModalManager />
                </div>
            </Div100vhContainer>
            {is_eu_user && <Disclaimer />}
        </React.Fragment>
    );
});

export default TradersHub;
