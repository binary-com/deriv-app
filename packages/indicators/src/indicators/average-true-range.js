import { sequence } from '@deriv/shared';
import { exponentialMovingAverageArray } from './exponential-moving-average';

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  pipSize: number,
 * }
 */
export const averageTrueRange = (data, config) => {
    const result = averageTrueRangeArray(data, config);
    return result[result.length - 1];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  pipSize: number,
 * }
 */
export const averageTrueRangeArray = (data, config) => {
    const high_list = data.map(item => {
        if (isNaN(item)) {
            return item.high ? item.high : NaN;
        }
        return item;
    });
    const low_list = data.map(item => {
        if (isNaN(item)) {
            return item.low ? item.low : NaN;
        }
        return item;
    });
    const close_list = data.map(item => {
        if (isNaN(item)) {
            return item.close ? item.close : NaN;
        }
        return item;
    });
    const true_range = sequence(low_list.length - 1).map(
        (x, i) => Math.max(high_list[i + 1], close_list[i]) - Math.min(low_list[i + 1], close_list[i])
    );
    return exponentialMovingAverageArray(true_range, config);
};
