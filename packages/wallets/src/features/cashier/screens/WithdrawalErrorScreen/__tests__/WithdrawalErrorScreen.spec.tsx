import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WithdrawalErrorScreen from '../WithdrawalErrorScreen';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(),
}));

jest.mock('@deriv/api-v2', () => ({
    useActiveWalletAccount: jest.fn(),
}));

describe('WithdrawalErrorScreen', () => {
    let resetError: jest.Mock, setResendEmail: jest.Mock;

    beforeEach(() => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: { currency: 'BTC' } });
        resetError = jest.fn();
        setResendEmail = jest.fn();
    });

    it('should show proper error for `InvalidToken` error code', () => {
        const error = {
            code: 'InvalidToken',
            message: 'Error message',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Email verification failed')).toBeInTheDocument();
        expect(
            screen.getByText('The verification link you used is invalid or expired. Please request for a new one.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Resend email' })).toBeInTheDocument();
    });

    it('should trigger proper callbacks when the user is clicking on `Resend email` button', async () => {
        const error = {
            code: 'InvalidToken',
            message: 'Error message',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        const resendEmailBtn = screen.getByRole('button', { name: 'Resend email' });

        await userEvent.click(resendEmailBtn);
        expect(resetError).toHaveBeenCalledTimes(1);
        expect(setResendEmail).toHaveBeenCalledTimes(1);
        expect(setResendEmail).toHaveBeenCalledWith(true);
    });

    it('should show withdrawal error details', () => {
        const error = {
            code: 'MyError',
            message: 'Error message',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    });

    it('should show correct withdrawal error screen for crypto suspended currency error', () => {
        const error = {
            code: 'CryptoSuspendedCurrency',
            message: 'Crypto Suspended Currency',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('BTC Wallet withdrawals are temporarily unavailable')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Due to system maintenance, withdrawals with your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();
        expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });

    it('should show correct withdrawal error screen for crypto suspended withdrawal error', () => {
        const error = {
            code: 'CryptoDisabledCurrencyWithdrawal',
            message: 'Crypto Disabled Currency Withdrawal',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('BTC Wallet withdrawals are temporarily unavailable')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Due to system maintenance, withdrawals with your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();
        expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });

    it('should show correct withdrawal error screen for crypto connection error', () => {
        const error = {
            code: 'CryptoConnectionError',
            message: 'Crypto Connection Error',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Maintenance in progress')).toBeInTheDocument();
        expect(screen.getByText('Crypto Connection Error')).toBeInTheDocument();
        expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });

    it('should show correct withdrawal error screen for crypto age limit verified error', () => {
        const error = {
            code: 'CryptoLimitAgeVerified',
            message: 'Crypto Limit Age Verified Error',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Crypto Limit Age Verified Error')).toBeInTheDocument();
        expect(screen.queryByText('Verify identity')).toBeInTheDocument();
    });

    it('should show redirect the user to the account/proof-of-identity when the user clicks on `Verify identity` after receiving crypto age limit verified error', async () => {
        const mockHistoryPush = jest.fn();
        (useHistory as jest.Mock).mockReturnValueOnce({
            push: mockHistoryPush,
        });
        const error = {
            code: 'CryptoLimitAgeVerified',
            message: 'Crypto Limit Age Verified Error',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        const verifyIdentityButton = screen.getByText('Verify identity');
        await userEvent.click(verifyIdentityButton);

        expect(mockHistoryPush).toBeCalledWith('/account/proof-of-identity');
    });

    it('should reload page when the user clicks on `Try again` button', async () => {
        const reloadMock = jest.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });
        const error = {
            code: 'MyError',
            message: 'Error message',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        const ReloadButton = screen.getByRole('button', { name: 'Try again' });

        await userEvent.click(ReloadButton);
        expect(reloadMock).toHaveBeenCalled();
    });

    it('should reload page when the user clicks on `Try again` button for invalid crypto address error', async () => {
        const error = {
            code: 'CryptoInvalidAddress',
            message: 'Crypto Invalid Address',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Crypto Invalid Address')).toBeInTheDocument();
        const ReloadButton = screen.getByRole('button', { name: 'Try again' });

        await userEvent.click(ReloadButton);
        expect(resetError).toHaveBeenCalledTimes(1);
    });

    it('should render without crashing when no data received', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: null });
        const error = {
            code: 'MyError',
            message: 'Error message',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    });

    it('should render without crashing when optional parameters are not received', async () => {
        const error = {
            code: 'InvalidToken',
            message: 'Error message',
        };

        render(<WithdrawalErrorScreen error={error} resetError={undefined} setResendEmail={undefined} />);

        const resendEmailBtn = screen.getByRole('button', { name: 'Resend email' });

        await userEvent.click(resendEmailBtn);
        expect(screen.getByText('Email verification failed')).toBeInTheDocument();
        expect(
            screen.getByText('The verification link you used is invalid or expired. Please request for a new one.')
        ).toBeInTheDocument();
    });
});
