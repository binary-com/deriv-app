import { TRADE_TYPES } from '@deriv/shared';
import { isTradeParamVisible, getChartHeight, checkIsServiceModalError } from '../layout-utils';

describe('isTradeParamVisible', () => {
    it('should return correct value for expiration component key', () => {
        const common_args = {
            component_key: 'expiration',
            contract_type: TRADE_TYPES.MULTIPLIER,
            has_cancellation: false,
            symbol: 'cryBTCUSD',
        };
        expect(
            isTradeParamVisible({
                ...common_args,
            })
        ).toEqual(true);
        expect(
            isTradeParamVisible({
                ...common_args,
                symbol: '1HZ100V',
            })
        ).toEqual(false);
        expect(
            isTradeParamVisible({
                ...common_args,
                contract_type: TRADE_TYPES.ACCUMULATOR,
            })
        ).toEqual(false);
    });

    it('should return correct value for mult_info_display component key', () => {
        const common_args = {
            component_key: 'mult_info_display',
            contract_type: TRADE_TYPES.MULTIPLIER,
            has_cancellation: true,
            symbol: '1HZ100V',
        };
        expect(
            isTradeParamVisible({
                ...common_args,
            })
        ).toEqual(true);
        expect(
            isTradeParamVisible({
                ...common_args,
                has_cancellation: false,
            })
        ).toEqual(false);
    });
    it('should return false if there is no such contract type or component_key', () => {
        const common_args = {
            component_key: 'barrier',
            contract_type: TRADE_TYPES.HIGH_LOW,
            has_cancellation: false,
            symbol: '1HZ150V',
        };
        expect(
            isTradeParamVisible({
                ...common_args,
                component_key: 'mock_component_key',
            })
        ).toEqual(false);
        expect(
            isTradeParamVisible({
                ...common_args,
                contract_type: 'mock_contract_type',
            })
        ).toEqual(false);
    });
});

describe('getChartHeight', () => {
    const original_height = window.innerHeight;

    beforeAll(() => (window.innerHeight = 740));
    afterAll(() => (window.innerHeight = original_height));

    it('should return correct chart height', () => {
        const common_args = {
            contract_type: TRADE_TYPES.MATCH_DIFF,
            has_cancellation: false,
            is_accumulator: false,
            symbol: '1HZ100V',
        };
        const default_chart_height = 484;
        const accumulators_chart_height = 428;
        const chart_height_with_additional_info = 454;

        expect(
            getChartHeight({
                ...common_args,
            })
        ).toEqual(default_chart_height);
        expect(
            getChartHeight({
                ...common_args,
                contract_type: TRADE_TYPES.ACCUMULATOR,
                is_accumulator: true,
            })
        ).toEqual(accumulators_chart_height);
        expect(
            getChartHeight({
                ...common_args,
                contract_type: TRADE_TYPES.MULTIPLIER,
                has_cancellation: true,
            })
        ).toEqual(chart_height_with_additional_info);
        expect(
            getChartHeight({
                ...common_args,
                contract_type: TRADE_TYPES.MULTIPLIER,
                symbol: 'cryBTCUSD',
            })
        ).toEqual(chart_height_with_additional_info);
        expect(
            getChartHeight({
                ...common_args,
                contract_type: TRADE_TYPES.VANILLA.CALL,
            })
        ).toEqual(chart_height_with_additional_info);
        expect(
            getChartHeight({
                ...common_args,
                contract_type: TRADE_TYPES.RISE_FALL,
            })
        ).toEqual(chart_height_with_additional_info);
        expect(
            getChartHeight({
                ...common_args,
                contract_type: TRADE_TYPES.HIGH_LOW,
            })
        ).toEqual(chart_height_with_additional_info);
    });
});

describe('checkIsServiceModalError', () => {
    it('should return false if services_error is empty object', () => {
        expect(checkIsServiceModalError({ services_error: {} })).toBe(false);
    });
    it('should return true if services_error has a proper code', () => {
        expect(checkIsServiceModalError({ services_error: { code: 'InsufficientBalance' } })).toBe(true);
        expect(checkIsServiceModalError({ services_error: { code: 'InvalidContractProposal' } })).toBe(true);
        expect(checkIsServiceModalError({ services_error: { code: 'PleaseAuthenticate' } })).toBe(true);
    });
    it('should return true if services_error code is AuthorizationRequired and type is buy', () => {
        expect(checkIsServiceModalError({ services_error: { code: 'AuthorizationRequired', type: 'buy' } })).toBe(true);
    });
    it('should return true if is_mf_verification_pending_modal_visible is true', () => {
        expect(checkIsServiceModalError({ services_error: {}, is_mf_verification_pending_modal_visible: true })).toBe(
            true
        );
    });
});
