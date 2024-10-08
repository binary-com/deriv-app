const DerivAPIBasic = require('@deriv/deriv-api/dist/DerivAPIBasic');
const getAppId = require('@deriv/shared').getAppId;
const getSocketURL = require('@deriv/shared').getSocketURL;
const cloneObject = require('@deriv/shared').cloneObject;
const getPropertyValue = require('@deriv/shared').getPropertyValue;
const State = require('@deriv/shared').State;
const { getLanguage } = require('@deriv/translations');
const website_name = require('@deriv/shared').website_name;
const SocketCache = require('./socket_cache');
const APIMiddleware = require('./api_middleware');

/*
 * An abstraction layer over native javascript WebSocket,
 * which provides additional functionality like
 * reopen the closed connection and process the buffered requests
 */
const BinarySocketBase = (() => {
    let deriv_api, binary_socket, client_store;

    let config = {};
    let wrong_app_id = 0;
    let is_disconnect_called = false;
    let is_connected_before = false;
    let is_switching_socket = false;

    const availability = {
        is_up: true,
        is_updating: false,
        is_down: false,
    };

    const getSocketUrl = (language, is_mock_server = false) => {
        if (is_mock_server) {
            return 'ws://127.0.0.1:42069';
        }
        return `wss://${getSocketURL()}/websockets/v3?app_id=${getAppId()}&l=${language}&brand=${website_name.toLowerCase()}`;
    };

    const isReady = () => hasReadyState(1);

    const isClose = () => !binary_socket || hasReadyState(2, 3);

    const blockRequest = value => deriv_api?.blockRequest(value);

    const close = () => {
        binary_socket.close();
    };

    const closeAndOpenNewConnection = (language = getLanguage(), session_id = '') => {
        close();
        is_switching_socket = true;
        openNewConnection(language, session_id);
    };

    const hasReadyState = (...states) => binary_socket && states.some(s => binary_socket.readyState === s);

    const init = ({ options, client }) => {
        if (typeof options === 'object' && config !== options) {
            config = options;
        }
        client_store = client;
    };

    const getMockServerConfig = () => {
        const mock_server_config = localStorage.getItem('mock_server_data');
        return mock_server_config
            ? JSON.parse(mock_server_config)
            : {
                  session_id: '',
                  is_mockserver_enabled: false,
              };
    };

    const openNewConnection = (language = getLanguage()) => {
        const mock_server_config = getMockServerConfig();
        const session_id = mock_server_config?.session_id || '';

        if (wrong_app_id === getAppId()) return;

        if (!is_switching_socket) config.wsEvent('init');

        if (isClose()) {
            is_disconnect_called = false;
            binary_socket = new WebSocket(getSocketUrl(language, session_id));

            deriv_api = new DerivAPIBasic({
                connection: binary_socket,
                storage: SocketCache,
                middleware: new APIMiddleware(config, session_id),
            });
        }

        deriv_api.onOpen().subscribe(() => {
            config.wsEvent('open');

            wait('website_status');

            if (client_store.is_logged_in) {
                const authorize_token = client_store.getToken();
                deriv_api.authorize(authorize_token);
            }

            if (typeof config.onOpen === 'function') {
                config.onOpen(isReady());
            }

            if (typeof config.onReconnect === 'function' && is_connected_before) {
                config.onReconnect();
            }

            if (!is_connected_before) {
                is_connected_before = true;
            }
        });

        deriv_api.onMessage().subscribe(({ data: response }) => {
            const msg_type = response.msg_type;
            State.set(['response', msg_type], cloneObject(response));

            config.wsEvent('message');

            if (getPropertyValue(response, ['error', 'code']) === 'InvalidAppID') {
                wrong_app_id = getAppId();
            }

            if (typeof config.onMessage === 'function') {
                config.onMessage(response);
            }
        });

        deriv_api.onClose().subscribe(() => {
            if (!is_switching_socket) {
                config.wsEvent('close');
            } else {
                is_switching_socket = false;
            }

            if (wrong_app_id !== getAppId() && typeof config.onDisconnect === 'function' && !is_disconnect_called) {
                config.onDisconnect();
                is_disconnect_called = true;
            }
        });
    };

    const isSiteUp = status => /^up$/i.test(status);

    const isSiteUpdating = status => /^updating$/i.test(status);

    const isSiteDown = status => /^down$/i.test(status);

    // if status is up or updating, consider site available
    // if status is down, consider site unavailable
    const setAvailability = status => {
        availability.is_up = isSiteUp(status);
        availability.is_updating = isSiteUpdating(status);
        availability.is_down = isSiteDown(status);
    };

    const excludeAuthorize = type => !(type === 'authorize' && !client_store.is_logged_in);

    const wait = (...responses) => deriv_api?.expectResponse(...responses.filter(excludeAuthorize));

    const subscribe = (request, cb) => deriv_api.subscribe(request).subscribe(cb, cb); // Delegate error handling to the callback

    const balanceAll = () => deriv_api.send({ balance: 1, account: 'all' });

    const subscribeBalanceAll = cb => subscribe({ balance: 1, account: 'all' }, cb);

    const subscribeBalanceActiveAccount = (cb, account) => subscribe({ balance: 1, account }, cb);

    const subscribeProposal = (req, cb) => subscribe({ proposal: 1, ...req }, cb);

    const subscribeProposalOpenContract = (contract_id = null, cb) =>
        subscribe({ proposal_open_contract: 1, ...(contract_id && { contract_id }) }, cb);

    const subscribeTicks = (symbol, cb) => subscribe({ ticks: symbol }, cb);

    const subscribeTicksHistory = (request_object, cb) => subscribe(request_object, cb);

    const subscribeTransaction = cb => subscribe({ transaction: 1 }, cb);

    const subscribeWebsiteStatus = cb => subscribe({ website_status: 1 }, cb);

    const getTicksHistory = request_object => deriv_api.send(request_object);

    const buyAndSubscribe = request => {
        return new Promise(resolve => {
            let called = false;
            const subscriber = subscribe(request, response => {
                if (!called) {
                    called = true;
                    subscriber.unsubscribe();
                    resolve(response);
                }
            });
        });
    };

    const buy = ({ proposal_id, price }) => deriv_api.send({ buy: proposal_id, price });

    const sell = (contract_id, bid_price) => deriv_api.send({ sell: contract_id, price: bid_price });

    const cashier = (action, parameters = {}) => deriv_api.send({ cashier: action, ...parameters });

    const cancelCryptoTransaction = transaction_id =>
        deriv_api.send({ cashier_withdrawal_cancel: 1, id: transaction_id });

    const newAccountVirtual = (verification_code, client_password, residence, device_data) =>
        deriv_api.send({
            new_account_virtual: 1,
            verification_code,
            client_password,
            residence,
            ...device_data,
        });

    const setAccountCurrency = (currency, passthrough) =>
        deriv_api.send({
            set_account_currency: currency,
            ...(passthrough && { passthrough }),
        });

    const newAccountReal = values =>
        deriv_api.send({
            new_account_real: 1,
            ...values,
        });

    const newAccountRealMaltaInvest = values => deriv_api.send({ new_account_maltainvest: 1, ...values });

    const mt5NewAccount = values =>
        deriv_api.send({
            mt5_new_account: 1,
            ...values,
        });

    const getFinancialAssessment = () =>
        deriv_api.send({
            get_financial_assessment: 1,
        });

    const setFinancialAndTradingAssessment = payload => deriv_api.send({ set_financial_assessment: 1, ...payload });

    const profitTable = (limit, offset, date_boundaries) =>
        deriv_api.send({ profit_table: 1, description: 1, limit, offset, ...date_boundaries });

    const statement = (limit, offset, other_properties) =>
        deriv_api.send({ statement: 1, description: 1, limit, offset, ...other_properties });

    const verifyEmail = (email, type, payload = {}) => deriv_api.send({ verify_email: email, type, ...payload });

    const tradingPlatformPasswordChange = payload =>
        deriv_api.send({
            trading_platform_password_change: 1,
            ...payload,
        });

    const tradingPlatformInvestorPasswordChange = payload =>
        deriv_api.send({
            trading_platform_investor_password_change: 1,
            ...payload,
        });

    const tradingPlatformInvestorPasswordReset = payload =>
        deriv_api.send({
            trading_platform_investor_password_reset: 1,
            ...payload,
        });

    const tradingPlatformPasswordReset = payload =>
        deriv_api.send({
            trading_platform_password_reset: 1,
            ...payload,
        });

    const tradingPlatformAvailableAccounts = platform =>
        deriv_api.send({
            trading_platform_available_accounts: 1,
            platform,
        });

    const paymentAgentList = (country, currency) =>
        deriv_api.send({ paymentagent_list: country, ...(currency && { currency }) });

    const allPaymentAgentList = country => deriv_api.send({ paymentagent_list: country });

    const paymentAgentDetails = (passthrough, req_id) =>
        deriv_api.send({ paymentagent_details: 1, passthrough, req_id });

    const paymentAgentWithdraw = ({ amount, currency, dry_run = 0, loginid, verification_code }) =>
        deriv_api.send({
            amount,
            currency,
            dry_run,
            paymentagent_loginid: loginid,
            paymentagent_withdraw: 1,
            verification_code,
        });

    const cryptoWithdraw = ({ address, amount, verification_code, estimated_fee_unique_id, dry_run = 0 }) =>
        deriv_api.send({
            cashier: 'withdraw',
            provider: 'crypto',
            type: 'api',
            address,
            amount,
            verification_code,
            estimated_fee_unique_id,
            dry_run,
        });

    const cryptoConfig = () =>
        deriv_api.send({
            crypto_config: 1,
        });

    const paymentAgentTransfer = ({ amount, currency, description, transfer_to, dry_run = 0 }) =>
        deriv_api.send({
            amount,
            currency,
            description,
            transfer_to,
            paymentagent_transfer: 1,
            dry_run,
        });

    const activeSymbols = (mode = 'brief') => deriv_api.activeSymbols(mode);

    const contractsForCompany = ({ landing_company }) =>
        deriv_api.send({
            landing_company,
            contracts_for_company: 1,
        });

    const transferBetweenAccounts = (account_from, account_to, currency, amount) =>
        deriv_api.send({
            transfer_between_accounts: 1,
            accounts: 'all',
            ...(account_from && {
                account_from,
                account_to,
                currency,
                amount,
            }),
        });

    const forgetStream = id => deriv_api.forget(id);

    const tncApproval = () => deriv_api.send({ tnc_approval: '1' });

    const contractUpdate = (contract_id, limit_order) =>
        deriv_api.send({
            contract_update: 1,
            contract_id,
            limit_order,
        });

    const contractUpdateHistory = contract_id =>
        deriv_api.send({
            contract_update_history: 1,
            contract_id,
        });

    const cancelContract = contract_id => deriv_api.send({ cancel: contract_id });

    const fetchLoginHistory = limit =>
        deriv_api.send({
            login_history: 1,
            limit,
        });

    // subscribe method export for P2P use only
    // so that subscribe remains private
    const p2pSubscribe = (request, cb) => subscribe(request, cb);
    const accountStatistics = () => deriv_api.send({ account_statistics: 1 });

    const tradingServers = platform => deriv_api.send({ platform, trading_servers: 1 });

    const tradingPlatformAccountsList = platform =>
        deriv_api.send({
            trading_platform_accounts: 1,
            platform,
        });

    const tradingPlatformNewAccount = values =>
        deriv_api.send({
            trading_platform_new_account: 1,
            ...values,
        });

    const triggerMt5DryRun = ({ email }) =>
        deriv_api.send({
            account_type: 'financial',
            dry_run: 1,
            email,
            leverage: 100,
            mainPassword: 'Test1234',
            mt5_account_type: 'financial_stp',
            mt5_new_account: 1,
            name: 'test real labuan financial stp',
        });

    const getServiceToken = (platform, server) => {
        const temp_service = platform;

        return deriv_api.send({
            service_token: 1,
            service: temp_service,
            server,
        });
    };

    const changeEmail = api_request => deriv_api.send(api_request);

    const getWalletMigrationState = () =>
        deriv_api.send({
            wallet_migration: 'state',
        });

    const startWalletMigration = () =>
        deriv_api.send({
            wallet_migration: 'start',
        });

    const resetWalletMigration = () =>
        deriv_api.send({
            wallet_migration: 'reset',
        });

    return {
        init,
        openNewConnection,
        forgetStream,
        wait,
        availability,
        hasReadyState,
        isSiteDown,
        isSiteUpdating,
        clear: () => {
            // do nothing.
        },
        sendBuffered: () => {
            // do nothing.
        },
        getSocket: () => binary_socket,
        get: () => deriv_api,
        getAvailability: () => availability,
        setOnDisconnect: onDisconnect => {
            config.onDisconnect = onDisconnect;
        },
        setOnReconnect: onReconnect => {
            config.onReconnect = onReconnect;
        },
        removeOnReconnect: () => {
            delete config.onReconnect;
        },
        removeOnDisconnect: () => {
            delete config.onDisconnect;
        },
        cache: delegateToObject({}, () => deriv_api.cache),
        storage: delegateToObject({}, () => deriv_api.storage),
        blockRequest,
        buy,
        buyAndSubscribe,
        sell,
        cashier,
        cancelCryptoTransaction,
        cancelContract,
        close,
        cryptoWithdraw,
        cryptoConfig,
        contractUpdate,
        contractUpdateHistory,
        getFinancialAssessment,
        setFinancialAndTradingAssessment,
        mt5NewAccount,
        newAccountVirtual,
        newAccountReal,
        newAccountRealMaltaInvest,
        p2pSubscribe,
        profitTable,
        statement,
        verifyEmail,
        getTicksHistory,
        tradingPlatformPasswordChange,
        tradingPlatformPasswordReset,
        tradingPlatformAvailableAccounts,
        tradingPlatformInvestorPasswordChange,
        tradingPlatformInvestorPasswordReset,
        activeSymbols,
        contractsForCompany,
        paymentAgentList,
        allPaymentAgentList,
        paymentAgentDetails,
        paymentAgentWithdraw,
        paymentAgentTransfer,
        setAccountCurrency,
        balanceAll,
        setAvailability,
        subscribeBalanceAll,
        subscribeBalanceActiveAccount,
        subscribeProposal,
        subscribeProposalOpenContract,
        subscribeTicks,
        subscribeTicksHistory,
        subscribeTransaction,
        subscribeWebsiteStatus,
        tncApproval,
        transferBetweenAccounts,
        fetchLoginHistory,
        closeAndOpenNewConnection,
        accountStatistics,
        tradingServers,
        tradingPlatformAccountsList,
        tradingPlatformNewAccount,
        triggerMt5DryRun,
        getServiceToken,
        changeEmail,
        getWalletMigrationState,
        startWalletMigration,
        resetWalletMigration,
    };
})();

function delegateToObject(base_obj, extending_obj_getter) {
    return new Proxy(base_obj, {
        get(target, field) {
            if (target[field]) return target[field];

            const extending_obj =
                typeof extending_obj_getter === 'function' ? extending_obj_getter() : extending_obj_getter;

            if (!extending_obj) return undefined;

            const value = extending_obj[field];
            if (value) {
                if (typeof value === 'function') {
                    return value.bind(extending_obj);
                }
                return value;
            }

            return undefined;
        },
    });
}

const proxied_socket_base = delegateToObject(BinarySocketBase, () => BinarySocketBase.get());

const proxyForAuthorize = obj =>
    new Proxy(obj, {
        get(target, field) {
            if (target[field] && typeof target[field] !== 'function') {
                return proxyForAuthorize(target[field]);
            }
            return (...args) => BinarySocketBase?.wait('authorize')?.then(() => target[field](...args));
        },
    });

BinarySocketBase.authorized = proxyForAuthorize(proxied_socket_base);

module.exports = proxied_socket_base;
