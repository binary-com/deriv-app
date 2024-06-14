import { waitFor } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { adverts } from 'Pages/my-ads/__mocks__/mock-data';
import { requestWS } from 'Utils/websocket';
import MyAdsStore from '../my-ads-store';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isMobileOrTablet: jest.fn(() => false),
}));

const mockFn = jest.fn();
jest.mock('Utils/websocket', () => ({
    ...jest.requireActual('Utils/websocket'),
    requestWS: jest.fn(),
}));

describe('MyAdsStore', () => {
    let my_ads_store;
    beforeEach(() => {
        const root_store = mockStore({
            general_store: {
                is_barred: false,
                showModal: jest.fn(),
            },
        });
        my_ads_store = new MyAdsStore(root_store);
    });
    it('should instantiate', () => {
        expect(my_ads_store).toBeTruthy();
    });
    it('should handle activate/deactivate of ads', async () => {
        my_ads_store.setAdverts(adverts);
        requestWS.mockResolvedValue({
            p2p_advert_update: {
                ...adverts[0],
                is_active: 0,
            },
        });
        my_ads_store.onClickActivateDeactivate('53', true, mockFn);
        expect(requestWS).toBeCalledWith({ p2p_advert_update: 1, id: '53', is_active: 0 });
        await waitFor(() => expect(mockFn).toBeCalledWith(false));
        await waitFor(() => expect(my_ads_store.adverts[0].is_active).toBe(0));
    });
    it('should show error popup when api throws error on activat/deactivate of ads', async () => {
        my_ads_store.setAdverts(adverts);
        requestWS.mockResolvedValue({ error: { code: 'some_error', message: 'this is the error message' } });
        my_ads_store.onClickActivateDeactivate('53', true, mockFn);
        expect(requestWS).toBeCalledWith({ p2p_advert_update: 1, id: '53', is_active: 0 });
        await waitFor(() => expect(my_ads_store.error_code).toBe('some_error'));
        await waitFor(() =>
            expect(my_ads_store.root_store.general_store.showModal).toBeCalledWith({
                key: 'ErrorModal',
                props: {
                    has_close_icon: false,
                    error_message: 'this is the error message',
                    error_modal_title: "Something's not right",
                    width: '40rem',
                },
            })
        );
    });
});
