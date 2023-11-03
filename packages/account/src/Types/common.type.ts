/** Add types that are shared between components */
import React from 'react';
import { FormikHandlers, FormikProps, FormikValues } from 'formik';
import { Redirect, RouteProps } from 'react-router-dom';
import { TPage404 } from '../Constants/routes-config';
import {
    Authorize,
    DetailsOfEachMT5Loginid,
    IdentityVerificationAddDocumentResponse,
    ResidenceList,
} from '@deriv/api-types';
import { CFD_PLATFORMS, Platforms } from '@deriv/shared';

export type TToken = {
    display_name: string;
    last_used: string;
    scopes: string[];
    token: string;
};

export type TPoaStatusProps = {
    needs_poi: boolean;
    redirect_button: React.ReactNode;
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

type TIdentity = {
    services: {
        idv: {
            documents_supported: { [key: string]: { display_name: string } } | Record<string, never>;
            has_visual_sample: 0 | 1;
            is_country_supported: 0 | 1;
        };
        onfido: {
            documents_supported: { [key: string]: { display_name: string } };
            is_country_supported: 0 | 1;
        };
    };
};

export type TFile = {
    path: string;
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
};

export type TPOIStatus = {
    needs_poa?: boolean;
    redirect_button?: React.ReactElement;
    is_from_external?: boolean;
    is_manual_upload?: boolean;
};

export type TPersonalDetailsForm = {
    warning_items?: Record<string, string>;
    is_virtual?: boolean;
    is_mf?: boolean;
    is_svg?: boolean;
    is_qualified_for_idv?: boolean;
    should_hide_helper_image: boolean;
    is_appstore?: boolean;
    editable_fields: Array<string>;
    has_real_account?: boolean;
    residence_list?: ResidenceList;
    is_fully_authenticated?: boolean;
    account_opening_reason_list?: Record<string, string>[];
    closeRealAccountSignup: () => void;
    salutation_list?: Record<string, string>[];
    is_rendered_for_onfido?: boolean;
    should_close_tooltip?: boolean;
    setShouldCloseTooltip?: (should_close_tooltip: boolean) => void;
} & FormikProps<FormikValues>;

export type TInputFieldValues = Record<string, string>;

export type TIDVVerificationResponse = IdentityVerificationAddDocumentResponse & { error: { message: string } };

export type TVerificationStatus = Readonly<
    Record<'none' | 'pending' | 'rejected' | 'verified' | 'expired' | 'suspected', string>
>;

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

export type TIDVForm = {
    selected_country: ResidenceList[0];
    hide_hint?: boolean;
    class_name?: string;
    can_skip_document_verification: boolean;
} & Partial<FormikHandlers> &
    FormikProps<TIDVFormValues>;

export type TPlatforms = typeof Platforms[keyof typeof Platforms];

export type TServerError = {
    code: string;
    message: string;
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

export type TLoginHistoryItems = {
    id: number;
    date: string;
    action: string;
    browser: string;
    ip: string;
    status: string;
};
