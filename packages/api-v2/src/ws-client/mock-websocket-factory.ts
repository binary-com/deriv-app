type HandlerType = (event?: { data: string }) => void;

export type WebSocketMock = {
    send: jest.Mock;
    close: jest.Mock;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
    respondFromServer: (response: string) => void;
};

function mockWebSocketFactory(): WebSocketMock {
    interface Handlers {
        [key: string]: Array<HandlerType>;
    }

    const handlers: Handlers = {};

    return jest.fn().mockImplementation(() => ({
        send: jest.fn(),
        close: jest.fn(() => {
            const closeHandlers = handlers.close;
            if (closeHandlers) {
                closeHandlers.forEach(handler => handler());
            }
        }),
        addEventListener: jest.fn((event: string, handler: HandlerType) => {
            if (!handlers[event]) {
                handlers[event] = [];
            }
            handlers[event].push(handler);
        }),
        removeEventListener: jest.fn((event: string, handler: HandlerType) => {
            const eventHandlers = handlers[event];
            if (eventHandlers) {
                handlers[event] = eventHandlers.filter(h => h !== handler);
            }

            if (handlers[event].length === 0) {
                delete handlers[event];
            }
        }),
        respondFromServer: (response: string) => {
            const messageHandlers = handlers.message;
            if (messageHandlers) {
                messageHandlers.forEach(handler => handler({ data: response }));
            }
        },
    }))();
}

export default mockWebSocketFactory;
