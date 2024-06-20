import { useMemo } from 'react';
import useAuthorizedQuery from '../useAuthorizedQuery';

const market_type_to_leverage_mapper: Record<string, number> = {
    gaming: 500,
    financial: 1000,
    all: 100,
};

/** A custom hook to get the list of available CTrader accounts. */
const useAvailableCTraderAccounts = () => {
    const { data: ctrader_available_accounts, ...rest } = useAuthorizedQuery('trading_platform_available_accounts', {
        platform: 'ctrader',
    });

    const modified_ctrader_available_accounts = useMemo(
        () =>
            ctrader_available_accounts?.trading_platform_available_accounts?.map(account => {
                return {
                    ...account,
                    /** The market type for the account */
                    market_type: account.market_type === 'gaming' ? 'synthetic' : account.market_type,
                    /** The platform for the account */
                    platform: 'ctrader',
                    /** Leverage for the account */
                    leverage:
                        market_type_to_leverage_mapper[
                            account.market_type as keyof typeof market_type_to_leverage_mapper
                        ],
                } as const;
            }),
        [ctrader_available_accounts?.trading_platform_available_accounts]
    );

    return {
        /** The available MT5 accounts */
        data: modified_ctrader_available_accounts,
        ...rest,
    };
};

export default useAvailableCTraderAccounts;
