/* eslint-disable camelcase */
/* 
    TODO: Remove these types once API types for client_kyc_status is available for mt5_login_list and trading_platform_available_accounts from BE
*/
import { THooks } from '../../types';
import { JURISDICTION } from './constants';

type TStatuses = 'expired' | 'none' | 'pending' | 'rejected' | 'suspected' | 'verified';

export type TModifiedMT5Accounts = THooks.SortedMT5Accounts & {
    client_kyc_status: {
        poa_status: TStatuses;
        poi_status: TStatuses;
        valid_tin: 0 | 1;
    };
    licence_number: string;
    regulatory_authority: string;
    shortcode: typeof JURISDICTION[keyof typeof JURISDICTION];
};
