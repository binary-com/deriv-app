import * as https from 'https';
import { EventEmitter } from 'events';
import { Server as WsServer } from 'ws';
import { generate } from 'selfsigned';
import { Page, expect } from '@playwright/test';
import generateOauthLoginFromAccounts from './generateOauthLoginFromAccounts';

import type {
    APITokenRequest,
    APITokenResponse,
    AccountLimitsRequest,
    AccountLimitsResponse,
    AccountStatusRequest,
    AccountStatusResponse,
    ActiveSymbolsRequest,
    ActiveSymbolsResponse,
    ApplicationDeleteRequest,
    ApplicationDeleteResponse,
    ApplicationGetDetailsRequest,
    ApplicationGetDetailsResponse,
    ApplicationListRequest,
    ApplicationListResponse,
    ApplicationMarkupDetailsRequest,
    ApplicationMarkupDetailsResponse,
    ApplicationMarkupStatisticsRequest,
    ApplicationMarkupStatisticsResponse,
    ApplicationRegisterRequest,
    ApplicationRegisterResponse,
    ApplicationUpdateRequest,
    ApplicationUpdateResponse,
    AssetIndexRequest,
    AssetIndexResponse,
    AuthorizeRequest,
    AuthorizeResponse,
    BalanceRequest,
    BalanceResponse,
    BuyContractForMultipleAccountsRequest,
    BuyContractForMultipleAccountsResponse,
    BuyContractRequest,
    BuyContractResponse,
    CancelAContractRequest,
    CancelAContractResponse,
    CashierInformationRequest,
    CashierInformationResponse,
    ContractsForSymbolRequest,
    ContractsForSymbolResponse,
    CopyTradingListRequest,
    CopyTradingListResponse,
    CopyTradingStartRequest,
    CopyTradingStartResponse,
    CopyTradingStatisticsRequest,
    CopyTradingStatisticsResponse,
    CopyTradingStopRequest,
    CopyTradingStopResponse,
    CountriesListRequest,
    CountriesListResponse,
    CryptocurrencyConfigurationsRequest,
    CryptocurrencyConfigurationsResponse,
    DocumentUploadRequest,
    DocumentUploadResponse,
    EconomicCalendarRequest,
    EconomicCalendarResponse,
    ExchangeRatesRequest,
    ExchangeRatesResponse,
    ForgetAllRequest,
    ForgetAllResponse,
    ForgetRequest,
    ForgetResponse,
    GetAccountSettingsRequest,
    GetAccountSettingsResponse,
    GetFinancialAssessmentRequest,
    GetFinancialAssessmentResponse,
    GetSelfExclusionRequest,
    GetSelfExclusionResponse,
    IdentityVerificationAddDocumentRequest,
    IdentityVerificationAddDocumentResponse,
    LandingCompanyDetailsRequest,
    LandingCompanyDetailsResponse,
    LandingCompanyRequest,
    LandingCompanyResponse,
    LogOutRequest,
    LogOutResponse,
    LoginHistoryRequest,
    LoginHistoryResponse,
    MT5AccountsListRequest,
    MT5AccountsListResponse,
    MT5DepositRequest,
    MT5DepositResponse,
    MT5GetSettingRequest,
    MT5GetSettingResponse,
    MT5NewAccountRequest,
    MT5NewAccountResponse,
    MT5PasswordChangeRequest,
    MT5PasswordChangeResponse,
    MT5PasswordCheckRequest,
    MT5PasswordCheckResponse,
    MT5PasswordResetRequest,
    MT5PasswordResetResponse,
    MT5WithdrawalRequest,
    MT5WithdrawalResponse,
    NewRealMoneyAccountDefaultLandingCompanyRequest,
    NewRealMoneyAccountDefaultLandingCompanyResponse,
    NewRealMoneyAccountDerivInvestmentEuropeLtdRequest,
    NewRealMoneyAccountDerivInvestmentEuropeLtdResponse,
    NewVirtualMoneyAccountRequest,
    NewVirtualMoneyAccountResponse,
    OAuthApplicationsRequest,
    OAuthApplicationsResponse,
    P2PAdvertCreateRequest,
    P2PAdvertCreateResponse,
    P2PAdvertInformationRequest,
    P2PAdvertInformationResponse,
    P2PAdvertListRequest,
    P2PAdvertListResponse,
    P2PAdvertUpdateRequest,
    P2PAdvertUpdateResponse,
    P2PAdvertiserAdvertsRequest,
    P2PAdvertiserAdvertsResponse,
    P2PAdvertiserCreateRequest,
    P2PAdvertiserCreateResponse,
    P2PAdvertiserInformationRequest,
    P2PAdvertiserInformationResponse,
    P2PAdvertiserListRequest,
    P2PAdvertiserListResponse,
    P2PAdvertiserPaymentMethodsRequest,
    P2PAdvertiserPaymentMethodsResponse,
    P2PAdvertiserRelationsRequest,
    P2PAdvertiserRelationsResponse,
    P2PAdvertiserUpdateRequest,
    P2PAdvertiserUpdateResponse,
    P2PChatCreateRequest,
    P2PChatCreateResponse,
    P2POrderCancelRequest,
    P2POrderCancelResponse,
    P2POrderConfirmRequest,
    P2POrderConfirmResponse,
    P2POrderCreateRequest,
    P2POrderCreateResponse,
    P2POrderDisputeRequest,
    P2POrderDisputeResponse,
    P2POrderInformationRequest,
    P2POrderInformationResponse,
    P2POrderListRequest,
    P2POrderListResponse,
    P2POrderReviewRequest,
    P2POrderReviewResponse,
    P2PPaymentMethodsRequest,
    P2PPaymentMethodsResponse,
    P2PPingRequest,
    P2PPingResponse,
    PaymentAgentCreateRequest,
    PaymentAgentCreateResponse,
    PaymentAgentDetailsRequest,
    PaymentAgentDetailsResponse,
    PaymentAgentListRequest,
    PaymentAgentListResponse,
    PaymentAgentTransferRequest,
    PaymentAgentTransferResponse,
    PaymentAgentWithdrawJustificationRequest,
    PaymentAgentWithdrawJustificationResponse,
    PaymentAgentWithdrawRequest,
    PaymentAgentWithdrawResponse,
    PaymentMethodsRequest,
    PaymentMethodsResponse,
    PayoutCurrenciesRequest,
    PayoutCurrenciesResponse,
    PingRequest,
    PingResponse,
    PortfolioRequest,
    PortfolioResponse,
    PriceProposalOpenContractsRequest,
    PriceProposalOpenContractsResponse,
    PriceProposalRequest,
    PriceProposalResponse,
    ProfitTableRequest,
    ProfitTableResponse,
    RealityCheckRequest,
    RealityCheckResponse,
    RevokeOauthApplicationRequest,
    RevokeOauthApplicationResponse,
    SellContractRequest,
    SellContractResponse,
    SellContractsMultipleAccountsRequest,
    SellContractsMultipleAccountsResponse,
    SellExpiredContractsRequest,
    SellExpiredContractsResponse,
    ServerListRequest,
    ServerListResponse,
    ServerStatusRequest,
    ServerStatusResponse,
    ServerTimeRequest,
    ServerTimeResponse,
    SetAccountCurrencyRequest,
    SetAccountCurrencyResponse,
    SetAccountSettingsRequest,
    SetAccountSettingsResponse,
    SetFinancialAssessmentRequest,
    SetFinancialAssessmentResponse,
    SetSelfExclusionRequest,
    SetSelfExclusionResponse,
    StatementRequest,
    StatementResponse,
    StatesListRequest,
    StatesListResponse,
    TermsAndConditionsApprovalRequest,
    TermsAndConditionsApprovalResponse,
    TicksHistoryRequest,
    TicksHistoryResponse,
    TicksStreamRequest,
    TicksStreamResponse,
    TopUpVirtualMoneyAccountRequest,
    TopUpVirtualMoneyAccountResponse,
    TradingDurationsRequest,
    TradingDurationsResponse,
    TradingPlatformInvestorPasswordResetRequest,
    TradingPlatformInvestorPasswordResetResponse,
    TradingPlatformPasswordResetRequest,
    TradingPlatformPasswordResetResponse,
    TradingTimesRequest,
    TradingTimesResponse,
    TransactionsStreamRequest,
    TransactionsStreamResponse,
    TransferBetweenAccountsRequest,
    TransferBetweenAccountsResponse,
    UnsubscribeEmailRequest,
    UnsubscribeEmailResponse,
    UpdateContractHistoryRequest,
    UpdateContractHistoryResponse,
    UpdateContractRequest,
    UpdateContractResponse,
    VerifyEmailRequest,
    VerifyEmailResponse,
} from '@deriv/api-types';

