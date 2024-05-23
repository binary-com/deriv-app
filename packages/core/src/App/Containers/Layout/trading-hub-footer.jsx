import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as React from 'react';
import { withRouter } from 'react-router';
import NetworkStatus, {
    AccountLimits as AccountLimitsFooter,
    EndpointNote,
    GoToDeriv,
    HelpCentre,
    RegulatoryInformation,
    ResponsibleTrading,
    ToggleSettings,
    ToggleFullScreen,
    ToggleLanguageSettings,
} from 'App/Components/Layout/Footer';
import LiveChat from 'App/Components/Elements/LiveChat';
import WhatsApp from 'App/Components/Elements/WhatsApp/index.ts';
import ServerTime from '../server-time.jsx';
import { routes, useIsMounted } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import DarkModeToggleIcon from 'Assets/SvgComponents/footer/ic-footer-light-theme.svg';
import LightModeToggleIcon from 'Assets/SvgComponents/footer/ic-footer-dark-theme.svg';
import { Popover } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useRemoteConfig } from '@deriv/api';

const FooterIconSeparator = () => <div className='footer-icon-separator' />;

const FooterExtensionRenderer = (footer_extension, idx) => {
    const { Component: FooterExtensionComponent } = footer_extension;
    return (
        <React.Fragment key={`footer-link-${footer_extension.position}-${idx}`}>
            {footer_extension.has_left_separator && <FooterIconSeparator />}
            <FooterExtensionComponent />
            {footer_extension.has_right_separator && <FooterIconSeparator />}
        </React.Fragment>
    );
};

const TradingHubFooter = observer(() => {
    const { client, common, ui, traders_hub } = useStore();
    const { show_eu_related_content } = traders_hub;
    const { has_wallet, is_logged_in, is_eu, landing_company_shortcode, is_virtual } = client;
    const { current_language } = common;
    const {
        enableApp,
        footer_extensions,
        settings_extension,
        is_app_disabled,
        is_route_modal_on,
        is_settings_modal_on,
        is_language_settings_modal_on,
        disableApp,
        toggleSettingsModal,
        toggleLanguageSettingsModal,
        is_dark_mode_on: is_dark_mode,
        setDarkMode,
    } = ui;

    let footer_extensions_left = [];
    let footer_extensions_right = [];
    if (footer_extensions.filter) {
        footer_extensions_left = footer_extensions.filter(footer_extension => footer_extension.position === 'left');
        footer_extensions_right = footer_extensions.filter(footer_extension => footer_extension.position === 'right');
    }

    const changeTheme = () => {
        setDarkMode(!is_dark_mode);
    };

    const isMounted = useIsMounted();

    const location = window.location.pathname;
    const { data } = useRemoteConfig(isMounted());
    const { cs_chat_livechat, cs_chat_whatsapp } = data;
    return (
        <footer
            className={classNames('footer', {
                'footer--is-disabled': is_app_disabled || is_route_modal_on,
            })}
        >
            {footer_extensions_left.length > 0 && (
                <div className='footer__links footer__links--left'>
                    {footer_extensions_left.map(FooterExtensionRenderer)}
                </div>
            )}
            <EndpointNote />
            <NetworkStatus />
            <FooterIconSeparator />
            <ServerTime />
            <FooterIconSeparator />
            <div className='footer__links'>
                {footer_extensions_right.map(FooterExtensionRenderer)}
                {cs_chat_whatsapp && <WhatsApp />}
                {cs_chat_livechat && <LiveChat />}
                <GoToDeriv />
                <ResponsibleTrading />
                {is_logged_in && <AccountLimitsFooter />}
                {is_logged_in && !is_virtual && (
                    <RegulatoryInformation
                        landing_company={landing_company_shortcode}
                        is_eu={is_eu}
                        show_eu_related_content={show_eu_related_content}
                    />
                )}
                {!has_wallet && (
                    <div className='footer__links--dark-mode'>
                        <Popover alignment='top' message={localize('Change theme')} zIndex={9999}>
                            {is_dark_mode ? (
                                <LightModeToggleIcon onClick={changeTheme} />
                            ) : (
                                <DarkModeToggleIcon onClick={changeTheme} />
                            )}
                        </Popover>
                    </div>
                )}
                <FooterIconSeparator />
                <HelpCentre />
                {location === routes.trade && (
                    <ToggleSettings
                        is_settings_visible={is_settings_modal_on}
                        toggleSettings={toggleSettingsModal}
                        disableApp={disableApp}
                        enableApp={enableApp}
                        settings_extension={settings_extension}
                    />
                )}
                {!has_wallet && (
                    <ToggleLanguageSettings
                        is_settings_visible={is_language_settings_modal_on}
                        toggleSettings={toggleLanguageSettingsModal}
                        lang={current_language}
                    />
                )}
                <ToggleFullScreen />
            </div>
        </footer>
    );
});

TradingHubFooter.propTypes = {
    location: PropTypes.object,
};

export default withRouter(TradingHubFooter);
