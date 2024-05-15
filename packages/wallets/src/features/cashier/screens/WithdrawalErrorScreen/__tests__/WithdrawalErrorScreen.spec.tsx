import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WithdrawalErrorScreen from '../WithdrawalErrorScreen';

describe('WithdrawalErrorScreen', () => {
    let resetError: jest.Mock, setResendEmail: jest.Mock;

    beforeEach(() => {
        resetError = jest.fn();
        setResendEmail = jest.fn();
    });

    describe('InvalidToken', () => {
        const error = {
            code: 'InvalidToken',
            message: 'Error message',
        };

        it('should show proper error for `InvalidToken` error code', () => {
            render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

            expect(screen.getByText('Email verification failed')).toBeInTheDocument();
            expect(
                screen.getByText('The verification link you used is invalid or expired. Please request for a new one.')
            ).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Resend email' })).toBeInTheDocument();
        });

        it('should trigger proper callbacks when the user is clicking on `Resend email` button', () => {
            render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

            const resendEmailBtn = screen.getByRole('button', { name: 'Resend email' });

            userEvent.click(resendEmailBtn);

            expect(resetError).toHaveBeenCalledTimes(1);
            expect(setResendEmail).toHaveBeenCalledTimes(1);
            expect(setResendEmail).toHaveBeenCalledWith(true);
        });
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

    it('should show default withdrawal error details when no error details is received', () => {
        render(<WithdrawalErrorScreen resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
        expect(
            screen.getByText('Sorry an error occurred. Please try accessing our cashier again.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    });

    it('should show correct withdrawal error screen for crypto suspended currency error', () => {
        const error = {
            code: 'CryptoSuspendedCurrency',
            message: 'Crypto Suspended Currency',
        };

        render(
            <WithdrawalErrorScreen
                currency='BTC'
                error={error}
                resetError={resetError}
                setResendEmail={setResendEmail}
            />
        );

        expect(screen.getByText('BTC Wallet withdrawals are temporarily unavailable')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Due to system maintenance, withdrawals with your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();
        expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    });

    it('should trigger `resetError` callback whe the user is clicking on `OK` button', () => {
        const error = {
            code: 'MyError',
            message: 'Error message',
        };

        render(<WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />);

        expect(screen.getByText('Oops, something went wrong!')).toBeInTheDocument();
        expect(screen.getByText('Error message')).toBeInTheDocument();
        const ReloadButton = screen.getByRole('button', { name: 'Try again' });

        userEvent.click(ReloadButton);
        expect(resetError).toHaveBeenCalledTimes(1);
    });
});
