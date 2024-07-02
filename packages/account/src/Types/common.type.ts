/** Add types that are shared between components */
import React from 'react';
import { IDENTIFIER_TYPES } from '../Constants/poo-identifier';
import getPaymentMethodsConfig from '../Configs/payment-method-config';
import { Redirect, RouteProps } from 'react-router-dom';
import { TPage404 } from '../Constants/routes-config';
import {
    Authorize,
    GetAccountStatus,
    DetailsOfEachMT5Loginid,
    GetFinancialAssessment,
    SetFinancialAssessmentRequest,
    IdentityVerificationAddDocumentResponse,
    ApiToken,
} from '@deriv/api-types';
import {
    AUTH_STATUS_CODES,
    CFD_PLATFORMS,
    MT5_ACCOUNT_STATUS,
    Platforms,
    TRADING_PLATFORM_STATUS,
} from '@deriv/shared';

export type TToken = NonNullable<ApiToken['tokens']>[0];

export type TFormattedToken = Partial<{
    display_name: string;
    formatted_scopes: string[];
    last_used: string;
    token: string;
}>;

export type TPoaStatusProps = {
    needs_poi?: boolean;
    redirect_button?: React.ReactNode;
};

export type TAuthAccountInfo = NonNullable<Authorize['account_list']>[0] & {
    landing_company_shortcode?: string;
};

export type TCurrencyConfig = {
    fractional_digits: number;
    is_deposit_suspended: 0 | 1;
    is_suspended: 0 | 1;
    is_withdrawal_suspended: 0 | 1;
    name: string;
    stake_default: number;
    transfer_between_accounts: {
        fees: {
            [key: string]: number;
        };
        limits: {
            max: number;
            min: number;
        } | null;
    };
    type: 'fiat' | 'crypto';
    value: string;
};

export type TFormValidation = {
    warnings: { [key: string]: string };
    errors: { [key: string]: string };
};

export type TRealAccount = {
    active_modal_index: number;
    current_currency: string;
    error_message: string;
    previous_currency: string;
    success_message: string;
    error_code: number;
    error_details?: Record<string, string>;
};

export type TPopoverAlignment = 'top' | 'right' | 'bottom' | 'left';

export type TRoute = {
    exact?: boolean;
    id?: string;
    icon_component?: string;
    is_invisible?: boolean;
    path?: string;
    icon?: string;
    default?: boolean;
    to?: string;
    component?: ((props?: RouteProps['component']) => JSX.Element) | Partial<typeof Redirect> | TPage404;
    getTitle?: () => string;
    is_disabled?: boolean;
    is_hidden?: boolean;
    subroutes?: TRoute[];
};

export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: TRoute[];
};

export type TBinaryRoutes = {
    is_logged_in: boolean;
    is_logging_in: boolean;
};

export type TUpgradeInfo = {
    type: string;
    can_upgrade: boolean;
    can_upgrade_to: string;
    can_open_multi: boolean;
};

export type TPOIStatus = {
    needs_poa?: boolean;
    redirect_button?: React.ReactElement;
    is_from_external?: boolean;
    is_manual_upload?: boolean;
};

export type TConfirmPersonalDetailsForm = Pick<
    TPersonalDetailsBaseForm,
    'first_name' | 'last_name' | 'date_of_birth'
> & {
    confirmation_checkbox?: boolean;
};

export type TPersonalDetailsBaseForm = {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    account_opening_reason: string;
    salutation: string;
    phone: string;
    tax_residence: string;
    tax_identification_number: string;
    tax_identification_confirm: boolean;
    place_of_birth: string;
    citizen: string;
};

export type TInputFieldValues = Record<string, string>;

export type TIDVVerificationResponse = IdentityVerificationAddDocumentResponse & { error: { message: string } };

export type TDocument = {
    id: string;
    text: string;
    value?: string;
    example_format?: string;
    additional?: {
        display_name?: string;
        example_format?: string;
    };
};

export type TIDVFormValues = {
    document_type: TDocument;
    document_number: string;
    document_additional?: string;
    error_message?: string;
};

export type TPlatforms = typeof Platforms[keyof typeof Platforms];

export type TServerError = {
    code?: string;
    message: string;
    name?: string;
    details?: { [key: string]: string };
    fields?: string[];
};
export type TCFDPlatform = typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS];

export type TClosingAccountFormValues = {
    'financial-priorities': boolean;
    'stop-trading': boolean;
    'not-interested': boolean;
    'another-website': boolean;
    'not-user-friendly': boolean;
    'difficult-transactions': boolean;
    'lack-of-features': boolean;
    'unsatisfactory-service': boolean;
    'other-reasons': boolean;
    other_trading_platforms: string;
    do_to_improve: string;
};

