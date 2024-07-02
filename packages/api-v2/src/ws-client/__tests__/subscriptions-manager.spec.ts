import mockWebSocketFactory, { WebSocketMock } from '../mock-websocket-factory';
import SubscriptionsManager from '../subscriptions-manager';
import Subscription from '../subscription';
import { resetReqSeqNumber } from '../request';

describe('SubscriptionsManager', () => {
    let mockWs: WebSocketMock = mockWebSocketFactory();
    let subscriptionsManager: SubscriptionsManager;

    beforeEach(() => {
        resetReqSeqNumber();
        mockWs = mockWebSocketFactory();

        subscriptionsManager = new SubscriptionsManager();
        subscriptionsManager.setAuthorizedWs(mockWs as unknown as WebSocket);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('calls onData with initial data', async () => {
        const onData = jest.fn();
        const subscriptionPromise = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData);

        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );
        await subscriptionPromise;

        expect(onData).toBeCalledWith({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } });
    });

    it('calls onData with updated data', async () => {
        const onData = jest.fn();
        const subscriptionPromise = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData);
        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );
        await subscriptionPromise;

        mockWs.respondFromServer(
            JSON.stringify({ data: 'updated data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );

        expect(onData.mock.calls[0]).toEqual([
            { data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } },
        ]);
        expect(onData.mock.calls[1]).toEqual([
            { data: 'updated data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } },
        ]);
    });

    it('calls onData for every subscription, while keeping one backend subscription if payload the same', async () => {
        const onData1 = jest.fn();
        const onData2 = jest.fn();

        // spy on Subscription constructor
        const SubscriptionSpy = jest.spyOn(Subscription.prototype, 'subscribe');

        const subscriptionPromise1 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData1);
        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );
        await subscriptionPromise1;

        const subscriptionPromise2 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData2);
        await subscriptionPromise2;

        expect(onData1).toBeCalledWith({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } });
        expect(onData2).toBeCalledWith({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } });

        expect(SubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    // this test is more about potential technical quirks in queueing
    it('parralel subscriptions are still working correctly', async () => {
        const onData1 = jest.fn();
        const onData2 = jest.fn();

        // important - subscribe multiple times in parallel
        const subscriptionPromise1 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData1);
        const subscriptionPromise2 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData2);

        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );

        await subscriptionPromise1;
        await subscriptionPromise2;

        // test that subscriptins work correctly
        expect(onData1).toBeCalledWith({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } });
        expect(onData2).toBeCalledWith({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } });
    });

    // this test is more about potential technical quirks in queueing
    it('parralel subscriptions are collapsed into one', async () => {
        const onData1 = jest.fn();
        const onData2 = jest.fn();

        // spy on Subscription constructor
        const SubscriptionSpy = jest.spyOn(Subscription.prototype, 'subscribe');

        // important - subscribe multiple times in parallel
        const subscriptionPromise1 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData1);
        const subscriptionPromise2 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData2);

        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );

        await subscriptionPromise1;
        await subscriptionPromise2;

        expect(SubscriptionSpy).toHaveBeenCalledTimes(1);
    });

    it('calls onData for every subscription when multiple different payloads are out there', async () => {
        const onData1 = jest.fn();
        const onData2 = jest.fn();

        // spy on Subscription constructor
        const SubscriptionSpy = jest.spyOn(Subscription.prototype, 'subscribe');

        const subscriptionPromise1 = subscriptionsManager.subscribe('website_status', { payload: 'payload1' }, onData1);
        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );
        await subscriptionPromise1;

        const subscriptionPromise2 = subscriptionsManager.subscribe('website_status', { payload: 'payload2' }, onData2);
        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 2, subscription: { id: 'SUBSCRIPTION_ID' } })
        );
        await subscriptionPromise2;

        expect(onData1).toBeCalledWith({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } });
        expect(onData2).toBeCalledWith({ data: 'initial data', req_id: 2, subscription: { id: 'SUBSCRIPTION_ID' } });

        expect(SubscriptionSpy).toHaveBeenCalledTimes(2);
    });

    it('yields unsubscribe function', async () => {
        const onData = jest.fn();
        const subscriptionPromise = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData);
        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );
        const subscription = await subscriptionPromise;
        expect(subscription.unsubscribe).toBeDefined();
    });

    it('usubscribe removes specific listener and it does not receive udpates anymore', async () => {
        const onData = jest.fn();
        const subscriptionPromise = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData);
        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );
        const subscription = await subscriptionPromise;

        const unsubscribePromise = subscription.unsubscribe();
        mockWs.respondFromServer(JSON.stringify({ forget: 'SUBSCRIPTION_ID', req_id: 2 }));
        await unsubscribePromise;

        // now, if we send an update, onData should not be called
        // I'm sending 3 updates for 3 different req_ids
        // just to really make sure that there are no hanging listeners triggering onData
        mockWs.respondFromServer(
            JSON.stringify({ data: 'updated data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );
        mockWs.respondFromServer(
            JSON.stringify({ data: 'updated data', req_id: 2, subscription: { id: 'SUBSCRIPTION_ID' } })
        );
        mockWs.respondFromServer(
            JSON.stringify({ data: 'updated data', req_id: 3, subscription: { id: 'SUBSCRIPTION_ID' } })
        );

        expect(onData.mock.calls).toHaveLength(1);
    });

    it('unsubscribe removes only specific listener, while keeping other listeners active', async () => {
        const onData1 = jest.fn();
        const onData2 = jest.fn();

        const subscriptionPromise1 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData1);
        const subscriptionPromise2 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData2);

        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );

        const subscription1 = await subscriptionPromise1;

        await subscriptionPromise2;

        const unsubscribePromise = subscription1.unsubscribe();
        mockWs.respondFromServer(JSON.stringify({ forget: 'SUBSCRIPTION_ID', req_id: 2 }));
        await unsubscribePromise;

        // now updates should be received only by onData2
        mockWs.respondFromServer(
            JSON.stringify({ data: 'updated data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );

        // first onData should be called once, second one twice as it haven't been unsubscribed
        expect(onData1.mock.calls).toHaveLength(1);
        expect(onData2.mock.calls).toHaveLength(2);

        expect(onData1.mock.calls[0]).toEqual([
            { data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } },
        ]);

        expect(onData2.mock.calls[0]).toEqual([
            { data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } },
        ]);
        expect(onData2.mock.calls[1]).toEqual([
            { data: 'updated data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } },
        ]);
    });

    it('does not unsubscribe from backend when there are listeneres still out there', async () => {
        // spy on Subscription constructor
        const backendUnsubscribeSpy = jest.spyOn(Subscription.prototype, 'unsubscribe');

        const onData1 = jest.fn();
        const onData2 = jest.fn();

        const subscriptionPromise1 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData1);
        const subscriptionPromise2 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData2);

        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );

        const subscription1 = await subscriptionPromise1;

        await subscriptionPromise2;

        const unsubscribePromise1 = subscription1.unsubscribe();
        mockWs.respondFromServer(JSON.stringify({ forget: 'SUBSCRIPTION_ID', req_id: 2 }));
        await unsubscribePromise1;

        expect(backendUnsubscribeSpy).toHaveBeenCalledTimes(0);
    });

    it('unsubscribes from backend when all listeners are removed', async () => {
        // spy on Subscription constructor
        const backendUnsubscribeSpy = jest.spyOn(Subscription.prototype, 'unsubscribe');

        const onData1 = jest.fn();
        const onData2 = jest.fn();

        const subscriptionPromise1 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData1);
        const subscriptionPromise2 = subscriptionsManager.subscribe('website_status', { payload: 'payload' }, onData2);

        mockWs.respondFromServer(
            JSON.stringify({ data: 'initial data', req_id: 1, subscription: { id: 'SUBSCRIPTION_ID' } })
        );

        const subscription1 = await subscriptionPromise1;
        const subscription2 = await subscriptionPromise2;

        // first unsubscribe, no need to send response from server as this should be just listener removal
        await subscription1.unsubscribe();

        expect(backendUnsubscribeSpy).toHaveBeenCalledTimes(0);

        const unsubscribePromise2 = subscription2.unsubscribe();
        mockWs.respondFromServer(JSON.stringify({ forget: 'SUBSCRIPTION_ID', req_id: 2 }));
        await unsubscribePromise2;

        expect(backendUnsubscribeSpy).toHaveBeenCalledTimes(1);
    });
});
