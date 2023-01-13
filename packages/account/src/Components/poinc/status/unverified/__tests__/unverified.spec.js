import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import { PoincUnverified } from '../unverified';

describe('<PoincUnverified/>', () => {
    const mockOnReSubmit = jest.fn();
    it('should render PoincUnverified component and trigger click', () => {
        render(<PoincUnverified onReSubmit={mockOnReSubmit} />);
        expect(screen.getByText('Income verification failed')).toBeInTheDocument();
        expect(screen.getByText(/please check the email we've sent you for further information/i)).toBeInTheDocument();
        const btn = screen.getByRole('button', { name: /try again/i });
        fireEvent.click(btn);
        expect(mockOnReSubmit).toHaveBeenCalled();
    });
});
