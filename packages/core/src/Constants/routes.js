import { getAllowedLocalStorageOrigin } from 'Utils/Events/storage';

const routes = {
    error404: '/404',
    account: '/account',
    financial_assessment: '/account/financial-assessment',
    personal_details: '/account/personal-details',
    proof_of_identity: '/account/proof-of-identity',
    proof_of_address: '/account/proof-of-address',
    deriv_password: '/account/deriv-password',
    account_limits: '/account/account-limits',
    account_password: '/settings/account_password',
    apps: '/settings/apps',
    cashier_password: '/settings/cashier_password',
    contract: '/contract/:contract_id',
    exclusion: '/settings/exclusion',
    financial: '/settings/financial',
    history: '/settings/history',
    index: '/index',
    limits: '/settings/limits',
    mt5: '/mt5',
    personal: '/settings/personal',
    positions: '/reports/positions',
    profit: '/reports/profit',
    reports: '/reports',
    root: '/',
    redirect: '/redirect',
    settings: '/settings',
    statement: '/reports/statement',
    token: '/settings/token',
    trade: '/',
    bot: '/bot',
    cashier: '/cashier',
    cashier_deposit: '/cashier/deposit',
    cashier_withdrawal: '/cashier/withdrawal',
    cashier_pa: '/cashier/payment-agent',
    cashier_acc_transfer: '/cashier/account-transfer',
    cashier_p2p: '/cashier/p2p',
    cashier_pa_transfer: '/cashier/payment-agent-transfer',
    smarttrader: `${getAllowedLocalStorageOrigin()}`,
    endpoint: '/endpoint',
};

export default routes;
