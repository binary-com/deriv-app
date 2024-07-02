import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasskeyReminderModal } from '../passkey-reminder-modal';

describe('PasskeyReminderModal', () => {
    let modal_root_el: HTMLElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const reminder_tips = [
        'Enable screen lock on your device.',
        'Enable bluetooth.',
        'Sign in to your Google or iCloud account.',
    ];

    const mockButtonClick = jest.fn();
    const mockToggleModal = jest.fn();

    it('renders PasskeyReminderModal', () => {
        render(<PasskeyReminderModal toggleModal={mockToggleModal} is_modal_open onButtonClick={mockButtonClick} />);

        expect(screen.getByText('Just a reminder')).toBeInTheDocument();
        reminder_tips.forEach(tip => {
            expect(screen.getByText(tip)).toBeInTheDocument();
        });

        userEvent.click(screen.getByRole('button', { name: /continue/i }));
        expect(mockButtonClick).toHaveBeenCalledTimes(1);
    });

    it('does not render PasskeyReminderModal content if modal is closed', () => {
        render(
            <PasskeyReminderModal toggleModal={mockToggleModal} is_modal_open={false} onButtonClick={mockButtonClick} />
        );

        expect(screen.queryByText('Just a reminder')).not.toBeInTheDocument();
    });
});
