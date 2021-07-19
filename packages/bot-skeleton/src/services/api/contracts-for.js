import { config } from '../../constants/config';
import PendingPromise from '../../utils/pending-promise';

export default class ContractsFor {
    constructor({ ws, server_time }) {
        this.cache_age_in_min = 10;
        this.contracts_for = {};
        this.ws = ws;
        this.server_time = server_time;
        // Below you can disable specific trade types and trade type categories, you may specify
        // market, submarket, symbol, trade_type, and trade_type_category. If one of
        // the props is left omitted, the rule applies to each of the values of the omitted prop.
        // e.g. if market omitted, rule will apply to all markets.
        this.disabled_options = [
            {
                submarket: 'smart_fx',
                trade_type: 'higherlower',
            },
            {
                submarket: 'minor_pairs',
                trade_type: 'higherlower',
            },
            {
                submarket: 'metals',
                trade_type: 'callputequal',
            },
            {
                market: 'indices',
                trade_type: 'callputequal',
            },
            {
                symbol: 'OTC_AS51',
                trade_type_category: 'inout',
            },
            { trade_type_category: 'lookback' },
            { trade_type_category: 'callputspread' },
        ];
        this.retrieving_contracts_for = {};
    }

    async getBarriers(symbol, trade_type, duration, barrier_types) {
        const barriers = { values: [] };

        if (!config.BARRIER_TRADE_TYPES.includes(trade_type)) {
            return barriers;
        }

        const barrier_props = ['high_barrier', 'low_barrier'];
        const contracts_for_category = await this.getContractsByTradeType(symbol, trade_type);
        const durations = await this.getDurations(symbol, trade_type, false);
        const offset_regexp = new RegExp('^[-|+]([0-9]+.[0-9]+)$');
        const isOffset = input => input && offset_regexp.test(input.toString());

        let has_absolute_default_value = true;

        if (contracts_for_category.length > 0) {
            barrier_types.forEach((barrier_type, index) => {
                const has_selected_offset_type = ['+', '-'].includes(barrier_type);
                const real_trade_type = this.getContractCategoryByTradeType(trade_type);

                let contract = contracts_for_category.find(c => {
                    const { BARRIER_CATEGORIES } = config;
                    const barrier_category = Object.keys(BARRIER_CATEGORIES).find(b =>
                        BARRIER_CATEGORIES[b].includes(trade_type)
                    );

                    const has_matching_category = c.contract_category === real_trade_type;
                    const has_matching_duration = durations.findIndex(d => d.unit === duration) !== -1;
                    const has_matching_barrier_category = c.barrier_category === barrier_category;
                    const has_matching_barrier_type =
                        // Match offset type barriers.
                        (has_selected_offset_type && isOffset(c.barrier || c[barrier_props[index]])) ||
                        // Match absolute type barriers.
                        (!has_selected_offset_type && !isOffset(c.barrier || c[barrier_props[index]]));

                    return (
                        has_matching_category &&
                        has_matching_duration &&
                        has_matching_barrier_category &&
                        has_matching_barrier_type
                    );
                });

                // Fallback to smallest available barriers if no contract could be found.
                if (!contract) {
                    contract = contracts_for_category
                        // Retrieve contracts with barriers.
                        .filter(c => c.barrier || c.high_barrier)
                        // Get contract with smallest barriers.
                        .sort((a, b) => {
                            const c = a.barrier || a.high_barrier;
                            const d = b.barrier || b.high_barrier;
                            return parseFloat(c) - parseFloat(d);
                        })
                        .shift();

                    if (contract && !has_selected_offset_type) {
                        has_absolute_default_value = false;
                    }
                }

                if (contract) {
                    const barrier_prop_name = contract.barriers === 1 ? 'barrier' : barrier_props[index];

                    if (contract[barrier_prop_name]) {
                        const barrier_match = `${contract[barrier_prop_name]}`.match(offset_regexp);
                        barriers.values[index] = barrier_match ? barrier_match[1] : contract[barrier_prop_name];
                    }

                    Object.assign(barriers, {
                        allow_both_types:
                            ['intraday', 'tick'].includes(contract.expiry_type) &&
                            isOffset(contract[barrier_prop_name]),
                        allow_absolute_type: barrier_type === 'absolute' && !isOffset(contract[barrier_prop_name]),
                    });

                    // Finish this loop prematurely if we only have a single barrier.
                    if (contract.barriers === 1) {
                        barrier_types.splice(index + 1, 1);
                    }
                }
            });

            if (!has_absolute_default_value) {
                barriers.values = barriers.values.map(() => false);
            } else if (
                barriers.values.length === 2 &&
                barrier_types.every(barrier_type => barrier_type === barrier_types[0]) &&
                barriers.values.every(barrier => barrier === barriers.values[0])
            ) {
                barriers.values[1] = (barriers.values[0] * 0.95).toFixed(1);
            }
        }

        return barriers;
    }

