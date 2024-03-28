import { Jurisdiction } from '@deriv/shared';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { CFD_PLATFORMS, CATEGORY, MARKET_TYPE, MOBILE_PLATFORMS } from 'Helpers/cfd-config';

export type TMobilePlatforms = keyof typeof MOBILE_PLATFORMS;

type ValueOf<T> = T[keyof T];

export type TCFDPlatform = ValueOf<typeof CFD_PLATFORMS>;

export type TAccountCategory = ValueOf<typeof CATEGORY>;

export type TMarketType = ValueOf<typeof MARKET_TYPE>;

export type TTokens = {
    demo: string;
    real: string;
};

export type TJurisdiction = typeof Jurisdiction[keyof typeof Jurisdiction];

export type TTradingPlatformAvailableAccount = {
    name: string;
    sub_account_type: string;
    account_type?: TAccountCategory;
    market_type: ValueOf<typeof MARKET_TYPE>;
    requirements: {
        after_first_deposit: {
            financial_assessment: string[];
        };
        compliance: {
            mt5: string[];
            tax_information: string[];
        };
        signup: string[];
    };
    shortcode: DetailsOfEachMT5Loginid['landing_company_short'];
    landing_company_short?: DetailsOfEachMT5Loginid['landing_company_short'];
    max_count?: number;
    available_count?: number;
};
