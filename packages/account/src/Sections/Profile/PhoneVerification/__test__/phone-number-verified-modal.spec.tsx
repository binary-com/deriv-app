import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import PhoneNumberVerifiedModal from '../phone-number-verified-modal';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

describe('PhoneNumberVerifiedModal', () => {
    let modal_root_el: HTMLElement;
    const mock_store = mockStore({
        ui: {
            is_mobile: false,
        },
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mockSetShouldShowPhoneNumberVerifiedModal = jest.fn();

    const renderModal = () => {
        render(
            <MemoryRouter>
                <StoreProvider store={mock_store}>
                    <PhoneNumberVerifiedModal
                        should_show_phone_number_verified_modal
                        setShouldShowPhoneNumberVerifiedModal={mockSetShouldShowPhoneNumberVerifiedModal}
                    />
                </StoreProvider>
            </MemoryRouter>
        );
    };

    it('it should render PhoneNumberVerifiedModal', () => {
        renderModal();
        expect(screen.getByText(/Verification successful/)).toBeInTheDocument();
        expect(screen.getByText(/That's it! Your number is verified./)).toBeInTheDocument();
    });

    it('it should close PhoneNumberVerifiedModal and navigate to PersonalDetails section when done is clicked', () => {
        renderModal();
        const doneButton = screen.getByRole('button', { name: /Done/ });
        userEvent.click(doneButton);
        expect(mockSetShouldShowPhoneNumberVerifiedModal).toHaveBeenCalledTimes(1);
        expect(mockHistoryPush).toHaveBeenCalledWith(routes.personal_details);
    });
});
