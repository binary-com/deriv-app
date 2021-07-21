import { sequence } from '@deriv/shared';

const calcFractal = (data, field, pipSize) => {
    const n = data.length;
    let result = null;

    if (field) {
        const high_list = data.map(item => {
            if (isNaN(item)) {
                return item.high ? item.high : NaN;
            }
            return item;
        });
        const high_ref = high_list[n - 3];
        if (
            high_ref > high_list[n - 2] &&
            high_ref > high_list[n - 1] &&
            high_ref >= high_list[n - 4] &&
            high_ref >= high_list[n - 5]
        ) {
            result = high_ref;
        } else {
            result = null;
        }
    } else {
        const low_list = data.map(item => {
            if (isNaN(item)) {
                return item.low ? item.low : NaN;
            }
            return item;
        });
        const low_ref = low_list[n - 3];
        if (
            low_ref < low_list[n - 2] &&
            low_ref < low_list[n - 1] &&
            low_ref <= low_list[n - 4] &&
            low_ref <= low_list[n - 5]
        ) {
            result = low_ref;
        } else {
            result = null;
        }
    }
    return result ? +result.toFixed(pipSize) : result;
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  pipSize: number,
 *  field: number,
 * }
 */
export const fractal = (data, config) => {
    const { pipSize = 2, field } = config;
    return calcFractal(data, field, pipSize);
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  pipSize: number,
 *  field: number,
 * }
 */
export const fractalArray = (data, config) => {
    const { pipSize = 2, field } = config;
    return sequence(data.length - 4).map((x, i) => calcFractal(data.slice(i, i + 5), field, pipSize));
};