export type TAccounts = {
    account?: {
        balance?: string | number;
        currency?: string;
        disabled?: boolean;
        error?: JSX.Element | string;
        is_crypto?: boolean;
        is_dxtrade?: boolean;
        is_mt?: boolean;
        market_type?: string;
        nativepicker_text?: string;
        platform_icon?: {
            Derived: React.SVGAttributes<SVGElement>;
            Financial: React.SVGAttributes<SVGElement>;
            Options: React.SVGAttributes<SVGElement>;
            CFDs: React.SVGAttributes<SVGAElement>;
        };
        text?: JSX.Element | string;
        value?: string;
    };
    icon?: string;
    idx?: string | number;
    is_dark_mode_on?: boolean;
    is_virtual?: boolean | number;
    loginid?: string;
    mt5_login_list?: DetailsOfEachMT5Loginid[];
    title?: string;
};

type TPendingAccountDetails = {
    balance?: number;
    currency?: string;
    display_login?: string;
    positions?: number;
    withdrawals?: number;
};

export type TDetailsOfDerivAccount = TAccounts & TPendingAccountDetails;
export type TDetailsOfMT5Account = DetailsOfEachMT5Loginid & TPendingAccountDetails;
export type TDetailsOfDerivXAccount = TDetailsOfMT5Account & { account_id?: string };
export type TDetailsOfCtraderAccount = DetailsOfEachMT5Loginid & {
    display_balance?: string;
    platform?: string;
    account_id?: string;
};

export type TLoginHistoryItems = {
    id: number;
    date: string;
    action: string;
    browser: string;
    ip: string;
    status: string;
};

export type TAutoComplete = {
    value: boolean;
    text: string;
};
export type TPaymentMethodIdentifier = typeof IDENTIFIER_TYPES[keyof typeof IDENTIFIER_TYPES];

export type TPaymentMethodInfo = {
    documents_required: number;
    icon: string;
    payment_method: string;
    items: DeepRequired<GetAccountStatus>['authentication']['ownership']['requests'];
    instructions: string[] | JSX.Element[];
    input_label: string | null;
    identifier_type: TPaymentMethodIdentifier | '';
    is_generic_pm: boolean;
};

export type TFile = File & { file: Blob };

export type TPaymentMethod = keyof ReturnType<typeof getPaymentMethodsConfig>;

export type TProofOfOwnershipFormValue = Record<TPaymentMethod, Record<number | string, TProofOfOwnershipData>>;

export type TProofOfOwnershipData = {
    documents_required: number;
    id: number;
    identifier_type: TPaymentMethodIdentifier | '';
    is_generic_pm: boolean;
    files: Array<TFile>;
    payment_method_identifier: string;
};

export type TProofOfOwnershipErrors = Record<
    TPaymentMethod,
    Array<{ payment_method_identifier?: string; files?: Array<string> }>
>;

export type TFinancialInformationForm = Omit<SetFinancialAssessmentRequest, 'set_financial_assessment'>;

export type TAuthStatusCodes = typeof AUTH_STATUS_CODES[keyof typeof AUTH_STATUS_CODES];

export type TMT5AccountStatus =
    | typeof MT5_ACCOUNT_STATUS[keyof typeof MT5_ACCOUNT_STATUS]
    | typeof TRADING_PLATFORM_STATUS[keyof typeof TRADING_PLATFORM_STATUS];

export type TFilesDescription = {
    descriptions: { id: string; value: JSX.Element }[];
    title: React.ReactNode;
};

export type TTradingAssessmentForm = Required<
    Pick<
        GetFinancialAssessment,
        | 'cfd_experience'
        | 'cfd_frequency'
        | 'cfd_trading_definition'
        | 'leverage_trading_high_risk_stop_loss'
        | 'leverage_impact_trading'
        | 'required_initial_margin'
        | 'risk_tolerance'
        | 'source_of_experience'
        | 'trading_experience_financial_instruments'
        | 'trading_frequency_financial_instruments'
    >
>;

export type TQuestion = {
    question_text: string;
    form_control: keyof TTradingAssessmentForm;
    answer_options: { text: string; value: string }[];
    field_type?: string;
};

// Type for the list of items in a dropdown or select
export type TListItem = {
    /**
     * The text of the item (e.g. 'United Kingdom', 'Germany', etc.)
     */
    text?: string;
    /**
     * The value of the item
     */
    value?: string;
};
