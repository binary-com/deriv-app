import APIMiddleware, { REQUESTS } from '../api-middleware';
import { datadogLogs } from '@datadog/browser-logs';

jest.mock('@datadog/browser-logs', () => {
    return {
        ...jest.requireActual('@datadog/browser-logs'),
        datadogLogs: {
            init: jest.fn(),
            logger: {
                info: jest.fn(),
            },
        },
    };
});

describe('APIMiddleware', () => {
    let api_middleware: APIMiddleware;
    const info = jest.fn();
    const mockMeasure = jest.fn(() => ({ startTime: 0 }));
    const clearMarks = jest.fn();
    const clearMeasures = jest.fn();
    const mockSendRequestsStatistic = jest.fn();

    const measure_object = {
        name: 'time',
        startTime: 15288.20000004768,
        duration: 133,
        detail: null,
        isBotRunning: false,
    };

    beforeEach(() => {
        Object.defineProperty(window, 'performance', {
            value: {
                mark: jest.fn(),
                measure: mockMeasure,
                getEntriesByName: jest.fn().mockReturnValue([{ name: 'entry_name' }]),
                logger: {
                    info: jest.fn().mockReturnValue([{ measure: 'measure_name' }, measure_object]),
                },
                mockSendRequestsStatistic,
                clearMeasures,
                clearMarks,
            },
        });
        Object.defineProperty(window, 'is_datadog_logging_enabled', { value: true });

        api_middleware = new APIMiddleware();
        process.env.DATADOG_CLIENT_TOKEN_LOGS = '123';
    });

    it('Should get measure for each request, invoke method log(), clear measures', () => {
        const spyLog = jest.spyOn(api_middleware, 'log');

        api_middleware.sendRequestsStatistic(false);

        REQUESTS.forEach(request_name => {
            expect(spyLog).toHaveBeenCalledWith([{ name: 'entry_name' }], false, request_name);
        });
        expect(clearMeasures).toBeCalledTimes(1);
    });

    it('Should log info if measures are there', () => {
        const datadog_logs = {
            name: 'time',
            startTimeDate: 15288.20000004768,
            duration: 133,
            detail: null,
            isBotRunning: false,
        };

        const spyDatalogsInfo = jest.spyOn(datadogLogs.logger, 'info');
        api_middleware.log([datadog_logs], false);

        expect(spyDatalogsInfo).toHaveBeenCalledWith(datadog_logs.name, { ...measure_object });
    });

    it('Should not log info if measures are absent', () => {
        api_middleware.log([], false);
        expect(info).toBeCalledTimes(0);
    });

    it('GetRequestType', () => {
        const spyGetRequestType = jest.spyOn(api_middleware, 'getRequestType');
        const request_type = { authorize: 1 };
        const result = api_middleware.getRequestType(request_type);
        REQUESTS.forEach(type => {
            if (type in request_type) {
                expect(spyGetRequestType).toHaveBeenCalledWith(request_type);
                expect(result).toBeDefined();
            }
        });
    });

    it('Should invoke the method defineMeasure()', async () => {
        const spydefineMeasure = jest.spyOn(api_middleware, 'defineMeasure');
        const response_promise = new Promise((res, rej) => res({ authorize: 1 }));

        await api_middleware.sendIsCalled({ response_promise, args: [{ authorize: 1 }] });

        expect(spydefineMeasure).toHaveBeenCalledWith('authorize');
    });

    it('Should invoke the method sendWillBeCalled()', async () => {
        const spysendWillBeCalled = jest.spyOn(api_middleware, 'sendWillBeCalled');

        await api_middleware.sendWillBeCalled({ args: [{ buy: 1 }] });

        expect(spysendWillBeCalled).toHaveBeenCalledWith({ args: [{ buy: 1 }] });
    });

    describe('Define measure', () => {
        it('Should define measure of history API call', () => {
            const spydefineMeasure = jest.spyOn(api_middleware, 'defineMeasure');
            const result = api_middleware.defineMeasure('history');

            expect(spydefineMeasure).toHaveBeenCalledWith('history');
            expect(mockMeasure).toHaveBeenCalledWith('ticks_history', 'ticks_history_start', 'ticks_history_end');
            expect(result).toBeDefined();
        });

        it('Should define measure of proposal API call', () => {
            const spydefineMeasure = jest.spyOn(api_middleware, 'defineMeasure');

            const result = api_middleware.defineMeasure('proposal');

            expect(spydefineMeasure).toHaveBeenCalledWith('proposal');
            expect(mockMeasure).toHaveBeenCalledWith('proposal', 'proposal_start', 'proposal_end');
            expect(result).toBeDefined();
        });

        it('Should define measure for API calls except of history', () => {
            const spydefineMeasure = jest.spyOn(api_middleware, 'defineMeasure');

            REQUESTS.forEach(request_name => {
                if (request_name !== 'history') {
                    const result = api_middleware.defineMeasure(request_name);
                    expect(spydefineMeasure).toHaveBeenCalledWith(request_name);
                    expect(mockMeasure).toHaveBeenCalledWith(
                        `${request_name}`,
                        `${request_name}_start`,
                        `${request_name}_end`
                    );
                    expect(result).toBeDefined();
                }
            });
        });
    });

    it('Should be added the method sendRequestsStatistic to window', () => {
        expect(window).not.toBeUndefined();
        expect(mockSendRequestsStatistic).not.toBeUndefined();
    });
});
