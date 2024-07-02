import mockWebSocketFactory, { WebSocketMock } from '../mock-websocket-factory';
import request, { resetReqSeqNumber } from '../request';

describe('send function', () => {
    let mockWebSocket: WebSocketMock;

    beforeEach(() => {
        resetReqSeqNumber();
        mockWebSocket = mockWebSocketFactory();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    test('should send request with correct req_id and name', async () => {
        const name = 'website_status';

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});
        mockWebSocket.respondFromServer(JSON.stringify({ req_id: 1 }));

        await promise;

        expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ [name]: 1, req_id: 1 }));
    });

    test('should send request with correct payload', async () => {
        const name = 'website_status';
        const payload = { key: 'value' };

        const promise = request(mockWebSocket as unknown as WebSocket, name, payload);
        mockWebSocket.respondFromServer(JSON.stringify({ req_id: 1 }));

        await promise;

        expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ [name]: 1, ...payload, req_id: 1 }));
    });

    test('should yield the response from server', async () => {
        const name = 'website_status';
        const mockData = { req_id: 1, result: 'success' };

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});

        mockWebSocket.respondFromServer(JSON.stringify(mockData));

        await expect(promise).resolves.toEqual(mockData);
    });

    test('should ignore responses from different reqSeqNumber', async () => {
        const name = 'website_status';
        const wrongMockData = { req_id: 9999, result: 'wrong' };
        const correctMockData = { req_id: 1, result: 'correct' };

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});

        // sending multiple request of wrong data
        mockWebSocket.respondFromServer(JSON.stringify(wrongMockData));
        mockWebSocket.respondFromServer(JSON.stringify(wrongMockData));

        // then correct data
        mockWebSocket.respondFromServer(JSON.stringify(correctMockData));

        // then incorrect one again
        mockWebSocket.respondFromServer(JSON.stringify(wrongMockData));
        mockWebSocket.respondFromServer(JSON.stringify(wrongMockData));

        await expect(promise).resolves.toEqual(correctMockData);
    });

    test('should reject the promise in case of timeout', async () => {
        const name = 'website_status';

        jest.useFakeTimers();

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});

        jest.runAllTimers();

        await expect(promise).rejects.toThrow('Request timeout');
    });

    test('any addEventListener call should have a matching removeEventListener when server response is proper', async () => {
        const name = 'website_status';

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});
        mockWebSocket.respondFromServer(JSON.stringify({ req_id: 1 }));

        await promise;

        expect(mockWebSocket.addEventListener).toHaveBeenCalled();
        // removeEventListener should be called with the same handler addEventListener was called
        const onData = mockWebSocket.addEventListener.mock.calls[0][1];
        expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith('message', onData);
    });

    test('any addEventListener call should have a matching removeEventListener in case of timeout', async () => {
        const name = 'website_status';

        jest.useFakeTimers();

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});

        jest.runAllTimers();

        await expect(promise).rejects.toThrow('Request timeout');

        expect(mockWebSocket.addEventListener).toHaveBeenCalled();
        // removeEventListener should be called with the same handler addEventListener was called
        const onData = mockWebSocket.addEventListener.mock.calls[0][1];
        expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith('message', onData);
    });
});
