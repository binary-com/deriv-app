import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WithdrawalVerificationRequest from '../WithdrawalVerificationRequest';

describe('WithdrawalVerificationRequest', () => {
    test('should render component correctly', () => {
        render(<WithdrawalVerificationRequest sendEmail={jest.fn()} />);

        expect(
            screen.getByText("Press the button below, and we'll email you a verification link.")
        ).toBeInTheDocument();

        const sendEmailButton = screen.getByRole('button', { name: 'Send email' });
        expect(sendEmailButton).toBeInTheDocument();

        expect(screen.getByText("This is to confirm that it's you making the withdrawal request.")).toBeInTheDocument();

        const emailVerificationIcon = screen.getByTestId('dt_withdrawal_verification_request_icon');
        expect(emailVerificationIcon).toBeInTheDocument();
    });

    test('should call sendEmail function on button click', () => {
        const sendEmailMock = jest.fn();
        render(<WithdrawalVerificationRequest sendEmail={sendEmailMock} />);

        fireEvent.click(screen.getByRole('button', { name: 'Send email' }));

        expect(sendEmailMock).toHaveBeenCalledTimes(1);
    });
});
