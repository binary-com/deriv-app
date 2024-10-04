import React from 'react';
import { APIProvider, useMutation } from '@deriv/api';
import useTinValidations from '../useTinValidations';
import { TinValidations } from '@deriv/api/types';
import { mockStore, StoreProvider } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useMutation: jest.fn(),
}));

const mockUseMutation = useMutation as jest.MockedFunction<typeof useMutation<'tin_validations'>>;

describe('useTinValidations', () => {
    const mock = mockStore({});

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <APIProvider>
            <StoreProvider store={mock}>{children}</StoreProvider>
        </APIProvider>
    );

    it('should return tin validation config object', () => {
        const tin_data: TinValidations = {
            tin_employment_status_bypass: ['Student'],
            tin_format: ['^\\d{5}$'],
            is_tin_mandatory: false,
        };
        // @ts-expect-error need to come up with a way to mock the return type of useMutation
        mockUseMutation.mockReturnValue({
            data: { tin_validations: tin_data },
            mutate: jest.fn(),
        });

        const { result } = renderHook(() => useTinValidations(), { wrapper });

        expect(result.current.tin_validation_config).toEqual(tin_data);
    });
});
