import { localize } from '@deriv/translations';
import { toMoment } from '../date';

type TContract = {
    max_contract_duration: string;
    min_contract_duration: string;
    expiry_type: string;
    start_type: string;
};

type TMaxMin = {
    min: number;
    max: number;
};

type TUnit = {
    text: string;
    value: string;
};

export type TDurations = {
    min_max: {
        spot: Partial<Record<'tick' | 'intraday' | 'daily', TMaxMin>>;
        forward: Partial<Record<'intraday', TMaxMin>>;
    };
    units_display: Partial<Record<'spot' | 'forward', TUnit[]>>;
};

type TDurationMinMax = {
    [key: string]: {
        max: string | number;
        min: string | number;
    };
};

const getDurationMaps = () => ({
    t: { display: localize('Ticks'), order: 1, to_second: null },
    s: { display: localize('Seconds'), order: 2, to_second: 1 },
    m: { display: localize('Minutes'), order: 3, to_second: 60 },
    h: { display: localize('Hours'), order: 4, to_second: 60 * 60 },
    d: { display: localize('Days'), order: 5, to_second: 60 * 60 * 24 },
});

export const buildDurationConfig = (
    contract: TContract,
    durations: TDurations = { min_max: { spot: {}, forward: {} }, units_display: {} }
) => {
    type TDurationMaps = keyof typeof duration_maps;
    durations.units_display[contract.start_type as keyof typeof durations.units_display] =
        durations.units_display[contract.start_type as keyof typeof durations.units_display] || [];

    const duration_min_max = durations.min_max[contract.start_type as keyof typeof durations.min_max];
    const obj_min = getDurationFromString(contract.min_contract_duration);
    const obj_max = getDurationFromString(contract.max_contract_duration);

    durations.min_max[contract.start_type as keyof typeof durations.min_max][
        contract.expiry_type as keyof typeof duration_min_max
    ] = {
        min: convertDurationUnit(obj_min.duration, obj_min.unit, 's') || 0,
        max: convertDurationUnit(obj_max.duration, obj_max.unit, 's') || 0,
    };

    const arr_units: string[] = [];
    durations?.units_display?.[contract.start_type as keyof typeof durations.units_display]?.forEach?.(obj => {
        arr_units.push(obj.value);
    });

    const duration_maps = getDurationMaps();

    if (/^(?:tick|daily)$/.test(contract.expiry_type)) {
        if (arr_units.indexOf(obj_min.unit) === -1) {
            arr_units.push(obj_min.unit);
        }
    } else {
        Object.keys(duration_maps).forEach(u => {
            if (
                u !== 'd' && // when the expiray_type is intraday, the supported units are seconds, minutes and hours.
                arr_units.indexOf(u) === -1 &&
                duration_maps[u as TDurationMaps].order >= duration_maps[obj_min.unit as TDurationMaps].order &&
                duration_maps[u as TDurationMaps].order <= duration_maps[obj_max.unit as TDurationMaps].order
            ) {
                arr_units.push(u);
            }
        });
    }

    durations.units_display[contract.start_type as keyof typeof durations.units_display] = arr_units
        .sort((a, b) => (duration_maps[a as TDurationMaps].order > duration_maps[b as TDurationMaps].order ? 1 : -1))
        .reduce((o, c) => [...o, { text: duration_maps[c as TDurationMaps].display, value: c }], [] as TUnit[]);
    return durations;
};

export const convertDurationUnit = (value: number, from_unit: string, to_unit: string) => {
    if (!value || !from_unit || !to_unit || isNaN(value)) {
        return null;
    }

    const duration_maps = getDurationMaps();

    if (from_unit === to_unit || duration_maps[from_unit as keyof typeof duration_maps].to_second === null) {
        return value;
    }

    return (
        (value * (duration_maps[from_unit as keyof typeof duration_maps]?.to_second ?? 1)) /
        (duration_maps[to_unit as keyof typeof duration_maps]?.to_second ?? 1)
    );
};

const getDurationFromString = (duration_string: string) => {
    const duration = duration_string.toString().match(/[a-zA-Z]+|[0-9]+/g) || '';
    return {
        duration: +duration[0], // converts string to numbers
        unit: duration[1],
    };
};

// TODO will change this after the global stores types get ready
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getExpiryType = (store: any) => {
    const { duration_unit, expiry_date, expiry_type, duration_units_list } = store;
    const server_time = store.root_store.common.server_time;

    const duration_is_day = expiry_type === 'duration' && duration_unit === 'd';
    const expiry_is_after_today =
        expiry_type === 'endtime' &&
        ((toMoment(expiry_date) as unknown as moment.Moment).isAfter(
            toMoment(server_time) as unknown as moment.MomentInput,
            'day'
        ) ||
            !hasIntradayDurationUnit(duration_units_list));

    let contract_expiry_type = 'daily';
    if (!duration_is_day && !expiry_is_after_today) {
        contract_expiry_type = duration_unit === 't' ? 'tick' : 'intraday';
    }

    return contract_expiry_type;
};

export const convertDurationLimit = (value: number, unit: string) => {
    if (!(value >= 0) || !unit || !Number.isInteger(value)) {
        return null;
    }

    if (unit === 'm') {
        const minute = value / 60;
        return minute >= 1 ? Math.floor(minute) : 1;
    } else if (unit === 'h') {
        const hour = value / (60 * 60);
        return hour >= 1 ? Math.floor(hour) : 1;
    } else if (unit === 'd') {
        const day = value / (60 * 60 * 24);
        return day >= 1 ? Math.floor(day) : 1;
    }

    return value;
};

export const hasIntradayDurationUnit = (duration_units_list: TUnit[]) => {
    return duration_units_list.some(unit => ['m', 'h'].indexOf(unit.value) !== -1);
};
/**
 * On switching symbols, end_time value of volatility indices should be set to today
 *
 * @param {String} symbol
 * @param {String | null} expiry_type
 * @returns {*}
 */
export const resetEndTimeOnVolatilityIndices = (symbol: string, expiry_type: string | null) =>
    /^R_/.test(symbol) && expiry_type === 'endtime' ? toMoment(null).format('DD MMM YYYY') : null;

export const getDurationMinMaxValues = (
    duration_min_max: TDurationMinMax,
    contract_expiry_type: string,
    duration_unit: string
) => {
    if (!duration_min_max[contract_expiry_type]) return [];
    const max_value = convertDurationLimit(+duration_min_max[contract_expiry_type].max, duration_unit);
    const min_value = convertDurationLimit(+duration_min_max[contract_expiry_type].min, duration_unit);

    return [min_value, max_value];
};

const formatDisplayedTime = (time_unit: number) => (time_unit < 10 ? `0${time_unit}` : time_unit);

export const formatDurationTime = (time?: number) => {
    if (time && !isNaN(time)) {
        const minutes = Math.floor(time / 60);
        const format_minutes = formatDisplayedTime(minutes);
        const seconds = Math.floor(time % 60);
        const format_seconds = formatDisplayedTime(seconds);
        return `${format_minutes}:${format_seconds}`;
    }

    return '00:00';
};
