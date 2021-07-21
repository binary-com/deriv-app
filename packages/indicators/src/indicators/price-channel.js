import { sequence } from '@deriv/shared';

const calcPriceChannel = (data, field, periods, pipSize) => {
    let result = null;
    if (field) {
        const high_list = data.map(item => {
            if (isNaN(item)) {
                return item.high ? item.high : NaN;
            }
            return item;
        });
        result = Math.max(...high_list.slice(high_list.length - periods, high_list.length));
    } else {
        const low_list = data.map(item => {
            if (isNaN(item)) {
                return item.low ? item.low : NaN;
            }
            return item;
        });
        result = Math.min(...low_list.slice(low_list.length - periods, low_list.length));
    }
    return +result.toFixed(pipSize);
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number
 *  pipSize: number,
 * }
 */
export const priceChannel = (data, config) => {
    const { periods = 10, pipSize = 2, field } = config;
    return calcPriceChannel(data, field, periods, pipSize);
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  pipSize: number,
 * }
 */
export const priceChannelArray = (data, config) => {
    const { periods = 10, pipSize = 2, field } = config;
    return sequence(data.length - periods + 1).map((x, i) =>
        calcPriceChannel(data.slice(i, i + periods), field, periods, pipSize)
    );
};
