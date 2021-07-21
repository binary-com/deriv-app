import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router';
import WS from 'Services/ws-methods';
import { DesktopWrapper, MobileWrapper, ThemedScrollbars } from '@deriv/components';
import { CookieStorage, isMobile, TRACKING_STATUS_KEY, PlatformContext, routes } from '@deriv/shared';
import { connect } from 'Stores/connect';
import CookieBanner from '../../Components/Elements/CookieBanner/cookie-banner.jsx';

const tracking_status_cookie = new CookieStorage(TRACKING_STATUS_KEY);

const AppContents = ({
    children,
    identifyEvent,
    is_app_disabled,
    is_cashier_visible,
    is_dark_mode,
    is_eu_country,
    is_logged_in,
    is_logging_in,
    is_cfd_page,
    is_positions_drawer_on,
    is_route_modal_on,
    notifyAppInstall,
    pageView,
    pushDataLayer,
}) => {
    const [show_cookie_banner, setShowCookieBanner] = React.useState(false);
    const [is_gtm_tracking, setIsGtmTracking] = React.useState(false);
    const { is_dashboard } = React.useContext(PlatformContext);
    const { pathname } = useLocation();

    const tracking_status = tracking_status_cookie.get(TRACKING_STATUS_KEY);
    const is_onboarding = pathname === routes.onboarding;

    React.useEffect(() => {
        const allow_tracking = !is_eu_country || tracking_status === 'accepted';
        if (allow_tracking && !is_gtm_tracking) {
            pushDataLayer({ event: 'allow_tracking' });
            setIsGtmTracking(true);
        }
    }, [is_gtm_tracking, is_eu_country, pushDataLayer, tracking_status]);

    React.useEffect(() => {
        if (!tracking_status && !is_logged_in && !is_logging_in) {
            WS.wait('website_status').then(() => {
                setShowCookieBanner(is_eu_country);
            });
        }
    }, [tracking_status, is_logged_in, is_eu_country, is_logging_in]);

    // rudderstack page view trigger
    identifyEvent();
    pageView();

    React.useEffect(() => {
        const handleInstallPrompt = e => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            // Update UI notify the user they can install the PWA
            notifyAppInstall(e);
        };
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    }, [notifyAppInstall]);

    // handle accept/decline cookies
    const onAccept = () => {
        tracking_status_cookie.set(TRACKING_STATUS_KEY, 'accepted', { sameSite: 'none', secure: true });
        pushDataLayer({ event: 'allow_tracking' });
        setShowCookieBanner(false);
        setIsGtmTracking(true);
    };

    const onDecline = () => {
        tracking_status_cookie.set(TRACKING_STATUS_KEY, 'declined', { sameSite: 'none', secure: true });
        setShowCookieBanner(false);
    };

    return (
        <div
            id='app_contents'
            className={classNames('app-contents', {
                'app-contents--show-positions-drawer': is_positions_drawer_on,
                'app-contents--is-disabled': is_app_disabled,
                'app-contents--is-mobile': isMobile(),
                'app-contents--is-route-modal': is_route_modal_on,
                'app-contents--is-scrollable': is_cfd_page || is_cashier_visible || is_onboarding,
                'app-contents--is-dashboard': is_dashboard,
                'app-contents--is-onboarding': is_onboarding,
            })}
        >
            <MobileWrapper>{children}</MobileWrapper>
            <DesktopWrapper>
                {/* Calculate height of user screen and offset height of header and footer */}
                <ThemedScrollbars height={is_onboarding ? 'calc(100vh - 72px)' : 'calc(100vh - 84px)'} has_horizontal>
                    {children}
                </ThemedScrollbars>
            </DesktopWrapper>
            {show_cookie_banner && (
                <CookieBanner
                    onAccept={onAccept}
                    onDecline={onDecline}
                    is_open={show_cookie_banner}
                    is_dark_mode={is_dark_mode}
                />
            )}
        </div>
    );
};

AppContents.propTypes = {
    children: PropTypes.any,
    is_app_disabled: PropTypes.bool,
    is_cashier_visible: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_cfd_page: PropTypes.bool,
    is_positions_drawer_on: PropTypes.bool,
    is_route_modal_on: PropTypes.bool,
};

export default connect(({ client, gtm, rudderstack, ui }) => ({
    is_eu_country: client.is_eu_country,
    is_eu: client.is_eu,
    is_logged_in: client.is_logged_in,
    is_logging_in: client.is_logging_in,
    pushDataLayer: gtm.pushDataLayer,
    identifyEvent: rudderstack.identifyEvent,
    pageView: rudderstack.pageView,
    is_app_disabled: ui.is_app_disabled,
    is_cashier_visible: ui.is_cashier_visible,
    is_dark_mode: ui.is_dark_mode_on,
    is_cfd_page: ui.is_cfd_page,
    is_positions_drawer_on: ui.is_positions_drawer_on,
    is_route_modal_on: ui.is_route_modal_on,
    notifyAppInstall: ui.notifyAppInstall,
}))(AppContents);
