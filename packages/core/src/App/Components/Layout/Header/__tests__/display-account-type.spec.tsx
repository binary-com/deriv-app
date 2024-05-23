import React from 'react';
import { render, screen } from '@testing-library/react';
import DisplayAccountType from '../display-account-type';

describe('DisplayAccountType component', () => {
    it('should render "Multipliers"', () => {
        render(<DisplayAccountType account_type='financial' is_eu={false} />);
        expect(screen.getByText(/multipliers/i)).toBeInTheDocument();
    });
});
