import { createContext } from 'react';
import { useSubscription } from '@deriv/api';
import { TSocketAcceptableProps, TSocketResponseData } from '@deriv/api/types';

export type TP2PSettings =
    | (TSocketResponseData<'p2p_settings'>['p2p_settings'] & {
          is_cross_border_ads_enabled: boolean;
          is_disabled: boolean;
          is_payment_methods_enabled: boolean;
          rate_type: 'float' | 'fixed';
          float_rate_offset_limit_string: string;
          reached_target_date: boolean;
          currency_list: {
              display_name: string;
              has_adverts: 0 | 1;
              is_default: 1 | undefined;
              text: string;
              value: string;
          }[];
          order_expiry_options?: number[];
          order_payment_period_string: string;
      })
    | undefined;

type TP2PSettingsContext = {
    p2p_settings: TP2PSettings;
    subscribe: (...props: TSocketAcceptableProps<'p2p_settings'>) => void;
    rest: Omit<ReturnType<typeof useSubscription>, 'data' | 'subscribe'>;
};

const P2PSettingsContext = createContext<TP2PSettingsContext | null>(null);

export default P2PSettingsContext;
