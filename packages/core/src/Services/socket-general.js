import moment from 'moment';
import { flow } from 'mobx';
import {
    State,
    getSocketURL,
    getActivePlatform,
    getPropertyValue,
    routes,
    getActionFromUrl,
    checkServerMaintenance,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import ServerTime from '_common/base/server_time';
import BinarySocket from '_common/base/socket_base';
import WS from './ws-methods';

let client_store, common_store, gtm_store;
let reconnectionCounter = 1;

// TODO: update commented statements to the corresponding functions from app
const BinarySocketGeneral = (() => {
    let session_duration_limit, session_start_time, session_timeout;

    let responseTimeoutErrorTimer = null;

    const onDisconnect = () => {
        clearTimeout(responseTimeoutErrorTimer);
        common_store.setIsSocketOpened(false);
    };

    const onOpen = is_ready => {
        responseTimeoutErrorTimer = setTimeout(() => {
            const expectedResponseTypes = WS?.get?.()?.expect_response_types || {};
            const pendingResponseTypes = Object.keys(expectedResponseTypes).filter(
                key => expectedResponseTypes[key].state === 'pending'
            );

            const error = new Error('deriv-api: no message received after 30s');
            error.userId = client_store?.loginid;

            window.TrackJS?.console?.error({
                message: error.message,
                clientsCountry: client_store?.clients_country,
                websocketUrl: getSocketURL(),
                pendingResponseTypes,
            });
        }, 30000);

        if (is_ready) {
            if (client_store.is_logged_in || client_store.is_logging_in) {
                WS.get()
                    .expectResponse('authorize')
                    .then(() => {
                        WS.subscribeWebsiteStatus(ResponseHandlers.websiteStatus);
                    });
            } else {
                WS.subscribeWebsiteStatus(ResponseHandlers.websiteStatus);
            }

            ServerTime.init(() => common_store.setServerTime(ServerTime.get()));
            common_store.setIsSocketOpened(true);
        }
    };

    const onMessage = response => {
        clearTimeout(responseTimeoutErrorTimer);
        handleError(response);
        // Header.hideNotification('CONNECTION_ERROR');
        switch (response.msg_type) {
            case 'authorize':
                if (response.error) {
                    const is_active_tab = sessionStorage.getItem('active_tab') === '1';
                    if (getPropertyValue(response, ['error', 'code']) === 'SelfExclusion' && is_active_tab) {
                        sessionStorage.removeItem('active_tab');
                    }
                    client_store.logout();
                } else if (!/authorize/.test(State.get('skip_response'))) {
                    // is_populating_account_list is a check to avoid logout on the first logged-in session
                    // In any other case, if the response loginid does not match the store's loginid, user must be logged out
                    if (
                        response.authorize.loginid !== client_store.loginid &&
                        !client_store.is_populating_account_list &&
                        !client_store.is_switching
                    ) {
                        client_store.logout();
                    } else if (response.authorize.loginid === client_store.loginid) {
                        // All other cases continue with the loginid and authorize the profile
                        authorizeAccount(response);
                    }
                }
                break;
            case 'landing_company':
                // Header.upgradeMessageVisibility();
                break;
            case 'get_self_exclusion':
                setSessionDurationLimit(response);
                break;
            case 'get_settings':
                if (response.get_settings) {
                    setResidence(response.get_settings.country_code);
                    client_store.setEmail(response.get_settings.email);
                    client_store.setAccountSettings(response.get_settings);
                    gtm_store.eventHandler(response.get_settings);
                }
                break;
            case 'set_account_currency':
                WS.forgetAll('balance').then(subscribeBalances);
                break;
            case 'get_account_status':
                client_store.setAccountStatus(response.get_account_status);
                break;
            case 'payout_currencies':
                client_store.responsePayoutCurrencies(response?.payout_currencies);
                break;
            case 'transaction':
                gtm_store.pushTransactionData(response);
                break;
            // no default
        }
    };

    const setResidence = residence => {
        if (residence) {
            client_store.setResidence(residence);
            WS.landingCompany(residence).then(client_store.responseLandingCompany);
        }
    };

    const setSessionDurationLimit = user_limits => {
        const duration = user_limits?.get_self_exclusion?.session_duration_limit;

        session_start_time = new Date(sessionStorage.getItem('session_start_time') || ServerTime.get());
        sessionStorage.setItem('session_start_time', session_start_time);

        if (duration && duration !== session_duration_limit) {
            const current_session_duration = session_duration_limit ? ServerTime.get() - moment(session_start_time) : 0;
            const remaining_session_time = duration * 60 * 1000 - current_session_duration;
            clearTimeout(session_timeout);
            session_timeout = setTimeout(() => {
                client_store.logout();
                sessionStorage.removeItem('session_start_time');
            }, remaining_session_time);
        } else if (!duration) {
            clearTimeout(session_timeout);
        }

        session_duration_limit = duration;
    };

    const setBalanceActiveAccount = flow(function* (obj_balance) {
        yield BinarySocket.wait('website_status');
        client_store.setBalanceActiveAccount(obj_balance);
    });

    const setBalanceOtherAccounts = obj_balance => {
        client_store.setBalanceOtherAccounts(obj_balance);
    };

    const handleError = response => {
        const msg_type = response.msg_type;
        const error_code = getPropertyValue(response, ['error', 'code']);
        switch (error_code) {
            case 'WrongResponse':
                // TODO: Remove condition checks below for WrongResponse once mt5 is more reliable
                if (msg_type === 'mt5_login_list') {
                    WS.authorized.mt5LoginList().then(mt5_list_response => {
                        if (!mt5_list_response.error) {
                            client_store.responseMt5LoginList(mt5_list_response);
                            WS.balanceAll().then(balance_response => {
                                if (!balance_response.error)
                                    client_store.setBalanceOtherAccounts(balance_response.balance);
                            });
                        } else {
                            client_store.resetMt5ListPopulatedState();
                        }
                    });
                } else if (msg_type === 'balance') {
                    WS.forgetAll('balance').then(subscribeBalances);
                } else if (msg_type === 'get_account_status') {
                    WS.authorized.getAccountStatus().then(account_status_response => {
                        if (!account_status_response.error) {
                            client_store.setAccountStatus(account_status_response.get_account_status);
                        }
                    });
                } else if (msg_type === 'landing_company') {
                    if (client_store.residence) {
                        WS.authorized.landingCompany(client_store.residence).then(landing_company_response => {
                            if (!landing_company_response.error) {
                                client_store.responseLandingCompany(landing_company_response);
                            }
                        });
                    }
                }
                break;
            case 'InternalServerError':
            case 'OutputValidationFailed': {
                if (msg_type !== 'mt5_login_list') {
                    common_store.setError(true, { message: response.error.message });
                }
                break;
            }
            case 'RateLimit':
                if (msg_type !== 'cashier_password') {
                    common_store.setError(true, {
                        message: localize('You have reached the rate limit of requests per second. Please try later.'),
                    });
                }
                break;
            case 'InvalidAppID':
                common_store.setError(true, { message: response.error.message });
                break;
            case 'DisabledClient':
                common_store.setError(true, { message: response.error.message });
                break;
            case 'InvalidToken':
                if (
                    [
                        'cashier',
                        'paymentagent_withdraw',
                        'reset_password',
                        'trading_platform_password_reset',
                        'trading_platform_investor_password_reset',
                        'new_account_virtual',
                        'portfolio',
                        'proposal_open_contract',
                        'change_email',
                        'phone_number_challenge',
                    ].includes(msg_type)
                ) {
                    return;
                }
                // eslint-disable-next-line no-case-declarations
                const active_platform = getActivePlatform(common_store.app_routing_history);

                // DBot handles this internally. Special case: 'client.invalid_token'
                if (active_platform === 'DBot') return;

                client_store.logout().then(() => {
                    let redirect_to = routes.traders_hub;
                    const action = getActionFromUrl();
                    if (action === 'system_email_change') {
                        return;
                    }
                    if (active_platform === 'Deriv MT5') {
                        redirect_to = routes.mt5;
                    }
                    common_store.routeTo(redirect_to);
                });
                break;
            case 'AuthorizationRequired':
                // if msg_type is coming from 'buy', behaviour should be handled in app itself.
                if (msg_type === 'buy') {
                    return;
                }
                client_store.logout();
                break;
            // no default
        }
    };

    const init = store => {
        client_store = store.client;
        common_store = store.common;
        gtm_store = store.gtm;

        return {
            onDisconnect,
            onOpen,
            onMessage,
        };
    };

    const subscribeBalances = () => {
        WS.subscribeBalanceAll(ResponseHandlers.balanceOtherAccounts);
        if (client_store.currency)
            WS.subscribeBalanceActiveAccount(ResponseHandlers.balanceActiveAccount, client_store.loginid);
    };

    const authorizeAccount = response => {
        client_store.responseAuthorize(response);
        subscribeBalances();
        WS.storage.getSettings();
        WS.getAccountStatus();
        WS.storage.payoutCurrencies();
        client_store.setIsAuthorize(true);
        if (!client_store.is_virtual) {
            WS.getSelfExclusion();
        }
        BinarySocket.sendBuffered();
        if (/bch/i.test(response.authorize.currency) && !client_store.accounts[client_store.loginid].accepted_bch) {
            // showPopup({
            //     url        : urlFor('user/warning'),
            //     popup_id   : 'warning_popup',
            //     form_id    : '#frm_warning',
            //     content_id : '#warning_content',
            //     validations: [{ selector: '#chk_accept', validations: [['req', { hide_asterisk: true }]] }],
            //     onAccept   : () => { Client.set('accepted_bch', 1); },
            // });
        }
    };

    return {
        init,
        setBalanceActiveAccount,
        setBalanceOtherAccounts,
        authorizeAccount,
    };
})();

export default BinarySocketGeneral;

const ResponseHandlers = (() => {
    const websiteStatus = response => {
        if (response.website_status) {
            const is_server_down = checkServerMaintenance(response.website_status);

            // If the site is down or updating, connect to WebSocket with an exponentially increasing delay on every attempt.
            // Requests excluding - website_status/authorize will be blocked during backoff
            // The delay starts off at approximately 1.024 seconds and grows exponentially, with a random factor between 0.5 and 2 to spread out the reconnection attempts.
            // The maximum delay is capped at 10 minutes (600k ms).
            if (is_server_down) {
                const reconnectionDelay =
                    Math.min(Math.pow(2, reconnectionCounter + 9), 600000) * (0.5 + Math.random() * 1.5);

                window.setTimeout(() => {
                    reconnectionCounter++;
                    BinarySocket.closeAndOpenNewConnection();
                    BinarySocket.blockRequest(is_server_down);
                }, reconnectionDelay);
                // If site is up, and there was a reconnection attempted before
            } else if (!is_server_down && reconnectionCounter > 1) {
                window.location.reload();
            }

            // @deriv/deriv-api blockRequest(true) affects all API requests except website_status
            BinarySocket.blockRequest(is_server_down);
            BinarySocket.setAvailability(response.website_status.site_status);
            client_store.setWebsiteStatus(response);
        }
    };

    const balanceActiveAccount = response => {
        if (!response.error) {
            BinarySocketGeneral.setBalanceActiveAccount(response.balance);
        }
    };

    const balanceOtherAccounts = response => {
        if (!response.error) {
            BinarySocketGeneral.setBalanceOtherAccounts(response.balance);
        }
    };

    return {
        websiteStatus,
        balanceActiveAccount,
        balanceOtherAccounts,
    };
})();
