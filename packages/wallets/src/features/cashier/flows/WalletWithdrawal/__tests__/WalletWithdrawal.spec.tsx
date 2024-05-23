import React, { PropsWithChildren } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { CashierLocked, WithdrawalLocked } from '../../../modules';
import WalletWithdrawal from '../WalletWithdrawal';

jest.mock('../../../modules', () => ({
    ...jest.requireActual('../../../modules'),
    CashierLocked: jest.fn(({ children }) => <>{children}</>),
    SystemMaintenance: jest.fn(({ children }) => <>{children}</>),
    WithdrawalCryptoModule: jest.fn(({ verificationCode }) => {
        return (
            <>
                <div>WithdrawalCryptoModule</div>
                <div>verificationCode={verificationCode}</div>
            </>
        );
    }),
    WithdrawalFiatModule: jest.fn(({ verificationCode }) => (
        <>
            <div>WithdrawalFiatModule</div>
            <div>verificationCode={verificationCode}</div>
        </>
    )),
    WithdrawalLocked: jest.fn(({ children }) => <>{children}</>),
    WithdrawalVerificationModule: jest.fn(() => <div>WithdrawalVerificationModule</div>),
}));

jest.mock('../../../screens', () => ({
    ...jest.requireActual('../../../screens'),
    WithdrawalNoBalance: jest.fn(() => <div>WithdrawalNoBalance</div>),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    Loader: jest.fn(() => <div>Loading</div>),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveWalletAccount: jest.fn(),
    useAuthorize: jest.fn(() => ({ switchAccount: jest.fn() })),
}));

const mockUseActiveWalletAccount = useActiveWalletAccount as jest.MockedFunction<typeof useActiveWalletAccount>;

const wrapper = ({ children }: PropsWithChildren) => (
    <CashierLocked>
        <WithdrawalLocked>{children}</WithdrawalLocked>
    </CashierLocked>
);

describe('WalletWithdrawal', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect?verification=1234&loginid=CR42069'),
            writable: true,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalWindowLocation,
        });
    });

    it('should remove the `verification` param from the window url', () => {
        const replaceStateSpy = jest.spyOn(window.history, 'replaceState');
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                balance: 100,

                currency: 'USD',
                loginid: 'CR42069',
            },
        });

        render(<WalletWithdrawal />, { wrapper });

        expect(replaceStateSpy).toBeCalledWith({}, '', 'http://localhost/redirect');
    });

    it('should render withdrawal email verification page if no verification code found', () => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect'),
            writable: true,
        });

        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                balance: 100,
                currency: 'USD',
                loginid: 'CR42069',
            },
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalVerificationModule')).toBeInTheDocument();
    });

    it('should render withdrawal fiat module if withdrawal is for fiat wallet', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                balance: 100,

                currency: 'USD',
                loginid: 'CR42069',
            },
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalFiatModule')).toBeInTheDocument();
        expect(screen.getByText('verificationCode=1234')).toBeInTheDocument();
    });

    it('should render withdrawal crypto module if withdrawal is for crypto wallet', async () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                balance: 100,
                currency: 'BTC',
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: { is_crypto: true },
                loginid: 'CR42069',
            },
        });

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalCryptoModule')).toBeInTheDocument();
        expect(screen.getByText('verificationCode=1234')).toBeInTheDocument();
    });

    it('should show loader if verification code is activeWallet data has not been received yet', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseActiveWalletAccount.mockReturnValue({});

        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should test if WithdrawalNoBalance screen is rendered if the wallet balance has zero balance', () => {
        mockUseActiveWalletAccount.mockReturnValue({
            data: {
                balance: 0,
                currency: 'BTC',
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                currency_config: { is_crypto: true },
                loginid: 'CR42069',
            },
        });
        render(<WalletWithdrawal />, { wrapper });
        expect(screen.getByText('WithdrawalNoBalance')).toBeInTheDocument();
    });
});
