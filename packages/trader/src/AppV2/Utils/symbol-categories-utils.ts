import { ActiveSymbols } from '@deriv/api-types';
import { localize } from '@deriv/translations';

type SubmarketGroup = {
    submarket_display_name: string;
    items: ActiveSymbols[];
};

type SubgroupGroup = {
    subgroup_display_name: string;
    submarkets: Record<string, SubmarketGroup>;
};

type MarketGroup = {
    market_display_name: string;
    subgroups: Record<string, SubgroupGroup>;
};

export const categorizeSymbols = (symbols: ActiveSymbols[]): Record<string, MarketGroup> => {
    if (symbols.length === 0) {
        return {};
    }
    let categorizedSymbols = symbols.reduce((acc: Record<string, MarketGroup>, symbol: ActiveSymbols) => {
        //@ts-expect-error type is correct but not sure why its complaining
        const { market, market_display_name, subgroup, subgroup_display_name, submarket, submarket_display_name } =
            symbol;

        if (!acc[market]) {
            acc[market] = {
                market_display_name,
                subgroups: {},
            };
        }

        if (!acc[market].subgroups[subgroup]) {
            acc[market].subgroups[subgroup] = {
                subgroup_display_name,
                submarkets: {},
            };
        }

        if (!acc[market].subgroups[subgroup].submarkets[submarket]) {
            acc[market].subgroups[subgroup].submarkets[submarket] = {
                submarket_display_name,
                items: [],
            };
        }

        acc[market].subgroups[subgroup].submarkets[submarket].items.push(symbol);

        return acc;
    }, {});

    categorizedSymbols = {
        all: {
            market_display_name: localize('All'),
            subgroups: {},
            ...categorizedSymbols,
        },
        ...categorizedSymbols,
    };
    return categorizedSymbols;
};
