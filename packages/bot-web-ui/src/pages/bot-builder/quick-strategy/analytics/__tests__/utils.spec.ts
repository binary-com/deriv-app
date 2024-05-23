import { TFormStrategy } from '../constants';
import { getTradeParameterData } from '../utils';

jest.mock('@deriv/bot-skeleton/src/scratch/blockly', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/hooks/block_svg', () => jest.fn());

describe('utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const form_strategy = {
        form_values: {
            symbol: 'BTCUSD',
            tradetype: 'CALL',
            type: 'MULT',
            stake: '100',
        },
    } as TFormStrategy;

    it('should return form values when no stored text is available', () => {
        const result = getTradeParameterData(form_strategy);

        expect(result).toEqual({
            asset_type: 'BTCUSD',
            trade_type: 'CALL',
            purchase_condition: 'MULT',
            initial_stake: '100',
        });
    });

    it('should return stored text when available', () => {
        // eslint-disable-next-line no-proto
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue(
            '{"symbol":"ETHUSD","tradetype":"PUT","type":"DIGIT","stake":200}'
        );

        const result = getTradeParameterData(form_strategy);

        expect(result).toEqual({
            asset_type: 'ETHUSD',
            trade_type: 'PUT',
            purchase_condition: 'DIGIT',
            initial_stake: 200,
        });
    });

    it('should use form value when stored text is not present for a specific field', () => {
        // eslint-disable-next-line no-proto
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue('{"symbol":"ETHUSD"}');

        const result = getTradeParameterData(form_strategy);

        expect(result).toEqual({
            asset_type: 'ETHUSD',
            trade_type: 'CALL',
            purchase_condition: 'MULT',
            initial_stake: '100',
        });
    });
});
