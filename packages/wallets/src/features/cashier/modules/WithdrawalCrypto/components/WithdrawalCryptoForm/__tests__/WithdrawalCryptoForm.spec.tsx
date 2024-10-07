import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider, useGrowthbookIsOn } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useWithdrawalCryptoContext, WithdrawalCryptoProvider } from '../../../provider';
import WithdrawalCryptoForm from '../WithdrawalCryptoForm';

jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    useWithdrawalCryptoContext: jest.fn().mockReturnValue([]),
}));

jest.mock('../../../utils', () => ({
    ...jest.requireActual('../../../utils'),
    validateCryptoAddress: jest.fn(),
    validateCryptoInput: jest.fn(),
    validateFiatInput: jest.fn(),
}));

jest.mock('../components/WithdrawalCryptoPercentageSelector', () => ({
    ...jest.requireActual('../components'),
    WithdrawalCryptoPercentageSelector: jest.fn(() => <div>WithdrawalCryptoPercentageSelector</div>),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useCryptoWithdrawal: jest.fn().mockReturnValue({
        mutateAsync: jest.fn().mockResolvedValue({}),
    }),
    useGrowthbookIsOn: jest.fn(),
}));

const mockUseWithdrawalCryptoContext = useWithdrawalCryptoContext as jest.MockedFunction<
    typeof useWithdrawalCryptoContext
>;

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <AuthProvider>
            <WithdrawalCryptoProvider verificationCode='Abcd1234'>{children}</WithdrawalCryptoProvider>
        </AuthProvider>
    </APIProvider>
);

const mockValues = {
    accountLimits: {
        remainder: undefined,
    },
    activeAccount: {
        currency: 'BTC',
    },
    countDownEstimationFee: 10,
    cryptoEstimationsFee: 0.0023,
    cryptoEstimationsFeeUniqueId: 'unique_id',
    fractionalDigits: {
        crypto: 8,
        fiat: 2,
    },
    getConvertedCryptoAmount: jest.fn(val => val),
    getConvertedFiatAmount: jest.fn(val => val),
    getCryptoEstimations: jest.fn(),
    isClientVerified: false,
    requestCryptoWithdrawal: jest.fn(),
    serverTime: 123456789,
    setCurrencyCode: jest.fn(),
};

describe('WithdrawalCryptoForm', () => {
    it('should check if requestCryptoWithdrawal was called with correct parameters', async () => {
        mockUseWithdrawalCryptoContext.mockReturnValue(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            mockValues
        );

        (useGrowthbookIsOn as jest.Mock).mockReturnValue([true]);

        render(<WithdrawalCryptoForm />, { wrapper });

        const cryptoAddressInput = screen.getByTestId('dt_withdrawal_crypto_address_input');
        const cryptoAmountInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');
        const submitButton = screen.getByText('Withdraw');

        await userEvent.type(cryptoAddressInput, 'SampleAddress', { delay: 1 });
        await userEvent.type(cryptoAmountInput, '123');
        await userEvent.click(submitButton);

        await waitFor(() => {
            expect(mockValues.requestCryptoWithdrawal).toBeCalledWith({
                address: 'SampleAddress',
                amount: 123,
                estimated_fee_unique_id: undefined,
            });
        });
    });

    it('should check if cryptoEstimationFee is visible when checkbox is enabled', async () => {
        mockUseWithdrawalCryptoContext.mockReturnValue(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            mockValues
        );

        render(<WithdrawalCryptoForm />, { wrapper });

        const cryptoAddressInput = screen.getByTestId('dt_withdrawal_crypto_address_input');
        const cryptoAmountInput = screen.getByTestId('dt_withdrawal_crypto_amount_input');
        const checkbox = screen.getByLabelText('Priority withdrawal');

        await userEvent.type(cryptoAddressInput, 'SampleAddress', { delay: 1 });
        await userEvent.type(cryptoAmountInput, '123');
        await userEvent.click(checkbox);

        await waitFor(() => {
            expect(screen.getByText('122.99770000')).toBeInTheDocument();
        });
    });
});
