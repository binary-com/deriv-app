// eslint-disable-next-line import/no-extraneous-dependencies
import type {
    CurrencyConfigStructure,
    CurrencyConfigStructure1,
    CurrencyConfigStructure2,
    CurrencyConfigStructure3,
    CurrencyConfigStructure4,
    CurrencyConfigStructure6,
    CurrencyConfigStructure7,
    CurrencyConfigStructure8,
    LandingCompanyDetails,
    LandingCompanyDetails1,
} from '@deriv/api-types';

/* Temporary overrides for LandingCompany and StatesList (copied from api-types library) needed until these types' exports are fixed in api-types library,
which requires modification of the automation that generates the TS file automatically from API schema. */
/**
 * Landing Company
 */
export interface LandingCompany {
    /**
     * Flag to indicate if address parseable or not
     */
    address_parseable?: 1 | 0;
    /**
     * Config for all account types (Synthetic Indices and Financials).
     */
    all_company?: 'svg' | 'none';
    /**
     * Config structure with document types ,taxRequired ,tin format details.
     */
    config?: {
        [k: string]: unknown;
    };
    /**
     * Available CTrader accounts.
     */
    ctrader?: {
        /**
         * CTrader all account types (Synthetic Indices and Financials).
         */
        all?: {
            /**
             * For standard client
             */
            standard?: 'svg' | 'none';
        };
    };
    /**
     * Available DerivEZ accounts.
     */
    derivez?: {
        /**
         * DerivEZ all account types (Synthetic Indices and Financials).
         */
        all?: {
            /**
             * For standard client
             */
            standard?: 'svg' | 'none';
        };
    };
    /**
     * Available Deriv X all account types (Synthetic Indices and Financials).
     */
    dxtrade_all_company?: {
        /**
         * Landing Company details.
         */
        standard?: {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Special conditions for changing sensitive fields
             */
            changeable_fields?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            currency_config?: CurrencyConfigStructure;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowable currencies
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowable markets
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
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
             * Flag that indicates whether the landing company supports professional accounts or not
             */
            support_professional_client?: 0 | 1;
            /**
             * Flag that indicates whether tax identifier number is not mandatory for the current country and landing company.
             */
            tin_not_mandatory?: 0 | 1;
        };
    };
    /**
     * Available Deriv X financial account types (all except Synthetic Indices).
     */
    dxtrade_financial_company?: {
        /**
         * Landing Company details.
         */
        standard?: {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Special conditions for changing sensitive fields
             */
            changeable_fields?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            currency_config?: CurrencyConfigStructure1;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowable currencies
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowable markets
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
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
             * Flag that indicates whether the landing company supports professional accounts or not
             */
            support_professional_client?: 0 | 1;
            /**
             * Flag that indicates whether tax identifier number is not mandatory for the current country and landing company.
             */
            tin_not_mandatory?: 0 | 1;
        };
    };
    /**
     * Available Deriv X derived account types (Synthetic Indices).
     */
    dxtrade_gaming_company?: {
        /**
         * Landing Company details.
         */
        standard?: {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Special conditions for changing sensitive fields
             */
            changeable_fields?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            currency_config?: CurrencyConfigStructure2;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowable currencies
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowable markets
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
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
             * Flag that indicates whether the landing company supports professional accounts or not
             */
            support_professional_client?: 0 | 1;
            /**
             * Flag that indicates whether tax identifier number is not mandatory for the current country and landing company.
             */
            tin_not_mandatory?: 0 | 1;
        };
    };
    /**
     * Landing Company for financial contracts (all except Synthetic Indices)
     */
    financial_company?: null | {
        /**
         * Landing Company address
         */
        address?: string[] | null;
        /**
         * Special conditions for changing sensitive fields
         */
        changeable_fields?: {
            [k: string]: unknown;
        };
        /**
         * Landing Company country of incorporation
         */
        country?: string;
        currency_config?: CurrencyConfigStructure3;
        /**
         * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
         */
        has_reality_check?: 1 | 0;
        /**
         * Allowed contract types for this Landing Company
         */
        legal_allowed_contract_categories?: string[];
        /**
         * Allowed account currencies for this Landing Company
         */
        legal_allowed_currencies?: string[];
        /**
         * Allowed markets for this Landing Company
         */
        legal_allowed_markets?: string[];
        /**
         * Default account currency
         */
        legal_default_currency?: string;
        /**
         * Landing Company legal name
         */
        name?: string;
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
         * Flag that indicates whether the landing company supports professional accounts or not
         */
        support_professional_client?: 0 | 1;
        /**
         * Flag that indicates whether tax identifier number is not mandatory for the current country and landing company.
         */
        tin_not_mandatory?: 0 | 1;
    };
    /**
     * Forbidden postcode pattern
     */
    forbidden_postcode_pattern?: string;
    /**
     * Landing Company for derived contracts (Synthetic Indices)
     */
    gaming_company?: null | {
        /**
         * Landing Company address
         */
        address?: string[] | null;
        /**
         * Special conditions for changing sensitive fields
         */
        changeable_fields?: {
            [k: string]: unknown;
        };
        /**
         * Landing Company country of incorporation
         */
        country?: string;
        currency_config?: CurrencyConfigStructure4;
        /**
         * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
         */
        has_reality_check?: 0 | 1;
        /**
         * Allowed contract types
         */
        legal_allowed_contract_categories?: string[];
        /**
         * Allowable currencies
         */
        legal_allowed_currencies?: string[];
        /**
         * Allowable markets
         */
        legal_allowed_markets?: string[];
        /**
         * Default account currency
         */
        legal_default_currency?: string;
        /**
         * Landing Company legal name
         */
        name?: string;
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
         * Flag that indicates whether the landing company supports professional accounts or not
         */
        support_professional_client?: 0 | 1;
        /**
         * Flag that indicates whether tax identifier number is not mandatory for the current country and landing company.
         */
        tin_not_mandatory?: 0 | 1;
    };
    /**
     * Country code
     */
    id?: string;
    /**
     * Flag to indicate if idv is supported or not
     */
    is_idv_supported?: 1 | 0;
    /**
     * Open mf account lc details.
     */
    lc_to_open_mf_account?: string;
    /**
     * Minimum age
     */
    minimum_age?: number;
    /**
     * Flag to indicate if mt5 age verification detail.
     */
    mt5_age_verification?: 1 | 0;
    /**
     * Landing Company for MT5 standard combined all Synthetic and financial, currently has Financial as subtype.
     */
    mt_all_company?: null | {
        swap_free?: LandingCompanyDetails;
        zero_spread?: LandingCompanyDetails1;
    };
    /**
     * Landing Company for MT5 financial contracts (all except Synthetic Indices), currently divided into Financial STP, Financial (standard) as subtypes.
     */
    mt_financial_company?: null | {
        /**
         * Contain details for landing company for financial subtype. The Financial account is suitable for a wide range of traders, both new and experienced. It gives you mid-range leverage and variable spreads that give you a great deal of flexibility for whatever position you wish to take in the market.
         */
        financial?: null | {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Special conditions for changing sensitive fields
             */
            changeable_fields?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            currency_config?: CurrencyConfigStructure6;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types for this Landing Company
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowed account currencies for this Landing Company
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowed markets for this Landing Company
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
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
             * Flag that indicates whether the landing company supports professional accounts or not
             */
            support_professional_client?: 0 | 1;
            /**
             * Flag that indicates whether tax identifier number is not mandatory for the current country and landing company.
             */
            tin_not_mandatory?: 0 | 1;
        };
        /**
         * Contain details for landing company for Financial STP subtype. The Financial STP account provides you with tight spreads, higher ticket size and offers a variety of FX pairs from majors to exotics. It is a straight through processing (STP) account with direct access to FX liquidity from various providers.
         */
        financial_stp?: null | {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Special conditions for changing sensitive fields
             */
            changeable_fields?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            currency_config?: CurrencyConfigStructure7;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types for this Landing Company
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowed account currencies for this Landing Company
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowed markets for this Landing Company
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
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
             * Flag that indicates whether the landing company supports professional accounts or not
             */
            support_professional_client?: 0 | 1;
            /**
             * Flag that indicates whether tax identifier number is not mandatory for the current country and landing company.
             */
            tin_not_mandatory?: 0 | 1;
        };
    };
    /**
     * Landing Company for MT5 standard derived contracts (Synthetic Indices), currently has Financial as subtype.
     */
    mt_gaming_company?: null | {
        /**
         * Landing Company for MT5 derived contracts (Synthetic Indices)
         */
        financial?: null | {
            /**
             * Landing Company address
             */
            address?: string[] | null;
            /**
             * Special conditions for changing sensitive fields
             */
            changeable_fields?: {
                [k: string]: unknown;
            };
            /**
             * Landing Company country of incorporation
             */
            country?: string;
            currency_config?: CurrencyConfigStructure8;
            /**
             * Flag to indicate whether reality check is applicable for this Landing Company. `1`: applicable, `0`: not applicable. The Reality Check is a feature that gives a summary of the client's trades and account balances on a regular basis throughout his session, and is a regulatory requirement for certain Landing Companies.
             */
            has_reality_check?: 0 | 1;
            /**
             * Allowed contract types
             */
            legal_allowed_contract_categories?: string[];
            /**
             * Allowable currencies
             */
            legal_allowed_currencies?: string[];
            /**
             * Allowable markets
             */
            legal_allowed_markets?: string[];
            /**
             * Default account currency
             */
            legal_default_currency?: string;
            /**
             * Landing Company legal name
             */
            name?: string;
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
             * Flag that indicates whether the landing company supports professional accounts or not
             */
            support_professional_client?: 0 | 1;
            /**
             * Flag that indicates whether tax identifier number is not mandatory for the current country and landing company.
             */
            tin_not_mandatory?: 0 | 1;
        };
    };
    /**
     * Country name
     */
    name?: string;
    /**
     * Flag to indicate whether max turnover limit settings.
     */
    need_set_max_turnover_limit?: 0 | 1;
    /**
     * Flag to indicate province settings.
     */
    no_province?: 0 | 1;
    /**
     * Flag to indicate whether address postcode is required or not.
     */
    require_address_postcode?: 0 | 1;
    /**
     * Flag to indicate whether age verification required ofr synthetic or not.
     */
    require_age_verified_for_synthetic?: 0 | 1;
    /**
     * Flag to indicate whether poi is required.
     */
    require_poi?: 0 | 1;
    /**
     * Flag to indicate whether verification required if age not verified.
     */
    require_verification_when_not_age_verified?: 0 | 1;
    /**
     * Flag to indicate whether to skip deposit verifcation or not.
     */
    skip_deposit_verification?: 0 | 1;
    /**
     * Virtual Company
     */
    virtual_company?: string;
}

/**
 * Returns the Landing Company for clients of a given country.
 */
export interface LandingCompanyResponse {
    landing_company?: LandingCompany;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'landing_company';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}

/**
 * List of states.
 */
export type StatesList = {
    /**
     * The state name.
     */
    text?: string;
    /**
     * The state code.
     */
    value?: string;
}[];

/**
 * A message with States List
 */
export interface StatesListResponse {
    states_list?: StatesList;
    /**
     * Echo of the request made.
     */
    echo_req: {
        [k: string]: unknown;
    };
    /**
     * Action name of the request made.
     */
    msg_type: 'states_list';
    /**
     * Optional field sent in request to map to response, present only when request contains `req_id`.
     */
    req_id?: number;
    [k: string]: unknown;
}
