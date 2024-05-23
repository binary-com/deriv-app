import React from 'react';
import {
    useAccountLimits,
    useActiveWalletAccount,
    useCryptoConfig,
    useCryptoWithdrawal,
    useCurrencyConfig,
    useExchangeRateSubscription,
    usePOA,
    usePOI,
} from '@deriv/api-v2';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import WithdrawalCryptoProvider, { useWithdrawalCryptoContext } from '../WithdrawalCryptoProvider';

jest.mock('@deriv/api-v2', () => ({
    useAccountLimits: jest.fn(),
    useActiveWalletAccount: jest.fn(),
    useCryptoConfig: jest.fn(),
    useCryptoWithdrawal: jest.fn(),
    useCurrencyConfig: jest.fn(),
    useExchangeRateSubscription: jest.fn(),
    usePOA: jest.fn(),
    usePOI: jest.fn(),
}));

const mockUseAccountLimits = useAccountLimits as jest.Mock;
const mockUseActiveWalletAccount = useActiveWalletAccount as jest.Mock;
const mockUseCryptoConfig = useCryptoConfig as jest.Mock;
const mockUseCryptoWithdrawal = useCryptoWithdrawal as jest.Mock;
const mockUseCurrencyConfig = useCurrencyConfig as jest.Mock;
const mockUseExchangeRate = useExchangeRateSubscription as jest.Mock;
const mockUsePOA = usePOA as jest.Mock;
const mockUsePOI = usePOI as jest.Mock;

describe('useWithdrawalCryptoContext', () => {
    beforeEach(() => {
        mockUseAccountLimits.mockReturnValue({});
        mockUseActiveWalletAccount.mockReturnValue({});
        mockUseCryptoConfig.mockReturnValue({});
        mockUseCryptoWithdrawal.mockReturnValue({ mutateAsync: jest.fn().mockResolvedValueOnce({}) });
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: () => ({
                fractionalDigits: 2,
            }),
        });
        mockUseExchangeRate.mockReturnValue({
            subscribe: jest.fn(),
            unsubscribe: jest.fn(),
        });
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <WithdrawalCryptoProvider verificationCode='Abcd1234'>{children}</WithdrawalCryptoProvider>
    );

    it('should check whether the client is verified', async () => {
        mockUsePOA.mockReturnValue({
            data: {
                is_verified: true,
            },
        });
        mockUsePOI.mockReturnValue({
            data: {
                is_verified: true,
            },
        });

        const { result } = renderHook(() => useWithdrawalCryptoContext(), { wrapper });

        await act(async () => {
            expect(result.current.isClientVerified).toBe(true);
        });
    });

    it('should check whether the client is not verified', async () => {
        mockUsePOA.mockReturnValue({
            data: {
                is_verified: false,
            },
        });
        mockUsePOI.mockReturnValue({
            data: {
                is_verified: true,
            },
        });

        const { rerender, result } = renderHook(() => useWithdrawalCryptoContext(), { wrapper });

        await act(async () => {
            expect(result.current.isClientVerified).toBe(false);
        });

        mockUsePOA.mockReturnValue({
            data: {
                is_verified: true,
            },
        });

        mockUsePOI.mockReturnValue({
            data: {
                is_verified: false,
            },
        });

        rerender();

        await act(async () => {
            expect(result.current.isClientVerified).toBe(false);
        });

        mockUsePOA.mockReturnValue({
            data: {
                is_verified: false,
            },
        });

        mockUsePOI.mockReturnValue({
            data: {
                is_verified: false,
            },
        });

        await act(async () => {
            expect(result.current.isClientVerified).toBe(false);
        });

        rerender();
    });
});
