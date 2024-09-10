import {
    WS,
    getPropertyValue,
    getSortedTradeTypes,
    cloneObject,
    isTimeValid,
    minDate,
    toMoment,
    getUnitMap,
    buildBarriersConfig,
    buildDurationConfig,
    hasIntradayDurationUnit,
    buildForwardStartingConfig,
    unsupported_contract_types_list,
    getCleanedUpCategories,
    getContractCategoriesConfig,
    getContractTypesConfig,
    getContractSubtype,
    getLocalizedBasis,
    TTradeTypesCategories,
    TRADE_TYPES,
    isDTraderV2,
} from '@deriv/shared';
import ServerTime from '_common/base/server_time';
import { localize } from '@deriv/translations';
import { isSessionAvailable } from './start-date';
import { ContractsFor, ContractsForSymbolResponse, TradingTimes, TradingTimesResponse } from '@deriv/api-types';
import { TConfig, TTradeStore } from 'Types';

type TBarriers = Record<
    keyof TTradeStore['duration_min_max'],
    {
        barrier?: string;
        high_barrier?: string;
        low_barrier?: string;
    }
> & {
    count: number;
};

type TNonAvailableContractsList = Record<'contract_category' | 'contract_display_name' | 'contract_type', string>[];
type TTextValueStrings = {
    text: string;
    value: string;
};
type TTimes = {
    open: string[];
    close: string[];
};
type TEvents =
    | {
          dates: string;
          descrip: string;
      }[]
    | [];

