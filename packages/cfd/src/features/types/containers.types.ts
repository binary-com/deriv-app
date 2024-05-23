import React from 'react';
import {
    GetSettings,
    ResidenceList,
    GetAccountStatus,
    VerifyEmailResponse,
    DetailsOfEachMT5Loginid,
} from '@deriv/api-types';
import { FormikHelpers as FormikActions } from 'formik';
import {
    TExistingData,
    TClickableDescription,
    TJurisdictionCardItems,
    TJurisdictionCardSection,
    TJurisdictionCardItemVerification,
    TJurisdictionCardSectionTitleIndicators,
    TModifiedTradingPlatformAvailableAccount,
} from './components.types';
import RootStore from 'Stores/index';
import { TCFDPlatform, TTradingPlatformAvailableAccount, TTokens, TAccountCategory, TMarketType } from './shared.types';

type TCFDPasswordFormValues = { password: string };

export type TCFDPersonalDetailsContainerProps = {
    onSubmit: (index: number, value: { [key: string]: string }) => void;
};

// cfd-change-password-confirmation
export type TCFDChangePasswordConfirmationProps = {
    platform: TCFDPlatform;
    className?: string;
    context?: RootStore;
    onCancel: () => void;
    confirm_label?: string;
    onConfirm: (values: TCFDPasswordFormValues, actions: FormikActions<TCFDPasswordFormValues>) => void;
};

export type TCFDDashboardContainer = {
    active_index: number;
    platform: TCFDPlatform;
    is_dark_mode_on: boolean;
    dxtrade_tokens: TTokens;
    ctrader_tokens: TTokens;
};

export type TMT5AccountOpeningRealFinancialStpModal = {
    enableApp: () => void;
    disableApp: () => void;
    toggleCFDVerificationModal: () => void;
    is_cfd_verification_modal_visible: boolean;
};

export type TMissingRealAccount = {
    platform: TCFDPlatform;
    onClickSignup: () => void;
};

export type TChangePassword = {
    platform: TCFDPlatform;
    onConfirm: () => void;
};

export type TPasswordResetAndTradingPasswordManager = {
    email: string;
    platform: TCFDPlatform;
    toggleModal?: () => void;
    account_group: TCFDPasswordReset['account_group'];
};

export type TResetPasswordIntent = {
    is_eu: boolean;
    context?: RootStore;
    children({ ...props }): React.ReactElement;
    current_list: Record<string, DetailsOfEachMT5Loginid>;
};

export type TError = {
    message: string;
    code: string | number;
};

export type TCFDResetPasswordModal = {
    platform: TCFDPlatform;
};

export type TCFDPasswordSuccessMessage = {
    is_investor: boolean;
    toggleModal: () => void;
};

export type TFormValues = Record<'old_password' | 'new_password' | 'password_type', string>;

export type TPasswordManagerModalFormValues = Record<'old_password' | 'new_password' | 'password_type', string>;

export type TMultiStepRefProps = {
    goNextStep: () => void;
    goPrevStep: () => void;
};

export type TInvestorPasswordManager = {
    toggleModal: () => void;
    error_message_investor: string;
    is_submit_success_investor: boolean;
    setPasswordType: (value: string) => void;
    onSubmit: (values: TPasswordManagerModalFormValues) => Promise<void>;
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
    validatePassword: (values: { old_password: string; new_password: string; password_type: string }) => void | object;
};

export type TCountdownComponent = {
    count_from: number;
    onTimeout: () => void;
};

export type TCFDPasswordReset = {
    server: DetailsOfEachMT5Loginid['server'];
    account_type: TAccountCategory;
    password_type: string;
    account_group: TAccountCategory;
    sendVerifyEmail: () => Promise<VerifyEmailResponse>;
};

export type TCFDPasswordManagerTabContentWrapper = {
    steps: Array<{ component: JSX.Element }>;
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
};

