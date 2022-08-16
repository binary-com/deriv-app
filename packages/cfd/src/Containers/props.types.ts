import { RouteComponentProps } from 'react-router';
import {
    DetailsOfEachMT5Loginid,
    GetSettings,
    LandingCompany,
    ResidenceList,
    VerifyEmailResponse,
} from '@deriv/api-types';
import { FormikHelpers as FormikActions } from 'formik';
import { TCFDPasswordFormValues } from './cfd-password-modal';

export type TCFDPersonalDetailsModalProps = {
    account_settings: GetSettings;
    enableApp: () => void;
    disableApp: () => void;
    getChangeableFields: () => string[];
    is_open: boolean;
    openPasswordModal: () => void;
    toggleCFDPersonalDetailsModal: () => void;
    toggleJurisdictionModal: () => void;
    is_fully_authenticated: boolean;
    landing_company: LandingCompany;
    residence_list: ResidenceList;
    setAccountSettings: (account_settings: GetSettings) => void;
};

type CFD_Platform = 'dxtrade' | 'mt5';

export type TCFDChangePasswordConfirmationProps = {
    confirm_label?: string;
    platform: string;
    className?: string;
    onConfirm: (values: TCFDPasswordFormValues, actions: FormikActions<TCFDPasswordFormValues>) => void;
    onCancel: () => void;
};

export type TCFDDashboardContainer = {
    platform: CFD_Platform;
    active_index: number;
    is_dark_mode_on: boolean;
    dxtrade_tokens: {
        demo: string;
        real: string;
    };
};

export type TMT5AccountOpeningRealFinancialStpModal = {
    enableApp: () => void;
    disableApp: () => void;
    toggleCFDVerificationModal: () => void;
    is_cfd_verification_modal_visible: boolean;
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
    account_group: 'real' | 'demo';
    toggleModal?: () => void;
};

export type TResetPasswordIntent = {
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    children({ ...props }): React.ReactElement;
    is_eu: boolean;
};

export type TError = {
    code: string | number;
    message: string;
};

export type TCFDResetPasswordModal = RouteComponentProps & {
    current_list: Record<string, DetailsOfEachMT5Loginid>;
    email: string;
    is_cfd_reset_password_modal_enabled: boolean;
    is_eu: boolean;
    is_logged_in: boolean;
    platform: CFD_Platform;
    setCFDPasswordResetModal: (value: boolean) => void;
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

export type TInvestorPasswordManager = {
    error_message_investor: string;
    is_submit_success_investor: boolean;
    multi_step_ref: React.MutableRefObject<TMultiStepRefProps | undefined>;
    onSubmit: (values: TPasswordManagerModalFormValues) => Promise<void>;
    setPasswordType: (value: string) => void;
    toggleModal: () => void;
    validatePassword: (values: { old_password: string; new_password: string; password_type: string }) => void | object;
};

export type TCountdownComponent = {
    count_from: number;
    onTimeout: () => void;
};

export type TCFDPasswordReset = {
    sendVerifyEmail: () => Promise<VerifyEmailResponse>;
    account_type: string;
    account_group: 'real' | 'demo';
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
    account_group: 'real' | 'demo';
};

export type TCFDPasswordManagerModal = {
    enableApp: () => void;
    email: string;
    is_eu: boolean;
    disableApp: () => void;
    is_visible: boolean;
    platform: CFD_Platform;
    selected_login: string;
    selected_account: string;
    toggleModal: () => void;
    selected_account_type: string;
    selected_account_group: 'real' | 'demo';
    selected_server: string;
    sendVerifyEmail: () => Promise<VerifyEmailResponse>;
};