export const ContractType = (() => {
    type TContractValues = ReturnType<typeof getComponents> &
        ReturnType<typeof getBasis> &
        ReturnType<typeof getTradeTypes> &
        ReturnType<typeof getStartDates> &
        ReturnType<typeof getStartType> &
        ReturnType<typeof getBarriers> &
        ReturnType<typeof getDurationUnit> &
        ReturnType<typeof getDurationUnitsList> &
        ReturnType<typeof getDurationMinMax> &
        ReturnType<typeof getAccumulatorRange> &
        ReturnType<typeof getMultiplierRange> &
        ReturnType<typeof getCancellation> &
        ReturnType<typeof getExpiryType> &
        ReturnType<typeof getEqualProps>;

    let available_contract_types: ReturnType<typeof getContractTypesConfig> = {};
    let available_categories: TTradeTypesCategories = {};
    let contract_types: ReturnType<typeof getContractTypesConfig>;
    let non_available_categories: TTradeTypesCategories = {};
    const trading_events: { [key: string]: Record<string, TEvents | undefined> } = {};
    const trading_times: { [key: string]: Record<string, TTimes> } = {};
    let has_only_forward_starting_contracts = false;

    const buildContractTypesConfig = (symbol: string): Promise<void> =>
        WS.contractsFor(symbol).then((r: Required<ContractsForSymbolResponse>) => {
            const has_contracts = getPropertyValue(r, ['contracts_for']);
            has_only_forward_starting_contracts =
                has_contracts && !r.contracts_for.available.find(contract => contract.start_type !== 'forward');
            if (!has_contracts || has_only_forward_starting_contracts) return;
            const contract_categories = getContractCategoriesConfig();
            contract_types = getContractTypesConfig(symbol);
            available_contract_types = {};
            available_categories = cloneObject(contract_categories); // To preserve the order (will clean the extra items later in this function)
            r.contracts_for.available.forEach(contract => {
                const type = Object.keys(contract_types).find(
                    key =>
                        contract_types[key].trade_types.indexOf(contract.contract_type) !== -1 &&
                        (typeof contract_types[key].barrier_count === 'undefined' ||
                            Number(contract_types[key].barrier_count) === contract.barriers) // To distinguish betweeen Rise/Fall & Higher/Lower
                );

                if (!type) return; // ignore unsupported contract types

                if (!available_contract_types[type]) {
                    // extend contract_categories to include what is needed to create the contract list
                    const sub_cats =
                        available_categories[
                            Object.keys(available_categories).find(
                                key => available_categories[key].categories.indexOf(type) !== -1
                            ) ?? ''
                        ].categories;

                    if (!sub_cats) return;

                    sub_cats[(sub_cats as string[]).indexOf(type)] = { value: type, text: contract_types[type].title };

                    // populate available contract types
                    available_contract_types[type] = cloneObject(contract_types[type]);
                }
                const config: TConfig = available_contract_types[type].config || {};

                // set config values
                config.has_spot = config.has_spot || contract.start_type === 'spot';
                config.durations = config.hide_duration ? undefined : buildDurationConfig(contract, config.durations);
                config.trade_types = buildTradeTypesConfig(contract, config.trade_types);
                config.barriers = buildBarriersConfig(contract, config.barriers);
                config.barrier_category = contract.barrier_category as TConfig['barrier_category'];
                config.barrier_choices = contract.barrier_choices as TConfig['barrier_choices'];
                config.forward_starting_dates = buildForwardStartingConfig(contract, config.forward_starting_dates);
                config.growth_rate_range = contract.growth_rate_range as TConfig['growth_rate_range'];
                config.multiplier_range = contract.multiplier_range as TConfig['multiplier_range'];
                config.cancellation_range = contract.cancellation_range as TConfig['cancellation_range'];

                available_contract_types[type].config = config;
            });
            available_categories = getCleanedUpCategories(available_categories);

            non_available_categories = {};
            const mutable_contracts_config = cloneObject(contract_categories);
            const getCategories = (key = ''): string[] => mutable_contracts_config[key]?.categories ?? [];
            const non_available_contracts = r.contracts_for.non_available as TNonAvailableContractsList;

            if (non_available_contracts) {
                non_available_contracts.forEach(({ contract_type }) => {
                    const type =
                        Object.keys(contract_types).find(key =>
                            contract_types[key].trade_types.includes(contract_type)
                        ) ?? '';
                    const key = Object.keys(mutable_contracts_config).find(key => getCategories(key).includes(type));
                    const categories: Array<string | TTextValueStrings> = getCategories(key);
                    const title = contract_types[type]?.title;
                    const is_available = !!available_categories[key as keyof TTradeTypesCategories]?.categories?.find(
                        el => (el as TTextValueStrings).text === title
                    );
                    if (categories.includes(type) && !is_available) {
                        categories[categories.indexOf(type)] = { value: type, text: title };
                    }
                    if (key) {
                        non_available_categories[key] = mutable_contracts_config[key];
                    }
                });
            }
            non_available_categories = getCleanedUpCategories(non_available_categories);
        });

    const buildTradeTypesConfig = (
        contract: ContractsFor['available'][number],
        trade_types: { [key: string]: string } = {}
    ) => {
        trade_types[contract.contract_type] = contract.contract_display ?? '';
        return trade_types;
    };

    const getArrayDefaultValue = <T>(arr_new_values: Array<T>, value: T): T =>
        arr_new_values.indexOf(value) !== -1 ? value : arr_new_values[0];

    const getContractValues = (store: TTradeStore): TContractValues | Record<string, never> => {
        const {
            contract_expiry_type,
            contract_type,
            basis,
            duration_unit,
            expiry_type,
            multiplier,
            start_date,
            cancellation_duration,
            short_barriers,
            long_barriers,
            strike_price_choices,
            v2_params_initial_values,
        } = store;

        if (!contract_type) return {};

        let stored_barriers_data: TTradeStore['short_barriers' | 'long_barriers' | 'strike_price_choices'];
        switch (getContractSubtype(contract_type)) {
            case 'Short':
                stored_barriers_data = short_barriers;
                break;
            case 'Long':
                stored_barriers_data = long_barriers;
                break;
            case 'Call':
            case 'Put':
                stored_barriers_data =
                    v2_params_initial_values?.strike && isDTraderV2()
                        ? ({
                              ...strike_price_choices,
                              barrier: v2_params_initial_values.strike,
                          } as TTradeStore['strike_price_choices'])
                        : strike_price_choices;
                break;
            default:
                stored_barriers_data = {};
        }

        const form_components = getComponents(contract_type);
        const obj_basis = getBasis(contract_type, basis);
        const obj_trade_types = getTradeTypes(contract_type);
        const obj_start_dates = getStartDates(contract_type, start_date);
        const obj_start_type = getStartType(obj_start_dates.start_date);
        const obj_barrier = getBarriers(contract_type, contract_expiry_type, stored_barriers_data?.barrier);
        const obj_duration_unit = getDurationUnit(duration_unit, contract_type, obj_start_type.contract_start_type);

        const obj_duration_units_list = getDurationUnitsList(contract_type, obj_start_type.contract_start_type);
        const obj_duration_units_min_max = getDurationMinMax(contract_type, obj_start_type.contract_start_type);
        const obj_accumulator_range_list = getAccumulatorRange(contract_type);
        const obj_barrier_choices = getBarrierChoices(contract_type, stored_barriers_data?.barrier_choices);
        const obj_multiplier_range_list = getMultiplierRange(contract_type, multiplier);
        const obj_cancellation = getCancellation(contract_type, cancellation_duration);
        const obj_expiry_type = getExpiryType(obj_duration_units_list.duration_units_list, expiry_type);
        const obj_equal = getEqualProps(contract_type);

        return {
            ...form_components,
            ...obj_basis,
            ...obj_trade_types,
            ...obj_start_dates,
            ...obj_start_type,
            ...obj_barrier,
            ...obj_duration_unit,
            ...obj_duration_units_list,
            ...obj_duration_units_min_max,
            ...obj_expiry_type,
            ...obj_accumulator_range_list,
            ...obj_barrier_choices,
            ...obj_multiplier_range_list,
            ...obj_cancellation,
            ...obj_equal,
        };
    };

    const getContractType = (list: TTradeTypesCategories, contractType: string) => {
        const filteredList = Object.keys(list || {})
            .reduce<string[]>((k, l) => [...k, ...(list[l].categories as TTextValueStrings[]).map(ct => ct.value)], [])
            .filter(
                type =>
                    !unsupported_contract_types_list.includes(type as typeof unsupported_contract_types_list[number])
            );
        const sortedList = getSortedTradeTypes(filteredList);

        return {
            contract_type: getArrayDefaultValue(sortedList, contractType),
        };
    };

    const getComponents = (c_type: string) => {
        const check = ['duration', 'amount', ...contract_types[c_type]?.components].filter(
            component =>
                !(
                    component === 'duration' &&
                    contract_types[c_type].config &&
                    contract_types[c_type].config?.hide_duration
                )
        );
        return (
            contract_types && {
                form_components: check,
            }
        );
    };

    const getDurationUnitsList = (contract_type: string, contract_start_type: string) => {
        return {
            duration_units_list:
                (getPropertyValue(available_contract_types, [
                    contract_type,
                    'config',
                    'durations',
                    'units_display',
                    contract_start_type,
                ]) as TTextValueStrings[]) || [],
        };
    };

    const getDurationUnit = (duration_unit: string, contract_type: string, contract_start_type: string) => {
        const duration_units =
            (getPropertyValue(available_contract_types, [
                contract_type,
                'config',
                'durations',
                'units_display',
                contract_start_type,
            ]) as TTextValueStrings[]) || [];
        const arr_units: string[] = [];
        duration_units.forEach(obj => {
            arr_units.push(obj.value);
        });

        return {
            duration_unit: getArrayDefaultValue(arr_units, duration_unit),
        };
    };

    const getDurationMinMax = (contract_type: string, contract_start_type: string, contract_expiry_type?: string) => {
        let duration_min_max: TTradeStore['duration_min_max'] =
            getPropertyValue(available_contract_types, [
                contract_type,
                'config',
                'durations',
                'min_max',
                contract_start_type,
            ]) || {};

        if (contract_expiry_type) {
            duration_min_max =
                'contract_expiry_type' in duration_min_max
                    ? (duration_min_max as unknown as { [key: string]: TTradeStore['duration_min_max'] })[
                          contract_expiry_type
                      ]
                    : {};
        }

        return { duration_min_max };
    };

    const getFullContractTypes = () => available_contract_types;

    const getStartType = (start_date: number) => ({
        // Number(0) refers to 'now'
        contract_start_type: start_date === Number(0) ? 'spot' : 'forward',
    });

    const getStartDates = (contract_type: string, current_start_date: number) => {
        const config: TConfig = getPropertyValue(available_contract_types, [contract_type, 'config']);
        const start_dates_list = [];

        if (config?.has_spot) {
            // Number(0) refers to 'now'
            start_dates_list.push({ text: localize('Now'), value: Number(0) });
        }
        if (config?.forward_starting_dates) {
            start_dates_list.push(...config.forward_starting_dates);
        }

        const start_date = start_dates_list.find(item => item.value === current_start_date)
            ? current_start_date
            : start_dates_list[0]?.value;

        return { start_date, start_dates_list };
    };

    const getSessions = (contract_type: string, start_date: number) => {
        const config: TConfig = getPropertyValue(available_contract_types, [contract_type, 'config']) || {};
        const sessions = config.forward_starting_dates?.find(option => option.value === start_date)?.sessions;
        return { sessions };
    };

    const hours = [...Array(24).keys()].map(a => `0${a}`.slice(-2));
    const minutes = [...Array(12).keys()].map(a => `0${a * 5}`.slice(-2));

    const getValidTime = (
        sessions: ReturnType<typeof getSessions>['sessions'],
        compare_moment: moment.Moment,
        start_moment?: moment.Moment
    ) => {
        if (sessions && !isSessionAvailable(sessions, compare_moment)) {
            // first see if changing the minute brings it to the right session
            compare_moment.minute(
                Number(
                    minutes.find(m => isSessionAvailable(sessions, compare_moment.minute(+m))) ||
                        compare_moment.format('mm')
                )
            );
            // if not, also change the hour
            if (!isSessionAvailable(sessions, compare_moment)) {
                compare_moment.minute(0);
                compare_moment.hour(
                    Number(
                        hours.find(h => isSessionAvailable(sessions, compare_moment.hour(+h), start_moment, true)) ||
                            compare_moment.format('HH')
                    )
                );
                compare_moment.minute(
                    Number(
                        minutes.find(m => isSessionAvailable(sessions, compare_moment.minute(+m))) ||
                            compare_moment.format('mm')
                    )
                );
            }
        }
        return compare_moment.format('HH:mm');
    };

    const buildMoment = (date: string | number | null, time?: string | null) => {
        const [hour, minute] = isTimeValid(time ?? '') ? time?.split(':') ?? [] : [0, 0];
        return toMoment(date || ServerTime.get())
            .hour(+hour)
            .minute(+minute);
    };

    const getStartTime = (
        sessions: ReturnType<typeof getSessions>['sessions'],
        start_date: number,
        start_time?: string | null
    ) => ({
        start_time: start_date ? getValidTime(sessions, buildMoment(start_date, start_time)) : null,
    });

    const getTradingEvents = async (date: string, underlying: string | null = null) => {
        if (!date) {
            return [];
        }
        if (!(date in trading_events)) {
            const trading_times_response: TradingTimesResponse = await WS.tradingTimes(date);
            const trading_times_data = trading_times_response.trading_times as TradingTimes;
            if (getPropertyValue(trading_times_response, ['trading_times', 'markets'])) {
                for (let i = 0; i < trading_times_data.markets.length; i++) {
                    const submarkets = trading_times_data.markets[i].submarkets;
                    if (submarkets) {
                        for (let j = 0; j < submarkets.length; j++) {
                            const symbols = submarkets[j].symbols;
                            if (symbols) {
                                for (let k = 0; k < symbols.length; k++) {
                                    const symbol = symbols[k];
                                    if (!trading_events[trading_times_response.echo_req.trading_times as string]) {
                                        trading_events[trading_times_response.echo_req.trading_times as string] = {};
                                    }
                                    trading_events[trading_times_response.echo_req.trading_times as string][
                                        symbol.symbol
                                    ] = symbol.events as TEvents;
                                }
                            }
                        }
                    }
                }
            }
        }

        return trading_events[date][underlying as string];
    };

    const getTradingTimes = async (
        date: string | null,
        underlying: string | null = null
    ): Promise<Record<string, never> | TTimes | Record<string, TTimes>> => {
        if (!date) {
            return {};
        }

        if (!(date in trading_times)) {
            const trading_times_response: TradingTimesResponse = await WS.tradingTimes(date);
            const trading_times_data = trading_times_response.trading_times as TradingTimes;
            if (getPropertyValue(trading_times_response, ['trading_times', 'markets'])) {
                for (let i = 0; i < trading_times_data.markets.length; i++) {
                    const submarkets = trading_times_data.markets[i].submarkets;
                    if (submarkets) {
                        for (let j = 0; j < submarkets.length; j++) {
                            const symbols = submarkets[j].symbols;
                            if (symbols) {
                                for (let k = 0; k < symbols.length; k++) {
                                    const symbol = symbols[k];
                                    if (!trading_times[trading_times_response.echo_req.trading_times as string]) {
                                        trading_times[trading_times_response.echo_req.trading_times as string] = {};
                                    }
                                    trading_times[trading_times_response.echo_req.trading_times as string][
                                        symbol.symbol
                                    ] = {
                                        open: (symbol.times as TTimes).open,
                                        close: (symbol.times as TTimes).close,
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }

        return underlying ? trading_times[date][underlying] : trading_times[date];
    };

    const getExpiryType = (
        duration_units_list: ReturnType<typeof getDurationUnitsList>['duration_units_list'],
        expiry_type: string | null
    ) => {
        if (duration_units_list) {
            if (
                (!expiry_type && duration_units_list.length > 0) ||
                (duration_units_list.length === 1 && duration_units_list[0].value === 't')
            ) {
                return { expiry_type: 'duration' };
            }
            if (duration_units_list.length === 0) {
                return {
                    expiry_type: null,
                };
            }
        }

        return { expiry_type };
    };

    const getExpiryDate = (
        duration_units_list: ReturnType<typeof getDurationUnitsList>['duration_units_list'],
        expiry_date: string | null,
        expiry_type: string | null,
        start_date: number
    ) => {
        let proper_expiry_date = null;

        if (expiry_type === 'endtime') {
            const moment_start = toMoment(start_date);
            const moment_expiry = toMoment(expiry_date);

            if (!hasIntradayDurationUnit(duration_units_list)) {
                const is_invalid = moment_expiry.isSameOrBefore(moment_start, 'day');
                proper_expiry_date = (is_invalid ? moment_start.clone().add(1, 'day') : moment_expiry).format(
                    'YYYY-MM-DD'
                );
            } else {
                // forward starting contracts should only show today and tomorrow as expiry date
                const is_invalid =
                    moment_expiry.isBefore(moment_start, 'day') ||
                    (start_date && moment_expiry.isAfter(moment_start.clone().add(1, 'day')));
                proper_expiry_date = (is_invalid ? moment_start : moment_expiry).format('YYYY-MM-DD');
            }
        }

        return { expiry_date: proper_expiry_date };
    };

    // It has to follow the correct order of checks:
    // first check if end time is within available sessions
    // then confirm that end time is at least 5 minute after start time
    const getExpiryTime = (
        expiry_date: string | null,
        expiry_time: string | null,
        expiry_type: string | null,
        market_close_times: string[] | undefined | TTimes,
        sessions: TTradeStore['sessions'],
        start_date: number,
        start_time?: string | null
    ) => {
        let end_time: moment.Moment | string | null = null;

        if (expiry_type === 'endtime') {
            let market_close_time = '23:59:59';

            if (Array.isArray(market_close_times) && market_close_times?.length && market_close_times[0] !== '--') {
                // Some of underlyings (e.g. Australian Index) have two close time during a day so we always select the further one as the end time of the contract.
                market_close_time = market_close_times.slice(-1)[0];
            }

            // For contracts with a duration of more that 24 hours must set the expiry_time to the market's close time on the expiry date.
            if (!start_date && ServerTime.get()?.isBefore(buildMoment(expiry_date), 'day')) {
                end_time = market_close_time;
            } else {
                const start_moment = start_date
                    ? buildMoment(start_date, start_time)
                    : (ServerTime.get() as moment.Moment);
                const end_moment = buildMoment(expiry_date, expiry_time);

                end_time = end_moment.format('HH:mm');
                // When the contract is forwarding, and the duration is endtime, users can purchase the contract within 24 hours.
                const expiry_sessions = [
                    {
                        open: start_moment.clone().add(5, 'minute'), // expiry time should be at least 5 minute after start_time
                        close: minDate(
                            start_moment.clone().add(24, 'hour'),
                            buildMoment(expiry_date, market_close_time)
                        ),
                    },
                ];

                if (!isSessionAvailable(expiry_sessions, end_moment)) {
                    end_time = getValidTime(expiry_sessions, end_moment.clone(), start_moment.clone());
                }
                if (end_moment.isSameOrBefore(start_moment) || end_moment.diff(start_moment, 'minute') < 5) {
                    const is_end_of_day = start_moment.get('hours') === 23 && start_moment.get('minute') >= 55;
                    const is_end_of_session =
                        sessions && !isSessionAvailable(sessions, start_moment.clone().add(5, 'minutes'));
                    end_time = start_moment.clone().add(is_end_of_day || is_end_of_session ? 0 : 5, 'minutes');
                    // Set the end_time to be multiple of 5 to be equal as the SELECTED_TIME that shown to the client.
                    end_time = setMinuteMultipleByFive(end_time as moment.Moment).format('HH:mm');
                }
                // Set the expiry_time to 5 minute less than start_time for forwading contracts when the expiry_time is null and the expiry_date is tomorrow.
                if (end_time === '00:00' && start_moment.isBefore(end_moment, 'day')) {
                    end_time = start_moment.clone().subtract(5, 'minute').format('HH:mm');
                }
            }
        }
        return { expiry_time: end_time };
    };

    const setMinuteMultipleByFive = (moment_obj: moment.Moment) =>
        moment_obj.minute(Math.ceil(moment_obj.minute() / 5) * 5);

    const getTradeTypes = (contract_type: string) => ({
        trade_types: getPropertyValue(available_contract_types, [contract_type, 'config', 'trade_types']),
    });

    const getBarriers = (contract_type: string, expiry_type: string, stored_barrier_value?: string) => {
        const barriers =
            (getPropertyValue(available_contract_types, [contract_type, 'config', 'barriers']) as TBarriers) || {};
        const barrier_values = barriers[expiry_type] || {};
        const barrier_1 = barrier_values.barrier || barrier_values.high_barrier || '';
        const barrier_2 = barrier_values.low_barrier || '';
        return {
            barrier_count: barriers.count || 0,
            barrier_1: stored_barrier_value || barrier_1.toString(),
            barrier_2: barrier_2.toString(),
        };
    };

    const getBasis = (contract_type: string, basis: string) => {
        const arr_basis: string[] = getPropertyValue(available_contract_types, [contract_type, 'basis']) || [];
        const localized_basis = getLocalizedBasis();
        const basis_list = arr_basis.reduce<TTextValueStrings[]>(
            (cur, bas) => [...cur, { text: localized_basis[bas as keyof typeof localized_basis], value: bas }],
            []
        );

        return {
            basis_list,
            basis: getArrayDefaultValue(arr_basis, basis),
        };
    };

    const getAccumulatorRange = (contract_type: string) => ({
        accumulator_range_list:
            (getPropertyValue(available_contract_types, [contract_type, 'config', 'growth_rate_range']) as number[]) ||
            [],
    });

    const getBarrierCategory = (contract_type: string) => ({
        barrier_category: getPropertyValue(available_contract_types, [contract_type, 'config', 'barrier_category']),
    });

    const getBarrierChoices = (contract_type: string, stored_barrier_choices = [] as string[]) => ({
        barrier_choices: stored_barrier_choices.length
            ? stored_barrier_choices
            : getPropertyValue(available_contract_types, [contract_type, 'config', 'barrier_choices']) || [],
    });

    const getMultiplierRange = (contract_type: string, multiplier: number) => {
        const arr_multiplier: number[] =
            getPropertyValue(available_contract_types, [contract_type, 'config', 'multiplier_range']) || [];

        return {
            multiplier_range_list: arr_multiplier.map(m => ({ text: `x${m}`, value: m })),
            multiplier: getArrayDefaultValue(arr_multiplier, multiplier),
        };
    };

    const getCancellation = (contract_type: string, cancellation_duration: string) => {
        const arr_cancellation_range: string[] =
            getPropertyValue(available_contract_types, [contract_type, 'config', 'cancellation_range']) || [];
        const cached_multipliers_cancellation: string[] =
            getPropertyValue(available_contract_types, [TRADE_TYPES.MULTIPLIER, 'config', 'cancellation_range']) || [];
        const regex = /(^(?:\d){1,})|((?:[a-zA-Z]){1,}$)/g;
        const getText = (str: string) => {
            const [duration, unit] = str.match(regex) ?? [];
            const unit_map = getUnitMap();
            const unit_names = unit_map[unit as keyof typeof unit_map];
            const name = 'name_plural' in unit_names ? unit_names.name_plural : unit_names.name;
            return `${duration} ${name}`;
        };
        const mapCancellationRangeList = (d: string) => ({ text: `${getText(d)}`, value: d });

        const should_show_cancellation = !!arr_cancellation_range.length;

        return {
            cancellation_duration: getArrayDefaultValue(arr_cancellation_range, cancellation_duration),
            cancellation_range_list: arr_cancellation_range.map(mapCancellationRangeList),
            cached_multiplier_cancellation_list: cached_multipliers_cancellation.map(mapCancellationRangeList),
            ...(should_show_cancellation ? {} : { has_cancellation: false }),
        };
    };

    const getEqualProps = (contract_type: string) => {
        const base_contract_type = /^(.*)_equal$/.exec(contract_type)?.[1];

        if (base_contract_type && !available_contract_types[base_contract_type]) {
            return {
                is_equal: 1,
                has_equals_only: true,
            };
        }
        return {};
    };

    return {
        buildContractTypesConfig,
        getBarrierCategory,
        getBarriers,
        getContractType,
        getContractValues,
        getDurationMinMax,
        getDurationUnit,
        getDurationUnitsList,
        getFullContractTypes,
        getExpiryDate,
        getExpiryTime,
        getExpiryType,
        getSessions,
        getStartTime,
        getStartType,
        getTradingEvents,
        getTradingTimes,
        getContractCategories: () => ({
            contract_types_list: available_categories,
            has_only_forward_starting_contracts,
            non_available_contract_types_list: non_available_categories,
        }),
    };
})();