export type TCFDPasswordManagerTabContent = {
    email: string;
    selected_login: string;
    platform: TCFDPlatform;
    toggleModal: () => void;
    setPasswordType: (value: string) => void;
    onChangeActiveTabIndex: (value: number) => void;
    account_group: TCFDPasswordReset['account_group'];
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
};

// cfd-password-manager-modal
export type TCFDPasswordManagerModal = {
    is_visible: boolean;
    platform: TCFDPlatform;
    selected_login: string;
    toggleModal: () => void;
    selected_server: DetailsOfEachMT5Loginid['server'];
    selected_account_type: TAccountCategory;
    selected_account_group: TCFDPasswordReset['account_group'];
};

// juriscdiction-modal
export type TJurisdictionCardProps = {
    disabled: boolean;
    account_type: TAccountCategory;
    is_non_idv_design: boolean;
    account_status: GetAccountStatus;
    type_of_card: TJurisdictionCardType;
    jurisdiction_selected_shortcode: DetailsOfEachMT5Loginid['landing_company_short'];
    setJurisdictionSelectedShortcode: (card_type: string) => void;
};

export type TJurisdictionCardBackProps = {
    disabled: boolean;
    card_classname: string;
    is_card_selected: boolean;
    toggleCardFlip: React.MouseEventHandler<HTMLSpanElement>;
    verification_docs: TJurisdictionCardItemVerification | undefined;
};

export type TJurisdictionCardFrontProps = TJurisdictionCardBackProps & {
    disabled: boolean;
    account_status: GetAccountStatus['status'];
    card_values: TJurisdictionCardItems;
    type_of_card: TJurisdictionCardType;
    card_data: TJurisdictionCardSection[];
};

export type TJurisdictionClickableDescriptionProps = {
    clickable_description: Array<TClickableDescription>;
    toggleCardFlip: React.MouseEventHandler<HTMLSpanElement>;
};

export type TJurisdictionTitleIndicatorProps = {
    account_status: GetAccountStatus['status'];
    type_of_card: TJurisdictionCardType;
    title_indicators: TJurisdictionCardSectionTitleIndicators;
    verification_docs: TJurisdictionCardItemVerification | undefined;
};

export type TJurisdictionCardSectionProps = {
    account_status: GetAccountStatus;
    type_of_card: TJurisdictionCardType;
    card_section_item: TJurisdictionCardSection;
    toggleCardFlip: React.MouseEventHandler<HTMLSpanElement>;
    verification_docs: TJurisdictionCardItemVerification | undefined;
};

export type TJurisdictionCardType = DetailsOfEachMT5Loginid['landing_company_short'];

export type TVerificationStatusBannerProps = {
    disabled: boolean;
    account_type: TAccountCategory;
    type_of_card: string;
    card_classname: string;
    residence_list: ResidenceList;
    account_settings: GetSettings;
    account_status: GetAccountStatus;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
    real_swapfree_accounts_existing_data: TExistingData;
    real_synthetic_accounts_existing_data: TExistingData;
    real_financial_accounts_existing_data: TExistingData;
};

export type TJurisdictionCheckBoxProps = {
    class_name: string;
    is_checked: boolean;
    onCheck: () => void;
    jurisdiction_selected_shortcode: DetailsOfEachMT5Loginid['landing_company_short'];
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
};
type TOpenAccountTransferMeta = {
    type?: TMarketType;
    category: TAccountCategory;
};

export type TJurisdictionModalContentWrapperProps = {
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
};

export type TJurisdictionModalProps = {
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
};

export type TJurisdictionModalContentProps = {
    is_virtual: boolean;
    account_type: TAccountCategory;
    is_non_idv_design: boolean;
    account_status: GetAccountStatus['status'];
    jurisdiction_selected_shortcode: DetailsOfEachMT5Loginid['landing_company_short'];
    real_swapfree_accounts_existing_data: TExistingData;
    real_synthetic_accounts_existing_data: TExistingData;
    real_financial_accounts_existing_data: TExistingData;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    swapfree_available_accounts: TTradingPlatformAvailableAccount[];
    synthetic_available_accounts: TTradingPlatformAvailableAccount[];
    financial_available_accounts: TTradingPlatformAvailableAccount[];
    all_market_type_available_accounts: TTradingPlatformAvailableAccount[];
};

