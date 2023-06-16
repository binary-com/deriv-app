import { TContractInfo } from '@deriv/shared';
import { createTickMarkers } from '../chart-markers';

describe('createTickMarkers', () => {
    let contract_info: TContractInfo;
    beforeEach(() => {
        contract_info = {
            contract_type: 'CALL',
            status: 'open',
            tick_stream: [
                { epoch: 1, tick: 1.2345, tick_display_value: '1.2345' },
                { epoch: 2, tick: 1.235, tick_display_value: '1.235' },
                { epoch: 3, tick: 1.2355, tick_display_value: '1.2355' },
                { epoch: 4, tick: 1.236, tick_display_value: '1.236' },
                { epoch: 5, tick: 1.2365, tick_display_value: '1.2365' },
                { epoch: 6, tick: 1.237, tick_display_value: '1.237' },
                { epoch: 7, tick: 1.2375, tick_display_value: '1.2375' },
                { epoch: 8, tick: 1.238, tick_display_value: '1.238' },
                { epoch: 9, tick: 1.2385, tick_display_value: '1.2385' },
                { epoch: 10, tick: 1.239, tick_display_value: '1.239' },
            ],
            entry_tick_time: 1,
            entry_tick_display_value: '1.2345',
            tick_count: 10,
        };
    });
    it('should return an empty array if tick_stream is empty', () => {
        contract_info.tick_stream = [];
        contract_info.tick_count = 0;
        const result = createTickMarkers(contract_info);
        expect(result).toEqual([]);
    });
    it('should return an array with markers for every tick in tick_stream when contract is open', () => {
        contract_info.tick_count = 10;
        const result = createTickMarkers(contract_info);
        expect(result.length).toBe(10);
        expect(result[0].content_config.className).toBe('chart-spot__entry');
        expect(result[1].content_config.is_value_hidden).toBe(false);
        expect(result[1].content_config.spot_className).toBe('chart-spot__spot');
        expect(result[1].content_config.spot_count).toBe(1);
        expect(result[1].content_config.spot_epoch).toBe('2');
        expect(result[1].content_config.spot_value).toBe('1.235');
    });
    it('should return an array with markers for all ticks when any tick contract is closed', () => {
        contract_info.audit_details = { all_ticks: contract_info.tick_stream };
        contract_info.tick_count = 10;
        contract_info.status = 'won';
        contract_info.exit_tick_time = 10;
        contract_info.exit_tick_display_value = '1.239';
        const result = createTickMarkers(contract_info);
        expect(result.length).toBe(10);
        expect(result[result.length - 1].content_config.spot_value).toBe('1.239');
        expect(result[result.length - 1].type).toBe('SPOT_EXIT');

        contract_info.contract_type = 'ACCU';
        const result_for_accumulator = createTickMarkers(contract_info);
        expect(result_for_accumulator.length).toBe(10);
        expect(result_for_accumulator[result_for_accumulator.length - 1].content_config.spot_value).toBe('1.239');
        expect(result_for_accumulator[result_for_accumulator.length - 1].type).toBe('SPOT_EXIT');
    });
    it('should correctly handle accumulator contract markers when contract is open', () => {
        contract_info.contract_type = 'ACCU';
        contract_info.status = 'open';
        const result = createTickMarkers(contract_info);
        expect(result.length).toBe(8); // preexit and exit ticks are not drawn for open accumulator contracts
        expect(result[result.length - 1].content_config.spot_value).toBe('1.238');
        expect(result[result.length - 1].type).toBe('SPOT_MIDDLE_7');
    });
});
