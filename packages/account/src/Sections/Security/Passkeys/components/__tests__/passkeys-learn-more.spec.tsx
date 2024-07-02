import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasskeysLearnMore } from '../passkeys-learn-more';

jest.mock('../tips-block', () => ({
    TipsBlock: jest.fn(() => <div>TipsBlock</div>),
}));
jest.mock('../description-container', () => ({
    DescriptionContainer: jest.fn(() => <div>DescriptionContainer</div>),
}));

describe('PasskeysLearnMore', () => {
    const mockOnPrimaryButtonClick = jest.fn();
    const mockOnSecondaryButtonClick = jest.fn();

    it('renders the tips correctly', () => {
        render(
            <PasskeysLearnMore
                onPrimaryButtonClick={mockOnPrimaryButtonClick}
                onSecondaryButtonClick={mockOnSecondaryButtonClick}
            />
        );

        expect(screen.getByText('Effortless login with passkeys')).toBeInTheDocument();
        expect(screen.getByText('DescriptionContainer')).toBeInTheDocument();
        expect(screen.getByText('TipsBlock')).toBeInTheDocument();
        userEvent.click(screen.getByRole('button', { name: /create passkey/i }));
        expect(mockOnPrimaryButtonClick).toHaveBeenCalled();
        userEvent.click(screen.getByTestId('dt_learn_more_back_button'));
        expect(mockOnSecondaryButtonClick).toHaveBeenCalled();
    });
});
