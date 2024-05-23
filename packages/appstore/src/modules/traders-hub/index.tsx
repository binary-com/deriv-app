import React from 'react';
import { DesktopWrapper, MobileWrapper, ButtonToggle, Div100vhContainer, Text } from '@deriv/components';
import { isDesktop, routes, checkServerMaintenance, startPerformanceEventTimer } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import CFDsListing from 'Components/cfds-listing';
import ModalManager from 'Components/modals/modal-manager';
import MainTitleBar from 'Components/main-title-bar';
import OptionsAndMultipliersListing from 'Components/options-multipliers-listing';
import ButtonToggleLoader from 'Components/pre-loader/button-toggle-loader';
import classNames from 'classnames';
import './traders-hub.scss';
import { useContentFlag, useGrowthbookFeatureFlag } from '@deriv/hooks';

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

    const { is_cr_demo, is_eu_demo, is_eu_real } = useContentFlag();
    const { selected_platform_type, setTogglePlatformType, is_eu_user } = traders_hub;
    const traders_hub_ref = React.useRef<HTMLDivElement>(null);

    const can_show_notify =
        (!is_switching && !is_logging_in && is_account_setting_loaded && is_landing_company_loaded) ||
        checkServerMaintenance(website_status);

    const direct_to_real_account_creation = useGrowthbookFeatureFlag({
        featureFlag: 'direct-real-account-creation-flow',
        defaultValue: false,
    });

    React.useEffect(() => {
        if (is_eu_user) {
            setTogglePlatformType('cfd');
        }
        if (!has_active_real_account && is_from_signup_account && is_logged_in) {
            if (direct_to_real_account_creation && is_cr_demo) {
                openRealAccountSignup('svg');
                setIsFromSignupAccount(false);
            } else if (is_eu_demo) {
                openRealAccountSignup('maltainvest');
                setIsFromSignupAccount(false);
            }
        }
    }, [
        is_cr_demo,
        is_eu_demo,
        has_active_real_account,
        is_eu_user,
        is_from_signup_account,
        is_logged_in,
        direct_to_real_account_creation,
        openRealAccountSignup,
        setIsFromSignupAccount,
        setTogglePlatformType,
    ]);

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

    const OrderedPlatformSections = ({ is_cfd_visible = true, is_options_and_multipliers_visible = true }) => {
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
    };

    const getOrderedPlatformSections = (isDesktop = false) => {
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
    };

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
                    <DesktopWrapper>{getOrderedPlatformSections(true)}</DesktopWrapper>
                    <MobileWrapper>
                        {is_mt5_allowed &&
                            (is_landing_company_loaded ? (
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
                                <ButtonToggleLoader />
                            ))}
                        {!is_mt5_allowed && (
                            <div className='traders-hub--mt5-not-allowed'>
                                <Text size='s' weight='bold' color='prominent'>
                                    <Localize i18n_default_text='Multipliers' />
                                </Text>
                            </div>
                        )}
                        {getOrderedPlatformSections()}
                    </MobileWrapper>
                    <ModalManager />
                </div>
            </Div100vhContainer>
            {is_eu_user && (
                <div data-testid='dt_traders_hub_disclaimer' className='disclaimer'>
                    <Text align='left' className='disclaimer-text' size={is_mobile ? 'xxxs' : 'xs'}>
                        <Localize i18n_default_text='The products offered on our website are complex derivative products that carry a significant risk of potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage. 67.28% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how these products work and whether you can afford to take the high risk of losing your money.' />
                    </Text>
                    <div className='disclaimer__bottom-plug' />
                </div>
            )}
        </React.Fragment>
    );
});

export default TradersHub;
