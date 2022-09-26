import { GetAccountStatus, Authorize, DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { TMT5LoginAccount } from 'Types';

type TAccount = NonNullable<Authorize['account_list']>[0];

// balance is missing in @deriv/api-types
type TActiveAccounts = TAccount & {
    balance?: number;
};

type TResponseMt5LoginList = {
    mt5_login_list: Array<DetailsOfEachMT5Loginid>;
};

type TResponseTradingPlatformAccountsList = {
    trading_platform_accounts: Array<TMT5LoginAccount>;
};

export type TClientStore = {
    accounts: { [k: string]: TAccount };
    account_limits: {
        daily_transfers?: {
            [k: string]: {
                allowed: boolean;
                available: boolean;
            };
        };
    };
    account_status: GetAccountStatus;
    active_accounts: Array<TActiveAccounts>;
    balance?: string;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    getLimits: () => void;
    has_maltainvest_account: boolean;
    is_account_setting_loaded: boolean;
    is_deposit_lock: boolean;
    is_dxtrade_allowed: boolean;
    is_eu: boolean;
    is_financial_account: boolean;
    is_financial_information_incomplete: boolean;
    is_identity_verification_needed: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_switching: boolean;
    is_trading_experience_incomplete: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    landing_company_shortcode: string;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    mt5_login_list: Array<DetailsOfEachMT5Loginid>;
    residence: string;
    responseMt5LoginList: ({ mt5_login_list }: TResponseMt5LoginList) => Array<DetailsOfEachMT5Loginid>;
    responseTradingPlatformAccountsList: ({
        trading_platform_accounts,
    }: TResponseTradingPlatformAccountsList) => Array<TMT5LoginAccount>;
    setAccountStatus: (status?: GetAccountStatus) => void;
    setBalanceOtherAccounts: (balance: number) => void;
    switchAccount: (value?: string) => void;
    verification_code: {
        payment_agent_withdraw: string;
        payment_withdraw: string;
        request_email: string;
        reset_password: string;
        signup: string;
        system_email_change: string;
        trading_platform_dxtrade_password_reset: string;
        trading_platform_mt5_password_reset: string;
    };
};
