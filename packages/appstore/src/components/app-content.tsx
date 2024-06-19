import React, { useCallback, useEffect } from 'react';
import { routes, useWS, makeLazyLoader, moduleLoader } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Analytics } from '@deriv-com/analytics';
import Routes from 'Components/routes/routes';
import classNames from 'classnames';
import './app.scss';
import { Loading } from '@deriv/components';

const EmailLinkExpiredModal = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "modal_email-link-expired" */ './modals/email-link-expired')),
    () => <Loading />
)();

const AppContent: React.FC = observer(() => {
    const { ui, traders_hub, client } = useStore();
    const {
        is_dark_mode_on,
        toggleEmailVerificationCodeExpiredModal,
        openRealAccountSignup,
        is_email_verification_code_expired_modal_visible,
    } = ui;
    const { selected_account_type } = traders_hub;
    const { is_eu, verification_code, is_logged_in } = client;
    const WS = useWS();

    // get the url params and save to variable
    const url_params = new URLSearchParams(window.location.search);
    const action = url_params.get('action');
    const code = verification_code?.verify_account;

    const confirmEmail = useCallback(async () => {
        if (action === 'verify_account') {
            const response = await WS.confirmEmail(code);
            if (response.error) {
                // handle error
                if (response?.error?.code === 'InvalidToken') {
                    toggleEmailVerificationCodeExpiredModal(true);
                }
            } else {
                if (!is_logged_in) return;

                WS.wait('get_account_status').then(() => openRealAccountSignup(is_eu ? 'maltainvest' : 'svg'));
            }
            history.replaceState(null, document.title, window.location.search.replace(/&?action=[^&]*/i, ''));
        }
    }, [WS, action, code, is_eu, is_logged_in, openRealAccountSignup, toggleEmailVerificationCodeExpiredModal]);

    useEffect(() => {
        if (action && code) {
            confirmEmail();
        }
    }, [action, code, confirmEmail]);

    useEffect(() => {
        if (selected_account_type) {
            Analytics.trackEvent('ce_tradershub_dashboard_form', {
                action: 'open',
                form_name: 'traders_hub_default',
                account_mode: selected_account_type,
            });
        }
    }, [selected_account_type]);

    return (
        <main
            className={classNames('dashboard', {
                'theme--light': !is_dark_mode_on,
                'theme--dark': is_dark_mode_on,
                'dashboard-onboarding': window.location.pathname === routes.onboarding,
            })}
        >
            <div className='dw-dashboard'>
                <Routes />
            </div>
            {is_email_verification_code_expired_modal_visible && <EmailLinkExpiredModal />}
        </main>
    );
});

export default AppContent;