type Request =
    | APITokenRequest
    | AccountLimitsRequest
    | AccountStatusRequest
    | ActiveSymbolsRequest
    | ApplicationDeleteRequest
    | ApplicationGetDetailsRequest
    | ApplicationListRequest
    | ApplicationMarkupDetailsRequest
    | ApplicationMarkupStatisticsRequest
    | ApplicationRegisterRequest
    | ApplicationUpdateRequest
    | AssetIndexRequest
    | AuthorizeRequest
    | BalanceRequest
    | BuyContractForMultipleAccountsRequest
    | BuyContractRequest
    | CancelAContractRequest
    | CashierInformationRequest
    | ContractsForSymbolRequest
    | CopyTradingListRequest
    | CopyTradingStartRequest
    | CopyTradingStatisticsRequest
    | CopyTradingStopRequest
    | CountriesListRequest
    | CryptocurrencyConfigurationsRequest
    | DocumentUploadRequest
    | EconomicCalendarRequest
    | ExchangeRatesRequest
    | ForgetAllRequest
    | ForgetRequest
    | GetAccountSettingsRequest
    | GetFinancialAssessmentRequest
    | GetSelfExclusionRequest
    | IdentityVerificationAddDocumentRequest
    | LandingCompanyDetailsRequest
    | LandingCompanyRequest
    | LogOutRequest
    | LoginHistoryRequest
    | MT5AccountsListRequest
    | MT5DepositRequest
    | MT5GetSettingRequest
    | MT5NewAccountRequest
    | MT5PasswordChangeRequest
    | MT5PasswordCheckRequest
    | MT5PasswordResetRequest
    | MT5WithdrawalRequest
    | NewRealMoneyAccountDefaultLandingCompanyRequest
    | NewRealMoneyAccountDerivInvestmentEuropeLtdRequest
    | NewVirtualMoneyAccountRequest
    | OAuthApplicationsRequest
    | P2PAdvertCreateRequest
    | P2PAdvertInformationRequest
    | P2PAdvertListRequest
    | P2PAdvertUpdateRequest
    | P2PAdvertiserAdvertsRequest
    | P2PAdvertiserCreateRequest
    | P2PAdvertiserInformationRequest
    | P2PAdvertiserListRequest
    | P2PAdvertiserPaymentMethodsRequest
    | P2PAdvertiserRelationsRequest
    | P2PAdvertiserUpdateRequest
    | P2PChatCreateRequest
    | P2POrderCancelRequest
    | P2POrderConfirmRequest
    | P2POrderCreateRequest
    | P2POrderDisputeRequest
    | P2POrderInformationRequest
    | P2POrderListRequest
    | P2POrderReviewRequest
    | P2PPaymentMethodsRequest
    | P2PPingRequest
    | PaymentAgentCreateRequest
    | PaymentAgentDetailsRequest
    | PaymentAgentListRequest
    | PaymentAgentTransferRequest
    | PaymentAgentWithdrawJustificationRequest
    | PaymentAgentWithdrawRequest
    | PaymentMethodsRequest
    | PayoutCurrenciesRequest
    | PingRequest
    | PortfolioRequest
    | PriceProposalOpenContractsRequest
    | PriceProposalRequest
    | ProfitTableRequest
    | RealityCheckRequest
    | RevokeOauthApplicationRequest
    | SellContractRequest
    | SellContractsMultipleAccountsRequest
    | SellExpiredContractsRequest
    | ServerListRequest
    | ServerStatusRequest
    | ServerTimeRequest
    | SetAccountCurrencyRequest
    | SetAccountSettingsRequest
    | SetFinancialAssessmentRequest
    | SetSelfExclusionRequest
    | StatementRequest
    | StatesListRequest
    | TermsAndConditionsApprovalRequest
    | TicksHistoryRequest
    | TicksStreamRequest
    | TopUpVirtualMoneyAccountRequest
    | TradingDurationsRequest
    | TradingPlatformInvestorPasswordResetRequest
    | TradingPlatformPasswordResetRequest
    | TradingTimesRequest
    | TransactionsStreamRequest
    | TransferBetweenAccountsRequest
    | UnsubscribeEmailRequest
    | UpdateContractHistoryRequest
    | UpdateContractRequest
    | VerifyEmailRequest;

