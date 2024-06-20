import { renderHook } from '@testing-library/react-hooks';
import useAuthorizedQuery from '../../useAuthorizedQuery';
import useAvailableCTraderAccounts from '../useAvailableCTraderAccounts';

jest.mock('../../useAuthorizedQuery');

describe('useAvailableCTraderAccounts', () => {
    const mockUseAuthorizedQuery = useAuthorizedQuery as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return modified accounts when data is available', () => {
        const mockData = {
            trading_platform_available_accounts: [
                { market_type: 'gaming', someOtherField: 'value1' },
                { market_type: 'financial', someOtherField: 'value2' },
            ],
        };

        mockUseAuthorizedQuery.mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
        });

        const { result } = renderHook(() => useAvailableCTraderAccounts());

        expect(result.current.data).toEqual([
            { market_type: 'synthetic', platform: 'ctrader', leverage: 500, someOtherField: 'value1' },
            { market_type: 'financial', platform: 'ctrader', leverage: 1000, someOtherField: 'value2' },
        ]);
    });

    it('should return empty array when no accounts are available', () => {
        mockUseAuthorizedQuery.mockReturnValue({
            data: null,
            isLoading: false,
            isError: false,
        });

        const { result } = renderHook(() => useAvailableCTraderAccounts());

        expect(result.current.data).toBe(undefined);
    });

    it('should pass through other fields from useAuthorizedQuery', () => {
        mockUseAuthorizedQuery.mockReturnValue({
            data: null,
            isLoading: true,
            isError: false,
        });

        const { result } = renderHook(() => useAvailableCTraderAccounts());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.isError).toBe(false);
    });

    it('should handle account types not in the mapper', () => {
        const mockData = {
            trading_platform_available_accounts: [{ market_type: 'unknown', someOtherField: 'value' }],
        };

        mockUseAuthorizedQuery.mockReturnValue({
            data: mockData,
            isLoading: false,
            isError: false,
        });

        const { result } = renderHook(() => useAvailableCTraderAccounts());

        expect(result.current.data).toEqual([
            { market_type: 'unknown', platform: 'ctrader', leverage: undefined, someOtherField: 'value' },
        ]);
    });
});
