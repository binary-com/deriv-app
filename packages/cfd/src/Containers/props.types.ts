import React from 'react';
import { FormikHelpers as FormikActions } from 'formik';
import {
    DetailsOfEachMT5Loginid,
    GetAccountStatus,
    GetSettings,
    ResidenceList,
    VerifyEmailResponse,
} from '@deriv/api-types';

import {
    TCFDsPlatformType,
    TClickableDescription,
    TExistingData,
    TJurisdictionCardItems,
    TJurisdictionCardItemVerification,
    TJurisdictionCardSection,
    TJurisdictionCardSectionTitleIndicators,
    TModifiedTradingPlatformAvailableAccount,
} from '../Components/props.types';
import RootStore from '../Stores/index';

import { TCFDPasswordFormValues } from './cfd-password-modal';

export type TCFDPersonalDetailsContainerProps = {
    onSubmit: (index: number, value: { [key: string]: string }) => void;
};

type CFD_Platform = 'dxtrade' | 'mt5' | 'ctrader';

export type TCFDChangePasswordConfirmationProps = {
    confirm_label?: string;
    platform: string;
    className?: string;
    onConfirm: (values: TCFDPasswordFormValues, actions: FormikActions<TCFDPasswordFormValues>) => void;
    onCancel: () => void;
    context?: RootStore;
};

export type TCFDDashboardContainer = {
    platform: CFD_Platform;
    active_index: number;
    is_dark_mode_on: boolean;
    dxtrade_tokens: {
        demo: string;
        real: string;
    };
    ctrader_tokens: {
        demo: string;
        real: string;
    };
};

export type TMT5AccountOpeningRealFinancialStpModal = {
    enableApp: () => void;
    disableApp: () => void;
};

export type TMissingRealAccount = {
    onClickSignup: () => void;
    platform: CFD_Platform;
};

export type TChangePassword = {
    platform: string;
    onConfirm: () => void;
};

export type TPasswordResetAndTradingPasswordManager = {
    email: string;
    platform: CFD_Platform;
    account_group: TCFDPasswordReset['account_group'];
    toggleModal?: () => void;
};

export type TResetPasswordIntent = {
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    context?: RootStore;
    children({ ...props }): React.ReactElement;
    is_eu: boolean;
};

export type TError = {
    code: string | number;
    message: string;
};

export type TCFDResetPasswordModal = {
    platform: CFD_Platform;
};

export type TCFDPasswordSuccessMessage = {
    toggleModal: () => void;
    is_investor: boolean;
};

export type TFormValues = Record<'old_password' | 'new_password' | 'password_type', string>;

export type TPasswordManagerModalFormValues = Record<'old_password' | 'new_password' | 'password_type', string>;

export type TMultiStepRefProps = {
    goNextStep: () => void;
    goPrevStep: () => void;
};

export type TCountdownComponent = {
    count_from: number;
    onTimeout: () => void;
};

export type TCFDPasswordReset = {
    sendVerifyEmail: () => Promise<VerifyEmailResponse>;
    account_type: string;
    account_group: 'demo' | 'real' | '';
    server: string;
    password_type: string;
};

export type TCFDPasswordManagerTabContentWrapper = {
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
    steps: Array<{ component: JSX.Element }>;
};

export type TCFDPasswordManagerTabContent = {
    toggleModal: () => void;
    selected_login: string;
    email: string;
    setPasswordType: (value: string) => void;
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
    platform: CFD_Platform;
    onChangeActiveTabIndex: (value: number) => void;
    account_group: TCFDPasswordReset['account_group'];
};

export type TCFDPasswordManagerModal = {
    is_visible: boolean;
    platform: CFD_Platform;
    selected_login: string;
    toggleModal: () => void;
    selected_account_type: string;
    selected_account_group: TCFDPasswordReset['account_group'];
    selected_server: string;
};

export type TJurisdictionCardProps = {
    jurisdiction_selected_shortcode: string;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    account_status: TAccountStatus;
    account_type: string;
    disabled: boolean;
    is_non_idv_design: boolean;
    type_of_card: TJurisdictionCardType;
};

export type TJurisdictionCardBackProps = {
    card_classname: string;
    disabled: boolean;
    is_card_selected: boolean;
    toggleCardFlip: React.MouseEventHandler<HTMLSpanElement>;
    verification_docs: TJurisdictionCardItemVerification | undefined;
};

