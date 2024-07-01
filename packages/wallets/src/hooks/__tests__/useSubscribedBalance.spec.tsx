import { act, renderHook } from '@testing-library/react-hooks';
import useSubscribedBalance from '../useSubscribedBalance';
import Observable from '../../utils/observable';

type TBalance = Parameters<ReturnType<typeof useSubscribedBalance>['setBalanceData']>[0];

const mockData: TBalance = {
    CR1: {
        balance: 10,
        converted_amount: 10,
        currency: 'USD',
        demo_account: 0,
        status: 1,
        type: 'deriv',
    },
};

describe('useSubscribedBalance', () => {
    it('sets the balance data when the set method is called', () => {
        const { result } = renderHook(() => useSubscribedBalance());
        const { setBalanceData } = result.current;

        expect(result.current.isLoading).toEqual(true);
        expect(result.current.data).toBeUndefined();
        act(() => setBalanceData(mockData));
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockData);
    });
    it('updates balance data when new data is set', () => {
        const { result } = renderHook(() => useSubscribedBalance());
        const { setBalanceData } = result.current;

        act(() => setBalanceData(mockData));
        expect(result.current.data).toEqual(mockData);

        const updatedData: TBalance = {
            CR1: {
                balance: 20,
                converted_amount: 20,
                currency: 'USD',
                demo_account: 0,
                status: 1,
                type: 'deriv',
            },
        };

        act(() => setBalanceData(updatedData));
        expect(result.current.data).toEqual(updatedData);
    });

    it('does not set the data if the received data is the same as the existing data', () => {
        const { result } = renderHook(() => useSubscribedBalance());
        const { setBalanceData } = result.current;

        act(() => setBalanceData(mockData));
        expect(result.current.data).toEqual(mockData);
        act(() => setBalanceData(mockData));
        expect(result.current.data).toEqual(mockData);
    });
    it('executes the clean-up function when the component unmounts', () => {
        const mockUnSubscribe = jest.fn();
        jest.spyOn(Observable.prototype, 'unsubscribe').mockImplementation(mockUnSubscribe);
        const { result, unmount } = renderHook(() => useSubscribedBalance());
        const { setBalanceData } = result.current;

        act(() => setBalanceData(mockData));
        expect(result.current.data).toEqual(mockData);
        unmount();
        expect(mockUnSubscribe).toHaveBeenCalledTimes(1);
    });
});
