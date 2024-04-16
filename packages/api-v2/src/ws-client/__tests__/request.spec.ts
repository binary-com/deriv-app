 // Adjust the import path as needed

function mockWebSocketFactory() {
    let handlers: any = {};
    let requests: any = [];

    return jest.fn().mockImplementation(() => ({
        send: jest.fn((req) => {
            requests.push(JSON.parse(req));
        }),
        close: jest.fn(),
        addEventListener: jest.fn((event, handler) => {
            handlers[event] = handler;
        }),
        removeEventListener: jest.fn(),

        respondFromServer: (data: string) => {
                handlers.message({ data: JSON.stringify({
                    req_id: requests[requests.length - 1]?.req_id,
                    ...JSON.parse(data),
                }), 
            });        
        },

        requests,
    }))();
}

describe('send function', () => {
    let mockWebSocket : any;
    let request : any;

    beforeEach(() => {
        request = require('../request').default;
        mockWebSocket = mockWebSocketFactory();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        mockWebSocket = null;
    });

    test('should send request with correct req_id and name', async () => {
        const name = 'test_action';

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});
        mockWebSocket.respondFromServer(JSON.stringify({}));

        await promise;

        expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ [name]: 1, req_id: 1 }));
    });

    test('should send request with correct payload', async () => {
        const name = 'test_action';
        const payload = { key: 'value' };

        const promise = request(mockWebSocket as unknown as WebSocket, name, payload);
        mockWebSocket.respondFromServer(JSON.stringify({}));

        await promise;

        expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ [name]: 1, ...payload, req_id: 1 }));
    });

    test('should yield the response from server', async () => {
        const name = 'test_action';
        const mockData = {req_id: 1, result: 'success' };

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});

        mockWebSocket.respondFromServer(JSON.stringify(mockData));

        await expect(promise).resolves.toEqual(mockData);
    });

    test('should ignore responses from different reqSeqNumber', async () => {
        const name = 'test_action';
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
        const name = 'test_action';

        jest.useFakeTimers();

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});

        jest.runAllTimers();

        await expect(promise).rejects.toThrow('Request timeout');
    });


    test('any addEventListener call should have a matching removeEventListener when server response is proper', async () => {
        const name = 'test_action';

        const promise = request(mockWebSocket as unknown as WebSocket, name, {});
        mockWebSocket.respondFromServer(JSON.stringify({}));

        await promise;

        expect(mockWebSocket.addEventListener).toHaveBeenCalled();
        // removeEventListener should be called with the same handler addEventListener was called
        const onData = mockWebSocket.addEventListener.mock.calls[0][1];
        expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith('message', onData);
    });

    test('any addEventListener call should have a matching removeEventListener in case of timeout', async () => {
        const name = 'test_action';

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
