import { render, screen } from '@testing-library/react';
import React from 'react';
import PhoneVerificationCard from '../phone-verification-card';
import { usePhoneNumberVerificationSessionTimer } from '@deriv/hooks';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    usePhoneNumberVerificationSessionTimer: jest.fn(() => ({
        formatted_time: '00:00',
    })),
}));

describe('ConfirmPhoneNumber', () => {
    beforeEach(() => {
        (usePhoneNumberVerificationSessionTimer as jest.Mock).mockReturnValue({ formatted_time: '00:00' });
    });

    it('should render ConfirmPhoneNumber', () => {
        render(<PhoneVerificationCard>Card Content</PhoneVerificationCard>);
        expect(screen.getByText(/Card Content/)).toBeInTheDocument();
        expect(screen.getByText(/Card Content/)).not.toHaveClass(
            'phone-verification__card phone-verification__card--small-card'
        );
    });

    it('should include --small-card className if props is being passed in', () => {
        render(<PhoneVerificationCard is_small_card>Card Content</PhoneVerificationCard>);
        const card_content = screen.getByText(/Card Content/);
        expect(card_content).toHaveClass('phone-verification__card phone-verification__card--small-card');
    });

    it('should have timer rendered in phone verification card', () => {
        render(<PhoneVerificationCard is_small_card>Card Content</PhoneVerificationCard>);
        const time_remaining_component = screen.getByText(/Time remaining: 00:00/);
        expect(time_remaining_component).toBeInTheDocument();
    });

    it('should adjust timer value based on formatted_time return by hooks', () => {
        (usePhoneNumberVerificationSessionTimer as jest.Mock).mockReturnValue({ formatted_time: '00:03' });
        render(<PhoneVerificationCard is_small_card>Card Content</PhoneVerificationCard>);
        const time_remaining_component = screen.getByText(/Time remaining: 00:03/);
        expect(time_remaining_component).toBeInTheDocument();
    });
});