export type TJurisdictionCardFrontProps = TJurisdictionCardBackProps & {
    account_status: TAccountStatus;
    card_data: TJurisdictionCardSection[];
    card_values: TJurisdictionCardItems;
    disabled: boolean;
    type_of_card: TJurisdictionCardType;
};

export type TJurisdictionClickableDescriptionProps = {
    clickable_description: Array<TClickableDescription>;
    toggleCardFlip: React.MouseEventHandler<HTMLSpanElement>;
};

export type TJurisdictionTitleIndicatorProps = {
    account_status: TAccountStatus;
    title_indicators: TJurisdictionCardSectionTitleIndicators;
    type_of_card: TJurisdictionCardType;
    verification_docs: TJurisdictionCardItemVerification | undefined;
};

export type TJurisdictionCardSectionProps = {
    account_status: TAccountStatus;
    card_section_item: TJurisdictionCardSection;
    toggleCardFlip: React.MouseEventHandler<HTMLSpanElement>;
    type_of_card: TJurisdictionCardType;
    verification_docs: TJurisdictionCardItemVerification | undefined;
};

export type TJurisdictionCardType = 'svg' | 'bvi' | 'vanuatu' | 'labuan' | 'maltainvest';

export type TVerificationStatusBannerProps = {
    account_status: TAccountStatus;
    account_settings: GetSettings;
    account_type: string;
    card_classname: string;
    disabled: boolean;
    type_of_card: string;
    real_synthetic_accounts_existing_data: TExistingData;
    real_financial_accounts_existing_data: TExistingData;
    real_swapfree_accounts_existing_data: TExistingData;
    should_restrict_bvi_account_creation: boolean;
    should_restrict_vanuatu_account_creation: boolean;
    residence_list: ResidenceList;
};

export type TOpenAccountTransferMeta = {
    category: string;
    type?: string;
};

export type TJurisdictionModalContentWrapperProps = {
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
};

export type TJurisdictionModalProps = {
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
};

export type TJurisdictionModalContentProps = {
    account_status: TAccountStatus;
    account_type: string;
    is_non_idv_design: boolean;
    jurisdiction_selected_shortcode: string;
    setJurisdictionSelectedShortcode: (card_type: string) => void;
    synthetic_available_accounts: TModifiedTradingPlatformAvailableAccount[];
    financial_available_accounts: TModifiedTradingPlatformAvailableAccount[];
    all_market_type_available_accounts: TModifiedTradingPlatformAvailableAccount[];
    swapfree_available_accounts: TModifiedTradingPlatformAvailableAccount[];
    real_synthetic_accounts_existing_data: TExistingData;
    real_financial_accounts_existing_data: TExistingData;
    real_swapfree_accounts_existing_data: TExistingData;
    is_virtual: boolean;
};

export type TJurisdictionModalTitleProps = {
    show_eu_related_content: boolean;
    account_type: string;
    platform: TCFDsPlatformType;
};

type TAccountStatus = Omit<GetAccountStatus, 'status' | 'p2p_poa_required'> &
    Partial<Pick<GetAccountStatus, 'status'>> & { p2p_poa_required: number };

export type TJurisdictionModalFootNoteProps = {
    account_status: TAccountStatus;
    account_type: string;
    card_classname: string;
    jurisdiction_selected_shortcode: string;
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
    available_accounts_count: number;
    classname_for_demo_and_eu: string | null;
    content_flag: string;
    pre_appstore_class: string;
    is_high_risk_for_mt5: boolean;
    CFDs_restricted_countries: boolean;
    financial_restricted_countries: boolean;
    is_preappstore_restricted_cr_demo_account: boolean;
    residence: string;
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
    is_preappstore_cr_demo_account: boolean;
    is_preappstore_restricted_cr_demo_account: boolean;
    is_real_enabled: boolean;
    openDerivRealAccountNeededModal: () => void;
    openPasswordModal: (account_type: TOpenAccountTransferMeta) => void;
    real_account_creation_unlock_date: string;
    setShouldShowCooldownModal: (value: boolean) => void;
    should_show_derivx: boolean;
    show_eu_related_content: boolean;
    toggleCompareAccounts: () => void;
};

type TDynamicLeverage = {
    from: number;
    to: number;
    leverage: number;
};

export type TDynamicLeverageMarketCardProps = {
    title: string;
    description?: string;
    leverage: string;
    data: TDynamicLeverage[];
};

export type TDynamicLeverageTableColumnHeader = {
    title: string;
    subtitle: string;
};
