import { sequence } from '@deriv/shared';

const calcWilliamRIndicator = (low_list, high_list, close_list, period, pipSize) => {
    const list = [];

    sequence(low_list.length - period + 1).map((x, i) => {
        const min = Math.min(...low_list.slice(i, i + period));
        const max = Math.max(...high_list.slice(i, i + period));
        list[i] = +(((max - close_list[i + period - 1]) / (max - min)) * -100).toFixed(pipSize);
    });

    return list;
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  period: number
 *  pipSize: number,
 * }
 */
export const williamRIndicator = (data, config) => {
    const result = williamRIndicatorArray(data, config);
    return result[result.length - 1];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  period: number
 *  pipSize: number,
 * }
 */
export const williamRIndicatorArray = (data, config) => {
    const { period = 14, pipSize = 2 } = config;
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
    return calcWilliamRIndicator(low_list, high_list, close_list, period, pipSize);
};
