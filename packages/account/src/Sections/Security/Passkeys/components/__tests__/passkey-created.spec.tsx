import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasskeyCreated } from '../passkey-created';

describe('PasskeyCreated', () => {
    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    it('renders PasskeyCreated component correctly', () => {
        render(
            <PasskeyCreated
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
            />
        );

        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText(/Your account is now secured with a passkey/)).toBeInTheDocument();
        expect(screen.getByText(/Manage your passkey/)).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: /continue trading/i }));
        userEvent.click(screen.getByRole('button', { name: /add more passkeys/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
