import moment from 'moment';
import { init, get, getDistanceToServerTime } from '../server_time';
import { WS } from '@deriv/shared';

jest.mock('@deriv/shared', () => {
    const today = new Date();
    const epoch = Math.floor(today.getTime() / 1000);

    return {
        WS: {
            send: jest.fn().mockResolvedValue({ time: epoch }),
        },
    };
});

describe('server_time', () => {
    beforeEach(() => {
        jest.useFakeTimers('legacy');
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return undefined if server_time is not set when calling get', () => {
        const server_time = get();
        expect(server_time).toBe(undefined);
    });

    it('should call requestTime when calling init', () => {
        init();
        expect(WS.send).toHaveBeenCalled();
    });

    it('should call requestTime every 30 seconds when calling init', () => {
        init();
        jest.advanceTimersByTime(60000);
        expect(WS.send).toHaveBeenCalledTimes(2);
    });

    it('should return server_time when calling get', () => {
        init();
        const server_time = get();
        expect(server_time).toBeInstanceOf(moment);
    });

    it('should return distance to server time when calling getDistanceToServerTime', () => {
        init();
        const compare_time = moment().add(1, 'day').unix() * 1000;
        const distance = getDistanceToServerTime(compare_time);
        expect(distance).toBeGreaterThan(0);
    });
});
