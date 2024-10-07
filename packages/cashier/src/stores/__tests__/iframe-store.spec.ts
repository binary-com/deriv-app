import IframeStore from '../iframe-store';
import { configure } from 'mobx';
import { TRootStore } from '../../types';
import { mockStore } from '@deriv/stores';

configure({ safeDescriptors: false });

let iframe_store: IframeStore, root_store: TRootStore;

beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
    jest.spyOn(global, 'clearInterval');
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'clearTimeout');
    root_store = mockStore({
        client: {
            setVerificationCode: jest.fn(),
        },
        modules: {
            cashier: {
                general_store: {
                    active_container: 'payment_agent',
                    setLoading: jest.fn(),
                },
            },
        },
        ui: {
            is_dark_mode_on: true,
        },
    }) as TRootStore;
    iframe_store = new IframeStore(root_store);
});

describe('IframeStore', () => {
    it('should set session_timeout and invoke removeOnIframeLoaded function', () => {
        const spyRemoveOnIframeLoaded = jest.spyOn(iframe_store, 'removeOnIframeLoaded');
        iframe_store.setSessionTimeout(true);

        expect(iframe_store.is_session_timeout).toBeTruthy();
        expect(spyRemoveOnIframeLoaded).toHaveBeenCalledTimes(1);
    });

    it('should remove onIframeLoaded function', () => {
        const removeEventListener = jest.spyOn(window, 'removeEventListener');
        iframe_store.onIframeLoaded = jest.fn();
        iframe_store.removeOnIframeLoaded();

        expect(removeEventListener).toHaveBeenCalledWith('message', expect.any(Function), false);
        expect(iframe_store.onIframeLoaded).toBe(null);
    });

    it('should clear timeout cashier url', () => {
        jest.useFakeTimers();

        iframe_store.timeout_session = 999;
        iframe_store.clearTimeoutCashierUrl();

        expect(clearTimeout).toHaveBeenCalledWith(999);
        jest.useRealTimers();
    });

    it('should set timeout cashier url', () => {
        jest.useFakeTimers();

        const spyClearTimeoutCashierUrl = jest.spyOn(iframe_store, 'clearTimeoutCashierUrl');
        const spySetSessionTimeout = jest.spyOn(iframe_store, 'setSessionTimeout');
        iframe_store.setTimeoutCashierUrl(true);

        expect(spyClearTimeoutCashierUrl).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 60000);
        expect(spySetSessionTimeout).toHaveBeenCalledWith(true);
        jest.useRealTimers();
    });

    it('should set container height', () => {
        iframe_store.setContainerHeight(100);

        expect(iframe_store.iframe_height).toBe(100);
    });

    it('should clear iframe', () => {
        const spyClearTimeoutCashierUrl = jest.spyOn(iframe_store, 'clearTimeoutCashierUrl');
        const spySetSessionTimeout = jest.spyOn(iframe_store, 'setSessionTimeout');
        iframe_store.clearIframe();

        expect(iframe_store.iframe_url).toBe('');
        expect(spyClearTimeoutCashierUrl).toHaveBeenCalledTimes(1);
        expect(spySetSessionTimeout).toHaveBeenCalledTimes(1);
        expect(spySetSessionTimeout).toHaveBeenCalledWith(true);
    });

    it('should set the proper iframe url', () => {
        iframe_store.setIframeUrl('iframe_url/');

        expect(iframe_store.iframe_url).toBe('iframe_url/');
        expect(iframe_store.root_store.client.setVerificationCode).toHaveBeenCalledWith('', 'payment_agent_withdraw');
    });

    it('iframe_url should be an empty string if there is no url', () => {
        iframe_store.setIframeUrl('');

        expect(iframe_store.iframe_url).toBe('');
    });

    it('should add event listener with proper arguments', async () => {
        const spyAddEventListener = jest.spyOn(window, 'addEventListener');

        await iframe_store.checkIframeLoaded();

        expect(spyAddEventListener).toHaveBeenCalledWith('message', iframe_store.onIframeLoaded, false);
    });

    it('should set proper iframe_height for desktop view', async () => {
        const spyRemoveOnIframeLoaded = jest.spyOn(iframe_store, 'removeOnIframeLoaded');

        expect(iframe_store.onIframeLoaded).toBe(null);

        await iframe_store.checkIframeLoaded();
        expect(spyRemoveOnIframeLoaded).toHaveBeenCalledTimes(1);

        const spyOnIframeLoaded = jest.spyOn(iframe_store, 'onIframeLoaded');

        spyOnIframeLoaded({ origin: 'https://cashier.deriv.com' });
        expect(iframe_store.iframe_height).toBe(window.innerHeight - 190);
    });

    it('should set proper iframe_height for mobile view', async () => {
        root_store.ui.is_mobile = true;
        const spyRemoveOnIframeLoaded = jest.spyOn(iframe_store, 'removeOnIframeLoaded');

        expect(iframe_store.onIframeLoaded).toBe(null);

        await iframe_store.checkIframeLoaded();
        expect(spyRemoveOnIframeLoaded).toHaveBeenCalledTimes(1);

        const spyOnIframeLoaded = jest.spyOn(iframe_store, 'onIframeLoaded');

        spyOnIframeLoaded({ origin: 'https://cashier.deriv.com' });
        expect(iframe_store.iframe_height).toBe(window.innerHeight - 100);
    });
});
