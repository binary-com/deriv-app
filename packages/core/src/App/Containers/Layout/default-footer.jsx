import classNames from 'classnames';
import * as React from 'react';
import { withRouter } from 'react-router';
import NetworkStatus, {
    AccountLimits as AccountLimitsFooter,
    EndpointNote,
    HelpCentre,
    RegulatoryInformation,
    ResponsibleTrading,
    ToggleFullScreen,
    ToggleSettings,
    ToggleLanguageSettings,
} from 'App/Components/Layout/Footer';
import LiveChat from 'App/Components/Elements/LiveChat';
import WhatsApp from 'App/Components/Elements/WhatsApp/index.ts';
import ServerTime from '../server-time.jsx';
import { observer, useStore } from '@deriv/stores';
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

const Footer = observer(() => {
    const { client, common, ui, traders_hub } = useStore();
    const { is_logged_in, landing_company_shortcode, is_eu, is_virtual } = client;
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
    } = ui;
    const { data } = useRemoteConfig(true);
    const { cs_chat_livechat, cs_chat_whatsapp } = data;
    const { show_eu_related_content } = traders_hub;

    let footer_extensions_left = [];
    let footer_extensions_right = [];
    if (footer_extensions.filter) {
        footer_extensions_left = footer_extensions.filter(footer_extension => footer_extension.position === 'left');
        footer_extensions_right = footer_extensions.filter(footer_extension => footer_extension.position === 'right');
    }

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
            <ServerTime />
            <div className='footer__links'>
                {footer_extensions_right.map(FooterExtensionRenderer)}
                {cs_chat_whatsapp && <WhatsApp />}
                {cs_chat_livechat && <LiveChat />}
                <FooterIconSeparator />
                <ResponsibleTrading />
                {is_logged_in && <AccountLimitsFooter />}
                {is_logged_in && !is_virtual && (
                    <RegulatoryInformation
                        landing_company={landing_company_shortcode}
                        is_eu={is_eu}
                        show_eu_related_content={show_eu_related_content}
                    />
                )}
                <FooterIconSeparator />
                <HelpCentre />
                <ToggleSettings
                    is_settings_visible={is_settings_modal_on}
                    toggleSettings={toggleSettingsModal}
                    disableApp={disableApp}
                    enableApp={enableApp}
                    settings_extension={settings_extension}
                />
                <ToggleLanguageSettings
                    is_settings_visible={is_language_settings_modal_on}
                    toggleSettings={toggleLanguageSettingsModal}
                    lang={current_language}
                />
                <ToggleFullScreen />
            </div>
        </footer>
    );
});

export default withRouter(Footer);
