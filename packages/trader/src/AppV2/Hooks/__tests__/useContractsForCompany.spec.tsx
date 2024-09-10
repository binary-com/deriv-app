import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../trader-providers';
import { WS, getContractCategoriesConfig, getContractTypesConfig, cloneObject } from '@deriv/shared';
import useContractsForCompany from '../useContractsForCompany';
import { waitFor } from '@testing-library/react';
import { invalidateDTraderCache } from '../useDtraderQuery';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    getContractCategoriesConfig: jest.fn(),
    getContractTypesConfig: jest.fn(),
    cloneObject: jest.fn(),
    WS: {
        send: jest.fn(),
        authorized: {
            send: jest.fn(),
        },
    },
}));

describe('useContractsForCompany', () => {
    let mocked_store: ReturnType<typeof mockStore>;

    const wrapper = ({ children }: { children: JSX.Element }) => (
        <TraderProviders store={mocked_store}>{children}</TraderProviders>
    );

    beforeEach(() => {
        mocked_store = {
            ...mockStore({}),
            client: {
                ...mockStore({}).client,
                landing_company_shortcode: 'maltainvest',
                loginid: 'CR1234',
            },
            modules: {
                trade: {
                    setContractTypesListV2: jest.fn(),
                    onChange: jest.fn(),
                },
            },
        };

        (getContractCategoriesConfig as jest.Mock).mockReturnValue({
            category_1: { categories: ['type_1'] },
            category_2: { categories: ['type_2'] },
        });

        (getContractTypesConfig as jest.Mock).mockReturnValue({
            type_1: { trade_types: ['type_1'], title: 'Type 1', barrier_count: 0 },
            type_2: { trade_types: ['type_2'], title: 'Type 2', barrier_count: 1 },
        });

        invalidateDTraderCache(['contracts_for_company']);

        (cloneObject as jest.Mock).mockImplementation(obj => JSON.parse(JSON.stringify(obj)));

        jest.clearAllMocks();
    });

    it('should fetch and set contract types for the company successfully', async () => {
        WS.authorized.send.mockResolvedValue({
            contracts_for_company: {
                available: [{ contract_type: 'type_1' }, { contract_type: 'type_2' }],
            },
        });

        const { result } = renderHook(() => useContractsForCompany(), { wrapper });

        await waitFor(() => {
            expect(result.current.contract_types_list).toEqual({
                category_1: { categories: [{ value: 'type_1', text: 'Type 1' }] },
                category_2: { categories: [{ value: 'type_2', text: 'Type 2' }] },
            });
            expect(mocked_store.modules.trade.setContractTypesListV2).toHaveBeenCalledWith({
                category_1: { categories: [{ value: 'type_1', text: 'Type 1' }] },
                category_2: { categories: [{ value: 'type_2', text: 'Type 2' }] },
            });
        });
    });

    it('should handle API errors gracefully', async () => {
        WS.authorized.send.mockResolvedValue({
            error: { message: 'Some error' },
        });

        const { result } = renderHook(() => useContractsForCompany(), { wrapper });

        await waitFor(() => {
            expect(result.current.contract_types_list).toEqual([]);
            expect(mocked_store.modules.trade.setContractTypesListV2).not.toHaveBeenCalled();
        });
    });

    it('should not set unsupported contract types', async () => {
        WS.authorized.send.mockResolvedValue({
            contracts_for_company: {
                available: [{ contract_type: 'unsupported_type' }],
            },
        });

        const { result } = renderHook(() => useContractsForCompany(), { wrapper });

        await waitFor(() => {
            expect(result.current.contract_types_list).toEqual([]);
            expect(mocked_store.modules.trade.setContractTypesListV2).not.toHaveBeenCalled();
        });
    });
});
