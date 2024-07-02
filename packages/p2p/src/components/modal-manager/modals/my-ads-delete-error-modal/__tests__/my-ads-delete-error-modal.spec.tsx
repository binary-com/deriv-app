import React from 'react';
import { render, screen } from '@testing-library/react';
import MyAdsDeleteErrorModal from '../my-ads-delete-error-modal';

const mock_modal_manager = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: () => mock_modal_manager,
}));

jest.mock('Stores', () => ({
    useStores: () => ({
        my_ads_store: {
            delete_error_message: 'Error: Cannot delete ad.',
        },
    }),
}));

describe('<MyAdsDeleteErrorModal />', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });
    it('should render MyAdsDeleteErrorModal component with my ads delete error message', () => {
        render(<MyAdsDeleteErrorModal />);
        expect(screen.getByText('Do you want to delete this ad?')).toBeInTheDocument();
        expect(screen.getByText('Error: Cannot delete ad.')).toBeInTheDocument();
    });

    it('should close modal when ok button is clicked', () => {
        render(<MyAdsDeleteErrorModal />);
        const ok_button = screen.getByRole('button', { name: /ok/i });
        expect(ok_button).toBeInTheDocument();
        ok_button.click();
        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
    });

    it('should render MyAdsDeleteErrorModal component in mobile view', () => {
        render(<MyAdsDeleteErrorModal />);
        expect(screen.getByText('Do you want to delete this ad?')).toBeInTheDocument();
        expect(screen.getByText('Error: Cannot delete ad.')).toBeInTheDocument();
    });
});