    // eslint-disable-next-line class-methods-use-this
    getContractCategoryByTradeType(trade_type) {
        const { TRADE_TYPE_TO_CONTRACT_CATEGORY_MAPPING } = config;

        return (
            Object.keys(TRADE_TYPE_TO_CONTRACT_CATEGORY_MAPPING).find(category =>
                TRADE_TYPE_TO_CONTRACT_CATEGORY_MAPPING[category].includes(trade_type)
            ) || trade_type
        );
    }

    // eslint-disable-next-line class-methods-use-this
    getTradeTypeCategoryByTradeType(trade_type) {
        const { TRADE_TYPE_CATEGORIES } = config;
        const trade_type_category = Object.keys(TRADE_TYPE_CATEGORIES).find(t =>
            TRADE_TYPE_CATEGORIES[t].includes(trade_type)
        );

        return trade_type_category || trade_type;
    }

    getTradeTypeCategoryNameByTradeType(trade_type) {
        const { TRADE_TYPE_CATEGORY_NAMES } = config;
        const trade_type_category = this.getTradeTypeCategoryByTradeType(trade_type);

        return TRADE_TYPE_CATEGORY_NAMES[trade_type_category];
    }

    // eslint-disable-next-line class-methods-use-this
    getBarrierCategoryByTradeType(trade_type) {
        const { BARRIER_CATEGORIES } = config;
        return Object.keys(BARRIER_CATEGORIES).find(barrier_category =>
            BARRIER_CATEGORIES[barrier_category].includes(trade_type)
        );
    }

    async getContractsByTradeType(symbol, trade_type) {
        const contracts = await this.getContractsFor(symbol);
        const contract_category = this.getContractCategoryByTradeType(trade_type);
        const barrier_category = this.getBarrierCategoryByTradeType(trade_type);

        return contracts.filter(contract => {
            const has_matching_category = contract.contract_category === contract_category;
            const has_matching_barrier = contract.barrier_category === barrier_category;

            return has_matching_category && has_matching_barrier;
        });
    }

    async getContractsFor(symbol) {
        if (!symbol || symbol === 'na') {
            return [];
        }

        const getContractsForFromApi = async () => {
            if (this.retrieving_contracts_for[symbol]) {
                await this.retrieving_contracts_for[symbol];
                return this.contracts_for[symbol].contracts;
            }

            this.retrieving_contracts_for[symbol] = new PendingPromise();
            const response = await this.ws.send({ contracts_for: symbol });

            if (response.error) {
                return [];
            }

            const {
                contracts_for: { available: contracts },
            } = response;

            // We don't offer forward-starting contracts in bot.
            const filtered_contracts = contracts.filter(c => c.start_type !== 'forward');

            this.contracts_for[symbol] = {
                contracts: filtered_contracts,
                timestamp: this.server_time.unix(),
            };

            this.retrieving_contracts_for[symbol].resolve();
            delete this.retrieving_contracts_for[symbol];

            return filtered_contracts;
        };

        if (this.contracts_for[symbol]) {
            const { contracts, timestamp } = this.contracts_for[symbol];
            const is_expired = this.server_time.unix() - timestamp > this.cache_age_in_min * 60;

            if (is_expired) {
                getContractsForFromApi();
            }

            return contracts;
        }

        return getContractsForFromApi();
    }

