import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import AdCreateEditErrorModal from '../ad-create-edit-error-modal';

const mocked_store_values: DeepPartial<ReturnType<typeof useStores>> = {
    my_ads_store: {
        error_code: '',
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mocked_store_values),
}));

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const el_modal = document.createElement('div');

describe('<AdCreateEditErrorModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render AdCreateEditErrorModal', () => {
        render(<AdCreateEditErrorModal />);

        expect(screen.getAllByText("Something's not right")[0]).toBeInTheDocument();
    });
    it('should display the ok button when there is no api error', () => {
        render(<AdCreateEditErrorModal />);

        const ok_button = screen.getByRole('button', { name: 'OK' });
        expect(ok_button).toBeInTheDocument();
    });
    it('should display the update ad button and "You already have an ad with this range" when there is api error', () => {
        (useStores as jest.Mock).mockReturnValueOnce({
            ...mocked_store_values,
            my_ads_store: {
                ...mocked_store_values.my_ads_store,
                error_code: 'AdvertSameLimits',
            },
        });
        render(<AdCreateEditErrorModal />);

        const update_button = screen.getByRole('button', { name: 'Update ad' });
        expect(update_button).toBeInTheDocument();
        expect(screen.getByText('You already have an ad with this range')).toBeInTheDocument();
    });
    it('should close the modal on clicking update ad/ok button', () => {
        render(<AdCreateEditErrorModal />);

        const ok_button = screen.getByRole('button', { name: 'OK' });
        expect(ok_button).toBeInTheDocument();
        userEvent.click(ok_button);
        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
    });
});
