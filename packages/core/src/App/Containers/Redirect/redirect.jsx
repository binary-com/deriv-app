import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { loginUrl, routes, PlatformContext, CFD_PLATFORMS } from '@deriv/shared';
import { getLanguage } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { WS } from 'Services';

const Redirect = ({
    history,
    currency,
    setVerificationCode,
    hasAnyRealAccount,
    openRealAccountSignup,
    setResetTradingPasswordModalOpen,
    toggleAccountSignupModal,
    toggleResetPasswordModal,
}) => {
    const url_query_string = window.location.search;
    const url_params = new URLSearchParams(url_query_string);
    let redirected_to_route = false;
    const { is_dashboard } = React.useContext(PlatformContext);

    setVerificationCode(url_params.get('code'), url_params.get('action'));

    switch (url_params.get('action')) {
        case 'signup': {
            if (is_dashboard) {
                history.push({
                    pathname: routes.dashboard,
                    search: url_query_string,
                });
                redirected_to_route = true;
            }
            sessionStorage.removeItem('redirect_url');
            toggleAccountSignupModal(true);
            break;
        }
        case 'reset_password': {
            toggleResetPasswordModal(true);
            break;
        }
        case 'trading_platform_password_reset': {
            const redirect_to = url_params.get('redirect_to');

            if (redirect_to) {
                let pathname = '';
                switch (redirect_to) {
                    case CFD_PLATFORMS.MT5:
                        pathname = routes.mt5;
                        break;
                    case CFD_PLATFORMS.DERIVX:
                        pathname = routes.dxtrade;
                        break;
                    case 'password':
                        pathname = routes.passwords;
                        break;
                    default:
                        break;
                }

                if (pathname) {
                    history.push({
                        pathname,
                        search: url_query_string,
                    });
                    redirected_to_route = true;
                }
            }

            setResetTradingPasswordModalOpen(true);
            break;
        }
        case 'payment_withdraw': {
            history.push(routes.cashier_withdrawal);
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
                if (hasAnyRealAccount()) return openRealAccountSignup('manage');
                return openRealAccountSignup();
            });
            const ext_platform_url = url_params.get('ext_platform_url');
            if (ext_platform_url) {
                history.push(`${routes.root}?ext_platform_url=${ext_platform_url}`);
                redirected_to_route = true;
            }
            break;
        }
        case 'verification': {
            // Removing this will break mobile DP2P app. Do not remove.
            sessionStorage.setItem('redirect_url', routes.cashier_p2p_verification);
            window.location.href = loginUrl({
                language: getLanguage(),
            });
            break;
        }
        case 'trading_platform_investor_password_reset': {
            localStorage.setItem('cfd_reset_password_code', url_params.get('code'));
            const is_demo = localStorage.getItem('cfd_reset_password_intent')?.includes('demo');
            history.push(`${routes.mt5}#${is_demo ? 'demo' : 'real'}#reset-password`);
            redirected_to_route = true;
            break;
        }
        default:
            break;
    }

    if (!redirected_to_route) {
        history.push({
            pathname: routes.root,
            search: url_query_string,
        });
    }

    return null;
};

Redirect.propTypes = {
    getServerTime: PropTypes.object,
    history: PropTypes.object,
    setResetTradingPasswordModalOpen: PropTypes.func,
    setVerificationCode: PropTypes.func,
    toggleAccountSignupModal: PropTypes.func,
    toggleResetPasswordModal: PropTypes.func,
};

export default withRouter(
    connect(({ client, ui }) => ({
        currency: client.currency,
        setVerificationCode: client.setVerificationCode,
        fetchResidenceList: client.fetchResidenceList,
        hasAnyRealAccount: client.hasAnyRealAccount,
        openRealAccountSignup: ui.openRealAccountSignup,
        setResetTradingPasswordModalOpen: ui.setResetTradingPasswordModalOpen,
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
        toggleResetPasswordModal: ui.toggleResetPasswordModal,
    }))(Redirect)
);
