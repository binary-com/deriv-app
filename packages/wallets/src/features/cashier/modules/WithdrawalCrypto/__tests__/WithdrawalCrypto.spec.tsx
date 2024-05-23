import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { useWithdrawalCryptoContext } from '../provider';
import WithdrawalCryptoModule from '../WithdrawalCrypto';

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    WithdrawalCryptoDisclaimer: jest.fn(() => <div>WithdrawalCryptoDisclaimer</div>),
    WithdrawalCryptoForm: jest.fn(() => <div>WithdrawalCryptoForm</div>),
    WithdrawalCryptoReceipt: jest.fn(() => <div>WithdrawalCryptoReceipt</div>),
}));

jest.mock('../../TransactionStatus', () => ({
    ...jest.requireActual('../../TransactionStatus'),
    TransactionStatus: jest.fn(() => <div>TransactionStatus</div>),
}));

jest.mock('../provider', () => ({
    ...jest.requireActual('../provider'),
    useWithdrawalCryptoContext: jest.fn(),
    WithdrawalCryptoProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

const mockUseWithdrawalCryptoContext = useWithdrawalCryptoContext as jest.MockedFunction<
    typeof useWithdrawalCryptoContext
>;

describe('WithdrawalCrypto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the WithdrawalCryptoDisclaimer on successful withdrawal', () => {
        mockUseWithdrawalCryptoContext.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: {},
            isWithdrawalSuccess: false,
        });

        render(
            <APIProvider>
                <AuthProvider>
                    <WithdrawalCryptoModule
                        setResendEmail={jest.fn()}
                        setVerificationCode={jest.fn()}
                        verificationCode='Abcd1234'
                    />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('WithdrawalCryptoDisclaimer')).toBeInTheDocument();
    });

    it('should render the WithdrawalCryptoForm on successful withdrawal', () => {
        mockUseWithdrawalCryptoContext.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: {
                currency: 'BTC',
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            getCurrencyConfig: jest.fn(() => {
                'Bitcoin';
            }),
            isWithdrawalSuccess: false,
        });

        render(
            <APIProvider>
                <AuthProvider>
                    <WithdrawalCryptoModule
                        setResendEmail={jest.fn()}
                        setVerificationCode={jest.fn()}
                        verificationCode='Abcd1234'
                    />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('WithdrawalCryptoForm')).toBeInTheDocument();
        expect(screen.getByText(/BTC/)).toBeInTheDocument();
        expect(screen.getByText('TransactionStatus')).toBeInTheDocument();
    });

    it('should render the WithdrawalCryptoReceipt on successful withdrawal', () => {
        mockUseWithdrawalCryptoContext.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeWallet: {
                currency: 'BTC',
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            getCurrencyConfig: jest.fn(() => {
                'Bitcoin';
            }),
            isWithdrawalSuccess: true,
        });

        render(
            <APIProvider>
                <AuthProvider>
                    <WithdrawalCryptoModule
                        setResendEmail={jest.fn()}
                        setVerificationCode={jest.fn()}
                        verificationCode='Abcd1234'
                    />
                </AuthProvider>
            </APIProvider>
        );
        expect(screen.getByText('WithdrawalCryptoReceipt')).toBeInTheDocument();
    });
});
