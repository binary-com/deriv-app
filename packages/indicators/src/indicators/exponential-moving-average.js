import { takeField, mean } from '../utils/math';

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  pipSize: number,
 * }
 * @param {Number} init_val
 */
export const exponentialMovingAverage = (data, config, init_val) => {
    const { periods, field, pipSize = 2 } = config;

    const weighting_multiplier = 2 / (periods + 1);

    const vals = takeField(data, field);

    if (init_val) {
        return (vals[0] - init_val) * weighting_multiplier + init_val;
    }

    if (data.length < periods) {
        throw new Error('Periods longer than data length');
    }

    const mean_val = mean(takeField(data.slice(0, periods), field));

    return +vals
        .slice(periods)
        .reduce((prev, e) => (e - prev) * weighting_multiplier + prev, mean_val)
        .toFixed(pipSize);
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  pipSize: number,
 * }
 */
export const exponentialMovingAverageArray = (data, config) => {
    const { periods } = config;

    let init_val = exponentialMovingAverage(data.slice(0, periods), config);

    return (
        data
            .slice(periods - 1)
            // eslint-disable-next-line no-confusing-arrow
            .map((x, i) => (!i ? init_val : (init_val = exponentialMovingAverage([x], config, init_val))))
    );
};
