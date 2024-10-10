import { FormikHelpers } from 'formik';
import { DetailsOfEachMT5Loginid, Mt5NewAccount, VerifyEmailResponse } from '@deriv/api-types';
import { TDetailsOfEachMT5Loginid, TProducts, TModifiedTradingPlatformAvailableAccount } from 'Components/props.types';
import { TCFDPasswordFormValues } from 'Containers/cfd-password-modal';
import { TDxCompanies, TMtCompanies } from 'Stores/Modules/CFD/Helpers/cfd-config';

export type TCFDStore = {
    setMT5TradeAccount: <T>(arg: T) => void;
    setJurisdictionSelectedShortcode: (shortcode: string) => void;
    setAccountType: (account_type: { category: string; type?: string }) => void;
    product: TProducts;
    dxtrade_tokens: {
        demo: string;
        real: string;
    };
    ctrader_tokens: {
        demo: string;
        real: string;
    };
    loadCTraderTokens: (url: string, account_type: 'real' | 'demo') => void;
    mt5_trade_account: Required<
        TDetailsOfEachMT5Loginid & {
            market_type?: TModifiedTradingPlatformAvailableAccount['market_type'] | 'synthetic';
        }
    >;
    real_synthetic_accounts_existing_data: DetailsOfEachMT5Loginid & DetailsOfEachMT5Loginid[];
    real_swapfree_accounts_existing_data: DetailsOfEachMT5Loginid & DetailsOfEachMT5Loginid[];
    real_financial_accounts_existing_data: DetailsOfEachMT5Loginid & DetailsOfEachMT5Loginid[];
    account_type: {
        type: string;
        category: string;
    };
    jurisdiction_selected_shortcode: string;
    clearCFDError: () => void;
    current_list: Record<string, DetailsOfEachMT5Loginid & { enabled: number } & DetailsOfEachMT5Loginid[]>;
    is_compare_accounts_visible: boolean;
    toggleCompareAccountsModal: () => void;
    dxtrade_companies: TDxCompanies;
    mt5_companies: TMtCompanies;
    platform: string;
    topUpVirtual: (platform: string) => void;
    current_account?: DetailsOfEachMT5Loginid & {
        category: string;
        type: string;
    };
    sendVerifyEmail: () => Promise<VerifyEmailResponse>;
    account_title: string;
    migrated_mt5_accounts: Record<string, string>[];
    disableCFDPasswordModal: () => void;
    error_message: string;
    error_type?: string;
    getAccountStatus: (platform: string) => void;
    mt5_migration_error: string;
    has_cfd_error: boolean;
    is_cfd_password_modal_enabled: boolean;
    is_cfd_success_dialog_enabled: boolean;
    is_from_mt5_migration_modal: boolean;
    is_sent_email_modal_enabled: boolean;
    setCFDSuccessDialog: (value: boolean) => void;
    setMT5MigrationError: (value: string) => void;
    setIsFromMt5MigrationModal: (value: boolean) => void;
    setMigratedMT5Accounts: (value: Record<string, string>[]) => void;
    setError: (state: boolean, obj?: Error) => void;
    submitMt5Password: (
        values: TCFDPasswordFormValues,
        actions: FormikHelpers<TCFDPasswordFormValues>
    ) => Promise<void>;
    submitCFDPassword: (
        values: TCFDPasswordFormValues & { platform?: string },
        actions: FormikHelpers<TCFDPasswordFormValues>
    ) => void;
    new_account_response: Mt5NewAccount;
    enableCFDPasswordModal: () => void;
    setSentEmailModalStatus: (status: boolean) => void;
    onMount: () => void;
    onUnmount: () => void;
    setCurrentAccount: (
        data: DetailsOfEachMT5Loginid,
        meta: {
            category: string;
            type?: string;
        }
    ) => void;
    getRealSyntheticAccountsExistingData: (getRealSyntheticAccountsExistingData?: DetailsOfEachMT5Loginid[]) => void;
    getRealFinancialAccountsExistingData: (getRealSyntheticAccountsExistingData?: DetailsOfEachMT5Loginid[]) => void;
    toggleMT5TradeModal: () => void;
    beginRealSignupForMt5: () => void;
    checkShouldOpenAccount: () => void;
    is_mt5_trade_modal_visible: boolean;
    createCFDAccount: (objCFDAccount: {
        category: string;
        type: string;
        set_password?: number;
        platform?: string;
    }) => void;
    is_mt5_password_invalid_format_modal_visible: boolean;
    setIsMt5PasswordInvalidFormatModalVisible: (value: boolean) => void;
    is_mt5_password_changed_modal_visible: boolean;
    setIsMt5PasswordChangedModalVisible: (value: boolean) => void;
    setServerMaintenanceModal: (value: boolean) => void;
    setAccountUnavailableModal: (value: boolean) => void;
    is_server_maintenance_modal_visible: boolean;
    is_account_unavailable_modal_visible: boolean;
};
