import React from 'react';
import { useSettings, useVerifyEmail } from '@deriv/api-v2';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import WithdrawalVerification from '../WithdrawalVerification';

jest.mock('@deriv/api-v2', () => ({
    useSettings: jest.fn(() => ({ data: { email: null } })),
    useVerifyEmail: jest.fn(() => ({ mutate: jest.fn() })),
}));

describe('WithdrawalVerification', () => {
    it('should render WithdrawalVerificationRequest initially', () => {
        render(<WithdrawalVerification />);
        expect(
            screen.getByText("Press the button below, and we'll email you a verification link.")
        ).toBeInTheDocument();
    });

    it('should send withdrawal verification email and render WithdrawalVerificationSent after clicking send email', async () => {
        (useSettings as jest.Mock).mockImplementation(() => ({ data: { email: 'test@example.com' } }));
        const mockMutate = jest.fn();
        (useVerifyEmail as jest.Mock).mockImplementation(() => ({
            mutate: mockMutate,
        }));

        render(<WithdrawalVerification />);

        fireEvent.click(screen.getByRole('button', { name: 'Send email' }));

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
            expect(
                screen.getByText('Please check your email for the verification link to complete the process.')
            ).toBeInTheDocument();
        });
    });

    it('should not send withdrawal verification email if email is not fetched from useSettings properly', async () => {
        (useSettings as jest.Mock).mockImplementation(() => ({ data: { email: null } }));
        const mockMutate = jest.fn();
        (useVerifyEmail as jest.Mock).mockImplementation(() => ({
            mutate: mockMutate,
        }));

        render(<WithdrawalVerification />);

        fireEvent.click(screen.getByRole('button', { name: 'Send email' }));

        await waitFor(() => {
            expect(mockMutate).not.toHaveBeenCalled();
            expect(
                screen.queryByText('Please check your email for the verification link to complete the process.')
            ).not.toBeInTheDocument();
        });
    });

    it('should trigger mutate callback when `resendEmail` is equal to `true`', async () => {
        const mockMutate = jest.fn();
        (useSettings as jest.Mock).mockImplementation(() => ({ data: { email: 'test@example.com' } }));
        (useVerifyEmail as jest.Mock).mockImplementation(() => ({
            mutate: mockMutate,
        }));

        render(<WithdrawalVerification resendEmail />);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledTimes(1);
        });
    });
});
