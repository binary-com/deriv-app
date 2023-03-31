import {
    AccountStatusResponse,
    Balance,
    CashierInformationRequest,
    CashierInformationResponse,
    CryptoConfig,
    DetailsOfEachMT5Loginid,
    P2PAdvertInfo,
    TransferBetweenAccountsResponse,
    PaymentAgentWithdrawResponse,
    PaymentAgentDetailsResponse,
} from '@deriv/api-types';
import type { TSocketEndpointNames, TSocketResponse } from '@deriv/api/types';
import type { TPaymentAgentWithdrawRequest, TTransactionItem, TExtendedPaymentAgentListResponse } from 'Types';

export type TCashierPayments = {
    provider?: string;
    transaction_type?: string;
};

export type TSubscribeCashierPayments = {
    error?: TServerError;
    cashier_payments: { crypto: TTransactionItem[] };
};

export type TAuthorizedSend = {
    error?: TServerError;
    p2p_order_list?: { list: P2PAdvertInfo[] };
};

export type TServerError = {
    code: string;
    message: string;
    details?: { [key: string]: string };
    fields?: string[];
};

type TPassthrough = {
    [k: string]: unknown;
};

type TServiceTokenRequest = {
    service_token: number;
    service: string;
    referrer: string;
};

type TServiceTokenResponse = {
    error: TServerError;
    service_token: {
        banxa: {
            url: string;
        };
    };
};

type TWebSocketCall = {
    cashier: (
        action: CashierInformationRequest['cashier'],
        parameters: Omit<CashierInformationRequest, 'cashier'>
    ) => Promise<CashierInformationResponse & { error: TServerError }>;
    cashierPayments?: (request?: TCashierPayments) => Promise<TSubscribeCashierPayments>;
    getAccountStatus: () => Promise<AccountStatusResponse>;
    p2pAdvertiserInfo?: () => Promise<unknown>;
    send?: (obj: unknown) => Promise<TAuthorizedSend>;
    transferBetweenAccounts: (
        account_from?: string,
        account_to?: string,
        currency?: string,
        amount?: number
    ) => Promise<TransferBetweenAccountsResponse & { error: TServerError }>;
    paymentAgentDetails: (passthrough?: TPassthrough, req_id?: number) => Promise<PaymentAgentDetailsResponse>;
    paymentAgentList: (residence: string, currency: string) => Promise<TExtendedPaymentAgentListResponse>;
    paymentAgentWithdraw: ({
        loginid,
        currency,
        amount,
        verification_code,
        dry_run,
    }: TPaymentAgentWithdrawRequest) => Promise<PaymentAgentWithdrawResponse>;
};

export type TWebSocket = {
    allPaymentAgentList: (residence: string) => Promise<TExtendedPaymentAgentListResponse>;
    authorized: TWebSocketCall;
    balanceAll: () => Promise<Balance>;
    cancelCryptoTransaction?: (transaction_id: string) => Promise<{ error: TServerError }>;
    cryptoConfig: () => { crypto_config: CryptoConfig };
    cryptoWithdraw: (
        args: Omit<CashierInformationRequest, 'cashier' | 'provider' | 'type'>
    ) => Promise<CashierInformationResponse & { error: TServerError }>;
    mt5LoginList: () => {
        mt5_login_list: DetailsOfEachMT5Loginid[];
    };
    send: (obj: unknown) => Promise<{ error: TServerError; exchange_rates: { rates: { [k: string]: string } } }>;
    serviceToken: (req: TServiceTokenRequest) => Promise<TServiceTokenResponse>;
    subscribeCashierPayments?: (callback: (response: TSubscribeCashierPayments) => void) => void;
    verifyEmail?: (email: string, withdrawal_type: string) => Promise<unknown>;
    storage: {
        mt5LoginList: () => {
            mt5_login_list: DetailsOfEachMT5Loginid[];
        };
    };
    tradingPlatformAccountsList: (platform: string) => {
        trading_platform_accounts: (DetailsOfEachMT5Loginid & { account_id: string })[];
    };
    wait: <T extends TSocketEndpointNames>(value: T) => Promise<TSocketResponse<T>>;
};
