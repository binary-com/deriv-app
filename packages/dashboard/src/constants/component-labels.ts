import { localize } from '@deriv/translations';

export const getWalletLabels = () => ({
    DEPOSIT: localize('Deposit'),
    GET_WALLET: localize('Get more wallets'),
    RESET: localize('Reset'),
    SETTINGS: localize('Settings'),
    TEMPORARILY_UNAVAILABLE: localize('Deposits and withdrawals temporarily unavailable '),
    TOPUP: localize('Top-up'),
    TRANSACTIONS: localize('Transactions'),
    TRANSFER: localize('Transfer'),
    WITHDRAWAL: localize('Withdrawal'),
});

export const getAppCardLabels = () => ({
    ADD: 'Add',
    WITHDRAW: 'Withdraw',
    TRANSACTIONS: 'Transactions',
    SETTINGS: 'Settings',
    SWAP_FREE: 'Swap-free',
    LINKED: 'Linked',
    LOGIN_ID: 'Login ID',
    BROKER: 'Broker',
    SERVER: 'Server',
    DEMO: 'Demo',
    ENABLE: 'Enable',
});
