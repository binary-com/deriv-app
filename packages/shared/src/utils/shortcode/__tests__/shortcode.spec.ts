import { extractInfoFromShortcode, hasForwardContractStarted } from '../shortcode';

describe('hasForwardContractStarted', () => {
    it('should return true if start_time from shortcode is less then current time', () => {
        expect(hasForwardContractStarted('CALL_1HZ10V_19.54_1710485400F_1710486300_S0P_0')).toBe(true);
    });
    it('should return false if start_time from shortcode is more then current time', () => {
        const shortcode = `CALL_1HZ10V_19.54_${Math.floor(Date.now() / 1000) + 100}F_1710486300_S0P_0`;
        expect(hasForwardContractStarted(shortcode)).toBe(false);
    });
});

describe('extractInfoFromShortcode', () => {
    it('should return an object with correct contract data extracted from shortcode', () => {
        expect(extractInfoFromShortcode('CALL_1HZ10V_19.54_1710485400F_1710486300_S0P_0')).toMatchObject({
            category: 'Call',
            underlying: '1HZ10V',
            multiplier: '',
            start_time: '1710485400F',
            payout_tick: '',
            growth_rate: '',
            growth_frequency: '',
            barrier_1: 'S0P',
        });
        expect(extractInfoFromShortcode('CALL_R_10_19.54_1691443851_1691444751_S0P_0')).toMatchObject({
            category: 'Call',
            underlying: 'R_10',
            multiplier: '',
            start_time: '1691443851',
            payout_tick: '',
            growth_rate: '',
            growth_frequency: '',
            barrier_1: 'S0P',
        });
        expect(extractInfoFromShortcode('MULTUP_STPRNG_10.00_100_1716797490_4870454399_0_0.00_N1')).toMatchObject({
            category: 'Multup',
            underlying: 'STPRNG',
            multiplier: '100',
            start_time: '1716797490',
            payout_tick: '',
            growth_rate: '',
            growth_frequency: '',
            barrier_1: '',
        });
        expect(extractInfoFromShortcode('MULTUP_STPRNG2_10.00_100_1716797490_4870454399_0_0.00_N1')).toMatchObject({
            category: 'Multup',
            underlying: 'STPRNG2',
            multiplier: '100',
            start_time: '1716797490',
            payout_tick: '',
            growth_rate: '',
            growth_frequency: '',
            barrier_1: '',
        });
        expect(extractInfoFromShortcode('MULTUP_STPRNG5_10.00_100_1716797490_4870454399_0_0.00_N1')).toMatchObject({
            category: 'Multup',
            underlying: 'STPRNG5',
            multiplier: '100',
            start_time: '1716797490',
            payout_tick: '',
            growth_rate: '',
            growth_frequency: '',
            barrier_1: '',
        });
        expect(extractInfoFromShortcode('MULTUP_BOOM1000_100.00_100_1719905399_4873564799_0_0.00_N1')).toMatchObject({
            category: 'Multup',
            underlying: 'BOOM1000',
            multiplier: '100',
            start_time: '1719905399',
            payout_tick: '',
            growth_rate: '',
            growth_frequency: '',
            barrier_1: '',
        });
        expect(extractInfoFromShortcode('MULTUP_CRASH1000_100.00_100_1719905471_4873564799_0_0.00_N1')).toMatchObject({
            category: 'Multup',
            underlying: 'CRASH1000',
            multiplier: '100',
            start_time: '1719905471',
            payout_tick: '',
            growth_rate: '',
            growth_frequency: '',
            barrier_1: '',
        });
        expect(extractInfoFromShortcode('ACCU_1HZ100V_9.00_0_0.01_1_0.000433139675_1716220710')).toMatchObject({
            category: 'Accu',
            underlying: '1HZ100V',
            multiplier: '',
            start_time: '1716220710',
            payout_tick: '0',
            growth_rate: '0.01',
            growth_frequency: '1',
            barrier_1: '',
        });
    });
    it('should return an empty object if shortcode is empty', () => {
        expect(extractInfoFromShortcode('')).toMatchObject({});
    });
});