type Response =
    | APITokenResponse
    | AccountLimitsResponse
    | AccountStatusResponse
    | ActiveSymbolsResponse
    | ApplicationDeleteResponse
    | ApplicationGetDetailsResponse
    | ApplicationListResponse
    | ApplicationMarkupDetailsResponse
    | ApplicationMarkupStatisticsResponse
    | ApplicationRegisterResponse
    | ApplicationUpdateResponse
    | AssetIndexResponse
    | AuthorizeResponse
    | BalanceResponse
    | BuyContractForMultipleAccountsResponse
    | BuyContractResponse
    | CancelAContractResponse
    | CashierInformationResponse
    | ContractsForSymbolResponse
    | CopyTradingListResponse
    | CopyTradingStartResponse
    | CopyTradingStatisticsResponse
    | CopyTradingStopResponse
    | CountriesListResponse
    | CryptocurrencyConfigurationsResponse
    | DocumentUploadResponse
    | EconomicCalendarResponse
    | ExchangeRatesResponse
    | ForgetAllResponse
    | ForgetResponse
    | GetAccountSettingsResponse
    | GetFinancialAssessmentResponse
    | GetSelfExclusionResponse
    | IdentityVerificationAddDocumentResponse
    | LandingCompanyDetailsResponse
    | LandingCompanyResponse
    | LogOutResponse
    | LoginHistoryResponse
    | MT5AccountsListResponse
    | MT5DepositResponse
    | MT5GetSettingResponse
    | MT5NewAccountResponse
    | MT5PasswordChangeResponse
    | MT5PasswordCheckResponse
    | MT5PasswordResetResponse
    | MT5WithdrawalResponse
    | NewRealMoneyAccountDefaultLandingCompanyResponse
    | NewRealMoneyAccountDerivInvestmentEuropeLtdResponse
    | NewVirtualMoneyAccountResponse
    | OAuthApplicationsResponse
    | P2PAdvertCreateResponse
    | P2PAdvertInformationResponse
    | P2PAdvertListResponse
    | P2PAdvertUpdateResponse
    | P2PAdvertiserAdvertsResponse
    | P2PAdvertiserCreateResponse
    | P2PAdvertiserInformationResponse
    | P2PAdvertiserListResponse
    | P2PAdvertiserPaymentMethodsResponse
    | P2PAdvertiserRelationsResponse
    | P2PAdvertiserUpdateResponse
    | P2PChatCreateResponse
    | P2POrderCancelResponse
    | P2POrderConfirmResponse
    | P2POrderCreateResponse
    | P2POrderDisputeResponse
    | P2POrderInformationResponse
    | P2POrderListResponse
    | P2POrderReviewResponse
    | P2PPaymentMethodsResponse
    | P2PPingResponse
    | PaymentAgentCreateResponse
    | PaymentAgentDetailsResponse
    | PaymentAgentListResponse
    | PaymentAgentTransferResponse
    | PaymentAgentWithdrawJustificationResponse
    | PaymentAgentWithdrawResponse
    | PaymentMethodsResponse
    | PayoutCurrenciesResponse
    | PingResponse
    | PortfolioResponse
    | PriceProposalOpenContractsResponse
    | PriceProposalResponse
    | ProfitTableResponse
    | RealityCheckResponse
    | RevokeOauthApplicationResponse
    | SellContractResponse
    | SellContractsMultipleAccountsResponse
    | SellExpiredContractsResponse
    | ServerListResponse
    | ServerStatusResponse
    | ServerTimeResponse
    | SetAccountCurrencyResponse
    | SetAccountSettingsResponse
    | SetFinancialAssessmentResponse
    | SetSelfExclusionResponse
    | StatementResponse
    | StatesListResponse
    | TermsAndConditionsApprovalResponse
    | TicksHistoryResponse
    | TicksStreamResponse
    | TopUpVirtualMoneyAccountResponse
    | TradingDurationsResponse
    | TradingPlatformInvestorPasswordResetResponse
    | TradingPlatformPasswordResetResponse
    | TradingTimesResponse
    | TransactionsStreamResponse
    | TransferBetweenAccountsResponse
    | UnsubscribeEmailResponse
    | UpdateContractHistoryResponse
    | UpdateContractResponse
    | VerifyEmailResponse;