    async getDurations(symbol, trade_type, convert_day_to_hours = true) {
        if (trade_type === 'multiplier') {
            return [];
        }

        const contracts = await this.getContractsFor(symbol);
        const { NOT_AVAILABLE_DURATIONS, DEFAULT_DURATION_DROPDOWN_OPTIONS } = config;

        if (contracts.length === 0) {
            return NOT_AVAILABLE_DURATIONS;
        }

        const contracts_for_category = await this.getContractsByTradeType(symbol, trade_type);
        const durations = [];
        const getDurationIndex = input =>
            DEFAULT_DURATION_DROPDOWN_OPTIONS.findIndex(d => d[1] === input.replace(/\d+/g, ''));
        // convert 'duration' to 'unit_to_convert' e.g : convertDuration('10h', 's') will return 10*60*60s
        const convertDuration = (duration, unit_to_convert) => {
            const duration_value = duration.replace(/\D/g, '');
            const duration_index = getDurationIndex(duration);
            const target_index = DEFAULT_DURATION_DROPDOWN_OPTIONS.findIndex(
                default_duration => default_duration[1] === unit_to_convert
            );

            let converted_duration = parseInt(duration_value);

            DEFAULT_DURATION_DROPDOWN_OPTIONS.slice(target_index + 1, duration_index + 1)
                .reverse()
                .forEach(default_duration => {
                    switch (default_duration[1]) {
                        case 'm':
                        case 'h':
                            converted_duration *= 60;
                            break;
                        case 'd':
                            converted_duration *= 24;
                            break;
                        default:
                            break;
                    }
                });

            return converted_duration;
        };

        contracts_for_category.forEach(contract => {
            if (!contract.min_contract_duration || !contract.max_contract_duration) {
                return;
            }

            const start_index = getDurationIndex(contract.min_contract_duration);
            const end_index = getDurationIndex(
                contract.max_contract_duration === '1d' && convert_day_to_hours ? '24h' : contract.max_contract_duration
            );

            DEFAULT_DURATION_DROPDOWN_OPTIONS.slice(start_index, end_index + 1).forEach((default_duration, index) => {
                const is_existing_duration = durations.findIndex(d => d.unit === default_duration[1]) !== -1;

                if (!is_existing_duration) {
                    durations.push({
                        display: default_duration[0],
                        unit: default_duration[1],
                        min: index === 0 ? parseInt(contract.min_contract_duration.replace(/\D/g, '')) : 1,
                        max: convertDuration(contract.max_contract_duration, default_duration[1]),
                    });
                }
            });
        });

        // If only intraday contracts available, remove day durations
        if (contracts_for_category.every(contract => contract.expiry_type === 'intraday')) {
            const day_duration_index = durations.findIndex(d => d[1] === 'd');

            if (day_duration_index !== -1) {
                durations.splice(day_duration_index, 1);
            }
        }

        if (durations.length === 0) {
            return NOT_AVAILABLE_DURATIONS;
        }

        // Maintain order based on duration unit
        return durations.sort((a, b) => getDurationIndex(a.unit) - getDurationIndex(b.unit));
    }

    async getPredictionRange(symbol, trade_type) {
        const contracts = await this.getContractsByTradeType(symbol, trade_type);
        const contract_category = this.getContractCategoryByTradeType(trade_type);
        const prediction_range = [];
        const { DIGIT_CATEGORIES, opposites } = config;

        if (DIGIT_CATEGORIES.includes(contract_category) && trade_type !== 'evenodd') {
            const contract = contracts.find(c => {
                const categories = Object.keys(opposites);

                return categories.some(category =>
                    opposites[category].map(subcategory => Object.keys(subcategory)[0]).includes(c.contract_type)
                );
            });

            if (contract && contract.last_digit_range) {
                prediction_range.push(...contract.last_digit_range);
            } else {
                prediction_range.push(1, 2, 3, 4, 5, 6, 7, 8);
            }
        }

        return prediction_range;
    }

    async getMultiplierRange(symbol, trade_type) {
        const contracts = await this.getContractsByTradeType(symbol, trade_type);
        const multiplier_range = [];
        const { opposites } = config;

        const contract = contracts.find(c => {
            return Object.keys(opposites).some(category => {
                return opposites[category].map(subcategory => Object.keys(subcategory)[0]).includes(c.contract_type);
            });
        });

        if (contract?.multiplier_range) {
            multiplier_range.push(...contract.multiplier_range);
        }

        return multiplier_range;
    }

    async getMarketBySymbol(symbol) {
        const contracts = await this.getContractsFor(symbol);

        if (!contracts.length) {
            return 'na';
        }

        return contracts[0].market;
    }

    async getSubmarketBySymbol(symbol) {
        const contracts = await this.getContractsFor(symbol);

        if (!contracts.length) {
            return 'na';
        }

        return contracts[0].submarket;
    }

    async getGroupedTradeTypes(symbol) {
        const contracts = await this.getContractsFor(symbol);
        const trade_type_options = {};

        for (let i = 0; i < contracts.length; i++) {
            const market = contracts[i].market;
            const submarket = contracts[i].submarket;
            const trade_type_category = this.getTradeTypeCategoryByTradeType(contracts[i].contract_category);
            const trade_type_category_name = this.getTradeTypeCategoryNameByTradeType(contracts[i].contract_category);
            // eslint-disable-next-line no-await-in-loop
            const trade_types = await this.getTradeTypeByTradeCategory(market, submarket, symbol, trade_type_category);

            if (trade_type_category_name) {
                const is_disabled = this.isDisabledOption({
                    market,
                    submarket,
                    symbol,
                    trade_type_category,
                });

                if (!is_disabled) {
                    trade_type_options[trade_type_category_name] = trade_types;
                }
            }
        }

        return trade_type_options;
    }

