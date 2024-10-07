import React, { PropsWithChildren } from 'react';
import { useFormikContext } from 'formik';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useWithdrawalCryptoContext, WithdrawalCryptoProvider } from '../../../../../provider';
import WithdrawalCryptoPriority from '../WithdrawalCryptoPriority';

jest.mock('../../../../../provider', () => ({
    ...jest.requireActual('../../../../../provider'),
    useWithdrawalCryptoContext: jest.fn(),
}));

jest.mock('formik', () => ({
    useFormikContext: jest.fn(),
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
    serverTime: 123456789,
};

describe('WithdrawalCryptoForm', () => {
    it('should render WithdrawalCryptoPriority component', () => {
        (useFormikContext as jest.Mock).mockReturnValue({
            handleChange: jest.fn(),
            values: { cryptoAmount: '123', priorityWithdrawal: false },
        });
        mockUseWithdrawalCryptoContext.mockReturnValue(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            mockValues
        );

        render(<WithdrawalCryptoPriority />, { wrapper });

        expect(screen.getByText('Priority withdrawal')).toBeInTheDocument();
        expect(screen.queryByText('Amount received:')).not.toBeInTheDocument();
    });

    it('should check if cryptoEstimationFee is visible when checkbox is enabled', async () => {
        (useFormikContext as jest.Mock).mockReturnValue({
            handleChange: jest.fn(),
            values: { cryptoAmount: '123', priorityWithdrawal: true },
        });
        mockUseWithdrawalCryptoContext.mockReturnValue(
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            mockValues
        );

        render(<WithdrawalCryptoPriority />, { wrapper });

        const checkbox = screen.getByLabelText('Priority withdrawal');

        await userEvent.click(checkbox);

        await waitFor(() => {
            expect(screen.getByText('122.99770000')).toBeInTheDocument();
        });
    });
});
