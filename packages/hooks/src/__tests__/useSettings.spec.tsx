import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useQuery, useMutation, useInvalidateQuery } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import useSettings from '../useSettings';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useInvalidateQuery: jest.fn(),
}));

describe('useSettings', () => {
    const mockInvalidateQuery = jest.fn();
    const mockMutate = jest.fn();
    const mockStoreData = mockStore({
        client: { is_authorize: true },
    });
    const wrapper = ({ children }: { children: JSX.Element }) => (
        <StoreProvider store={mockStoreData}>{children}</StoreProvider>
    );

    beforeEach(() => {
        (useInvalidateQuery as jest.Mock).mockReturnValue(mockInvalidateQuery);
        (useMutation as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            data: null,
            isLoading: false,
            error: null,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return initial state correctly', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        });

        const { result } = renderHook(() => useSettings(), { wrapper });

        expect(result.current.data).toBe(undefined);
        expect(result.current.mutation.data).toBe(null);
        expect(result.current.mutation.isLoading).toBe(false);
        expect(result.current.mutation.error).toBe(null);
    });

    it('should return modified settings', () => {
        const mockData = {
            get_settings: {
                citizen: 'country',
                account_opening_reason: 'reason',
                has_submitted_personal_details: true,
                place_of_birth: 'place',
                tax_residence: 'residence',
                tax_identification_number: 'number',
            },
        };

        (useQuery as jest.Mock).mockReturnValue({
            data: mockData,
            isLoading: false,
            error: null,
        });

        const { result } = renderHook(() => useSettings(), { wrapper });

        expect(result.current.data).toEqual({
            ...mockData.get_settings,
            has_submitted_personal_details: true,
        });
    });

    it('should call mutate with correct payload', () => {
        (useQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        });

        const { result } = renderHook(() => useSettings(), { wrapper });

        act(() => {
            result.current.update({ phone: '+123456789' });
        });

        expect(mockMutate).toHaveBeenCalledWith({ payload: { phone: '+123456789' } });
    });
});
