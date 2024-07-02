import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasskeysStatusLayout } from '../passkeys-status-layout';

describe('PasskeysStatusLayout', () => {
    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();
    const mock_description = 'Test description';
    const mock_title = 'Test title';
    const mock_primary_button_text = 'Test primary';
    const mock_secondary_button_text = 'Test secondary';

    it('renders PasskeysStatusLayout component correctly', () => {
        render(
            <PasskeysStatusLayout
                title={<div>{mock_title}</div>}
                description={<div>{mock_description}</div>}
                primary_button_text={<div>{mock_primary_button_text}</div>}
                secondary_button_text={<div>{mock_secondary_button_text}</div>}
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
            />
        );

        expect(screen.getByText(mock_title)).toBeInTheDocument();
        expect(screen.getByText(mock_description)).toBeInTheDocument();
        expect(screen.getByText(mock_description)).toBeInTheDocument();

        const primary_button = screen.getByRole('button', { name: mock_primary_button_text });
        expect(primary_button).toBeEnabled();

        userEvent.click(screen.getByRole('button', { name: mock_primary_button_text }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        userEvent.click(screen.getByRole('button', { name: mock_secondary_button_text }));
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
