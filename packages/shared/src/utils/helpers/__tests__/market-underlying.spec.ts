import { getContractDurationType, getMarketInformation, getMarketName, getTradeTypeName } from '../market-underlying';
import { CONTRACT_TYPES, TRADE_TYPES } from '../../contract';

describe('market-underlying', () => {
    const position = {
        contract_type: 'CALL',
        shortcode: 'CALL_1HZ100V_19.53_1695913929_5T_S0P_0',
    };
    describe('getContractDurationType', () => {
        it('should return Ticks if longcode contains ticks', () => {
            expect(getContractDurationType('... ticks')).toBe('Ticks');
        });
        it('should return Days when longcode does not contain duration and shortcode is not passed', () => {
            expect(getContractDurationType('')).toBe('Days');
        });
        it('should return Days when longcode does not contain duration and shortcode is not for Multipliers', () => {
            expect(getContractDurationType('', position.shortcode)).toBe('Days');
        });
        it('should return an empty string when shortcode is for Multipliers', () => {
            expect(getContractDurationType('', 'MULTUP_1HZ100V_10.00_10_1702912846_4856543999_0_0.00')).toBe('');
        });
        it('should return a plural duration if longcode contains singular duration', () => {
            expect(
                getContractDurationType(
                    'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 1 minute after contract start time.'
                )
            ).toBe('Minutes');
        });
    });
    describe('getMarketInformation', () => {
        it('should return an object with correct data about contract_type and symbol when shortcode is provided', () => {
            expect(getMarketInformation(position.shortcode)).toMatchObject({ category: 'call', underlying: '1HZ100V' });
            expect(getMarketInformation('MULTUP_CRASH1000_100.00_100_1719905471_4873564799_0_0.00_N1')).toMatchObject({
                category: 'multup',
                underlying: 'CRASH1000',
            });
            expect(getMarketInformation('MULTUP_STPRNG_10.00_100_1716797490_4870454399_0_0.00_N1')).toMatchObject({
                category: 'multup',
                underlying: 'STPRNG',
            });
            expect(getMarketInformation('MULTUP_STPRNG2_10.00_100_1716797490_4870454399_0_0.00_N1')).toMatchObject({
                category: 'multup',
                underlying: 'STPRNG2',
            });
        });
        it('should return an object with empty values when shortcode is not provided', () => {
            expect(getMarketInformation('')).toMatchObject({ category: '', underlying: '' });
        });
    });
    describe('getMarketName', () => {
        it('should return the correct symbol display name when symbol is provided', () => {
            expect(getMarketName('R_100')).toBe('Volatility 100 Index');
        });
        it('should return null when symbol is not provided', () => {
            expect(getMarketName('')).toBe(null);
        });
    });
    describe('getTradeTypeName', () => {
        it('should return the correct contract type display name', () => {
            expect(getTradeTypeName(CONTRACT_TYPES.ACCUMULATOR)).toBe('Accumulators');
        });
        it('should return the correct Higher or Lower contract type display name when is_how_low === true', () => {
            expect(getTradeTypeName(position.contract_type, { isHighLow: true })).toBe('Higher');
            expect(getTradeTypeName(CONTRACT_TYPES.PUT, { isHighLow: true })).toBe('Lower');
        });
        it('should return the correct Rise or Fall contract type display name when is_how_low === false', () => {
            expect(getTradeTypeName(position.contract_type)).toBe('Rise');
            expect(getTradeTypeName(CONTRACT_TYPES.PUT)).toBe('Fall');
        });
        it('should return the correct Up or Down contract type display name when show_button_name is true', () => {
            expect(getTradeTypeName(CONTRACT_TYPES.TURBOS.LONG, { showButtonName: true })).toBe('Up');
            expect(getTradeTypeName(CONTRACT_TYPES.TURBOS.SHORT, { showButtonName: true })).toBe('Down');
        });
        it('should return null if an incorrect contract_type is provided', () => {
            expect(getTradeTypeName(TRADE_TYPES.RISE_FALL)).toBe(null);
        });
        it('should return main title for contracts which have such field if show_main_title is true', () => {
            expect(getTradeTypeName(CONTRACT_TYPES.TURBOS.LONG, { showMainTitle: true })).toBe('Turbos');
            expect(getTradeTypeName(CONTRACT_TYPES.VANILLA.CALL, { showMainTitle: true })).toBe('Vanillas');
            expect(getTradeTypeName(CONTRACT_TYPES.MULTIPLIER.DOWN, { showMainTitle: true })).toBe('Multipliers');
        });
        it('should not return main title for contracts which have such field but show_main_title is false', () => {
            expect(getTradeTypeName(CONTRACT_TYPES.TURBOS.LONG)).not.toBe('Turbos');
            expect(getTradeTypeName(CONTRACT_TYPES.VANILLA.CALL)).not.toBe('Vanillas');
            expect(getTradeTypeName(CONTRACT_TYPES.MULTIPLIER.DOWN)).not.toBe('Multipliers');
        });
        it('should not return main title for contracts which have not such field if show_main_title is true', () => {
            expect(getTradeTypeName(CONTRACT_TYPES.FALL, { showMainTitle: true })).toBeFalsy();
        });
    });
});
