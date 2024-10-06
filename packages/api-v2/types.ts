import type {
    AccountLimitsRequest,
    AccountLimitsResponse,
    AccountListRequest,
    AccountListResponse,
    AccountStatusRequest,
    AccountStatusResponse,
    ActiveSymbolsRequest,
    ActiveSymbolsResponse,
    APITokenRequest,
    APITokenResponse,
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
    CryptocurrencyEstimationsRequest,
    CryptocurrencyEstimationsResponse,
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
    LoginHistoryRequest,
    LoginHistoryResponse,
    LogOutRequest,
    LogOutResponse,
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
    P2PAdvertListRequest,
    P2PAdvertListResponse,
    P2PAdvertUpdateRequest,
    P2PAdvertUpdateResponse,
    P2PChatCreateRequest,
    P2PChatCreateResponse,
    P2PCountryListRequest,
    P2PCountryListResponse,
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
    VerifyEmailCellxpertRequest,
    VerifyEmailCellxpertResponse,
    VerifyEmailRequest,
    VerifyEmailResponse,
} from '@deriv/api-types';
import type { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

/**
 * Proof of Identity (POI) and Proof of Address (POA) authentication status details.
 */
type KycAuthStatus = {
    /**
     * POA authentication status details.
     */
    address: {
        /**
         * Current POA status.
         */
        status?: 'none' | 'pending' | 'rejected' | 'verified' | 'expired';
        /**
         * Supported documents per document_type.
         */
        supported_documents?: string[];
    };
    /**
     * POI authentication status details.
     */
    identity: {
        /**
         * Available services for the next POI attempt.
         */
        available_services?: string[];
        /**
         * Details on the rejected POI attempt.
         */
        last_rejected?: {
            /**
             * Document type of the rejected POI attempt (IDV only).
             */
            document_type?: null | string;
            /**
             * Reason(s) for the rejected POI attempt.
             */
            rejected_reasons?: string[];
            /**
             * Indicate if the verification report was returned by the provider (IDV only).
             */
            report_available?: 0 | 1;
        };
        /**
         * Service used for the current POI status.
         */
        service?: 'none' | 'idv' | 'onfido' | 'manual';
        /**
         * Current POI status.
         */
        status?: 'none' | 'pending' | 'rejected' | 'verified' | 'expired' | 'suspected';
        /**
         * Supported documents per service.
         */
        supported_documents?: {
            idv?: {
                [k: string]: {
                    additional?: {
                        display_name?: string;
                        format?: string;
                        [k: string]: unknown;
                    };
                    display_name?: string;
                    format?: string;
                    [k: string]: unknown;
                };
            };
            onfido?: {
                [k: string]: {
                    display_name?: string;
                    [k: string]: unknown;
                };
            };
            [k: string]: unknown;
        };
    };
};

type TPrivateSocketEndpoints = {
    account_security: {
        request: {
            /**
             * Must be `1`
             */
            account_security: 1;
            /**
             * [Optional] OTP (one-time passcode) generated by a 2FA application like Authy, Google Authenticator or Yubikey.
             */
            otp?: string;
            /**
             * [Optional] Action to be taken for managing TOTP (time-based one-time password, RFC6238). Generate will create a secret key which is then returned in the secret_key response field, you can then enable by using that code in a 2FA application.
             */
            totp_action?: 'status' | 'enable' | 'disable' | 'generate';
            /**
             * [Optional] The login id of the user. If left unspecified, it defaults to the initial authorized token's login id.
             */
            loginid?: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            /**
             * The information of 2-Factor authentication.
             */
            account_security?: {
                /**
                 * TOTP information.
                 */
                totp: {
                    /**
                     * Determines whether the 2-Factor authentication is enabled.
                     */
                    is_enabled: 0 | 1;
                    /**
                     * The secret key for the 2-Factor authentication.
                     */
                    secret_key: string;
                };
            };
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'account_security';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
    available_accounts: {
        request: {
            /**
             * Must be `1`
             */
            available_accounts: 1;
            /**
             * List of account categories that needs to received.
             */
            categories: 'wallet'[];
            /**
             * [Optional] The login id of the user. If left unspecified, it defaults to the initial authorized token's login id.
             */
            loginid?: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            available_accounts?: {
                /**
                 * Wallet account types that are available to be created
                 */
                wallets: {
                    /**
                     * Account type of wallet
                     */
                    account_type: 'doughflow' | 'crypto' | 'paymentagent' | 'paymentagent_client' | 'p2p';
                    /**
                     * Currency of wallet
                     */
                    currency: string;
                    /**
                     * Landing Company of wallet.
                     */
                    landing_company: string;
                }[];
            };
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'available_accounts';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
    wallet_migration: {
        request: {
            /**
             * Must be `state`, `start` or `reset`
             */
            wallet_migration: 'state' | 'start' | 'reset';
        };
        response: {
            wallet_migration: {
                /**
                 * State of wallet migration.
                 */
                state: 'ineligible' | 'eligible' | 'in_progress' | 'migrated' | 'failed';
            };
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'wallet_migration';
        };
    };
    cashier_payments: {
        request: {
            /**
             * Must be `1`
             */
            cashier_payments: 1;
            /**
             * [Optional] Cashier provider. `crypto` will be default option for crypto currency accounts.
             */
            provider?: 'crypto';
            /**
             * [Optional] If set to 1, will send updates whenever there is update to crypto payments.
             */
            subscribe?: 0 | 1;
            /**
             * [Optional] Type of transactions to receive.
             */
            transaction_type?: 'all' | 'deposit' | 'withdrawal';
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            cashier_payments?: {
                /**
                 * Response for provider `crypto'.
                 */
                crypto: {
                    /**
                     * The destination crypto address.
                     */
                    address_hash: string;
                    /**
                     * The URL of the address on blockchain.
                     */
                    address_url: string;
                    /**
                     * [Optional] The transaction amount. Not present when deposit transaction still unconfirmed.
                     */
                    amount?: number;
                    /**
                     * [Optional] The number of confirmations for pending deposits or withdrawals.
                     */
                    confirmations?: number;
                    /**
                     * The unique identifier for the transaction.
                     */
                    id: string;
                    /**
                     * [Optional] Boolean value: 1 or 0, indicating whether the transaction can be cancelled. Only applicable for `withdrawal` transactions.
                     */
                    is_valid_to_cancel?: 1 | 0;
                    /**
                     * The status code of the transaction.
                     * Possible values for **deposit:** `PENDING|CONFIRMED|ERROR`,
                     * possible values for **withdrawal:** `LOCKED|VERIFIED|REJECTED|PERFORMING_BLOCKCHAIN_TXN|PROCESSING|SENT|ERROR|CANCELLED|REVERTING|REVERTED`.
                     */
                    status_code:
                        | 'CANCELLED'
                        | 'CONFIRMED'
                        | 'ERROR'
                        | 'LOCKED'
                        | 'PENDING'
                        | 'PERFORMING_BLOCKCHAIN_TXN'
                        | 'PROCESSING'
                        | 'REJECTED'
                        | 'REVERTED'
                        | 'REVERTING'
                        | 'SENT'
                        | 'VERIFIED';
                    /**
                     * The status message of the transaction
                     */
                    status_message: string;
                    /**
                     * The epoch of the transaction date
                     */
                    submit_date: number;
                    /**
                     * [Optional] The transaction hash when available.
                     */
                    transaction_hash?: string;
                    /**
                     * The type of the transaction.
                     */
                    transaction_type: 'deposit' | 'withdrawal';
                    /**
                     * [Optional] The URL of the transaction on blockchain if `transaction_hash` is available.
                     */
                    transaction_url?: string;
                }[];
            };
            subscription?: {
                /**
                 * A per-connection unique identifier. Can be passed to the `forget` API call to unsubscribe.
                 */
                id: string;
            };
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'cashier_payments';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
    cashier_withdrawal_cancel: {
        request: {
            /**
             * Must be `1`
             */
            cashier_withdrawal_cancel: 1;
            /**
             * The unique identifier for the transaction.
             */
            id: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            cashier_withdrawal_cancel?: {
                /**
                 * The unique identifier for the transaction.
                 */
                id: string;
                /**
                 * The status code of the cancellation.
                 */
                status_code: 'CANCELLED';
            };
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'cashier_withdrawal_cancel';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
    get_account_types: {
        request: {
            /**
             * Must be `1`
             */
            get_account_types: 1;
            /**
             * [Optional] Set to landing company to get relevant account types. If not set, this defaults to current account landing company
             */
            company?: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            get_account_types?: {
                /**
                 * Trading account types that are available to create or link to
                 */
                trading: {
                    /**
                     * Details for trading account types
                     *
                     * This interface was referenced by `undefined`'s JSON-Schema definition
                     * via the `patternProperty` "^(binary|dxtrade|mt5|standard)$".
                     */
                    [k: string]: {
                        /**
                         * Wallet currencies allowed for this trading account
                         */
                        allowed_wallet_currencies: string[];
                        /**
                         * Can this trading account linked to another currency after opening
                         */
                        linkable_to_different_currency: 0 | 1;
                        /**
                         * Wallet types that this trading account can be linked to.
                         */
                        linkable_wallet_types: string[];
                    };
                };
                /**
                 * Wallet accounts types that are available to create or link to
                 */
                wallet: {
                    /**
                     * Details for wallets account types
                     *
                     * This interface was referenced by `undefined`'s JSON-Schema definition
                     * via the `patternProperty` "^(affiliate|crypto|doughflow|p2p|paymentagent|paymentagent_client|virtual)$".
                     */
                    [k: string]: {
                        /**
                         * Allowed currencies for creating accounts of this type; used or disallowed currencies are not listed.
                         */
                        currencies: string[];
                    };
                };
            };
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'get_account_types';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
    new_account_wallet: {
        request: {
            /**
             * Must be `1`
             */
            new_account_wallet: 1;
            /**
             * Show whether client has accepted risk disclaimer.
             */
            accept_risk?: 0 | 1;
            /**
             * [Optional] Purpose and reason for requesting the account opening.
             */
            account_opening_reason?: 'Speculative' | 'Income Earning' | 'Hedging';
            /**
             * To set the wallets type - only doughflow and crptyo wallets are allowed for initial phase, other types will be added later
             */
            account_type: 'doughflow' | 'crypto';
            /**
             * [Optional] Within 35 characters.
             */
            address_city?: string;
            /**
             * [Optional] Mailing address.
             */
            address_line_1?: string;
            /**
             * [Optional] Within 70 characters.
             */
            address_line_2?: string;
            /**
             * [Optional] Within 20 characters and may not contain '+'.
             */
            address_postcode?: string;
            /**
             * [Optional] Possible value receive from `states_list` call.
             */
            address_state?: string;
            /**
             * [Optional] Country of legal citizenship, 2-letter country code. Possible value receive from `residence_list` call.
             */
            citizen?: string;
            /**
             * [Optional] Indicates whether this is for a client requesting an account with professional status.
             */
            client_type?: 'professional' | 'retail';
            /**
             * To set currency of the account. List of supported currencies can be acquired with `payout_currencies` call.
             */
            currency: string;
            /**
             * [Optional] Date of birth format: `yyyy-mm-dd`.
             */
            date_of_birth?: string;
            /**
             * Required for maltainvest
             */
            financial_assessment?: {
                /**
                 * The anticipated account turnover.
                 */
                account_turnover?:
                    | 'Less than $25,000'
                    | '$25,000 - $50,000'
                    | '$50,001 - $100,000'
                    | '$100,001 - $500,000'
                    | 'Over $500,000';
                /**
                 * How much experience do you have in CFD trading?
                 */
                cfd_experience?: 'No experience' | 'Less than a year' | '1 - 2 years' | 'Over 3 years';
                /**
                 * How many CFD trades have you placed in the past 12 months?
                 */
                cfd_frequency?:
                    | 'No transactions in the past 12 months'
                    | '1 - 5 transactions in the past 12 months'
                    | '6 - 10 transactions in the past 12 months'
                    | '11 - 39 transactions in the past 12 months'
                    | '40 transactions or more in the past 12 months';
                /**
                 * In your understanding, CFD trading allows you to:
                 */
                cfd_trading_definition?:
                    | 'Purchase shares of a company or physical commodities.'
                    | 'Place a bet on the price movement.'
                    | 'Speculate on the price movement.'
                    | 'Make a long-term investment.';
                /**
                 * Level of Education.
                 */
                education_level?: 'Primary' | 'Secondary' | 'Tertiary';
                /**
                 * Industry of Employment.
                 */
                employment_industry?:
                    | 'Construction'
                    | 'Education'
                    | 'Finance'
                    | 'Health'
                    | 'Tourism'
                    | 'Information & Communications Technology'
                    | 'Science & Engineering'
                    | 'Legal'
                    | 'Social & Cultural'
                    | 'Agriculture'
                    | 'Real Estate'
                    | 'Food Services'
                    | 'Manufacturing'
                    | 'Unemployed';
                /**
                 * Employment Status.
                 */
                employment_status?: 'Employed' | 'Pensioner' | 'Self-Employed' | 'Student' | 'Unemployed';
                /**
                 * Estimated Net Worth.
                 */
                estimated_worth?:
                    | 'Less than $100,000'
                    | '$100,000 - $250,000'
                    | '$250,001 - $500,000'
                    | '$500,001 - $1,000,000'
                    | 'Over $1,000,000';
                /**
                 * Income Source.
                 */
                income_source?:
                    | 'Salaried Employee'
                    | 'Self-Employed'
                    | 'Investments & Dividends'
                    | 'Pension'
                    | 'State Benefits'
                    | 'Savings & Inheritance';
                /**
                 * How does leverage affect CFD trading?
                 */
                leverage_impact_trading?:
                    | 'Leverage is a risk mitigation technique.'
                    | 'Leverage prevents you from opening large positions.'
                    | 'Leverage guarantees profits.'
                    | "Leverage lets you open larger positions for a fraction of the trade's value.";
                /**
                 * Leverage trading is high-risk, so it's a good idea to use risk management features such as stop loss. Stop loss allows you to
                 */
                leverage_trading_high_risk_stop_loss?:
                    | 'Cancel your trade at any time within a chosen timeframe.'
                    | 'Close your trade automatically when the loss is more than or equal to a specific amount.'
                    | 'Close your trade automatically when the profit is more than or equal to a specific amount.'
                    | 'Make a guaranteed profit on your trade.';
                /**
                 * Net Annual Income.
                 */
                net_income?:
                    | 'Less than $25,000'
                    | '$25,000 - $50,000'
                    | '$50,001 - $100,000'
                    | '$100,001 - $500,000'
                    | 'Over $500,000';
                /**
                 * Occupation.
                 */
                occupation?:
                    | 'Chief Executives, Senior Officials and Legislators'
                    | 'Managers'
                    | 'Professionals'
                    | 'Clerks'
                    | 'Personal Care, Sales and Service Workers'
                    | 'Agricultural, Forestry and Fishery Workers'
                    | 'Craft, Metal, Electrical and Electronics Workers'
                    | 'Plant and Machine Operators and Assemblers'
                    | 'Cleaners and Helpers'
                    | 'Mining, Construction, Manufacturing and Transport Workers'
                    | 'Armed Forces'
                    | 'Government Officers'
                    | 'Students'
                    | 'Unemployed';
                /**
                 * When would you be required to pay an initial margin?
                 */
                required_initial_margin?:
                    | 'When opening a Leveraged CFD trade.'
                    | 'When trading Multipliers.'
                    | 'When buying shares of a company.'
                    | 'All of the above.';
                /**
                 * Do you understand that you could potentially lose 100% of the money you use to trade?
                 */
                risk_tolerance?: 'Yes' | 'No';
                /**
                 * How much knowledge and experience do you have in relation to online trading?
                 */
                source_of_experience?:
                    | 'I have an academic degree, professional certification, and/or work experience.'
                    | 'I trade forex CFDs and other complex financial instruments.'
                    | 'I have attended seminars, training, and/or workshops.'
                    | 'I have little experience.'
                    | 'I have no knowledge.';
                /**
                 * [Optional] Source of wealth.
                 */
                source_of_wealth?:
                    | 'Accumulation of Income/Savings'
                    | 'Cash Business'
                    | 'Company Ownership'
                    | 'Divorce Settlement'
                    | 'Inheritance'
                    | 'Investment Income'
                    | 'Sale of Property';
                /**
                 * How much experience do you have with other financial instruments?
                 */
                trading_experience_financial_instruments?:
                    | 'No experience'
                    | 'Less than a year'
                    | '1 - 2 years'
                    | 'Over 3 years';
                /**
                 * How many trades have you placed with other financial instruments in the past 12 months?
                 */
                trading_frequency_financial_instruments?:
                    | 'No transactions in the past 12 months'
                    | '1 - 5 transactions in the past 12 months'
                    | '6 - 10 transactions in the past 12 months'
                    | '11 - 39 transactions in the past 12 months'
                    | '40 transactions or more in the past 12 months';
            };
            /**
             * [Optional] Within 2-50 characters, use only letters, spaces, hyphens, full-stops or apostrophes.
             */
            first_name?: string;
            /**
             * [Optional] Set the landing company of the wallet. Default value is 'svg' if company not provided
             */
            landing_company_short?: 'maltainvest' | 'svg';
            /**
             * [Optional] Within 2-50 characters, use only letters, spaces, hyphens, full-stops or apostrophes.
             */
            last_name?: string;
            /**
             * [Optional] Indicates client's self-declaration of not being a PEP/RCA (Politically Exposed Person/Relatives and Close Associates).
             */
            non_pep_declaration?: number;
            /**
             * [Optional] Starting with `+` followed by 8-35 digits, allowing hyphens or space.
             */
            phone?: string;
            /**
             * Accept any value in enum list.
             */
            salutation?: 'Mr' | 'Ms' | 'Miss' | 'Mrs';
            /**
             * Tax identification number. Only applicable for real money account. Required for `maltainvest` landing company.
             */
            tax_identification_number?: string;
            /**
             * Residence for tax purpose. Comma separated iso country code if multiple jurisdictions. Only applicable for real money account. Required for `maltainvest` landing company.
             */
            tax_residence?: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            new_account_wallet?: {
                /**
                 * Client ID of new real money account
                 */
                client_id: string;
                /**
                 * Currency of an account
                 */
                currency?: string;
                /**
                 * Landing company full name
                 */
                landing_company: string;
                /**
                 * Landing company shortcode
                 */
                landing_company_short?: string;
                /**
                 * Landing company shortcode
                 */
                landing_company_shortcode?: string;
                /**
                 * OAuth token for client's login session
                 */
                oauth_token: string;
            };
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'new_account_wallet';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
    p2p_settings: {
        request: {
            /**
             * Must be `1`
             */
            p2p_settings: 1;
            /**
             * [Optional] If set to `1`, will send updates whenever there is an update to P2P settings.
             */
            subscribe?: 1;
            /**
             * [Optional] The login id of the user. If left unspecified, it defaults to the initial authorized token's login id.
             */
            loginid?: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            p2p_settings?: {
                /**
                 * Maximum number of active ads allowed by an advertiser per currency pair and advert type (buy or sell).
                 */
                adverts_active_limit: number;
                /**
                 * Adverts will be deactivated if no activity occurs within this period, in days.
                 */
                adverts_archive_period?: number;
                /**
                 * Block trading settings
                 */
                block_trade: {
                    /**
                     * When 1, Block trading is unavailable.
                     */
                    disabled?: 0 | 1;
                    /**
                     * Maximum amount of a block trade advert, in USD.
                     */
                    maximum_advert_amount?: number;
                };
                /**
                 * A buyer will be blocked for this duration after exceeding the cancellation limit, in hours.
                 */
                cancellation_block_duration: number;
                /**
                 * The period within which to count buyer cancellations, in hours.
                 */
                cancellation_count_period: number;
                /**
                 * A buyer may cancel an order within this period without negative consequences, in minutes after order creation.
                 */
                cancellation_grace_period: number;
                /**
                 * A buyer will be temporarily barred after marking this number of cancellations within cancellation_period.
                 */
                cancellation_limit: number;
                /**
                 * When 0, only exchanges in local currency are allowed for P2P advertiser.
                 */
                cross_border_ads_enabled: 0 | 1;
                /**
                 * When 1, the P2P service is unavailable.
                 */
                disabled: 0 | 1;
                /**
                 * Indicates the availbility of certain backend features.
                 */
                feature_level: number;
                /**
                 * Availability of fixed rate adverts.
                 */
                fixed_rate_adverts: 'disabled' | 'enabled' | 'list_only';
                /**
                 * Date on which fixed rate adverts will be deactivated.
                 */
                fixed_rate_adverts_end_date?: string;
                /**
                 * Availability of floating rate adverts.
                 */
                float_rate_adverts: 'disabled' | 'enabled' | 'list_only';
                /**
                 * Maximum rate offset for floating rate adverts.
                 */
                float_rate_offset_limit: number;
                /**
                 * Available local currencies for p2p_advert_list request.
                 */
                local_currencies: {
                    /**
                     * Local currency name
                     */
                    display_name: string;
                    /**
                     * Indicates that there are adverts available for this currency.
                     */
                    has_adverts: 0 | 1;
                    /**
                     * Indicates that this is local currency for the current country.
                     */
                    is_default?: 1;
                    /**
                     * Local currency symbol
                     */
                    symbol: string;
                }[];
                /**
                 * Maximum amount of an advert, in USD.
                 */
                maximum_advert_amount: number;
                /**
                 * Maximum amount of an order, in USD.
                 */
                maximum_order_amount: number;
                /**
                 * Maximum number of orders a user may create per day.
                 */
                order_daily_limit: number;
                /**
                 * Time allowed for order payment, in minutes after order creation.
                 */
                order_payment_period: number;
                /**
                 * Local P2P exchange rate which should be used instead of those obtained from the `exchange_rates` call.
                 */
                override_exchange_rate?: string;
                /**
                 * Indicates if the payment methods feature is enabled.
                 */
                payment_methods_enabled: 0 | 1;
                /**
                 * Time after successful order completion during which reviews can be created, in hours.
                 */
                review_period: number;
                /**
                 * List of currencies for which P2P is available
                 */
                supported_currencies: string[];
            };
        };
    };
    service_token: {
        request: {
            /**
             * Must be `1`
             */
            service_token: 1;
            /**
             * [Optional] The 2-letter country code.
             */
            country?: string;
            /**
             * [Optional] The URL of the web page where the Web SDK will be used.
             */
            referrer?: string;
            /**
             * Server (dxtrade).
             */
            server?: 'demo' | 'real';
            /**
             * The service(s) to retrieve token(s) for.
             */
            service:
                | ('onfido' | 'sendbird' | 'banxa' | 'wyre' | 'dxtrade' | 'ctrader')
                | ('onfido' | 'sendbird' | 'banxa' | 'wyre')[];
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            /**
             * Service specific tokens and data.
             */
            service_token?: {
                /**
                 * Banxa order data.
                 */
                banxa?: {
                    /**
                     * Created order id reference token.
                     */
                    token?: string;
                    /**
                     * Banxa order checkout url.
                     */
                    url?: string;
                    /**
                     * Banxa order checkout iframe url.
                     */
                    url_iframe?: string;
                };
                /**
                 * CTrader data.
                 */
                ctrader?: {
                    /**
                     * CTrader One Time token
                     */
                    token?: string;
                };
                /**
                 * Deriv X data.
                 */
                dxtrade?: {
                    /**
                     * Deriv X login token.
                     */
                    token?: string;
                };
                /**
                 * Onfido data.
                 */
                onfido?: {
                    /**
                     * Onfido token.
                     */
                    token?: string;
                };
                /**
                 * Sendbird data.
                 */
                sendbird?: {
                    /**
                     * Sendbird application ID.
                     */
                    app_id?: string;
                    /**
                     * The epoch time in which the token will be expired. Note: the token could be expired sooner than this, due to different reasons.
                     */
                    expiry_time?: number;
                    /**
                     * Sendbird token.
                     */
                    token?: string;
                };
                /**
                 * Wyre reservation data.
                 */
                wyre?: {
                    /**
                     * Wyre reservation id token
                     */
                    token?: string;
                    /**
                     * Wyre reservation URL
                     */
                    url?: string;
                };
            };
        };
        /**
         * Echo of the request made.
         */
        echo_req: {
            [k: string]: unknown;
        };
        /**
         * Action name of the request made.
         */
        msg_type: 'service_token';
        /**
         * Optional field sent in request to map to response, present only when request contains `req_id`.
         */
        req_id?: number;
        [k: string]: unknown;
    };
    trading_platform_investor_password_reset: {
        request: {
            /**
             * Must be `1`
             */
            trading_platform_investor_password_reset: 1;
            /**
             * Trading account ID.
             */
            account_id: string;
            /**
             * New password of the account. For validation (Accepts any printable ASCII character. Must be within 8-25 characters, and include numbers, lowercase and uppercase letters. Must not be the same as the user's email address).
             */
            new_password: string;
            /**
             * Name of trading platform.
             */
            platform: 'mt5';
            /**
             * Email verification code (received from a `verify_email` call, which must be done first)
             */
            verification_code: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            trading_platform_investor_password_reset?: 0 | 1;
        };
        /**
         * Echo of the request made.
         */
        echo_req: {
            [k: string]: unknown;
        };
        /**
         * Action name of the request made.
         */
        msg_type: 'trading_platform_investor_password_reset';
        /**
         * Optional field sent in request to map to response, present only when request contains `req_id`.
         */
        req_id?: number;
        [k: string]: unknown;
    };
    trading_platform_leverage: {
        request: {
            /**
             * Must be `1`
             */
            trading_platform_leverage: 1;
            /**
             * Name of trading platform.
             */
            platform: 'mt5' | 'dxtrade' | 'ctrader';
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            /**
             * dynamic leverage data.
             */
            trading_platform_leverage: {
                leverage: {
                    [x in 'stock_indices' | 'forex' | 'metals' | 'cryptocurrencies']: {
                        display_name: string;
                        instruments: string[];
                        min: number;
                        max: number;
                        volume: {
                            unit: string;
                            data: {
                                from: number;
                                to: number;
                                leverage: number;
                            }[];
                        };
                    };
                };
            };
        };
        /**
         * Echo of the request made.
         */
        echo_req: {
            [k: string]: unknown;
        };
        /**
         * Action name of the request made.
         */
        msg_type: 'trading_platform_leverage';
        /**
         * Optional field sent in request to map to response, present only when request contains `req_id`.
         */
        req_id?: number;
        [k: string]: unknown;
    };
    trading_platform_password_change: {
        request: {
            /**
             * Must be `1`
             */
            trading_platform_password_change: 1;
            /**
             * New trading password. Accepts any printable ASCII character. Must be within 8-25 characters, and include numbers, lowercase and uppercase letters. Must not be the same as the user's email address.
             */
            new_password: string;
            /**
             * Old password for validation. Must be empty if a password has not been set yet.
             */
            old_password?: string;
            /**
             * Name of trading platform.
             */
            platform: 'dxtrade' | 'mt5';
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            trading_platform_password_change?: 0 | 1;
        };
        /**
         * Echo of the request made.
         */
        echo_req: {
            [k: string]: unknown;
        };
        /**
         * Action name of the request made.
         */
        msg_type: 'trading_platform_password_change';
        /**
         * Optional field sent in request to map to response, present only when request contains `req_id`.
         */
        req_id?: number;
        [k: string]: unknown;
    };
    trading_platform_new_account: {
        request: {
            /**
             * Must be `1`
             */
            trading_platform_new_account: 1;
            /**
             * Account type.
             */
            account_type: 'demo' | 'real';
            /**
             * [Optional]
             */
            company?: string;
            /**
             * [Optional] Trading account currency, the default value will be the qualified account currency.
             */
            currency?: string;
            /**
             * [Optional] If set to 1, only validation is performed.
             */
            dry_run?: 0 | 1;
            /**
             * Market type
             */
            market_type: 'financial' | 'synthetic' | 'all';
            /**
             * The master password of the account. For validation (Accepts any printable ASCII character. Must be within 8-25 characters, and include numbers, lowercase and uppercase letters. Must not be the same as the user's email address). Only for DXTrade.
             */
            password?: string;
            /**
             * Name of trading platform.
             */
            platform: 'dxtrade' | 'ctrader';
            /**
             * [Optional] Sub account type.
             */
            sub_account_type?: 'financial' | 'financial_stp' | 'swap_free';
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            trading_platform_new_account: {
                /**
                 * ID of Trading account.
                 */
                account_id?: string;
                /**
                 * Account type.
                 */
                account_type?: 'demo' | 'real' | 'all';
                /**
                 * Agent Details.
                 */
                agent?: null | string;
                /**
                 * Balance of the Trading account.
                 */
                balance?: number;
                /**
                 * Currency of the Trading account.
                 */
                currency?: string;
                /**
                 * Account balance, formatted to appropriate decimal places.
                 */
                display_balance?: string;
                /**
                 * Account enabled status
                 */
                enabled?: number;
                /**
                 * Landing company shortcode of the Trading account.
                 */
                landing_company_short?: 'bvi' | 'labuan' | 'malta' | 'maltainvest' | 'svg' | 'vanuatu' | 'seychelles';
                /**
                 * Login name used to log in into Trading platform.
                 */
                login?: string;
                /**
                 * Market type.
                 */
                market_type?: 'financial' | 'synthetic' | 'all';
                /**
                 * Name of trading platform.
                 */
                platform?: 'dxtrade' | 'ctrader';
                /**
                 * Sub account type.
                 */
                sub_account_type?: 'financial' | 'financial_stp' | 'swap_free';
            };
        };
        /**
         * Echo of the request made.
         */
        echo_req: {
            [k: string]: unknown;
        };
        /**
         * Action name of the request made.
         */
        msg_type: 'trading_platform_new_account';
        /**
         * Optional field sent in request to map to response, present only when request contains `req_id`.
         */
        req_id?: number;
        [k: string]: unknown;
    };
    trading_platform_available_accounts: {
        request: {
            /**
             * Must be `1`
             */
            trading_platform_available_accounts: 1;
            /**
             * Name of trading platform.
             */
            platform: 'mt5' | 'ctrader';
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            /**
             * Available Trading Accounts
             */
            trading_platform_available_accounts?:
                | {
                      /**
                       * A list of Deriv landing companies that can work with this account type
                       */
                      linkable_landing_companies?: ('svg' | 'maltainvest')[];
                      /**
                       * The type of market tradable by this account
                       */
                      market_type?: 'financial' | 'gaming' | 'all';
                      /**
                       * Landing Company legal name
                       */
                      name?: string;
                      /**
                       * This needs to be removed after updating api-types version
                       */
                      product?: 'zero_spread' | 'swap_free' | 'standard' | 'financial';
                      /**
                       * Legal requirements for the Landing Company
                       */
                      requirements?: {
                          /**
                           * After first deposit requirements
                           */
                          after_first_deposit?: {
                              /**
                               * Financial assessment requirements
                               */
                              financial_assessment?: string[];
                          };
                          /**
                           * Compliance requirements
                           */
                          compliance?: {
                              /**
                               * Compliance MT5 requirements
                               */
                              mt5?: string[];
                              /**
                               * Compliance tax information requirements
                               */
                              tax_information?: string[];
                          };
                          /**
                           * Sign up requirements
                           */
                          signup?: string[];
                          /**
                           * Withdrawal requirements
                           */
                          withdrawal?: string[];
                      };
                      /**
                       * Landing Company short code
                       */
                      shortcode?: string;
                      /**
                       * Sub account type
                       */
                      sub_account_type?: 'standard' | 'swap_free' | 'stp';
                  }[]
                | null;
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'trading_platform_available_accounts';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
    trading_platform_accounts: {
        request: {
            /**
             * Must be `1`
             */
            trading_platform_accounts: 1;
            /**
             * Trading platform name
             */
            platform: 'dxtrade' | 'mt5' | 'ctrader';
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            /**
             * Array containing Trading account objects.
             */
            trading_platform_accounts?: {
                /**
                 * ID of Trading account.
                 */
                account_id?: string;
                /**
                 * Account type.
                 */
                account_type?: 'demo' | 'real';
                /**
                 * Balance of the Trading account.
                 */
                balance?: null | number;
                /**
                 * Residence of the MT5 account.
                 */
                country?: string;
                /**
                 * Currency of the Trading account.
                 */
                currency?: string;
                /**
                 * Account balance, formatted to appropriate decimal places.
                 */
                display_balance?: null | string;
                /**
                 * Email address of the MT5 account.
                 */
                email?: string;
                /**
                 * Account enabled status
                 */
                enabled?: number;
                /**
                 * Error in MT5 account details.
                 */
                error?: {
                    /**
                     * Error code string.
                     */
                    code?: string;
                    /**
                     * Extra information about the error.
                     */
                    details?: {
                        /**
                         * MT5 account type.
                         */
                        account_type?: string;
                        /**
                         * MT5 account login ID.
                         */
                        login?: string;
                        /**
                         * Trade server name of the MT5 account.
                         */
                        server?: string;
                        /**
                         * Trade server information.
                         */
                        server_info?: {
                            /**
                             * The environment. E.g. Deriv-Server.
                             */
                            environment?: 'Deriv-Demo' | 'Deriv-Server' | 'Deriv-Server-02';
                            /**
                             * Geographical location of the server.
                             */
                            geolocation?: {
                                /**
                                 * Internal server grouping.
                                 */
                                group?: string;
                                /**
                                 * Sever location.
                                 */
                                location?: string;
                                /**
                                 * Sever region.
                                 */
                                region?: string;
                                /**
                                 * Sever sequence.
                                 */
                                sequence?: number;
                            };
                            /**
                             * Server id.
                             */
                            id?: string;
                        };
                    };
                    /**
                     * Error message.
                     */
                    message_to_client?: string;
                };
                /**
                 * Group type of the MT5 account, e.g. `demo\svg_financial`
                 */
                group?: string;
                /**
                 * Landing company shortcode of the Trading account.
                 */
                landing_company_short?: 'bvi' | 'labuan' | 'malta' | 'maltainvest' | 'svg' | 'vanuatu' | 'seychelles';
                /**
                 * Leverage of the MT5 account (1 to 1000).
                 */
                leverage?: number;
                /**
                 * Login name used to log in into Trading platform
                 */
                login?: string;
                /**
                 * Market type
                 */
                market_type?: 'financial' | 'synthetic' | 'all';
                /**
                 * Name of the owner of the MT5 account.
                 */
                name?: string;
                /**
                 * Name of trading platform.
                 */
                platform?: 'dxtrade' | 'mt5' | 'ctrader';
                /**
                 * Trade server name of the MT5 account.
                 */
                server?: string;
                /**
                 * Trade server information.
                 */
                server_info?: {
                    /**
                     * The environment. E.g. Deriv-Server.
                     */
                    environment?: 'Deriv-Demo' | 'Deriv-Server' | 'Deriv-Server-02';
                    /**
                     * Geographical location of the server.
                     */
                    geolocation?: {
                        /**
                         * Internal server grouping.
                         */
                        group?: string;
                        /**
                         * Sever location.
                         */
                        location?: string;
                        /**
                         * Sever region.
                         */
                        region?: string;
                        /**
                         * Sever sequence.
                         */
                        sequence?: number;
                    };
                    /**
                     * Server id.
                     */
                    id?: string;
                };
                /**
                 * Sub account type
                 */
                sub_account_type?: 'financial' | 'financial_stp';
            }[];
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'trading_platform_accounts';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
    account_closure: {
        request: {
            /**
             * Must be `1`
             */
            account_closure: 1;
            /**
             * Reason for closing off accounts.
             */
            reason: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            /**
             * If set to `1`, all accounts are closed.
             */
            account_closure?: 0 | 1;
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'account_closure';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
    trading_platform_investor_password_change: {
        request: {
            /**
             * Must be `1`
             */
            trading_platform_investor_password_change: 1;
            /**
             * Trading account ID.
             */
            account_id: string;
            /**
             * New investor password. Accepts any printable ASCII character. Must be within 8-25 characters, and include numbers, lowercase and uppercase letters. Must not be the same as the user's email address.
             */
            new_password: string;
            /**
             * Old investor password for validation (non-empty string, accepts any printable ASCII character)
             */
            old_password: string;
            /**
             * Name of trading platform.
             */
            platform: 'mt5';
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            trading_platform_password_change?: 0 | 1;
        };
        /**
         * Echo of the request made.
         */
        echo_req: {
            [k: string]: unknown;
        };
        /**
         * Action name of the request made.
         */
        msg_type: 'trading_platform_investor_password_change';
        /**
         * Optional field sent in request to map to response, present only when request contains `req_id`.
         */
        req_id?: number;
        [k: string]: unknown;
    };
    notification_event: {
        request: {
            /**
             * Must be `1`
             */
            notification_event: 1;
            /**
             * Event arguments.
             */
            args?: {
                /**
                 * (Optional- for `poi_documents_uploaded` only) An array of onfido document ids intended to be included in the poi check.
                 */
                documents?: string[];
            };
            /**
             * The category or nature of the event.
             */
            category: 'authentication';
            /**
             * The name of the event.
             */
            event: 'poi_documents_uploaded';
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
            [k: string]: unknown;
        };
        response: {
            /**
             * `1`: all actions finished successfully, `0`: at least one or more actions failed.
             */
            notification_event: 0 | 1;
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'notification_event';
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
    };
    trading_platform_deposit: {
        request: {
            /**
             * Must be `1`
             */
            trading_platform_deposit: 1;
            /**
             * Amount to deposit (in the currency of from_wallet).
             */
            amount?: number;
            /**
             * Wallet account to transfer money from.
             */
            from_account?: string;
            /**
             * Name of trading platform.
             */
            platform: 'dxtrade' | 'derivez' | 'ctrader';
            /**
             * Trading account login to deposit money to.
             */
            to_account: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            trading_platform_deposit?:
                | {
                      /**
                       * The reference number for the related deposit to the trading account
                       */
                      transaction_id?: number;
                      [k: string]: unknown;
                  }
                | 1;
        };
        /**
         * Echo of the request made.
         */
        echo_req: {
            [k: string]: unknown;
        };
        /**
         * Action name of the request made.
         */
        msg_type: 'trading_platform_deposit';
        /**
         * Optional field sent in request to map to response, present only when request contains `req_id`.
         */
        req_id?: number;
        [k: string]: unknown;
    };
    mt5_deposit: {
        request: {
            /**
             * Must be `1`
             */
            mt5_deposit: 1;
            /**
             * Amount to deposit (in the currency of from_binary); min = $1 or an equivalent amount, max = $20000 or an equivalent amount
             */
            amount?: number;
            /**
             * Binary account loginid to transfer money from
             */
            from_binary?: string;
            /**
             * MT5 account login to deposit money to
             */
            to_mt5: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field. Maximum size is 3500 bytes.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            mt5_deposit?: number;
            /**
             * Withdrawal reference ID of Binary account
             */
            binary_transaction_id?: number;
        };
        /**
         * Echo of the request made.
         */
        echo_req: {
            [k: string]: unknown;
        };
        /**
         * Action name of the request made.
         */
        msg_type: 'mt5_deposit';
        /**
         * Optional field sent in request to map to response, present only when request contains `req_id`.
         */
        req_id?: number;
        [k: string]: unknown;
    };
    kyc_auth_status: {
        request: {
            /**
             * Must be `1`
             */
            kyc_auth_status: 1;
            /**
             * The country for which service availability is being verified, 2-letter country code
             */
            country?: string;
            /**
             * Indicates which landing companies to get the KYC authentication status for.
             */
            landing_companies?: (
                | 'iom'
                | 'malta'
                | 'maltainvest'
                | 'svg'
                | 'virtual'
                | 'vanuatu'
                | 'labuan'
                | 'samoa'
                | 'samoa-virtual'
                | 'bvi'
                | 'dsl'
            )[];
            /**
             * [Optional] The login id of the user. If left unspecified, it defaults to the initial authorized token's login id.
             */
            loginid?: string;
            /**
             * [Optional] Used to pass data through the websocket, which may be retrieved via the `echo_req` output field.
             */
            passthrough?: {
                [k: string]: unknown;
            };
            /**
             * [Optional] Used to map request to response.
             */
            req_id?: number;
        };
        response: {
            kyc_auth_status?: KycAuthStatus;
            /**
             * Echo of the request made.
             */
            echo_req: {
                [k: string]: unknown;
            };
            /**
             * Action name of the request made.
             */
            msg_type: 'kyc_auth_status';
            /**
             * Optional field sent in request to map to response, present only when request contains `req_id`.
             */
            req_id?: number;
            [k: string]: unknown;
        };
    };
};

// Need this because deriv-api-types is assigning the response of MT5LoginList to another type called DetailsOfEachMT5Loginid which is not updated automatically by BE
// Need to manualy update the type here after BE updates the response
type TWhiteLabelLinks = {
    white_label_links: {
        android: string;
        ios: string;
        webtrader_url: string;
        windows: string;
    };
};

type TExtendedMT5AccounListType = NonNullable<MT5AccountsListResponse['mt5_login_list']>[number] & {
    white_label_links: TWhiteLabelLinks['white_label_links'];
    /**
     * Product Type
     */
    product?: 'zero_spread' | 'swap_free' | 'standard' | 'financial';
};

type MT5AccountListResponse = {
    mt5_login_list?: TExtendedMT5AccounListType[];
};

type TExtendTransferAccount = NonNullable<TransferBetweenAccountsResponse['accounts']>[number] & {
    /**
     * Product Type
     */
    product?: 'zero_spread' | 'swap_free' | 'standard' | 'financial';
};

type TExtendTransferBetweenAccountsResponse = TransferBetweenAccountsResponse & {
    accounts?: TExtendTransferAccount[];
};

type TAccountList = NonNullable<AccountListResponse['account_list']>[number] & { excluded_until: Date };

type TradingPlatformStatusRequest = {
    trading_platform_status: 1;
};

type TradingPlatformStatusResponse = {
    trading_platform_status: {
        platform: Exclude<
            NonNullable<
                TSocketEndpoints['trading_platform_accounts']['response']['trading_platform_accounts']
            >[0]['platform'],
            undefined
        >;
        status: 'active' | 'maintenance' | 'unavailable';
    }[];
};

interface IExtendedAccountListResponse extends AccountListResponse {
    account_list?: TAccountList[];
}

type TSocketEndpoints = {
    active_symbols: {
        request: ActiveSymbolsRequest;
        response: ActiveSymbolsResponse;
    };
    account_list: {
        request: AccountListRequest;
        response: IExtendedAccountListResponse;
    };
    api_token: {
        request: APITokenRequest;
        response: APITokenResponse;
    };
    app_delete: {
        request: ApplicationDeleteRequest;
        response: ApplicationDeleteResponse;
    };
    app_get: {
        request: ApplicationGetDetailsRequest;
        response: ApplicationGetDetailsResponse;
    };
    app_list: {
        request: ApplicationListRequest;
        response: ApplicationListResponse;
    };
    app_markup_details: {
        request: ApplicationMarkupDetailsRequest;
        response: ApplicationMarkupDetailsResponse;
    };
    app_markup_statistics: {
        request: ApplicationMarkupStatisticsRequest;
        response: ApplicationMarkupStatisticsResponse;
    };
    app_register: {
        request: ApplicationRegisterRequest;
        response: ApplicationRegisterResponse;
    };
    app_update: {
        request: ApplicationUpdateRequest;
        response: ApplicationUpdateResponse;
    };
    asset_index: {
        request: AssetIndexRequest;
        response: AssetIndexResponse;
    };
    authorize: {
        request: AuthorizeRequest;
        response: AuthorizeResponse;
    };
    balance: {
        request: BalanceRequest;
        response: BalanceResponse;
    };
    buy_contract_for_multiple_accounts: {
        request: BuyContractForMultipleAccountsRequest;
        response: BuyContractForMultipleAccountsResponse;
    };
    buy: {
        request: BuyContractRequest;
        response: BuyContractResponse;
    };
    cancel: {
        request: CancelAContractRequest;
        response: CancelAContractResponse;
    };
    cashier: {
        request: CashierInformationRequest;
        response: CashierInformationResponse;
    };
    contract_update_history: {
        request: UpdateContractHistoryRequest;
        response: UpdateContractHistoryResponse;
    };
    contract_update: {
        request: UpdateContractRequest;
        response: UpdateContractResponse;
    };
    contracts_for: {
        request: ContractsForSymbolRequest;
        response: ContractsForSymbolResponse;
    };
    copy_start: {
        request: CopyTradingStartRequest;
        response: CopyTradingStartResponse;
    };
    copy_stop: {
        request: CopyTradingStopRequest;
        response: CopyTradingStopResponse;
    };
    copytrading_list: {
        request: CopyTradingListRequest;
        response: CopyTradingListResponse;
    };
    copytrading_statistics: {
        request: CopyTradingStatisticsRequest;
        response: CopyTradingStatisticsResponse;
    };
    crypto_config: {
        request: CryptocurrencyConfigurationsRequest;
        response: CryptocurrencyConfigurationsResponse;
    };
    crypto_estimations: {
        request: CryptocurrencyEstimationsRequest;
        response: CryptocurrencyEstimationsResponse;
    };
    document_upload: {
        request: DocumentUploadRequest;
        response: DocumentUploadResponse;
    };
    economic_calendar: {
        request: EconomicCalendarRequest;
        response: EconomicCalendarResponse;
    };
    exchange_rates: {
        request: ExchangeRatesRequest;
        response: ExchangeRatesResponse;
    };
    forget_all: {
        request: ForgetAllRequest;
        response: ForgetAllResponse;
    };
    forget: {
        request: ForgetRequest;
        response: ForgetResponse;
    };
    get_account_status: {
        request: AccountStatusRequest;
        response: AccountStatusResponse;
    };
    get_financial_assessment: {
        request: GetFinancialAssessmentRequest;
        response: GetFinancialAssessmentResponse;
    };
    get_limits: {
        request: AccountLimitsRequest;
        response: AccountLimitsResponse;
    };
    get_self_exclusion: {
        request: GetSelfExclusionRequest;
        response: GetSelfExclusionResponse;
    };
    get_settings: {
        request: GetAccountSettingsRequest;
        response: GetAccountSettingsResponse;
    };
    identity_verification_document_add: {
        request: IdentityVerificationAddDocumentRequest;
        response: IdentityVerificationAddDocumentResponse;
    };
    landing_company_details: {
        request: LandingCompanyDetailsRequest;
        response: LandingCompanyDetailsResponse;
    };
    landing_company: {
        // TODO: Fix typings of this endpoint, because landing_company payload should be a string instead of LandingCompany interface
        request: Omit<LandingCompanyRequest, 'landing_company'> & {
            /** Client's 2-letter country code (obtained from `residence_list` call). */
            landing_company: string;
        };
        response: LandingCompanyResponse;
    };
    login_history: {
        request: LoginHistoryRequest;
        response: LoginHistoryResponse;
    };
    logout: {
        request: LogOutRequest;
        response: LogOutResponse;
    };
    mt5_deposit: {
        request: MT5DepositRequest;
        response: MT5DepositResponse;
    };
    mt5_get_settings: {
        request: MT5GetSettingRequest;
        response: MT5GetSettingResponse;
    };
    mt5_login_list: {
        request: MT5AccountsListRequest;
        response: MT5AccountListResponse;
    };
    mt5_new_account: {
        request: MT5NewAccountRequest;
        response: MT5NewAccountResponse;
    };
    mt5_password_change: {
        request: MT5PasswordChangeRequest;
        response: MT5PasswordChangeResponse;
    };
    mt5_password_check: {
        request: MT5PasswordCheckRequest;
        response: MT5PasswordCheckResponse;
    };
    mt5_password_reset: {
        request: MT5PasswordResetRequest;
        response: MT5PasswordResetResponse;
    };
    mt5_withdrawal: {
        request: MT5WithdrawalRequest;
        response: MT5WithdrawalResponse;
    };
    new_account_maltainvest: {
        request: NewRealMoneyAccountDerivInvestmentEuropeLtdRequest;
        response: NewRealMoneyAccountDerivInvestmentEuropeLtdResponse;
    };
    new_account_real: {
        request: NewRealMoneyAccountDefaultLandingCompanyRequest;
        response: NewRealMoneyAccountDefaultLandingCompanyResponse;
    };
    new_account_virtual: {
        request: NewVirtualMoneyAccountRequest;
        response: NewVirtualMoneyAccountResponse;
    };
    oauth_apps: {
        request: OAuthApplicationsRequest;
        response: OAuthApplicationsResponse;
    };
    p2p_advert_create: {
        request: P2PAdvertCreateRequest;
        response: P2PAdvertCreateResponse;
    };
    p2p_advert_info: {
        request: P2PAdvertInformationRequest;
        response: P2PAdvertInformationResponse;
    };
    p2p_advert_list: {
        request: P2PAdvertListRequest;
        response: P2PAdvertListResponse;
    };
    p2p_advert_update: {
        request: P2PAdvertUpdateRequest;
        response: P2PAdvertUpdateResponse;
    };
    p2p_advertiser_adverts: {
        request: P2PAdvertiserAdvertsRequest;
        response: P2PAdvertiserAdvertsResponse;
    };
    p2p_advertiser_create: {
        request: P2PAdvertiserCreateRequest;
        response: P2PAdvertiserCreateResponse;
    };
    p2p_advertiser_info: {
        request: P2PAdvertiserInformationRequest;
        response: P2PAdvertiserInformationResponse;
    };
    p2p_advertiser_list: {
        request: P2PAdvertiserListRequest;
        response: P2PAdvertiserListResponse;
    };
    p2p_advertiser_payment_methods: {
        request: P2PAdvertiserPaymentMethodsRequest;
        response: P2PAdvertiserPaymentMethodsResponse;
    };
    p2p_advertiser_relations: {
        request: P2PAdvertiserRelationsRequest;
        response: P2PAdvertiserRelationsResponse;
    };
    p2p_advertiser_update: {
        request: P2PAdvertiserUpdateRequest;
        response: P2PAdvertiserUpdateResponse;
    };
    p2p_chat_create: {
        request: P2PChatCreateRequest;
        response: P2PChatCreateResponse;
    };
    p2p_country_list: {
        request: P2PCountryListRequest;
        response: P2PCountryListResponse;
    };
    p2p_order_cancel: {
        request: P2POrderCancelRequest;
        response: P2POrderCancelResponse;
    };
    p2p_order_confirm: {
        request: P2POrderConfirmRequest;
        response: P2POrderConfirmResponse;
    };
    p2p_order_create: {
        request: P2POrderCreateRequest;
        response: P2POrderCreateResponse;
    };
    p2p_order_dispute: {
        request: P2POrderDisputeRequest;
        response: P2POrderDisputeResponse;
    };
    p2p_order_info: {
        request: P2POrderInformationRequest;
        response: P2POrderInformationResponse;
    };
    p2p_order_list: {
        request: P2POrderListRequest;
        response: P2POrderListResponse;
    };
    p2p_order_review: {
        request: P2POrderReviewRequest;
        response: P2POrderReviewResponse;
    };
    p2p_payment_methods: {
        request: P2PPaymentMethodsRequest;
        response: P2PPaymentMethodsResponse;
    };
    p2p_ping: {
        request: P2PPingRequest;
        response: P2PPingResponse;
    };
    payment_methods: {
        request: PaymentMethodsRequest;
        response: PaymentMethodsResponse;
    };
    paymentagent_create: {
        request: PaymentAgentCreateRequest;
        response: PaymentAgentCreateResponse;
    };
    paymentagent_details: {
        request: PaymentAgentDetailsRequest;
        response: PaymentAgentDetailsResponse;
    };
    paymentagent_list: {
        request: PaymentAgentListRequest;
        response: PaymentAgentListResponse;
    };
    paymentagent_transfer: {
        request: PaymentAgentTransferRequest;
        response: PaymentAgentTransferResponse;
    };
    paymentagent_withdraw: {
        request: PaymentAgentWithdrawRequest;
        response: PaymentAgentWithdrawResponse;
    };
    paymentagent_withdraw_justification: {
        request: PaymentAgentWithdrawJustificationRequest;
        response: PaymentAgentWithdrawJustificationResponse;
    };
    payout_currencies: {
        request: PayoutCurrenciesRequest;
        response: PayoutCurrenciesResponse;
    };
    ping: {
        request: PingRequest;
        response: PingResponse;
    };
    portfolio: {
        request: PortfolioRequest;
        response: PortfolioResponse;
    };
    profit_table: {
        request: ProfitTableRequest;
        response: ProfitTableResponse;
    };
    proposal_open_contract: {
        request: PriceProposalOpenContractsRequest;
        response: PriceProposalOpenContractsResponse;
    };
    proposal: {
        request: PriceProposalRequest;
        response: PriceProposalResponse;
    };
    reality_check: {
        request: RealityCheckRequest;
        response: RealityCheckResponse;
    };
    residence_list: {
        request: CountriesListRequest;
        response: CountriesListResponse;
    };
    revoke_oauth_app: {
        request: RevokeOauthApplicationRequest;
        response: RevokeOauthApplicationResponse;
    };
    sell_contract_for_multiple_accounts: {
        request: SellContractsMultipleAccountsRequest;
        response: SellContractsMultipleAccountsResponse;
    };
    sell_expired: {
        request: SellExpiredContractsRequest;
        response: SellExpiredContractsResponse;
    };
    sell: {
        request: SellContractRequest;
        response: SellContractResponse;
    };
    set_account_currency: {
        request: SetAccountCurrencyRequest;
        response: SetAccountCurrencyResponse;
    };
    set_financial_assessment: {
        request: SetFinancialAssessmentRequest;
        response: SetFinancialAssessmentResponse;
    };
    set_self_exclusion: {
        request: SetSelfExclusionRequest;
        response: SetSelfExclusionResponse;
    };
    set_settings: {
        request: SetAccountSettingsRequest;
        response: SetAccountSettingsResponse;
    };
    statement: {
        request: StatementRequest;
        response: StatementResponse;
    };
    states_list: {
        request: StatesListRequest;
        response: StatesListResponse;
    };
    ticks_history: {
        request: TicksHistoryRequest;
        response: TicksHistoryResponse;
    };
    ticks: {
        request: TicksStreamRequest;
        response: TicksStreamResponse;
    };
    time: {
        request: ServerTimeRequest;
        response: ServerTimeResponse;
    };
    tnc_approval: {
        request: TermsAndConditionsApprovalRequest;
        response: TermsAndConditionsApprovalResponse;
    };
    topup_virtual: {
        request: TopUpVirtualMoneyAccountRequest;
        response: TopUpVirtualMoneyAccountResponse;
    };
    trading_durations: {
        request: TradingDurationsRequest;
        response: TradingDurationsResponse;
    };
    trading_platform_investor_password_reset: {
        request: TradingPlatformInvestorPasswordResetRequest;
        response: TradingPlatformInvestorPasswordResetResponse;
    };
    trading_platform_password_reset: {
        request: TradingPlatformPasswordResetRequest;
        response: TradingPlatformPasswordResetResponse;
    };
    trading_platform_status: {
        request: TradingPlatformStatusRequest;
        response: TradingPlatformStatusResponse;
    };
    trading_servers: {
        request: ServerListRequest;
        response: ServerListResponse;
    };
    trading_times: {
        request: TradingTimesRequest;
        response: TradingTimesResponse;
    };
    transaction: {
        request: TransactionsStreamRequest;
        response: TransactionsStreamResponse;
    };
    transfer_between_accounts: {
        request: TransferBetweenAccountsRequest;
        response: TExtendTransferBetweenAccountsResponse;
    };
    unsubscribe_email: {
        request: UnsubscribeEmailRequest;
        response: UnsubscribeEmailResponse;
    };
    verify_email_cellxpert: {
        request: VerifyEmailCellxpertRequest;
        response: VerifyEmailCellxpertResponse;
    };
    verify_email: {
        request: VerifyEmailRequest;
        response: VerifyEmailResponse;
    };
    website_status: {
        request: ServerStatusRequest;
        response: ServerStatusResponse;
    };
} & TPrivateSocketEndpoints;

export type TSocketEndpointNames = keyof TSocketEndpoints;

export type TSocketSubscribableEndpointNames =
    | KeysMatching<TSocketEndpoints, { request: { subscribe?: number } }>
    | 'exchange_rates';

export type TSocketResponse<T extends TSocketEndpointNames> = TSocketEndpoints[T]['response'];

export type TSocketError<T extends TSocketEndpointNames> = {
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Error object.
     */
    error: {
        code: string;
        message: string;
    };
    /**
     * Action name of the request made.
     */
    msg_type: T;
    /**
     * [Optional] Used to map request to response.
     */
    req_id?: number;
    /**
     * Error message from useSubscription response
     */
    message?: string;
};

export type TSocketResponseData<T extends TSocketEndpointNames> = Omit<
    NoStringIndex<TSocketResponse<T>>,
    'req_id' | 'msg_type' | 'echo_req' | 'subscription'
>;

type TSocketRequest<T extends TSocketEndpointNames> = TSocketEndpoints[T]['request'];

type TRemovableEndpointName<T extends TSocketEndpointNames> = T extends KeysMatching<TSocketRequest<T>, 1> ? T : never;

type TSocketRequestCleaned<T extends TSocketEndpointNames> = Omit<
    TSocketRequest<T>,
    TRemovableEndpointName<T> | 'passthrough' | 'req_id' | 'subscribe'
>;

export type TSocketPaginatateableRequestCleaned<T extends TSocketPaginateableEndpointNames> = Omit<
    TSocketRequest<T>,
    TRemovableEndpointName<T> | 'passthrough' | 'req_id' | 'subscribe'
> & {
    /** Number of records to skip */
    offset?: number;
    /** Number of records to return */
    limit?: number;
};

export type TSocketRequestPayload<
    T extends TSocketEndpointNames | TSocketPaginateableEndpointNames = TSocketEndpointNames
> = Partial<TSocketRequestCleaned<T>> extends TSocketRequestCleaned<T>
    ? {
          payload?: T extends TSocketPaginateableEndpointNames
              ? TSocketPaginatateableRequestCleaned<T>
              : TSocketRequestCleaned<T>;
      }
    : {
          payload: T extends TSocketPaginateableEndpointNames
              ? TSocketPaginatateableRequestCleaned<T>
              : TSocketRequestCleaned<T>;
      };

export type TSocketRequestQueryOptions<T extends TSocketEndpointNames> = Parameters<
    typeof useQuery<TSocketResponseData<T>, TSocketError<T>>
>[2];

export type TSocketRequestInfiniteQueryOptions<T extends TSocketEndpointNames> = Parameters<
    typeof useInfiniteQuery<TSocketResponseData<T>, TSocketError<T>>
>[2];

export type TSocketRequestMutationOptions<T extends TSocketEndpointNames> = Parameters<
    typeof useMutation<TSocketResponseData<T>, TSocketError<T>, TSocketAcceptableProps<T>>
>[2];

type TSocketRequestWithOptions<
    T extends TSocketEndpointNames,
    O extends boolean = false,
    OT extends 'useQuery' | 'useInfiniteQuery' = 'useQuery'
> = Omit<
    TSocketRequestPayload<T> & {
        options?: OT extends 'useQuery' ? TSocketRequestQueryOptions<T> : TSocketRequestInfiniteQueryOptions<T>;
    },
    | (TSocketRequestPayload<T>['payload'] extends Record<string, never> ? 'payload' : never)
    | (TNever<TSocketRequestPayload<T>['payload']> extends undefined ? 'payload' : never)
    | (O extends true ? never : 'options')
>;

type TNever<T> = T extends Record<string, never> ? never : T;

type TSocketRequestProps<
    T extends TSocketEndpointNames,
    O extends boolean = false,
    OT extends 'useQuery' | 'useInfiniteQuery' = 'useQuery'
> = TNever<TSocketRequestWithOptions<T, O, OT>>;

export type TSocketAcceptableProps<
    T extends TSocketEndpointNames,
    O extends boolean = false,
    OT extends 'useQuery' | 'useInfiniteQuery' = 'useQuery'
> = TSocketRequestProps<T, O, OT> extends never
    ? [undefined?]
    : Partial<TSocketRequestProps<T, O, OT>> extends TSocketRequestProps<T, O, OT>
    ? [TSocketRequestProps<T, O, OT>?]
    : [TSocketRequestProps<T, O, OT>];

export type TSocketPaginateableEndpointNames = KeysMatching<
    TSocketEndpoints,
    { request: { limit?: number; offset?: number } }
>;
