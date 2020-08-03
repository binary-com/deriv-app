import { stddev, takeLast } from './math';
import { simpleMovingAverage } from './simple-moving-average';
import { sequence } from '../object';

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  type: 'SMA' | 'WMA' | 'EMA' | 'TEMA' | 'TRIMA',
 *  stdDevUp: number,
 *  stdDevDown: number,
 *  pipSize: number,
 * }
 */
export const bollingerBands = (data, config) => {
    const { periods = 20, field, stdDevUp = 2, stdDevDown = 2, pipSize = 2 } = config;
    const vals = takeLast(data, periods, field);
    const middle = simpleMovingAverage(vals, { periods });
    const stdDev = stddev(vals);
    const upper = middle + stdDev * stdDevUp;
    const lower = middle - stdDev * stdDevDown;

    return [+middle.toFixed(pipSize), +upper.toFixed(pipSize), +lower.toFixed(pipSize)];
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  type: 'SMA' | 'WMA' | 'EMA' | 'TEMA' | 'TRIMA',
 *  stdDevUp: number,
 *  stdDevDown: number,
 *  pipSize: number,
 * }
 */
export const bollingerBandsArray = (data, config) => {
    const { periods } = config;
    return sequence(data.length - periods + 1).map((x, i) => bollingerBands(data.slice(i, i + periods), config));
};
