import { useQuery } from '@deriv/api';
import useAuthorize from './useAuthorize';

/** A custom hook that gets the list of statuses of ctrader dxtrade mt5 platform. */
const useTradingPlatformStatus = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('trading_platform_status', {
        options: { enabled: isSuccess, refetchInterval: 120000 },
    });

    const tradingPlatformStatusData = data?.trading_platform_status;

    return {
        /** List of cfd platform statuses */
        data: tradingPlatformStatusData,
        ...rest,
    };
};

export default useTradingPlatformStatus;
