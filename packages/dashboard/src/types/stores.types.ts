import { GetFinancialAssessment, GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import {
    TAccountCategory,
    TAccountType,
    TAccountList,
    TClientProps,
    TConfigProps,
    TCurrenciesList,
    TRoutesProps,
    TUIProps,
    TUpgradeInfo,
} from 'Types';

export type TClientStore = {
    init: (client_props: TClientProps) => void;
    email_address: string;
    currencies_list: TCurrenciesList;
    currency: string;
    is_logged_in: boolean;
    financial_assessment: GetFinancialAssessment;
    residence_list: ResidenceList;
    states_list: StatesList;
    accounts_list: TAccountList;
    account_settings?: GetSettings;
    upgrade_info: TUpgradeInfo;
    residence: string;
    upgradeable_landing_companies: string[];
    has_active_real_account?: () => boolean;
    upgradeable_currencies?: () => string[];
    fetchResidenceList?: () => void;
    fetchStatesList?: () => void;
    fetchFinancialAssessment?: () => void;
    needs_financial_assessment?: () => boolean;
    is_fully_authenticated?: () => boolean;
    realAccountSignup?: () => Promise<void>;
    has_currency?: () => boolean;
    setAccountCurrency?: () => void;
    has_wallet_account: boolean;
};

export type TConfigStore = {
    asset_path: string;
    has_router: boolean;
    redirect_404?: string;
    routes: TRoutesProps;
    setConfig: (config: TConfigProps) => void;
};

export type TMT5Store = {
    account_title: string;
    account_type: {
        category: TAccountCategory;
        type: TAccountType;
    };
    has_mt5_error: boolean;
    is_mt5_success_dialog_enabled: boolean;
    is_mt5_password_modal_enabled: boolean;
    error_message: string;
    setError: (x: boolean) => void;
    setMt5SuccessDialog: (x: boolean) => void;
    submitMt5Password: () => void;
    beginRealSignupForMt5: () => void;
    enableMt5PasswordModal: () => void;
    disableMt5PasswordModal: () => void;
};

export type TRootStore = {
    ui_store: TUIStore;
    client_store: TClientStore;
    config_store: TConfigStore;
    mt5_store: TMT5Store;
};

export type TUIStore = {
    components: {
        Page404?: React.ComponentType | React.ElementType;
    };
    is_dark_mode_on: boolean;
    init: (ui_props: TUIProps) => void;
    real_account_signup: unknown;
    real_account_signup_target: string;
    is_clear_funds_modal_open: boolean;
    is_get_wallet_modal_open: boolean;
    is_real_acc_signup_on: boolean;
    is_trade_modal_open: boolean;
    resetRealAccountSignupParams?: () => void;
    openRealAccountSignup: () => void;
    enableGetPasswordModal: () => void;
    disableGetPasswordModal: () => void;
    toggleTradeModal: (state_change?: boolean) => void;
    toggleClearFundsModal: (state_change?: boolean) => void;
};
