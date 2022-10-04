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

type TDurations = {
    // min_max: {
    //     spot?: Partial<Record<'tick' | 'intraday' | 'daily', TMaxMin>>;
    //     forward?: Record<'intraday', TMaxMin>;
    // };
    // units_display: Partial<Record<'spot' | 'forward', TUnit[]>>;

    min_max: {
        // spot: {
        //     tick: TMaxMin;
        //     intraday: TMaxMin;
        //     daily: TMaxMin;
        // };
        // forward: {
        //     intraday: TMaxMin;
        // };
    };
    units_display: {
        // spot: TUnit[];
        // forward: TUnit[];
    };
};

const getDurationMaps = () => ({
    t: { display: localize('Ticks'), order: 1, to_second: 0 },
    s: { display: localize('Seconds'), order: 2, to_second: 1 },
    m: { display: localize('Minutes'), order: 3, to_second: 60 },
    h: { display: localize('Hours'), order: 4, to_second: 60 * 60 },
    d: { display: localize('Days'), order: 5, to_second: 60 * 60 * 24 },
});

export const buildDurationConfig = (
    contract: TContract,
    durations: TDurations = { min_max: {}, units_display: {} }
) => {
    type TDurationMinMax = keyof typeof durations.min_max;
    type TDurationUnits = keyof typeof durations.units_display;
    type TDurationMap = keyof typeof duration_maps;

    durations.min_max[contract.start_type as TDurationMinMax] =
        durations.min_max[contract.start_type as TDurationMinMax] || {};
    durations.units_display[contract.start_type as TDurationUnits] =
        durations.units_display[contract.start_type as TDurationUnits] || [];

    const obj_min = getDurationFromString(contract.min_contract_duration);
    const obj_max = getDurationFromString(contract.max_contract_duration);

    durations.min_max[contract.start_type as TDurationMinMax][contract.expiry_type] = {
        min: convertDurationUnit(obj_min.duration, obj_min.unit, 's'),
        max: convertDurationUnit(obj_max.duration, obj_max.unit, 's'),
    };

    const arr_units: [] = [];
    durations.units_display[contract.start_type as TDurationUnits].forEach(obj => {
        arr_units.push(obj.value);
    });

    const duration_maps = getDurationMaps();

    if (/^tick|daily$/.test(contract.expiry_type)) {
        if (arr_units.indexOf(obj_min.unit) === -1) {
            arr_units.push(obj_min.unit);
        }
    } else {
        Object.keys(duration_maps).forEach(u => {
            if (
                u !== 'd' && // when the expiray_type is intraday, the supported units are seconds, minutes and hours.
                arr_units.indexOf(u) === -1 &&
                duration_maps[u as TDurationMap].order >= duration_maps[obj_min.unit as TDurationMap].order &&
                duration_maps[u as TDurationMap].order <= duration_maps[obj_max.unit as TDurationMap].order
            ) {
                arr_units.push(u);
            }
        });
    }

    durations.units_display[contract.start_type as TDurationUnits] = arr_units
        .sort((a, b) => (duration_maps[a as TDurationMap].order > duration_maps[b as TDurationMap].order ? 1 : -1))
        .reduce((o, c) => [...o, { text: duration_maps[c as TDurationMap].display, value: c }], []);

    return durations;
};

export const convertDurationUnit = (value: number, from_unit: string, to_unit: string) => {
    if (!value || !from_unit || !to_unit || isNaN(value)) {
        return null;
    }

    const duration_maps = getDurationMaps();

    if (from_unit === to_unit || !('to_second' in duration_maps[from_unit as keyof typeof duration_maps])) {
        return value;
    }

    return (
        (value * duration_maps[from_unit as keyof typeof duration_maps].to_second) /
        duration_maps[to_unit as keyof typeof duration_maps].to_second
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
export const getExpiryType = (store: any) => {
    const { duration_unit, expiry_date, expiry_type, duration_units_list } = store;
    const server_time = store.root_store.common.server_time;

    const duration_is_day = expiry_type === 'duration' && duration_unit === 'd';
    const expiry_is_after_today =
        expiry_type === 'endtime' &&
        (toMoment(expiry_date).isAfter(toMoment(server_time), 'day') || !hasIntradayDurationUnit(duration_units_list));

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

export const hasIntradayDurationUnit = duration_units_list =>
    duration_units_list.some(unit => ['m', 'h'].indexOf(unit.value) !== -1);

/**
 * On switching symbols, end_time value of volatility indices should be set to today
 *
 * @param {String} symbol
 * @param {String} expiry_type
 * @returns {*}
 */
export const resetEndTimeOnVolatilityIndices = (symbol: string, expiry_type: string) =>
    /^R_/.test(symbol) && expiry_type === 'endtime' ? toMoment(null).format('DD MMM YYYY') : null;

export const getDurationMinMaxValues = (duration_min_max, contract_expiry_type: string, duration_unit: string) => {
    if (!duration_min_max[contract_expiry_type]) return [];
    const max_value = convertDurationLimit(+duration_min_max[contract_expiry_type].max, duration_unit);
    const min_value = convertDurationLimit(+duration_min_max[contract_expiry_type].min, duration_unit);

    return [min_value, max_value];
};
