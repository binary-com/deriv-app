import {
    AccountStatusResponse,
    Balance,
    CashierInformationRequest,
    CashierInformationResponse,
    TransferBetweenAccountsResponse,
    CryptoConfig,
} from '@deriv/api-types';
import { TMT5LoginAccount } from 'Types';

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
};

type TWebSocketCall = {
    cashier: (
        action: CashierInformationRequest['cashier'],
        parameters: Omit<CashierInformationRequest, 'cashier'>
    ) => Promise<CashierInformationResponse>;
    getAccountStatus: () => Promise<AccountStatusResponse>;
    transferBetweenAccounts: (
        account_from?: string,
        account_to?: string,
        currency?: string,
        amount?: number
    ) => Promise<TransferBetweenAccountsResponse & { error: TServerError }>;
};

export type TWebSocket = {
    authorized: TWebSocketCall;
    cryptoConfig: () => { crypto_config: CryptoConfig };
    cryptoWithdraw: (args: {
        address: string;
        amount: number;
        verification_code: string;
        dry_run?: number;
    }) => Promise<any>;
    balanceAll: () => Promise<Balance>;
    mt5LoginList: () => {
        mt5_login_list: Array<TMT5LoginAccount>;
    };
    send: (obj: any) => Promise<any>;
    storage: {
        mt5LoginList: () => {
            mt5_login_list: Array<TMT5LoginAccount>;
        };
    };
    tradingPlatformAccountsList: (platform: string) => {
        trading_platform_accounts: Array<TMT5LoginAccount>;
    };
    wait: (value: string) => Promise<any>;
};
