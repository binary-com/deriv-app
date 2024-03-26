import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import AdCancelModal from '../ad-cancel-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        setShowEditAdForm: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: () => mock_store,
}));

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
        render(
            <AdCancelModal
                confirm_label='Go back'
                message="If you choose to cancel, the details you've entered will be lost."
                title='Cancel ad creation?'
            />
        );

        const confirm_button = screen.getByRole('button', { name: 'Go back' });
        expect(confirm_button).toBeInTheDocument();
        expect(screen.getByText('Cancel ad creation?')).toBeInTheDocument();
        expect(
            screen.getByText("If you choose to cancel, the details you've entered will be lost.")
        ).toBeInTheDocument();
    });
    it('should close modal on clicking cancel button', () => {
        render(
            <AdCancelModal
                confirm_label="Don't cancel"
                message='If you choose to cancel, the edited details will be lost.'
                title='Cancel your edits?'
            />
        );

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        userEvent.click(cancel_button);
        expect(mock_modal_manager.hideModal).toBeCalledTimes(1);
    });
});
