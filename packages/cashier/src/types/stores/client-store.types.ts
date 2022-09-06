import { GetAccountStatus, Authorize } from '@deriv/api-types';

type TAccount = NonNullable<Authorize['account_list']>[0];

export type TClientStore = {
    account_status: GetAccountStatus;
    accounts: { [k: string]: TAccount };
    balance?: string;
    currency: string;
    current_currency_type?: string;
    current_fiat_currency?: string;
    is_account_setting_loaded: boolean;
    is_deposit_lock: boolean;
    is_identity_verification_needed: boolean;
    is_logged_in: boolean;
    is_logging_in: boolean;
    is_switching: boolean;
    is_virtual: boolean;
    is_withdrawal_lock: boolean;
    local_currency_config: {
        currency: string;
        decimal_places?: number;
    };
    loginid?: string;
    residence: string;
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
    email: string;
};