export interface Context {
    query: object;
    state: object;
    request: Request;
    response?: Response;
    req_id: number;
    socket: any;
}

export interface MockServer extends EventEmitter {
    close: () => void;
    url: string;
    add: (mock: (context: Context) => void) => void;
    remove: (mock: (context: Context) => void) => void;
}

type Options = {
    port?: number;
};

const pems = generate();

export async function createMockServer(
    state: object,
    query: object,
    mocks: Array<(context: Context) => void>,
    options?: Options
): Promise<MockServer> {
    const eventEmitter = new EventEmitter() as MockServer;

    const server = https.createServer({ key: pems.private, cert: pems.cert });
    await new Promise<void>(resolve => server.listen(options?.port ?? 0, resolve));
    const wss = new WsServer({ server });

    wss.on('connection', ws => {
        ws.on('message', async message => {
            const parsedMessage = JSON.parse(message.toString());
            const context: Context = {
                query,
                state,
                request: parsedMessage,
                req_id: parsedMessage.req_id,
                socket: ws,
            };

            mocks.flat().forEach(mock => mock(context));

            if (context.response) {
                ws.send(JSON.stringify(context.response));
            }

            if (!context.response) {
                /* eslint no-console: 0 */
                console.warn('mock websocket request was not handled for', context.request);
            }
        });
    });

    eventEmitter.close = () => {
        wss.close();
        server.close();
    };

    const address = server.address() as { port: number };
    eventEmitter.url = `localhost:${address.port}`;

    eventEmitter.add = mock => {
        mocks.push(mock);
    };

    eventEmitter.remove = mockToRemove => {
        const index = mocks.findIndex(mock => mock === mockToRemove);
        if (index !== -1) {
            mocks.splice(index, 1);
        }
    };

    return eventEmitter;
}

