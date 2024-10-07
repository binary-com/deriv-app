import { sequence } from '@deriv/shared';
import { takeField } from '../utils/math';

// eslint-disable-next-line no-confusing-arrow
const calcGain = (q1, q2) => (q2 > q1 ? q2 - q1 : 0);
// eslint-disable-next-line no-confusing-arrow
const calcLoss = (q1, q2) => (q2 < q1 ? q1 - q2 : 0);

const calcFirstAvgDiff = (vals, comp, periods) => {
    let prev;
    return (
        vals.reduce((r, q, i) => {
            if (i === 1) {
                prev = r;
            }
            const diff = comp(prev, q);
            prev = q;
            return diff + (i === 1 ? 0 : r);
        }) / periods
    );
};

const calcSecondAvgDiff = (vals, comp, periods, init_avg) => {
    let prev;
    if (vals.length === 1) {
        // There is no data to calc avg
        return init_avg;
    }
    return vals.reduce((r, q, i) => {
        if (i === 1) {
            prev = r;
        }
        const diff = comp(prev, q);
        prev = q;
        const prev_avg = i === 1 ? init_avg : r;
        return (prev_avg * (periods - 1) + diff) / periods;
    });
};

/**
 * @param {Array} data
 * @param {Object} config of type
 * {
 *  periods: number,
 *  field?: 'open' | 'high' | 'low' | 'close',
 *  pipSize: number,
 * }
 * @param {any} memoized_diff
 */
export const relativeStrengthIndex = (data, config, memoized_diff) => {
    const { periods, field } = config;

    if (data.length < periods) {
        throw new Error('Periods longer than data length');
    }

    if (data.length === periods) {
        return 0;
    }

    const vals = takeField(data.slice(0, periods + 1), field);

    let rest_seq, init_avg_gain, init_avg_loss;

    if (memoized_diff && 'gain' in memoized_diff) {
        rest_seq = takeField(data.slice(-2), field);

        init_avg_gain = memoized_diff.gain;
        init_avg_loss = memoized_diff.loss;
    } else {
        // include last element from above to calc diff
        rest_seq = takeField(data.slice(periods, data.length), field);

        init_avg_gain = calcFirstAvgDiff(vals, calcGain, periods);
        init_avg_loss = calcFirstAvgDiff(vals, calcLoss, periods);
    }

    const avg_gain = calcSecondAvgDiff(rest_seq, calcGain, periods, init_avg_gain);
    const avg_loss = calcSecondAvgDiff(rest_seq, calcLoss, periods, init_avg_loss);

    if (memoized_diff) {
        memoized_diff.gain = avg_gain;
        memoized_diff.loss = avg_loss;
    }

    if (avg_gain === 0) {
        return 0;
    } else if (avg_loss === 0) {
        return 100;
    }

    const RS = avg_gain / avg_loss;

    return 100 - 100 / (1 + RS);
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
export const relativeStrengthIndexArray = (data, config) => {
    const { periods, pipSize = 2 } = config;
    const memoized_diff = {};
    return sequence(data.length - periods).map(
        (x, i) => +relativeStrengthIndex(data.slice(0, i + periods + 1), config, memoized_diff).toFixed(pipSize)
    );
};
