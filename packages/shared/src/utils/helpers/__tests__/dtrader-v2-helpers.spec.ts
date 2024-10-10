import { routes } from '../../routes';
import {
    getPositionsV2TabIndexFromURL,
    getTradeNotificationMessage,
    isDTraderV2,
    POSITIONS_V2_TAB_NAME,
} from '../dtrader-v2-helpers';

describe('getPositionsV2TabIndexFromURL', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: {
                hostname: 'https://localhost:8443/',
                pathname: routes.trader_positions,
            },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            value: originalWindowLocation,
        });
        location.search = '';
    });

    it('should return 0 if it is an open tab in location.search', () => {
        location.search = `?tab_name=${POSITIONS_V2_TAB_NAME.OPEN.toLowerCase()}`;
        expect(getPositionsV2TabIndexFromURL()).toBe(0);
    });

    it('should return 0 if it is an open tab in location.search and URL has additional parameters', () => {
        location.search = `?lang=KM&tab_name=${POSITIONS_V2_TAB_NAME.OPEN.toLowerCase()}`;
        expect(getPositionsV2TabIndexFromURL()).toBe(0);
    });

    it('should return 1 if it is a closed tab in location.search', () => {
        location.search = `?tab_name=${POSITIONS_V2_TAB_NAME.CLOSED.toLowerCase()}`;
        expect(getPositionsV2TabIndexFromURL()).toBe(1);
    });

    it('should return 1 if it is a closed tab in location.search and URL has additional parameters', () => {
        location.search = `?lang=PL&tab_name=${POSITIONS_V2_TAB_NAME.CLOSED.toLowerCase()}`;
        expect(getPositionsV2TabIndexFromURL()).toBe(1);
    });

    it('should return 0 if there is no appropriate query param', () => {
        location.search = '';
        expect(getPositionsV2TabIndexFromURL()).toBe(0);
    });
});

describe('isDTraderV2', () => {
    const data = {
        dtrader_v2: true,
        p2p_v2: false,
        sharkfin: false,
        wallet: false,
    };
    const feature_flags_with_dtrader_v2_on = { data };
    const feature_flags_with_dtrader_v2_off = { data: { ...data, dtrader_v2: false } };

    it('should return true if dtrader_v2 flag in localStorage is true and window.innerWidth is less than 600', () => {
        window.innerWidth = 599;
        window.localStorage.setItem('FeatureFlagsStore', JSON.stringify(feature_flags_with_dtrader_v2_on));
        expect(isDTraderV2()).toBe(true);
    });

    it('should return false if window.innerWidth is equal to 600', () => {
        window.innerWidth = 600;
        window.localStorage.setItem('FeatureFlagsStore', JSON.stringify(feature_flags_with_dtrader_v2_on));
        expect(isDTraderV2()).toBe(false);
    });

    it('should return false if dtrader_v2 flag in localStorage is false', () => {
        window.innerWidth = 599;
        window.localStorage.setItem('FeatureFlagsStore', JSON.stringify(feature_flags_with_dtrader_v2_off));
        expect(isDTraderV2()).toBe(false);
    });

    it('should return false if FeatureFlagsStore is missing from localStorage', () => {
        window.innerWidth = 599;
        window.localStorage.clear();
        expect(isDTraderV2()).toBe(false);
    });
});

describe('getTradeNotificationMessage', () => {
    it('should return correct trade notification message based on passed shortcode', () => {
        expect(getTradeNotificationMessage('ACCU_1HZ100V_10.00_0_0.03_1_0.000379665263_1722518733_0')).toBe(
            'Accumulators - Volatility 100 (1s) Index'
        );
        expect(getTradeNotificationMessage('PUT_1HZ100V_19.51_1722518877_1722519177_S0P_0')).toBe(
            'Fall - Volatility 100 (1s) Index'
        );
        expect(getTradeNotificationMessage('CALL_FRXAUDUSD_26.62_1722518945_1722988799_658680_0')).toBe(
            'Higher - AUD/USD'
        );
    });
});