type SetupMocksOptions = {
    baseURL?: string;
    page: Page;
    state?: object;
    mocks: Array<(context: Context) => void>;
};

async function setupMocks({ baseURL, page, state, mocks }: SetupMocksOptions) {
    if (!baseURL) {
        throw new Error('baseURL is required');
    }

    const oauthLoginUrl = generateOauthLoginFromAccounts(baseURL, (state as { accounts: [] })?.accounts);
    const query = Object.fromEntries(oauthLoginUrl.searchParams);
    const mockServer = await createMockServer(state || {}, query, mocks);

    page.addListener('close', () => {
        mockServer.close();
    });
    await page.goto(baseURL, { waitUntil: 'commit' });

    await page.evaluate(server_url => {
        window.localStorage.setItem('config.server_url', server_url);
        window.localStorage.setItem(
            'FeatureFlagStore',
            `{"data":{"wallet":false,"sharkfin":false,"dtrader_v2":false}}`
        );
    }, mockServer.url);

    await page.goto(oauthLoginUrl.href);

    await expect
        .poll(
            async () => {
                return page.evaluate(() => {
                    return window.localStorage.getItem('active_loginid');
                });
            },
            { timeout: 30000 }
        )
        .not.toBeNull();

    return mockServer;
}

export default setupMocks;
