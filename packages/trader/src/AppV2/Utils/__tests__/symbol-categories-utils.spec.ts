import { categorizeSymbols } from '../symbol-categories-utils';
import { ActiveSymbols } from '@deriv/api-types';

describe('categorizeSymbols', () => {
    const symbols = [
        {
            symbol: 'cryBTCUSD',
            display_name: 'BTC/USD',
            market: 'cryptocurrency',
            market_display_name: 'Cryptocurrencies',
            subgroup: 'none',
            subgroup_display_name: 'None',
            submarket: 'non_stable_coin',
            submarket_display_name: 'Cryptocurrencies',
        },
        {
            symbol: 'frxXAUUSD',
            display_name: 'Gold/USD',
            market: 'commodities',
            market_display_name: 'Commodities',
            subgroup: 'none',
            subgroup_display_name: 'None',
            submarket: 'metals',
            submarket_display_name: 'Metals',
        },
        {
            symbol: 'OTC_SPC',
            display_name: 'US 500',
            market: 'indices',
            market_display_name: 'Stock Indices',
            subgroup: 'none',
            subgroup_display_name: 'None',
            submarket: 'americas_OTC',
            submarket_display_name: 'American indices',
        },
        {
            symbol: 'BOOM300N',
            display_name: 'Boom 300 Index',
            market: 'synthetic_index',
            market_display_name: 'Derived',
            subgroup: 'synthetics',
            subgroup_display_name: 'Synthetics',
            submarket: 'crash_index',
            submarket_display_name: 'Crash/Boom Indices',
        },
        {
            symbol: 'WLDXAU',
            display_name: 'Gold Basket',
            market: 'synthetic_index',
            market_display_name: 'Derived',
            subgroup: 'baskets',
            subgroup_display_name: 'Baskets',
            submarket: 'commodity_basket',
            submarket_display_name: 'Commodities Basket',
        },
        {
            symbol: 'frxAUDUSD',
            display_name: 'AUD/USD',
            market: 'forex',
            market_display_name: 'Forex',
            subgroup: 'none',
            subgroup_display_name: 'None',
            submarket: 'major_pairs',
            submarket_display_name: 'Major Pairs',
        },
    ] as ActiveSymbols;

    const expectedOutput = {
        favorites: {
            market: 'favorites',
            market_display_name: 'Favourites',
            subgroups: {},
        },
        all: {
            market: 'all',
            market_display_name: 'All',
            subgroups: {
                baskets: {
                    subgroup_display_name: 'Baskets',
                    submarkets: {
                        commodity_basket: {
                            submarket_display_name: 'Commodities Basket',
                            items: [
                                {
                                    symbol: 'WLDXAU',
                                    display_name: 'Gold Basket',
                                    market: 'synthetic_index',
                                    market_display_name: 'Derived',
                                    subgroup: 'baskets',
                                    subgroup_display_name: 'Baskets',
                                    submarket: 'commodity_basket',
                                    submarket_display_name: 'Commodities Basket',
                                },
                            ],
                        },
                    },
                },
                commodities: {
                    subgroup_display_name: 'Commodities',
                    submarkets: {
                        metals: {
                            submarket_display_name: 'Metals',
                            items: [
                                {
                                    symbol: 'frxXAUUSD',
                                    display_name: 'Gold/USD',
                                    market: 'commodities',
                                    market_display_name: 'Commodities',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'metals',
                                    submarket_display_name: 'Metals',
                                },
                            ],
                        },
                    },
                },
                cryptocurrency: {
                    subgroup_display_name: 'Cryptocurrencies',
                    submarkets: {
                        non_stable_coin: {
                            submarket_display_name: 'Cryptocurrencies',
                            items: [
                                {
                                    symbol: 'cryBTCUSD',
                                    display_name: 'BTC/USD',
                                    market: 'cryptocurrency',
                                    market_display_name: 'Cryptocurrencies',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'non_stable_coin',
                                    submarket_display_name: 'Cryptocurrencies',
                                },
                            ],
                        },
                    },
                },
                forex: {
                    subgroup_display_name: 'Forex',
                    submarkets: {
                        major_pairs: {
                            submarket_display_name: 'Major Pairs',
                            items: [
                                {
                                    symbol: 'frxAUDUSD',
                                    display_name: 'AUD/USD',
                                    market: 'forex',
                                    market_display_name: 'Forex',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'major_pairs',
                                    submarket_display_name: 'Major Pairs',
                                },
                            ],
                        },
                    },
                },
                indices: {
                    subgroup_display_name: 'Stock Indices',
                    submarkets: {
                        americas_OTC: {
                            submarket_display_name: 'American indices',
                            items: [
                                {
                                    symbol: 'OTC_SPC',
                                    display_name: 'US 500',
                                    market: 'indices',
                                    market_display_name: 'Stock Indices',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'americas_OTC',
                                    submarket_display_name: 'American indices',
                                },
                            ],
                        },
                    },
                },
                synthetics: {
                    subgroup_display_name: 'Synthetics',
                    submarkets: {
                        crash_index: {
                            submarket_display_name: 'Crash/Boom Indices',
                            items: [
                                {
                                    symbol: 'BOOM300N',
                                    display_name: 'Boom 300 Index',
                                    market: 'synthetic_index',
                                    market_display_name: 'Derived',
                                    subgroup: 'synthetics',
                                    subgroup_display_name: 'Synthetics',
                                    submarket: 'crash_index',
                                    submarket_display_name: 'Crash/Boom Indices',
                                },
                            ],
                        },
                    },
                },
            },
        },
        synthetic_index: {
            market: 'synthetic_index',
            market_display_name: 'Derived',
            subgroups: {
                baskets: {
                    subgroup_display_name: 'Baskets',
                    submarkets: {
                        commodity_basket: {
                            submarket_display_name: 'Commodities Basket',
                            items: [
                                {
                                    symbol: 'WLDXAU',
                                    display_name: 'Gold Basket',
                                    market: 'synthetic_index',
                                    market_display_name: 'Derived',
                                    subgroup: 'baskets',
                                    subgroup_display_name: 'Baskets',
                                    submarket: 'commodity_basket',
                                    submarket_display_name: 'Commodities Basket',
                                },
                            ],
                        },
                    },
                },
                synthetics: {
                    subgroup_display_name: 'Synthetics',
                    submarkets: {
                        crash_index: {
                            submarket_display_name: 'Crash/Boom Indices',
                            items: [
                                {
                                    symbol: 'BOOM300N',
                                    display_name: 'Boom 300 Index',
                                    market: 'synthetic_index',
                                    market_display_name: 'Derived',
                                    subgroup: 'synthetics',
                                    subgroup_display_name: 'Synthetics',
                                    submarket: 'crash_index',
                                    submarket_display_name: 'Crash/Boom Indices',
                                },
                            ],
                        },
                    },
                },
            },
        },
        forex: {
            market: 'forex',
            market_display_name: 'Forex',
            subgroups: {
                none: {
                    subgroup_display_name: 'None',
                    submarkets: {
                        major_pairs: {
                            submarket_display_name: 'Major Pairs',
                            items: [
                                {
                                    symbol: 'frxAUDUSD',
                                    display_name: 'AUD/USD',
                                    market: 'forex',
                                    market_display_name: 'Forex',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'major_pairs',
                                    submarket_display_name: 'Major Pairs',
                                },
                            ],
                        },
                    },
                },
            },
        },
        indices: {
            market: 'indices',
            market_display_name: 'Stock Indices',
            subgroups: {
                none: {
                    subgroup_display_name: 'None',
                    submarkets: {
                        americas_OTC: {
                            submarket_display_name: 'American indices',
                            items: [
                                {
                                    symbol: 'OTC_SPC',
                                    display_name: 'US 500',
                                    market: 'indices',
                                    market_display_name: 'Stock Indices',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'americas_OTC',
                                    submarket_display_name: 'American indices',
                                },
                            ],
                        },
                    },
                },
            },
        },
        cryptocurrency: {
            market: 'cryptocurrency',
            market_display_name: 'Cryptocurrencies',
            subgroups: {
                none: {
                    subgroup_display_name: 'None',
                    submarkets: {
                        non_stable_coin: {
                            submarket_display_name: 'Cryptocurrencies',
                            items: [
                                {
                                    symbol: 'cryBTCUSD',
                                    display_name: 'BTC/USD',
                                    market: 'cryptocurrency',
                                    market_display_name: 'Cryptocurrencies',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'non_stable_coin',
                                    submarket_display_name: 'Cryptocurrencies',
                                },
                            ],
                        },
                    },
                },
            },
        },
        commodities: {
            market: 'commodities',
            market_display_name: 'Commodities',
            subgroups: {
                none: {
                    subgroup_display_name: 'None',
                    submarkets: {
                        metals: {
                            submarket_display_name: 'Metals',
                            items: [
                                {
                                    symbol: 'frxXAUUSD',
                                    display_name: 'Gold/USD',
                                    market: 'commodities',
                                    market_display_name: 'Commodities',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'metals',
                                    submarket_display_name: 'Metals',
                                },
                            ],
                        },
                    },
                },
            },
        },
    };

    it('should categorize symbols correctly', () => {
        const result = categorizeSymbols(symbols);
        expect(result).toEqual(expectedOutput);
    });

    it('should return empty object for empty symbols array', () => {
        const result = categorizeSymbols([]);
        expect(result).toEqual({});
    });
});
