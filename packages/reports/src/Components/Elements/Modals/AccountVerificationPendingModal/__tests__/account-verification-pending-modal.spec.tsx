import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountVerificationPendingModal from '../account-verification-pending-modal';

describe('<AccountVerificationPendingModal />', () => {
    let modal_root_el: HTMLDivElement;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_props: React.ComponentProps<typeof AccountVerificationPendingModal> = {
        is_visible: true,
        onConfirm: jest.fn(),
    };

    const modal_heading = /Pending verification/;
    const modal_desc =
        /You cannot trade as your documents are still under review. We will notify you by email once your verification is approved./i;

    it('should render the component AccountVerificationPendingModal if is_visible is true', () => {
        render(<AccountVerificationPendingModal {...mock_props} />);

        expect(screen.getByRole('heading', { name: modal_heading })).toBeInTheDocument();
        expect(screen.getByText(modal_desc)).toBeInTheDocument();

        const confirm_ok_btn = screen.getByRole('button', { name: /OK/i });
        expect(confirm_ok_btn).toBeInTheDocument();
        expect(confirm_ok_btn).toBeEnabled();
    });

    it('should call onConfirm when clicking on OK button', () => {
        render(<AccountVerificationPendingModal {...mock_props} />);

        const confirm_ok_btn = screen.getByRole('button', { name: /OK/i });
        userEvent.click(confirm_ok_btn);
        expect(mock_props.onConfirm).toBeCalledTimes(1);
    });

    it('should not render the component if is_visible is false ', () => {
        render(<AccountVerificationPendingModal {...mock_props} is_visible={false} />);

        expect(screen.queryByRole('heading', { name: modal_heading })).not.toBeInTheDocument();
        expect(screen.queryByText(modal_desc)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /OK/i })).not.toBeInTheDocument();
    });
});
