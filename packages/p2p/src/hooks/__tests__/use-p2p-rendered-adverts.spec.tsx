import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { mockStore, StoreProvider } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { useStores } from 'Stores/index';
import useP2PRenderedAdverts from '../use-p2p-rendered-adverts';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PAdvertList: jest.fn(() => ({
        data: [
            {
                account_currency: 'USD',
                advertiser_details: {
                    name: 'client Test90000253',
                },
                counterparty_type: 'buy',
                type: 'buy',
                country: 'id',
                description: 'Created by script. Please call me 02203400',
            },
            {
                account_currency: 'USD',
                advertiser_details: {
                    name: 'client Test90000254',
                },
                counterparty_type: 'sell',
                type: 'sell',
                country: 'id',
                description: 'Created by script. Please call me 02203400',
            },
        ],
    })),
}));
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn().mockReturnValue({}),
}));

const mockUseStores = useStores as jest.MockedFunction<typeof useStores>;

const renderHookWithConfig = (config: Record<string, object>, mock?: TCoreStores) => {
    const mock_store = mock || mockStore({ ui: { is_mobile_or_tablet: false } });
    mockUseStores.mockReturnValueOnce(config);
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mock_store}>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useP2PRenderedAdverts(), { wrapper });
    return result.current.rendered_adverts;
};

describe('useP2PRenderedAdverts', () => {
    it('should return the adverts object from response with type sell when table_type is buy', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: 'USD',
                selected_payment_method_value: 'Alipay',
                table_type: 'buy',
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('sell');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000254');
    });
    it('should return the adverts object from response with type buy when table_type is sell', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: 'USD',
                selected_payment_method_value: 'Alipay',
                table_type: 'sell',
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response when selected_payment_method_value has a length > 0', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: 'USD',
                selected_payment_method_value: 'Alipay',
                table_type: 'sell',
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response when selected_payment_method_value has a length === 0', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: 'USD',
                selected_payment_method_value: '',
                table_type: 'sell',
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response when selected_local_currency is defined', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: undefined,
                selected_payment_method_value: 'USD',
                table_type: 'sell',
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response when selected_local_currency is undefined', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: undefined,
                selected_payment_method_value: '',
                table_type: 'sell',
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response when should_use_client_limits is true', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: undefined,
                selected_payment_method_value: '',
                table_type: 'sell',
                should_use_client_limits: true,
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response when should_use_client_limits is false', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: undefined,
                selected_payment_method_value: '',
                table_type: 'sell',
                should_use_client_limits: false,
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response when is_buy is true', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: undefined,
                selected_payment_method_value: '',
                table_type: 'sell',
                should_use_client_limits: false,
                is_buy: true,
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response when is_buy is false', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: undefined,
                selected_payment_method_value: '',
                table_type: 'sell',
                should_use_client_limits: false,
                is_buy: false,
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response for adverts that match the given search_term', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: undefined,
                selected_payment_method_value: '',
                table_type: 'sell',
                should_use_client_limits: false,
                is_buy: false,
                search_term: 'client Test90000253',
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config);

        expect(view).toHaveLength(1);
        expect(view[0]?.country).toBe('id');
        expect(view[0].counterparty_type).toBe('buy');
        expect(view[0].description).toBe('Created by script. Please call me 02203400');
        expect(view[0].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response for adverts that match the given search_term for mobile', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: undefined,
                selected_payment_method_value: '',
                table_type: 'sell',
                should_use_client_limits: false,
                is_buy: false,
                search_term: 'client Test90000253',
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config, mockStore({ ui: { is_mobile_or_tablet: true } }));

        expect(view).toHaveLength(2);
        expect(view[1]?.country).toBe('id');
        expect(view[1].counterparty_type).toBe('buy');
        expect(view[1].description).toBe('Created by script. Please call me 02203400');
        expect(view[1].advertiser_details?.name).toBe('client Test90000253');
    });
    it('should return the adverts object from response for adverts for mobile when search_term is undefined', () => {
        const config = {
            general_store: {
                list_item_limit: 50,
            },
            buy_sell_store: {
                selected_local_currency: undefined,
                selected_payment_method_value: '',
                table_type: 'sell',
                should_use_client_limits: false,
                is_buy: false,
            },
            advertiser_page_store: { counterparty_type: 'buy' },
        };
        const view = renderHookWithConfig(config, mockStore({ ui: { is_mobile_or_tablet: true } }));

        expect(view).toHaveLength(2);
        expect(view[1]?.country).toBe('id');
        expect(view[1].counterparty_type).toBe('buy');
        expect(view[1].description).toBe('Created by script. Please call me 02203400');
        expect(view[1].advertiser_details?.name).toBe('client Test90000253');
    });
});