export type TJurisdictionModalTitleProps = {
    account_type: TAccountCategory;
    platform: TCFDPlatform;
    show_eu_related_content: boolean;
};

type TAccountStatus = Omit<GetAccountStatus, 'status' | 'p2p_poa_required'> &
    Partial<Pick<GetAccountStatus, 'status'>> & { p2p_poa_required: number };

export type TJurisdictionModalFootNoteProps = {
    account_type: TAccountCategory;
    card_classname: string;
    account_status: TAccountStatus;
    jurisdiction_selected_shortcode: DetailsOfEachMT5Loginid['landing_company_short'];
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
};

export type TCompareAccountRowItem = {
    text: string;
    tooltip_msg?: string;
    options?: Record<string, string | boolean | Record<string, string>>;
};

export type TCompareAccountContentValues = Record<
    string,
    TCompareAccountRowItem | TCompareAccountRowItem[] | undefined
>;

export type TCompareAccountRowProps = TCompareAccountContentProps & {
    residence: ResidenceList;
    content_flag: string;
    pre_appstore_class: string;
    is_high_risk_for_mt5: boolean;
    available_accounts_count: number;
    CFDs_restricted_countries: boolean;
    financial_restricted_countries: boolean;
    classname_for_demo_and_eu: string | null;
    is_preappstore_restricted_cr_demo_account: boolean;
};

export type TCompareAccountContentProps = {
    id: string;
    attribute: string;
    values: TCompareAccountContentValues;
};

export type TCompareAccountFooterButtonData = { label: string; action: string };

export type TDMT5CompareModalContentProps = {
    content_flag: string;
    is_demo_tab: boolean;
    is_logged_in: boolean;
    is_real_enabled: boolean;
    should_show_derivx: boolean;
    show_eu_related_content: boolean;
    toggleCompareAccounts: () => void;
    is_preappstore_cr_demo_account: boolean;
    real_account_creation_unlock_date: string;
    openDerivRealAccountNeededModal: () => void;
    is_preappstore_restricted_cr_demo_account: boolean;
    setShouldShowCooldownModal: (value: boolean) => void;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
};

export type TCFDDbviOnboardingProps = {
    context: RootStore;
    is_virtual: boolean;
    enableApp: () => void;
    disableApp: () => void;
    updateMT5Status: () => void;
    openPasswordModal: () => void;
    updateAccountStatus: () => void;
    account_status: GetAccountStatus;
    fetchAccountSettings: () => void;
    toggleCFDVerificationModal: () => void;
    jurisdiction_selected_shortcode: DetailsOfEachMT5Loginid['landing_company_short'];
    is_cfd_verification_modal_visible: boolean;
    has_submitted_cfd_personal_details: boolean;
    has_created_account_for_selected_jurisdiction: boolean;
};

// dynamic-leverage
type TDynamicLeverage = {
    to: number;
    from: number;
    leverage: number;
};

export type TDynamicLeverageMarketCardProps = {
    title: string;
    leverage: string;
    description?: string;
    data: TDynamicLeverage[];
};

export type TDynamicLeverageTableColumnHeader = {
    title: string;
    subtitle: string;
};

export type TInstrumentsIcon = {
    icon:
        | 'DerivedFX'
        | 'Synthetics'
        | 'Baskets'
        | 'Stocks'
        | 'StockIndices'
        | 'Commodities'
        | 'Forex'
        | 'Cryptocurrencies'
        | 'ETF';
    text: string;
    className?: string;
    highlighted: boolean;
    is_asterisk?: boolean;
};

// cfd-compare-accounts-button
export type TCompareAccountsCard = {
    is_demo?: boolean;
    is_eu_user?: boolean;
    trading_platforms: TModifiedTradingPlatformAvailableAccount;
};
