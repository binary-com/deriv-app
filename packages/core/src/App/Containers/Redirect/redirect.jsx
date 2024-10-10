import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';
import { loginUrl, routes, redirectToLogin, SessionStore, getDomainName } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getLanguage } from '@deriv/translations';
import { WS } from 'Services';
import { Analytics } from '@deriv-com/analytics';
import Cookies from 'js-cookie';

const Redirect = observer(() => {
    const history = useHistory();
    const { client, ui } = useStore();

    const { currency, has_wallet, is_logged_in, is_logging_in, setNewEmail, setVerificationCode, verification_code } =
        client;

    const {
        openRealAccountSignup,
        setResetTradingPasswordModalOpen,
        setRedirectFromEmail,
        toggleAccountSignupModal,
        toggleResetPasswordModal,
        toggleResetEmailModal,
        toggleUpdateEmailModal,
        is_mobile,
    } = ui;

    // TODO: remove this after oauth2 migration
    // get data from cookies and populate local storage for clients
    // to be logged in coming from OS subdomains
    const client_accounts = Cookies.get('client.accounts');
    const active_loginid = Cookies.get('active_loginid');

    if (client_accounts && active_loginid) {
        localStorage.setItem('client.accounts', client_accounts);
        localStorage.setItem('active_loginid', active_loginid);

        const domain = getDomainName();

        // remove cookies after populating local storage
        Cookies.remove('client.accounts', { domain, secure: true });
        Cookies.remove('active_loginid', { domain, secure: true });
        window.location.reload();
    }

    const openLivechat = () => {
        window.LiveChatWidget.call('maximize');
    };

    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);
    let redirected_to_route = false;
    const action_param = url_params.get('action');
    const code_param = url_params.get('code') || verification_code[action_param];
    const ext_platform_url = url_params.get('ext_platform_url');

    const redirectToExternalPlatform = url => {
        history.push(`${routes.traders_hub}?ext_platform_url=${url}`);
        redirected_to_route = true;
    };
    setVerificationCode(code_param, action_param);
    setNewEmail(url_params.get('email'), action_param);

    switch (action_param) {
        case 'signup': {
            Analytics.trackEvent('ce_virtual_signup_form', {
                action: 'email_confirmed',
                form_name: is_mobile ? 'virtual_signup_web_mobile_default' : 'virtual_signup_web_desktop_default',
                email: url_params.get('email'),
            });
            if (url_params?.get('utm_content')) {
                SessionStore.set('show_book', url_params?.get('utm_content'));
            }
            SessionStore.set('signup_query_param', url_query_string);
            history.push({
                pathname: routes.onboarding,
                search: url_query_string,
            });
            SessionStore.remove('redirect_url');
            redirected_to_route = true;
            toggleAccountSignupModal(true);
            break;
        }
        case 'reset_password': {
            toggleResetPasswordModal(true);
            break;
        }
        case 'request_email': {
            if (!is_logging_in && !is_logged_in) {
                if (verification_code[action_param]) {
                    sessionStorage.setItem('request_email_code', verification_code[action_param]);
                }
                redirectToLogin(is_logged_in, getLanguage(), true);
                redirected_to_route = true;
            } else {
                if (!verification_code[action_param]) {
                    const request_email_code = sessionStorage.getItem('request_email_code');
                    setVerificationCode(request_email_code, action_param);
                    sessionStorage.removeItem('request_email_code');
                }
                toggleResetEmailModal(true);
            }
            break;
        }
        case 'social_email_change': {
            toggleResetPasswordModal(true);
            break;
        }
        case 'system_email_change': {
            toggleUpdateEmailModal(true);
            break;
        }
        case 'trading_platform_mt5_password_reset':
        case 'trading_platform_dxtrade_password_reset': {
            const reset_code_key = `${action_param}_code`;
            if (!is_logging_in && !is_logged_in) {
                if (verification_code[action_param]) {
                    sessionStorage.setItem(reset_code_key, verification_code[action_param]);
                }
                redirectToLogin(is_logged_in, getLanguage());
                redirected_to_route = true;
                break;
            }
            if (!verification_code[action_param]) {
                const reset_code = sessionStorage.getItem(reset_code_key);
                setVerificationCode(reset_code, action_param);
                sessionStorage.removeItem(reset_code_key);
            }
            const redirect_to = url_params.get('redirect_to');

            if (redirect_to) {
                let pathname = '';
                let hash = '';
                switch (redirect_to) {
                    case '1':
                    case '2':
                        pathname = routes.traders_hub;
                        break;
                    case '10':
                    case '20':
                        pathname = routes.traders_hub;
                        hash = 'real';
                        break;
                    case '11':
                    case '21':
                        pathname = routes.traders_hub;
                        hash = 'demo';
                        break;
                    case '3':
                        pathname = routes.traders_hub;
                        break;
                    default:
                        break;
                }

                if (pathname) {
                    history.push({
                        pathname,
                        hash,
                        search: url_query_string,
                    });
                    redirected_to_route = true;
                }
            }

            setResetTradingPasswordModalOpen(true);
            break;
        }
        case 'phone_number_verification': {
            const phone_number_verification_code = `${action_param}_code`;
            if (!is_logging_in && !is_logged_in) {
                sessionStorage.setItem(phone_number_verification_code, code_param);
            }
            setRedirectFromEmail(true);
            history.push(routes.phone_verification);
            redirected_to_route = true;
            break;
        }
        case 'payment_deposit': {
            if (has_wallet) {
                history.push(routes.wallets_deposit);
            } else {
                history.push(routes.cashier_deposit);
            }
            redirected_to_route = true;
            break;
        }
        case 'payment_withdraw': {
            if (has_wallet) {
                if (verification_code?.payment_withdraw) {
                    /*
                  1. pass verification_code through query param as we do not want to use localstorage/session storage
                     though can't use "verification_code" as name param
                     as there is general logic within client-store
                     which removes anything which resembles code=XYZ
                  2. pass loginid as a query param so that the withdrawal component knows what account is being withdrawn from
                */
                    history.push(
                        `${routes.wallets_withdrawal}?verification=${verification_code.payment_withdraw}${
                            client.loginid ? `&loginid=${client.loginid}` : ''
                        }`
                    );
                } else {
                    history.push(routes.wallets_withdrawal);
                }
            } else {
                history.push(routes.cashier_withdrawal);
            }
            redirected_to_route = true;
            break;
        }
        case 'payment_transfer': {
            if (has_wallet) {
                history.push(routes.wallets_transfer);
            } else {
                history.push(routes.cashier_acc_transfer);
            }
            redirected_to_route = true;
            break;
        }
        case 'crypto_transactions_withdraw': {
            history.push(`${routes.cashier_withdrawal}?action=${action_param}`);
            redirected_to_route = true;
            break;
        }
        case 'payment_transactions': {
            if (has_wallet) {
                history.push(routes.wallets_transactions);
            } else {
                history.push(routes.statement);
            }
            redirected_to_route = true;
            break;
        }
        case 'payment_agent_withdraw': {
            history.push(routes.cashier_pa);
            redirected_to_route = true;
            break;
        }
        case 'add_account': {
            WS.wait('get_account_status').then(() => {
                if (!currency) return openRealAccountSignup('set_currency');
                return openRealAccountSignup('svg');
            });
            if (ext_platform_url) redirectToExternalPlatform(ext_platform_url);
            break;
        }
        case 'add_account_multiplier': {
            WS.wait('get_account_status').then(() => {
                if (!currency) return openRealAccountSignup('set_currency');
                return openRealAccountSignup('maltainvest');
            });
            if (ext_platform_url) redirectToExternalPlatform(ext_platform_url);
            break;
        }
        case 'manage_account': {
            WS.wait('get_account_status').then(() => {
                return openRealAccountSignup('manage');
            });
            if (ext_platform_url) redirectToExternalPlatform(ext_platform_url);
            break;
        }
        case 'verification': {
            // Removing this will break mobile DP2P app. Do not remove.
            sessionStorage.setItem('redirect_url', routes.p2p_verification);
            const new_href = loginUrl({
                language: getLanguage(),
            });
            window.location.href = new_href;
            break;
        }
        case 'trading_platform_investor_password_reset': {
            localStorage.setItem('cfd_reset_password_code', code_param);
            const is_demo = localStorage.getItem('cfd_reset_password_intent')?.includes('demo');
            if (has_wallet) {
                history.push({
                    pathname: routes.traders_hub,
                    search: url_query_string,
                });
            } else {
                history.push(`${routes.traders_hub}#${is_demo ? 'demo' : 'real'}#reset-password`);
            }
            redirected_to_route = true;
            break;
        }
        case 'p2p_order_confirm': {
            history.push({
                pathname: routes.cashier_p2p,
                search: url_query_string,
            });
            redirected_to_route = true;
            break;
        }
        case 'livechat': {
            openLivechat();
            break;
        }
        default:
            break;
    }
    useEffect(() => {
        if (!redirected_to_route && history.location.pathname !== routes.traders_hub) {
            history.push({
                pathname: routes.traders_hub,
                search: url_query_string,
            });
        }
    }, [redirected_to_route, url_query_string, history]);

    return null;
});

Redirect.propTypes = {
    history: PropTypes.object,
};

export default withRouter(Redirect);
