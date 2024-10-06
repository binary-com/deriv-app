type TIsHighLow = {
    shortcode?: string;
    shortcode_info?: {
        category?: string;
        underlying?: string;
        barrier_1?: string;
        multiplier?: string;
        start_time?: string;
    };
};

type TInfoFromShortcode = Record<
    | 'category'
    | 'underlying'
    | 'barrier_1'
    | 'multiplier'
    | 'start_time'
    | 'payout_tick'
    | 'growth_rate'
    | 'growth_frequency',
    string
>;

// category_underlying_amount
const base_pattern =
    '^([A-Z]+)_((?:1HZ[0-9-V]+)|(?:(?:CRASH|BOOM|STPRNG)[0-9\\d]+[A-Z]?)|(?:cry_[A-Z]+)|(?:JD[0-9]+)|(?:OTC_[A-Z0-9]+)|R_[\\d]{2,3}|[A-Z]+)_([\\d.]+)';

// category_underlying_amount_payouttick_growthrate_growthfrequency_ticksizebarrier_starttime
const accumulators_regex = new RegExp(`${base_pattern}_(\\d+)_(\\d*\\.?\\d*)_(\\d+)_(\\d*\\.?\\d*)_(\\d+)`);

// category_underlying_amount_multiplier_starttime
const multipliers_regex = new RegExp(`${base_pattern}_(\\d+)_(\\d+)`);

// category_underlying_amount_starttime_endtime_barrier
const options_regex = new RegExp(`${base_pattern}_([A-Z\\d]+)_([A-Z\\d]+)_?([A-Z\\d]+)?`);

export const extractInfoFromShortcode = (shortcode: string): TInfoFromShortcode => {
    const info_from_shortcode = {
        category: '',
        underlying: '',
        barrier_1: '',
        multiplier: '',
        start_time: '',
        payout_tick: '',
        growth_rate: '',
        growth_frequency: '',
    };

    const is_accumulators = /^ACCU/i.test(shortcode);
    const is_multipliers = /^MULT/i.test(shortcode);

    // First group of regex pattern captures the trade category, second group captures the market's underlying
    let pattern;
    if (is_multipliers) {
        pattern = multipliers_regex;
    } else pattern = is_accumulators ? accumulators_regex : options_regex;
    const extracted = pattern.exec(shortcode);

    if (extracted !== null) {
        info_from_shortcode.category = extracted[1].charAt(0).toUpperCase() + extracted[1].slice(1).toLowerCase();
        info_from_shortcode.underlying = extracted[2];

        if (is_multipliers) {
            info_from_shortcode.multiplier = extracted[4];
            info_from_shortcode.start_time = extracted[5];
        } else if (is_accumulators) {
            info_from_shortcode.payout_tick = extracted[4];
            info_from_shortcode.growth_rate = extracted[5];
            info_from_shortcode.growth_frequency = extracted[6];
            info_from_shortcode.start_time = extracted[8];
        } else {
            info_from_shortcode.start_time = extracted[4];
        }

        if (/^(CALL|PUT)$/i.test(info_from_shortcode.category)) {
            info_from_shortcode.barrier_1 = extracted[6];
        }
    }

    return info_from_shortcode;
};

export const isHighLow = ({ shortcode = '', shortcode_info }: TIsHighLow) => {
    const info_from_shortcode = shortcode ? extractInfoFromShortcode(shortcode) : shortcode_info;
    return info_from_shortcode && info_from_shortcode.barrier_1 ? !/^S0P$/.test(info_from_shortcode.barrier_1) : false;
};

export const getStartTime = (shortcode: string) => {
    const shortcode_info = extractInfoFromShortcode(shortcode);
    if (shortcode_info?.multiplier) return false;
    return shortcode_info?.start_time || '';
};

export const isForwardStarting = (shortcode: string, purchase_time?: number | string) => {
    const start_time = getStartTime(shortcode);
    return start_time && purchase_time && /f$/gi.test(start_time);
};

export const hasForwardContractStarted = (shortcode: string) => {
    const start_time = getStartTime(shortcode);
    return start_time && Date.now() / 1000 > Number(start_time.slice(0, -1));
};
