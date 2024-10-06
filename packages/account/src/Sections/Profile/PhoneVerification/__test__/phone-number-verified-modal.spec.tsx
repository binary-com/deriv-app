import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import PhoneNumberVerifiedModal from '../phone-number-verified-modal';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { routes } from '@deriv/shared';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
}));

const mockPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockPush,
    }),
}));

describe('PhoneNumberVerifiedModal', () => {
    let modal_root_el: HTMLElement;
    const mock_store = mockStore({});

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const renderModal = () => {
        render(
            <StoreProvider store={mock_store}>
                <MemoryRouter>
                    <PhoneNumberVerifiedModal should_show_phone_number_verified_modal />
                </MemoryRouter>
            </StoreProvider>
        );
    };

    it('it should render PhoneNumberVerifiedModal', () => {
        renderModal();
        expect(screen.getByText(/Phone number verified/)).toBeInTheDocument();
        expect(screen.getByText(/is verified as your phone number./)).toBeInTheDocument();
    });

    it('it should refetch GetSettings when done is clicked', async () => {
        renderModal();
        const doneButton = screen.getByRole('button', { name: /OK/ });
        await userEvent.click(doneButton);
        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toBeCalledWith(routes.traders_hub);
    });
});
