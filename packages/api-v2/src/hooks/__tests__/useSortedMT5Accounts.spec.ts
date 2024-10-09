import { renderHook } from '@testing-library/react-hooks';
import useActiveAccount from '../useActiveAccount';
import useAvailableMT5Accounts from '../useAvailableMT5Accounts';
import useIsEuRegion from '../useIsEuRegion';
import useMT5AccountsList from '../useMT5AccountsList';
import useSortedMT5Accounts from '../useSortedMT5Accounts';
import { cleanup } from '@testing-library/react';

jest.mock('../useActiveAccount', () => jest.fn());
jest.mock('../useAvailableMT5Accounts', () => jest.fn());
jest.mock('../useIsEuRegion', () => jest.fn());
jest.mock('../useMT5AccountsList', () => jest.fn());

const mockMT5NonEUAvailableAccounts = [
    {
        is_default_jurisdiction: 'false',
        product: 'standard',
        shortcode: 'svg',
    },
    {
        is_default_jurisdiction: 'false',
        product: 'financial',
        shortcode: 'svg',
    },
    {
        is_default_jurisdiction: 'true',
        product: 'financial',
        shortcode: 'vanuatu',
    },
    {
        is_default_jurisdiction: 'true',
        product: 'stp',
        shortcode: 'vanuatu',
    },
    {
        is_default_jurisdiction: 'true',
        product: 'standard',
        shortcode: 'vanuatu',
    },
    {
        is_default_jurisdiction: 'true',
        product: 'zero_spread',
        shortcode: 'bvi',
    },
    {
        is_default_jurisdiction: 'true',
        product: 'swap_free',
        shortcode: 'svg',
    },
];

const mockMT5NonEUAddedAccounts = [
    {
        is_virtual: false,
        landing_company_short: 'vanuatu',
        product: 'standard',
    },
    {
        is_virtual: false,
        landing_company_short: 'vanuatu',
        product: 'financial',
    },
    {
        is_virtual: false,
        landing_company_short: 'bvi',
        product: 'zero_spread',
    },
];

const mockMT5EUAvailableAccounts = [
    {
        is_default_jurisdiction: 'true',
        product: 'financial',
        shortcode: 'maltainvest',
    },
];

const mockMT5EUAddedAccounts = [
    {
        is_virtual: false,
        landing_company_short: 'maltainvest',
        product: 'financial',
    },
];

describe('useSortedMT5Accounts', () => {
    beforeEach(() => {
        (useActiveAccount as jest.Mock).mockReturnValue({
            data: { is_virtual: false },
        });
        (useIsEuRegion as jest.Mock).mockReturnValue({
            isEUCountry: false,
        });
    });
    afterEach(cleanup);

    it('returns non-eu available accounts with default jurisdiction', () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: mockMT5NonEUAvailableAccounts,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [],
        });

        const { result } = renderHook(() => useSortedMT5Accounts());

        expect(result.current.data).toEqual([
            {
                is_added: false,
                is_default_jurisdiction: 'true',
                product: 'standard',
                shortcode: 'vanuatu',
            },
            {
                is_added: false,
                is_default_jurisdiction: 'true',
                product: 'financial',
                shortcode: 'vanuatu',
            },
            {
                is_added: false,
                is_default_jurisdiction: 'true',
                product: 'swap_free',
                shortcode: 'svg',
            },
            {
                is_added: false,
                is_default_jurisdiction: 'true',
                product: 'zero_spread',
                shortcode: 'bvi',
            },
        ]);
    });

    it('returns eu available accounts with default jurisdiction', () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: mockMT5EUAvailableAccounts,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [],
        });

        const { result } = renderHook(() => useSortedMT5Accounts());

        expect(result.current.data).toEqual([
            {
                is_added: false,
                is_default_jurisdiction: 'true',
                product: 'financial',
                shortcode: 'maltainvest',
            },
        ]);
    });

    it('returns list of non-eu added and available accounts after some accounts are created', () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: mockMT5NonEUAvailableAccounts,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: mockMT5NonEUAddedAccounts,
        });

        const { result } = renderHook(() => useSortedMT5Accounts());

        expect(result.current.data).toEqual([
            {
                is_added: true,
                is_default_jurisdiction: 'true',
                is_virtual: false,
                landing_company_short: 'vanuatu',
                product: 'standard',
                shortcode: 'vanuatu',
            },
            {
                is_added: true,
                is_default_jurisdiction: 'true',
                is_virtual: false,
                landing_company_short: 'vanuatu',
                product: 'financial',
                shortcode: 'vanuatu',
            },
            {
                is_added: false,
                is_default_jurisdiction: 'true',
                product: 'swap_free',
                shortcode: 'svg',
            },
            {
                is_added: true,
                is_default_jurisdiction: 'true',
                is_virtual: false,
                landing_company_short: 'bvi',
                product: 'zero_spread',
                shortcode: 'bvi',
            },
        ]);
    });

    it('returns list of eu added and available accounts after some accounts are created', () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: mockMT5EUAvailableAccounts,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: mockMT5EUAddedAccounts,
        });
        (useIsEuRegion as jest.Mock).mockReturnValue({
            isEUCountry: true,
        });

        const { result } = renderHook(() => useSortedMT5Accounts());

        expect(result.current.data).toEqual([
            {
                is_added: true,
                is_default_jurisdiction: 'true',
                is_virtual: false,
                landing_company_short: 'maltainvest',
                product: 'financial',
                shortcode: 'maltainvest',
            },
        ]);
    });

    it('returns sorted non-eu accounts list in the correct order', () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: mockMT5NonEUAvailableAccounts,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [],
        });

        const { result } = renderHook(() => useSortedMT5Accounts());

        expect(result.current.data?.map(account => account.product)).toStrictEqual([
            'standard',
            'financial',
            'swap_free',
            'zero_spread',
        ]);
    });

    it('filters-out available MT5 financial stp account disabling clients to create it', () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: mockMT5NonEUAvailableAccounts,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [],
        });

        const { result } = renderHook(() => useSortedMT5Accounts());

        expect(result.current.data).not.toContain({
            is_added: false,
            is_default_jurisdiction: 'true',
            product: 'stp',
            shortcode: 'vanuatu',
        });
    });

    it('all available MT5 accounts are created', () => {
        (useAvailableMT5Accounts as jest.Mock).mockReturnValue({
            data: mockMT5NonEUAvailableAccounts,
        });
        (useMT5AccountsList as jest.Mock).mockReturnValue({
            data: [
                ...mockMT5NonEUAddedAccounts,
                {
                    is_virtual: false,
                    landing_company_short: 'svg',
                    product: 'swap_free',
                },
            ],
        });

        const { result } = renderHook(() => useSortedMT5Accounts());

        expect(result.current.data).toEqual([
            {
                is_added: true,
                is_default_jurisdiction: 'true',
                is_virtual: false,
                landing_company_short: 'vanuatu',
                product: 'standard',
                shortcode: 'vanuatu',
            },
            {
                is_added: true,
                is_default_jurisdiction: 'true',
                is_virtual: false,
                landing_company_short: 'vanuatu',
                product: 'financial',
                shortcode: 'vanuatu',
            },
            {
                is_added: true,
                is_default_jurisdiction: 'true',
                is_virtual: false,
                landing_company_short: 'svg',
                product: 'swap_free',
                shortcode: 'svg',
            },
            {
                is_added: true,
                is_default_jurisdiction: 'true',
                is_virtual: false,
                landing_company_short: 'bvi',
                product: 'zero_spread',
                shortcode: 'bvi',
            },
        ]);
    });
});
