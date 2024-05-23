import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore, StoreProvider } from '@deriv/stores';
import ErrorModal from '../error-modal';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);
const mock_modal_manager_context = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: () => mock_modal_manager_context,
}));

describe('<ErrorModal/>', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should show error modal with the correct details', () => {
        render(
            <ErrorModal
                error_message='error message'
                error_modal_button_text='Close'
                error_modal_title='Something went wrong'
            />,
            { wrapper }
        );
        expect(screen.getByText('error message')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it("should call onClose when footer's button is clicked", () => {
        const mock_on_close = jest.fn();
        render(<ErrorModal error_message='error message' error_modal_button_text='Close' onClose={mock_on_close} />, {
            wrapper,
        });
        const close_button = screen.getByText('Close');
        expect(close_button).toBeInTheDocument();
        close_button.click();
        expect(mock_on_close).toHaveBeenCalled();
    });

    it("should call hideModal when footer's button is clicked", () => {
        render(<ErrorModal error_message='error message' />, {
            wrapper,
        });
        const ok_button = screen.getByText('OK');
        expect(ok_button).toBeInTheDocument();
        ok_button.click();
        expect(mock_modal_manager_context.hideModal).toHaveBeenCalled();
    });
});
