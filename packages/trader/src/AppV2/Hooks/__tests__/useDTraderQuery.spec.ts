import { renderHook, act } from '@testing-library/react-hooks';
import { useDtraderQuery, invalidateDTraderCache } from '../useDtraderQuery';
import { WS } from '@deriv/shared';

jest.mock('@deriv/shared', () => ({
    WS: {
        send: jest.fn(),
        authorized: {
            send: jest.fn(),
        },
    },
}));

describe('useDtraderQuery', () => {
    const mockRequest = { some_request: 'test' };
    const mockResponse = { data: 'some data' };
    const mockError = { message: 'An error occurred' };

    beforeEach(() => {
        invalidateDTraderCache(['some-key']);
        jest.clearAllMocks();
    });

    it('should return initial state correctly', () => {
        const { result } = renderHook(() => useDtraderQuery(['some-key'], mockRequest));

        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();
        expect(result.current.is_fetching).toBe(true);
    });

    it('should fetch data successfully', async () => {
        (WS.send as jest.Mock).mockResolvedValueOnce(mockResponse);

        const { result, waitForNextUpdate } = renderHook(() =>
            useDtraderQuery(['some-key'], mockRequest, { wait_for_authorize: false })
        );

        await waitForNextUpdate();

        expect(WS.send).toHaveBeenCalledWith(mockRequest);
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.error).toBeNull();
        expect(result.current.is_fetching).toBe(false);
    });

    it('should fetch data using authorized send when wait_for_authorize is true', async () => {
        (WS.authorized.send as jest.Mock).mockResolvedValueOnce(mockResponse);

        const { result, waitForNextUpdate } = renderHook(() =>
            useDtraderQuery(['some-key'], mockRequest, { wait_for_authorize: true })
        );

        await waitForNextUpdate();

        expect(WS.authorized.send).toHaveBeenCalledWith(mockRequest);
        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.error).toBeNull();
        expect(result.current.is_fetching).toBe(false);
    });

    it('should handle errors correctly', async () => {
        (WS.authorized.send as jest.Mock).mockRejectedValueOnce(mockError);

        const { result, waitForNextUpdate } = renderHook(() => useDtraderQuery(['some-key'], mockRequest));

        await waitForNextUpdate();

        expect(result.current.data).toBeNull();
        expect(result.current.error).toEqual(mockError);
        expect(result.current.is_fetching).toBe(false);
    });

    it('should cache the result', async () => {
        (WS.authorized.send as jest.Mock).mockResolvedValueOnce(mockResponse);

        const { result, waitForNextUpdate } = renderHook(() => useDtraderQuery(['some-key'], mockRequest));

        await waitForNextUpdate();

        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.is_fetching).toBe(false);

        const { result: cachedResult } = renderHook(() => useDtraderQuery(['some-key'], mockRequest));

        expect(cachedResult.current.data).toEqual(mockResponse);
        expect(cachedResult.current.is_fetching).toBe(false);
        expect(WS.authorized.send).toHaveBeenCalledTimes(1);
    });

    it('should refetch data on calling refetch', async () => {
        (WS.authorized.send as jest.Mock).mockResolvedValueOnce(mockResponse);

        const { result, waitForNextUpdate } = renderHook(() => useDtraderQuery(['some-key'], mockRequest));

        await waitForNextUpdate();

        expect(result.current.data).toEqual(mockResponse);

        const newMockResponse = { data: 'new data' };
        (WS.authorized.send as jest.Mock).mockResolvedValueOnce(newMockResponse);

        act(() => {
            result.current.refetch();
        });

        await waitForNextUpdate();

        expect(result.current.data).toEqual(newMockResponse);
    });

    it('should not fetch data if enabled is false', () => {
        const { result } = renderHook(() => useDtraderQuery(['some-key'], mockRequest, { enabled: false }));

        expect(result.current.data).toBeNull();
        expect(result.current.is_fetching).toBe(false);
        expect(WS.send).not.toHaveBeenCalled();
    });
});
