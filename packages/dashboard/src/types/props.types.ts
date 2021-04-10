import { GetFinancialAssessment, GetSettings, ResidenceList, StatesList } from '@deriv/api-types';
import { TAccountList, TCurrenciesList } from 'Types';
import { TUpgradeInfo } from './params.types';

export type TClientProps = {
    is_logged_in: boolean;
    loginid: string;
    email_address: string;
    currency: string;
    currencies_list: TCurrenciesList;
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
    has_real_account?: () => boolean;
};

export type TConfigProps = {
    asset_path: string;
    has_router: boolean;
    routes: TRoutesProps;
};

export type TRoutesProps = {
    home: string;
    about_us: string;
    explore: string;
    resources: string;
    platform_dmt5_synthetic: string;
};

export interface TUIProps {
    height_offset: string;
    is_dark_mode_on: boolean;
    components: {
        Page404: React.ComponentType | React.ElementType | null;
    };
    real_account_signup: unknown;
    real_account_signup_target: string;
    resetRealAccountSignupParams?: () => void;
    openRealAccountSignup?: () => void;
}

type ReactTypes = React.ComponentType | React.ElementType;

type TLocalizeProps = {
    components?: ReactTypes[];
    i18n?: unknown;
    i18n_default_text: string;
    values?: {
        [k: string]: string;
    };
};

export type TStringTranslation = string | React.ReactElement<TLocalizeProps>;

// ref: https://www.carlrippon.com/react-children-with-typescript/
export type TReactChildren = React.ReactNode;
