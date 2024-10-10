import React, { PropsWithChildren } from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { fireEvent, render, screen } from '@testing-library/react';
import WithdrawalCryptoReceipt from '../WithdrawalCryptoReceipt';

const mockCurrencyConfig = {
    BTC: {
        display_code: 'BTC',
        fractional_digits: 8,
    },
    USD: {
        display_code: 'USD',
        fractional_digits: 2,
    },
};

const mockWithdrawalReceipt = {
    address: 'test_crypto_address',
    amount: 100,
    currency: 'BTC',
};

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(() => ({
        push: mockPush,
    })),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useCurrencyConfig: jest.fn(() => ({
        getConfig: (currency: 'BTC' | 'USD') => mockCurrencyConfig[currency],
    })),
}));

const wrapper = ({ children }: PropsWithChildren) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

describe('WithdrawalCryptoReceipt', () => {
    it('should render the component with withdrawal information', () => {
        render(<WithdrawalCryptoReceipt onClose={() => jest.fn()} withdrawalReceipt={mockWithdrawalReceipt} />, {
            wrapper,
        });

        const amountElement = screen.getByTestId('dt_amount_received');
        expect(amountElement).toHaveTextContent('100.00000000 BTC');

        const addressElement = screen.getByText('test_crypto_address');
        expect(addressElement).toBeInTheDocument();

        const reviewTextElement = screen.getByText(
            "Your withdrawal is currently in review. It will be processed within 24 hours. We'll send you an email once your transaction has been processed."
        );
        expect(reviewTextElement).toBeInTheDocument();
    });

    it('should render the component with withdrawal information with transaction fee', () => {
        const withdrawalReceiptWithFee = {
            ...mockWithdrawalReceipt,
            transactionFee: 0.0001,
        };

        render(<WithdrawalCryptoReceipt onClose={() => jest.fn()} withdrawalReceipt={withdrawalReceiptWithFee} />, {
            wrapper,
        });
        const transactionFeeElement = screen.getByText(/Transaction fee/);
        expect(transactionFeeElement).toBeInTheDocument();
    });

    it('should trigger the close function when the "Close" button is clicked', () => {
        const onCloseMock = jest.fn();

        render(<WithdrawalCryptoReceipt onClose={onCloseMock} withdrawalReceipt={mockWithdrawalReceipt} />, {
            wrapper,
        });

        fireEvent.click(screen.getByText('Close'));

        expect(onCloseMock).toHaveBeenCalled();
    });

    it('should navigate to the transactions page when the "View transactions" button is clicked', () => {
        render(<WithdrawalCryptoReceipt onClose={() => jest.fn()} withdrawalReceipt={mockWithdrawalReceipt} />, {
            wrapper,
        });

        fireEvent.click(screen.getByText('View transactions'));

        expect(mockPush).toHaveBeenCalledWith('/wallet/transactions');
    });
});
