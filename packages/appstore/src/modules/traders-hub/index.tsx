import React from 'react';
import { DesktopWrapper, MobileWrapper, ButtonToggle, Div100vhContainer, Text } from '@deriv/components';
import { isDesktop, routes, ContentFlag, checkServerMaintenance } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import classNames from 'classnames';
import TourGuide from '../tour-guide/tour-guide';
import { getPlatformToggleOptions } from '../../helpers';
import './traders-hub.scss';

const GetOrderedPlatformSections = observer(({ isDesktop = false }: { isDesktop?: boolean }) => {
    const { traders_hub, client } = useStore();
    const { is_mt5_allowed } = client;
    const { selected_platform_type } = traders_hub;

    if (is_mt5_allowed) {
        return isDesktop ? (
            <OrderedPlatformSections />
        ) : (
            <OrderedPlatformSections
                is_cfd_visible={selected_platform_type === 'cfd'}
                is_options_and_multipliers_visible={selected_platform_type === 'options'}
            />
        );
    }
    return <OrderedPlatformSections is_cfd_visible={false} is_options_and_multipliers_visible={true} />;
});

const OrderedPlatformSections = observer(
    ({
        is_cfd_visible = true,
        is_options_and_multipliers_visible = true,
    }: {
        is_cfd_visible?: boolean;
        is_options_and_multipliers_visible?: boolean;
    }) => {
        const { traders_hub } = useStore();
        const { is_eu_user } = traders_hub;

        return (
            <div
                data-testid='dt_traders_hub'
                className={classNames('traders-hub__main-container', {
                    'traders-hub__main-container-reversed': is_eu_user,
                })}
            >
                {is_options_and_multipliers_visible && <OptionsAndMultipliersListing />}
                {is_cfd_visible && <CFDsListing />}
            </div>
        );
    }
);

const TabsOrTitle = observer(() => {
    const { traders_hub, client } = useStore();
    const { is_mt5_allowed } = client;
    const { content_flag, selected_platform_type, is_eu_user, setTogglePlatformType } = traders_hub;

    const eu_title = content_flag === ContentFlag.EU_DEMO || content_flag === ContentFlag.EU_REAL || is_eu_user;

    const platform_toggle_options = getPlatformToggleOptions(eu_title);
    const platform_toggle_options_eu = getPlatformToggleOptions(eu_title).reverse();

    const platformTypeChange = (event: {
        target: {
            value: string;
            name: string;
        };
    }) => {
        setTogglePlatformType(event.target.value);
    };

    return is_mt5_allowed ? (
        <ButtonToggle
            buttons_arr={is_eu_user ? platform_toggle_options_eu : platform_toggle_options}
            className='traders-hub__button-toggle'
            has_rounded_button
            is_traders_hub={window.location.pathname === routes.traders_hub}
            name='platforn_type'
            onChange={platformTypeChange}
            value={selected_platform_type}
        />
    ) : (
        <div className='traders-hub--mt5-not-allowed'>
            <Text size='s' weight='bold' color='prominent'>
                <Localize i18n_default_text='Multipliers' />
            </Text>
        </div>
    );
});

const TradersHub = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const {
        notification_messages_ui: Notifications,
        openRealAccountSignup,
        is_from_signup_account,
        is_mobile,
        setIsFromSignupAccount,
    } = ui;
    const {
        is_landing_company_loaded,
        is_logged_in,
        is_switching,
        is_logging_in,
        is_account_setting_loaded,
        is_mt5_allowed,
        has_active_real_account,
        website_status,
    } = client;
    const { setTogglePlatformType, is_tour_open, content_flag, is_eu_user } = traders_hub;
    const traders_hub_ref = React.useRef<HTMLDivElement>(null);

    const can_show_notify =
        (!is_switching && !is_logging_in && is_account_setting_loaded && is_landing_company_loaded) ||
        checkServerMaintenance(website_status);

    const [scrolled, setScrolled] = React.useState(false);

    const handleScroll = React.useCallback(() => {
        const element = traders_hub_ref?.current;
        if (element && is_tour_open) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [is_tour_open]);

    React.useEffect(() => {
        if (is_eu_user) setTogglePlatformType('cfd');
        if (
            !has_active_real_account &&
            is_logged_in &&
            is_from_signup_account &&
            content_flag === ContentFlag.EU_DEMO
        ) {
            openRealAccountSignup('maltainvest');
            setIsFromSignupAccount(false);
        }
    }, [
        content_flag,
        has_active_real_account,
        is_eu_user,
        is_from_signup_account,
        is_logged_in,
        openRealAccountSignup,
        setIsFromSignupAccount,
        setTogglePlatformType,
    ]);

    React.useEffect(() => {
        if (is_eu_user) setTogglePlatformType('cfd');
        const timer = setTimeout(() => {
            handleScroll();
            setTimeout(() => {
                setScrolled(true);
            }, 200);
        }, 100);
        return () => clearTimeout(timer);
    }, [handleScroll, is_eu_user, is_tour_open, setTogglePlatformType]);

    if (!is_logged_in) return null;

    return (
        <React.Fragment>
            <Div100vhContainer className='traders-hub--mobile' height_offset='50px' is_disabled={isDesktop()}>
                {can_show_notify && <Notifications />}
                <div
                    id='traders-hub'
                    className={classNames('traders-hub', {
                        'traders-hub--eu-user': is_eu_user && is_mt5_allowed,
                        'traders-hub--eu-user-without-mt5': is_eu_user && !is_mt5_allowed,
                    })}
                    ref={traders_hub_ref}
                >
                    <MainTitleBar />
                    <DesktopWrapper>
                        <GetOrderedPlatformSections isDesktop />
                    </DesktopWrapper>
                    <MobileWrapper>
                        {is_landing_company_loaded ? <TabsOrTitle /> : <ButtonToggleLoader />}
                        <GetOrderedPlatformSections />
                    </MobileWrapper>
                    <ModalManager />
                    {scrolled && <TourGuide />}
                </div>
            </Div100vhContainer>
            {is_eu_user && (
                <div data-testid='dt_traders_hub_disclaimer' className='disclaimer'>
                    <Text align='left' className='disclaimer-text' size={is_mobile ? 'xxxs' : 'xs'}>
                        <Localize
                            i18n_default_text='<0>EU statutory disclaimer</0>: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <0>70.1% of retail investor accounts lose money when trading CFDs with this provider</0>. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'
                            components={[<strong key={0} />]}
                        />
                    </Text>
                    <div className='disclaimer__bottom-plug' />
                </div>
            )}
        </React.Fragment>
    );
});

export default TradersHub;