    async getTradeTypeByTradeCategory(market, submarket, symbol, trade_type_category) {
        const { NOT_AVAILABLE_DURATIONS, TRADE_TYPE_CATEGORIES, opposites } = config;
        const subcategories = TRADE_TYPE_CATEGORIES[trade_type_category];
        const dropdown_options = [];

        if (subcategories && subcategories.length) {
            for (let i = 0; i < subcategories.length; i++) {
                const trade_type = subcategories[i];
                const durations = await this.getDurations(symbol, trade_type); // eslint-disable-line no-await-in-loop
                const has_durations = JSON.stringify(durations) !== JSON.stringify(NOT_AVAILABLE_DURATIONS);
                const is_disabled = this.isDisabledOption({
                    market,
                    submarket,
                    symbol,
                    trade_type_category,
                    trade_type,
                });

                if (!is_disabled && has_durations) {
                    const types = opposites[trade_type.toUpperCase()];
                    dropdown_options.push({
                        name: types.map(type => type[Object.keys(type)[0]]).join('/'),
                        value: trade_type,
                        icon: [Object.keys(types[0])[0], Object.keys(types[1])[0]],
                    });
                }
            }
        }

        return dropdown_options;
    }

    async getTradeTypeCategories(market, submarket, symbol) {
        const { TRADE_TYPE_CATEGORY_NAMES, NOT_AVAILABLE_DROPDOWN_OPTIONS } = config;
        const contracts = await this.getContractsFor(symbol);
        const trade_type_categories = [];

        contracts.forEach(contract => {
            const trade_type_category = this.getTradeTypeCategoryByTradeType(contract.contract_category);
            const trade_type_category_name = this.getTradeTypeCategoryNameByTradeType(contract.contract_category);

            if (trade_type_category_name) {
                const is_disabled = this.isDisabledOption({
                    market,
                    submarket,
                    symbol,
                    trade_type_category,
                });

                if (!is_disabled) {
                    const is_existing_category =
                        trade_type_categories.findIndex(c => c[1] === trade_type_category) !== -1;

                    if (!is_existing_category) {
                        trade_type_categories.push([trade_type_category_name, trade_type_category]);
                    }
                }
            }
        });

        if (trade_type_categories.length > 0) {
            const category_names = Object.keys(TRADE_TYPE_CATEGORY_NAMES);

            return trade_type_categories.sort((a, b) => {
                const index_a = category_names.findIndex(c => c === a[1]);
                const index_b = category_names.findIndex(c => c === b[1]);
                return index_a - index_b;
            });
        }

        return NOT_AVAILABLE_DROPDOWN_OPTIONS;
    }

    async getTradeTypes(market, submarket, symbol, trade_type_category) {
        const { NOT_AVAILABLE_DURATIONS, TRADE_TYPE_CATEGORIES, opposites } = config;
        const trade_types = [];
        const subcategories = TRADE_TYPE_CATEGORIES[trade_type_category];

        if (subcategories) {
            for (let i = 0; i < subcategories.length; i++) {
                const trade_type = subcategories[i];
                const durations = await this.getDurations(symbol, trade_type); // eslint-disable-line no-await-in-loop
                const has_durations = JSON.stringify(durations) !== JSON.stringify(NOT_AVAILABLE_DURATIONS);
                const is_disabled = this.isDisabledOption({
                    market,
                    submarket,
                    symbol,
                    trade_type_category,
                    trade_type,
                });

                if (!is_disabled && has_durations) {
                    const types = opposites[trade_type.toUpperCase()];
                    // e.g. [['Rise/Fall', 'callput']]
                    trade_types.push([types.map(type => type[Object.keys(type)[0]]).join('/'), trade_type]);
                }
            }
        }

        return trade_types.length > 0 ? trade_types : config.NOT_AVAILABLE_DROPDOWN_OPTIONS;
    }

    isDisabledOption(compare_obj) {
        return this.disabled_options.some(disabled_obj =>
            Object.keys(disabled_obj).every(prop => compare_obj[prop] === disabled_obj[prop])
        );
    }

    disposeCache() {
        this.contracts_for = {};
    }
}
