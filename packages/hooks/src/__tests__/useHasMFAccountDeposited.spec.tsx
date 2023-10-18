import * as React from 'react';
import { APIProvider, useFetch } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useHasMFAccountDeposited from '../useHasMFAccountDeposited';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({ data: { get_account_status: { status: [] } } })),
}));

const mockUseFetch = useFetch as jest.MockedFunction<typeof useFetch<'get_account_status'>>;
const mock_usefetch_return_value = {
    data: {
        get_account_status: {
            status: ['allow_document_upload'],
        },
    },
};

describe('useHasMFAccountDeposited', () => {
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <APIProvider>
            <StoreProvider store={mockStore({})}>{children}</StoreProvider>
        </APIProvider>
    );

    beforeEach(() => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockUseFetch.mockReturnValue(mock_usefetch_return_value);
    });

    test('should return false if expected status is not in account_status', () => {
        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current).toBe(false);
    });

    test('should return true if unwelcome status is in account_status', () => {
        mock_usefetch_return_value.data.get_account_status.status = ['unwelcome'];
        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return true if withdrawal_locked status is in account_status', () => {
        mock_usefetch_return_value.data.get_account_status.status = ['withdrawal_locked'];
        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current).toBe(true);
    });

    test('should return true if cashier_locked status is in account_status', () => {
        mock_usefetch_return_value.data.get_account_status.status = ['cashier_locked'];
        const { result } = renderHook(() => useHasMFAccountDeposited(), { wrapper });

        expect(result.current).toBe(true);
    });
});
