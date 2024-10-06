import { getUrlSmartTrader } from '../url/helpers';

export const routes = {
    reset_password: '/',
    error404: '/404',
    index: '/index',
    redirect: '/redirect',
    endpoint: '/endpoint',
    complaints_policy: '/complaints-policy',
    contract: '/contract/:contract_id',

    // platforms
    mt5: '/mt5',
    dxtrade: '/derivx',
    bot: '/bot',
    trade: '/dtrader',
    trader_positions: '/dtrader/positions',
    smarttrader: getUrlSmartTrader(),

    // account
    account: '/account',
    trading_assessment: '/account/trading-assessment',
    languages: '/account/languages',
    financial_assessment: '/account/financial-assessment',
    personal_details: '/account/personal-details',
    proof_of_identity: '/account/proof-of-identity',
    proof_of_address: '/account/proof-of-address',
    proof_of_ownership: '/account/proof-of-ownership',
    proof_of_income: '/account/proof-of-income',
    passwords: '/account/passwords',
    passkeys: '/account/passkeys',
    phone_verification: '/account/personal-details/phone-verification',
    closing_account: '/account/closing-account',
    deactivate_account: '/account/deactivate-account', // TODO: Remove once mobile team has changed this link
    account_closed: '/account-closed',
    account_limits: '/account/account-limits',
    connected_apps: '/account/connected-apps',
    api_token: '/account/api-token',
    login_history: '/account/login-history',
    two_factor_authentication: '/account/two-factor-authentication',
    self_exclusion: '/account/self-exclusion',

    // settings
    settings: '/settings',
    account_password: '/settings/account_password',
    apps: '/settings/apps',
    cashier_password: '/settings/cashier_password',
    exclusion: '/settings/exclusion',
    financial: '/settings/financial',
    history: '/settings/history',
    limits: '/settings/limits',
    token: '/settings/token',
    personal: '/settings/personal',

    // reports
    reports: '/reports',
    positions: '/reports/positions',
    profit: '/reports/profit',
    statement: '/reports/statement',

    // cashier
    cashier: '/cashier',
    cashier_deposit: '/cashier/deposit',
    cashier_withdrawal: '/cashier/withdrawal',
    cashier_pa: '/cashier/payment-agent',
    cashier_acc_transfer: '/cashier/account-transfer',
    cashier_transactions_crypto: '/cashier/crypto-transactions',
    // cashier_offramp: '/cashier/off-ramp',
    cashier_onramp: '/cashier/on-ramp',
    cashier_p2p: '/cashier/p2p',
    cashier_pa_transfer: '/cashier/payment-agent-transfer',

    // P2P
    p2p_verification: '/cashier/p2p/verification',
    p2p_buy_sell: '/cashier/p2p/buy-sell',
    p2p_orders: '/cashier/p2p/orders',
    p2p_my_ads: '/cashier/p2p/my-ads',
    p2p_my_profile: '/cashier/p2p/my-profile',
    p2p_advertiser_page: '/cashier/p2p/advertiser',

    // Appstore
    old_traders_hub: '/appstore/traders-hub',
    traders_hub: '/',
    onboarding: '/onboarding',
    compare_cfds: '/cfd-compare-accounts',

    // Wallets
    wallets: '/wallet',
    wallets_deposit: '/wallet/deposit',
    wallets_withdrawal: '/wallet/withdrawal',
    wallets_transfer: '/wallet/account-transfer',
    wallets_transactions: '/wallet/transactions',
    wallets_compare_accounts: '/compare-accounts',
    wallets_on_ramp: '/wallet/on-ramp',
    wallets_reset_balance: '/wallet/reset-balance',
};

export const DISABLE_LANDSCAPE_BLOCKER_ROUTES = [
    routes.trade,
    routes.onboarding,
    routes.compare_cfds,
    routes.reports,
    routes.bot,
    routes.account,
    routes.endpoint,
    routes.wallets,
    routes.wallets_compare_accounts,
    routes.cashier,
    /** because contract route has dynamic id */
    '/contract',
];

export const isDisabledLandscapeBlockerRoute = (path: string) => {
    // can't use routes.traders_hub for the next check because all routes starts with '/'
    if (path === routes.traders_hub) return true;
    return DISABLE_LANDSCAPE_BLOCKER_ROUTES.some(route => path.startsWith(route));
};
