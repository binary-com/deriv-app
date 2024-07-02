import React from 'react';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BusinessHourModal from '../business-hour-modal';
import { StoreProvider, mockStore } from '@deriv/stores';
import userEvent from '@testing-library/user-event';

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const el_modal = document.createElement('div');

let mock_store = {
    ui: {
        is_mobile: false,
    },
};

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore(mock_store)}>{children}</StoreProvider>
);

describe('<BusinessHourModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('it should render the Main screen for business hour modal', () => {
        render(<BusinessHourModal />, { wrapper });

        expect(screen.getByText('Business hour')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Set the hours you’re available to accept orders. Your ads will only be visible to others during these times.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                '*Some ads may not be immediately visible to potential buyers due to order processing times.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('should show the edit screen when user clicks on Edit button', () => {
        render(<BusinessHourModal />, { wrapper });

        const edit_button = screen.getByRole('button', { name: 'Edit' });

        userEvent.click(edit_button);

        expect(screen.getByText('Edit business hour')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('should hide the edit screen if the user clicks on Cancel button', () => {
        render(<BusinessHourModal />, { wrapper });

        const edit_button = screen.getByRole('button', { name: 'Edit' });

        userEvent.click(edit_button);

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });

        userEvent.click(cancel_button);

        expect(screen.getByText('Business hour')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();

        expect(screen.queryByText('Edit business hour')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });

    it('should show the mobile view when is_mobile is true for the main screen', () => {
        mock_store = {
            ui: {
                is_mobile: true,
            },
        };

        render(<BusinessHourModal />, { wrapper });

        expect(screen.getByText('Business hour')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Set the hours you’re available to accept orders. Your ads will only be visible to others during these times.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                '*Some ads may not be immediately visible to potential buyers due to order processing times.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByTestId('dt_mobile_full_page_return_icon')).toBeInTheDocument();
    });

    it('should call hideModal when the user clicks on the back button', () => {
        render(<BusinessHourModal />, { wrapper });

        const back_button = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(back_button);

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });

    it('should show edit page on mobile if the user clicks on Edit button', () => {
        render(<BusinessHourModal />, { wrapper });

        const edit_button = screen.getByRole('button', { name: 'Edit' });

        userEvent.click(edit_button);

        expect(screen.getByText('Edit business hour')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByTestId('dt_mobile_full_page_return_icon')).toBeInTheDocument();
    });

    it('should hide the edit screen if user clicks on back button from edit screen', () => {
        render(<BusinessHourModal />, { wrapper });

        const edit_button = screen.getByRole('button', { name: 'Edit' });

        userEvent.click(edit_button);

        const back_button = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(back_button);

        expect(screen.getByText('Business hour')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();

        expect(screen.queryByText('Edit business hour')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });
});
