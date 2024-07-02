import BackendSubscription from '../subscription';
import request from '../request';
import mockWebSocketFactory, { WebSocketMock } from '../mock-websocket-factory';
// Mock the request function
jest.mock('../request', () =>
    jest
        .fn()
        .mockImplementation(() =>
            Promise.resolve({ result: 'data received from send', subscription: { id: 'SUBSCRIPTION_ID' } })
        )
);

const ENDPOINT = 'balance';

describe('Subscription', () => {
    let mockWs: WebSocketMock, backendSubscription: BackendSubscription;

    beforeEach(() => {
        mockWs = mockWebSocketFactory();

        // Initialize BackendSubscription with mocked WebSocket
        backendSubscription = new BackendSubscription(mockWs as unknown as WebSocket, ENDPOINT, { key: 'value' });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    test('calls listener with initial data', async () => {
        const listenerMock = jest.fn();
        backendSubscription.addListener(listenerMock);

        // Execute subscribe
        await backendSubscription.subscribe();

        expect(listenerMock).toHaveBeenCalledWith({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
    });

    test('calls all the listeners with initial data', async () => {
        const listenerMock1 = jest.fn();
        const listenerMock2 = jest.fn();
        const listenerMock3 = jest.fn();

        backendSubscription.addListener(listenerMock1);
        backendSubscription.addListener(listenerMock2);
        backendSubscription.addListener(listenerMock3);

        // Execute subscribe
        await backendSubscription.subscribe();

        expect(listenerMock1).toHaveBeenCalledWith({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });

        expect(listenerMock2).toHaveBeenCalledWith({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });

        expect(listenerMock3).toHaveBeenCalledWith({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
    });

    test('sends updated data to all the listneres', async () => {
        const listenerMock1 = jest.fn();
        const listenerMock2 = jest.fn();
        const listenerMock3 = jest.fn();

        backendSubscription.addListener(listenerMock1);
        backendSubscription.addListener(listenerMock2);
        backendSubscription.addListener(listenerMock3);

        // Execute subscribe
        await backendSubscription.subscribe();

        // Simulate server response
        const fakeResponse2 = {
            req_id: backendSubscription.reqId,
            data: 'test data 2',
            subscription: { id: 'SUBSCRIPTION_ID' },
        };
        mockWs.respondFromServer(JSON.stringify(fakeResponse2));

        expect(listenerMock1.mock.calls[0][0]).toEqual({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock1.mock.calls[1][0]).toEqual({
            req_id: backendSubscription.reqId,
            data: 'test data 2',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });

        expect(listenerMock2.mock.calls[0][0]).toEqual({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock2.mock.calls[1][0]).toEqual({
            req_id: backendSubscription.reqId,
            data: 'test data 2',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });

        expect(listenerMock3.mock.calls[0][0]).toEqual({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock3.mock.calls[1][0]).toEqual({
            req_id: backendSubscription.reqId,
            data: 'test data 2',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
    });

    test('ignores messages with different req_id', async () => {
        const listenerMock = jest.fn();
        backendSubscription.addListener(listenerMock);

        // Execute subscribe
        await backendSubscription.subscribe();

        // Simulate server response with different req_id
        const fakeBadResponse = {
            req_id: +(backendSubscription.reqId ?? 1) + 3,
            data: 'test data 2',
            subscription: { id: 'SUBSCRIPTION_ID' },
        };
        mockWs.respondFromServer(JSON.stringify(fakeBadResponse));

        // Simulate server response
        const fakeCorrectResponse = {
            req_id: backendSubscription.reqId,
            data: 'test data 2',
            subscription: { id: 'SUBSCRIPTION_ID' },
        };
        mockWs.respondFromServer(JSON.stringify(fakeCorrectResponse));

        expect(listenerMock).toHaveBeenCalledWith({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock).not.toHaveBeenCalledWith(fakeBadResponse);
        expect(listenerMock).toHaveBeenCalledWith(fakeCorrectResponse);
    });

    test('when unsubscribing, removes websocket message and close listeners', async () => {
        const listenerMock = jest.fn();
        backendSubscription.addListener(listenerMock);

        // Execute subscribe
        await backendSubscription.subscribe();

        // Execute unsubscribe
        await backendSubscription.unsubscribe();

        // expect removeEventListener to have been called with with the same arguments as addEventListener to ensure proper cleanup
        expect(mockWs.removeEventListener).toHaveBeenCalledWith('message', mockWs.addEventListener.mock.calls[0][1]);
        expect(mockWs.removeEventListener).toHaveBeenCalledWith('close', mockWs.addEventListener.mock.calls[1][1]);
    });

    test('when unsubscribing, sends forget request with received subscription id', async () => {
        const listenerMock = jest.fn();
        backendSubscription.addListener(listenerMock);

        // Execute subscribe
        const subscribePromise = backendSubscription.subscribe();
        mockWs.respondFromServer(
            JSON.stringify({
                req_id: backendSubscription.reqId,
                data: 'test data 2',
                subscription: { id: 'SUBSCRIPTION_ID' },
            })
        );
        await subscribePromise;

        // // Execute unsubscribe
        await backendSubscription.unsubscribe();

        expect(request).toHaveBeenCalledWith(mockWs, 'forget', { forget: 'SUBSCRIPTION_ID' });
    });

    test('when websocket closes, removes websocket message and close listeners', async () => {
        const listenerMock = jest.fn();
        backendSubscription.addListener(listenerMock);

        // Execute subscribe
        await backendSubscription.subscribe();

        // Simulate websocket close
        mockWs.close();

        // expect removeEventListener to have been called with with the same arguments as addEventListener to ensure proper cleanup
        expect(mockWs.removeEventListener).toHaveBeenCalledWith('message', mockWs.addEventListener.mock.calls[0][1]);
        expect(mockWs.removeEventListener).toHaveBeenCalledWith('close', mockWs.addEventListener.mock.calls[1][1]);
    });

    test('after websocket closes, does not call listeners even on new data', async () => {
        const listenerMock1 = jest.fn();
        const listenerMock2 = jest.fn();
        const listenerMock3 = jest.fn();

        backendSubscription.addListener(listenerMock1);
        backendSubscription.addListener(listenerMock2);
        backendSubscription.addListener(listenerMock3);

        // Execute subscribe
        await backendSubscription.subscribe();

        // Simulate websocket close
        mockWs.close();

        // Simulate server response
        const fakeResponse2 = {
            req_id: backendSubscription.reqId,
            data: 'test data 2',
            subscription: { id: 'SUBSCRIPTION_ID' },
        };
        mockWs.respondFromServer(JSON.stringify(fakeResponse2));

        expect(listenerMock1.mock.calls[0][0]).toEqual({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock1.mock.calls[1]).toBeUndefined();

        expect(listenerMock2.mock.calls[0][0]).toEqual({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock2.mock.calls[1]).toBeUndefined();

        expect(listenerMock3.mock.calls[0][0]).toEqual({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock3.mock.calls[1]).toBeUndefined();
    });

    test('after unsubscribe, does not call listeners even on new data', async () => {
        const listenerMock1 = jest.fn();
        const listenerMock2 = jest.fn();
        const listenerMock3 = jest.fn();

        backendSubscription.addListener(listenerMock1);
        backendSubscription.addListener(listenerMock2);
        backendSubscription.addListener(listenerMock3);

        // Execute subscribe
        await backendSubscription.subscribe();

        // Simulate websocket close
        await backendSubscription.unsubscribe();

        // Simulate server response
        const fakeResponse2 = {
            req_id: backendSubscription.reqId,
            data: 'test data 2',
            subscription: { id: 'SUBSCRIPTION_ID' },
        };
        mockWs.respondFromServer(JSON.stringify(fakeResponse2));

        expect(listenerMock1.mock.calls[0][0]).toEqual({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock1.mock.calls[1]).toBeUndefined();

        expect(listenerMock2.mock.calls[0][0]).toEqual({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock2.mock.calls[1]).toBeUndefined();

        expect(listenerMock3.mock.calls[0][0]).toEqual({
            result: 'data received from send',
            subscription: { id: 'SUBSCRIPTION_ID' },
        });
        expect(listenerMock3.mock.calls[1]).toBeUndefined();
    });
});
