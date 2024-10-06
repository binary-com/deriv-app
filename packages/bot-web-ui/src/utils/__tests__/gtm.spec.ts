import { mockStore } from '@deriv/stores';
import GTM from '../gtm';
import { mockDBotStore } from 'Stores/useDBotStore';
import { mock_ws } from 'Utils/mock';
import { action } from 'mobx';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
jest.mock('@deriv/bot-skeleton/src/scratch/xml/main.xml', () => '<xml>sample</xml>');

const mock_login_id = 'test_login_id';

const mock_row_data = {
    [mock_login_id]: [
        {
            type: 'contract',
            data: {
                buy_price: 1,
                contract_id: 235121627708,
                contract_type: 'CALL',
                currency: 'USD',
                date_start: '2024-3-12 03:57:21 GMT',
                display_name: 'Volatility 10 (1s) Index',
                is_completed: true,
                payout: 1.95,
                profit: false,
                run_id: 'run-1710215840873',
                shortcode: 'CALL_1HZ10V_1.95_1710215841_1T_S0P_0',
                tick_count: 1,
                transaction_ids: {
                    buy: 469073343108,
                },
                underlying: '1HZ10V',
            },
        },
        {},
    ],
};
const mock_store = mockStore({
    client: {
        loginid: mock_login_id,
    },
});
const mock_DBot_store = mockDBotStore(mock_store, mock_ws);
const combined_store = { ...mock_DBot_store, core: { ...mock_store } };

describe('GTM Module', () => {
    it('should initialize GTM and push data layer getting called from core', () => {
        const mockPushDataLayer = jest.fn();
        mock_store.gtm.pushDataLayer = mockPushDataLayer;
        GTM.init(combined_store);
        mock_DBot_store.run_panel.setIsRunning(true);

        expect(mockPushDataLayer).toHaveBeenCalledWith(
            expect.objectContaining({
                counters: expect.anything(),
                event: expect.anything(),
                run_id: expect.anything(),
            })
        );
    });

    it('should directly push data layer', () => {
        const mockPushDataLayer = jest.fn();
        mock_store.gtm.pushDataLayer = mockPushDataLayer;

        const sampleData = {
            event: 'test_event',
            data: { key: 'value' },
        };

        GTM.pushDataLayer(sampleData);

        expect(mockPushDataLayer).toHaveBeenCalledWith(sampleData);
    });

    it('should fail on sending null for init', () => {
        // eslint-disable-next-line no-console
        console.warn = jest.fn();
        GTM.init(null);
        // eslint-disable-next-line no-console
        expect(console.warn).toHaveBeenCalledWith('Error initializing GTM reactions ', expect.any(Error));
    });

    it('onRunBot should fail on sending null', () => {
        const captured_warnings = [];
        // eslint-disable-next-line no-console
        console.warn = message => captured_warnings.push(message);
        try {
            GTM.onRunBot(null);
            mock_DBot_store.transactions.elements = mock_row_data;
            expect(captured_warnings[0]).toContain('Error pushing run data to datalayer');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});
