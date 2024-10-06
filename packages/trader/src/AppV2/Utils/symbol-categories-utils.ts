import { ActiveSymbols } from '@deriv/api-types';
import { localize } from '@deriv/translations';
import sortSymbols from './sort-symbols-utils';

type SubmarketGroup = {
    submarket_display_name: string;
    items: ActiveSymbols;
};

type SubgroupGroup = {
    subgroup_display_name: string;
    submarkets: Record<string, SubmarketGroup>;
};

export type MarketGroup = {
    market: string;
    market_display_name: string;
    subgroups: Record<string, SubgroupGroup>;
};

export const categorizeSymbols = (symbols: ActiveSymbols): Record<string, MarketGroup> => {
    if (symbols.length === 0) {
        return {};
    }
    // Categorize ActiveSymbols array into object categorized by markets
    const sortedSymbols = sortSymbols(symbols);
    let categorizedSymbols = sortedSymbols.reduce((acc: Record<string, MarketGroup>, symbol: ActiveSymbols[0]) => {
        const { market, market_display_name, subgroup, subgroup_display_name, submarket, submarket_display_name } =
            symbol;

        acc[market] ??= { market, market_display_name, subgroups: {} };

        acc[market].subgroups[subgroup] ??= {
            subgroup_display_name,
            submarkets: {},
        };

        acc[market].subgroups[subgroup].submarkets[submarket] ??= {
            submarket_display_name,
            items: [],
        };

        acc[market].subgroups[subgroup].submarkets[submarket].items.push(symbol);

        return acc;
    }, {});
    // Sort categorizedSymbols by submarket_display_name
    Object.keys(categorizedSymbols).forEach(market => {
        Object.keys(categorizedSymbols[market].subgroups).forEach(subgroup => {
            const submarkets = categorizedSymbols[market].subgroups[subgroup].submarkets;
            const sortedSubmarkets = Object.entries(submarkets)
                .sort(([, a], [, b]) => a.submarket_display_name.localeCompare(b.submarket_display_name))
                .reduce((sortedAcc, [key, value]) => {
                    sortedAcc[key] = value;
                    return sortedAcc;
                }, {} as Record<string, SubmarketGroup>);
            categorizedSymbols[market].subgroups[subgroup].submarkets = sortedSubmarkets;
        });
    });

    //format the all submarkets into a single subgroup objects, renaming keys, and subgroup_display_name if they are 'none'
    const allCategory = Object.values(categorizedSymbols).reduce((result, item) => {
        Object.keys(item.subgroups).forEach(key => {
            const newKey = key === 'none' ? item.market : key;
            const newName = key === 'none' ? item.market_display_name : item.subgroups[key].subgroup_display_name;

            result[newKey] = {
                subgroup_display_name: newName,
                submarkets: item.subgroups[key].submarkets,
            };
        });

        return result;
    }, {} as Record<string, SubgroupGroup>);

    // Assign a new category called 'all' with the same data shape as the rest of the categories for rendering
    categorizedSymbols = {
        favorites: {
            market: 'favorites',
            market_display_name: localize('Favourites'),
            subgroups: {},
        },
        all: {
            market: 'all',
            market_display_name: localize('All'),
            subgroups: { ...allCategory } as Record<string, SubgroupGroup>,
        },
        /// spread the rest of the categories into final object
        ...categorizedSymbols,
    };

    return categorizedSymbols;
};
