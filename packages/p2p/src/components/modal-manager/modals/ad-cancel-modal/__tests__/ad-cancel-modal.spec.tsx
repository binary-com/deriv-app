import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AdCancelModal from '../ad-cancel-modal';

const mock_modal_manager = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context');
const mocked_useModalManagerContext = useModalManagerContext as jest.MockedFunction<
    () => Partial<ReturnType<typeof useModalManagerContext>>
>;

mocked_useModalManagerContext.mockImplementation(() => mock_modal_manager);

describe('<AdCancelModal/>', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    it('should render the AdCancelModal', () => {
        const message = "If you choose to cancel, the details you've entered will be lost.";
        const onConfirm = jest.fn();
        const title = 'Cancel ad creation?';
        render(<AdCancelModal message={message} onConfirm={onConfirm} title={title} />);

        expect(
            screen.getByText("If you choose to cancel, the details you've entered will be lost.")
        ).toBeInTheDocument();
        expect(screen.getByText('Cancel ad creation?')).toBeInTheDocument();
    });
    it("should close modal on clicking Don't cancel button", () => {
        const message = 'If you choose to cancel, the edited details will be lost.';
        const title = 'Cancel your edits?';

        render(<AdCancelModal message={message} title={title} />);

        const dont_cancel_button = screen.getByRole('button', { name: "Don't cancel" });
        userEvent.click(dont_cancel_button);
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });
    it('should call onConfirm on clicking Cancel button', () => {
        const message = 'If you choose to cancel, the edited details will be lost.';
        const onConfirm = jest.fn();
        const title = 'Cancel your edits?';

        render(<AdCancelModal message={message} onConfirm={onConfirm} title={title} />);

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);
        expect(onConfirm).toHaveBeenCalled();
    });
});
