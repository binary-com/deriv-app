import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoPasskeys } from '../no-passkeys';

describe('NoPasskeys', () => {
    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    it('renders NoPasskeys component correctly', () => {
        render(
            <NoPasskeys
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
            />
        );

        expect(screen.getByText('Enhanced security is just a tap away.')).toBeInTheDocument();
        expect(screen.getByText('Experience safer logins')).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: /create passkey/i }));
        userEvent.click(screen.getByRole('button', { name: /learn more/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
