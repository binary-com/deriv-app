import { render, screen } from '@testing-library/react';
import React from 'react';
import PhoneVerificationCard from '../phone-verification-card';

describe('ConfirmPhoneNumber', () => {
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
});
