import { getUrlSmartTrader, getUrlBinaryBot } from '../url/helpers';

export const routes = {
    account: '/account',
    account_closed: '/account-closed',
    account_limits: '/account/account-limits',
    account_password: '/settings/account_password',
    api_token: '/account/api-token',
    apps: '/settings/apps',
    binarybot: getUrlBinaryBot(),
    bot: '/bot',
    cashier: '/cashier',
    cashier_acc_transfer: '/cashier/account-transfer',
    cashier_crypto_transactions: '/cashier/crypto-transactions',
    // cashier_offramp: '/cashier/off-ramp',
    cashier_deposit: '/cashier/deposit',
    cashier_onramp: '/cashier/on-ramp',
    cashier_pa: '/cashier/payment-agent',
    cashier_password: '/settings/cashier_password',
    cashier_pa_transfer: '/cashier/payment-agent-transfer',
    cashier_p2p: '/cashier/p2p',
    cashier_p2p_verification: '/cashier/p2p/verification',
    cashier_withdrawal: '/cashier/withdrawal',
    closing_account: '/account/closing-account',
    complaints_policy: '/complaints-policy',
    connected_apps: '/account/connected-apps',
    contract: '/contract/:contract_id',
    deactivate_account: '/account/deactivate-account', // TODO: Remove once mobile team has changed this link
    dxtrade: '/derivx',
    endpoint: '/endpoint',
    error404: '/404',
    exclusion: '/settings/exclusion',
    financial: '/settings/financial',
    financial_assessment: '/account/financial-assessment',
    history: '/settings/history',
    index: '/index',
    limits: '/settings/limits',
    mt5: '/mt5',
    passwords: '/account/passwords',
    login_history: '/account/login-history',
    personal: '/settings/personal',
    personal_details: '/account/personal-details',
    positions: '/reports/positions',
    profit: '/reports/profit',
    proof_of_address: '/account/proof-of-address',
    proof_of_identity: '/account/proof-of-identity',
    proof_of_income: '/account/proof-of-income',
    redirect: '/redirect',
    reports: '/reports',
    reset_password: '/',
    root: '/',
    self_exclusion: '/account/self-exclusion',
    settings: '/settings',
    smarttrader: getUrlSmartTrader(),
    statement: '/reports/statement',
    token: '/settings/token',
    trade: '/',
    two_factor_authentication: '/account/two-factor-authentication',

    // Appstore
    trading_hub: '/trading-hub',
};
