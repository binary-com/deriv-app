import React from 'react';
import { useActiveAccount, useCurrencyConfig } from '@deriv/api';
import { fireEvent, render, screen } from '@testing-library/react';
import Withdrawal from '../Withdrawal';

jest.mock('../../../lib', () => ({
    ...jest.requireActual('../../../lib'),
    // WithdrawalCryptoModule: jest.fn(({ onClose, verificationCode }) => {
    //     return (
    //         <>
    //             <div>WithdrawalCryptoModule</div>
    //             <div>verificationCode={verificationCode}</div>
    //             <button onClick={onClose}>close</button>
    //         </>
    //     );
    // }),
    WithdrawalFiatModule: jest.fn(({ verificationCode }) => (
        <>
            <div>WithdrawalFiatModule</div>
            <div>verificationCode={verificationCode}</div>
        </>
    )),
    WithdrawalVerificationModule: jest.fn(() => <div>WithdrawalVerificationModule</div>),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    Loader: jest.fn(() => <div>Loading</div>),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useActiveAccount: jest.fn(),
    useCurrencyConfig: jest.fn(),
}));

const mockUseActiveAccount = useActiveAccount as jest.MockedFunction<typeof useActiveAccount>;

const mockUseCurrencyConfig = useCurrencyConfig as jest.MockedFunction<typeof useCurrencyConfig>;

describe('<WalletWithdrawal />', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect?verification=1234'),
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
        mockUseActiveAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(),
            isSuccess: true,
        });

        render(<Withdrawal />);

        expect(replaceStateSpy).toBeCalledWith({}, '', 'http://localhost/redirect');
    });

    it('should render withdrawal email verification page if no verification code found', () => {
        Object.defineProperty(window, 'location', {
            value: new URL('http://localhost/redirect'),
            writable: true,
        });

        mockUseActiveAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(),
            isSuccess: true,
        });

        render(<Withdrawal />);
        expect(screen.getByText('WithdrawalVerificationModule')).toBeInTheDocument();
    });

    it('should render withdrawal fiat module if withdrawal is for fiat wallet', () => {
        mockUseActiveAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'USD',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(() => ({ is_fiat: true })),
            isSuccess: true,
        });

        render(<Withdrawal />);
        expect(screen.getByText('WithdrawalFiatModule')).toBeInTheDocument();
        expect(screen.getByText('verificationCode=1234')).toBeInTheDocument();
    });

    it('should render withdrawal crypto module if withdrawal is for crypto wallet', async () => {
        mockUseActiveAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'BTC',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(() => ({ is_fiat: false })),
            isSuccess: true,
        });

        render(<Withdrawal />);
        expect(screen.getByText('WithdrawalCryptoModule')).toBeInTheDocument();
        expect(screen.getByText('verificationCode=1234')).toBeInTheDocument();
    });

    it('should render withdrawal email verification module when onClose is triggered on the withdrawal crypto module', () => {
        mockUseActiveAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'BTC',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(() => ({ is_fiat: false })),
            isSuccess: true,
        });

        render(<Withdrawal />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('WithdrawalVerificationModule')).toBeInTheDocument();
    });

    it('should show loader if verification code is there but currency config is yet to be loaded', () => {
        mockUseActiveAccount.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            data: {
                currency: 'BTC',
            },
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseCurrencyConfig.mockReturnValue({
            getConfig: jest.fn(),
            isSuccess: false,
        });

        render(<Withdrawal />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });
});
