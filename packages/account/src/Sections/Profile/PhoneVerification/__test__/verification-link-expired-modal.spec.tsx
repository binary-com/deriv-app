import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { usePhoneNumberVerificationSetTimer } from '@deriv/hooks';
import { StoreProvider, mockStore } from '@deriv/stores';
import { routes } from '@deriv/shared';
import VerificationLinkExpiredModal from '../verification-link-expired-modal';

const mock_push_function = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mock_push_function,
    }),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    usePhoneNumberVerificationSetTimer: jest.fn(() => ({
        next_email_otp_request_timer: '',
    })),
}));

describe('VerificationLinkExpiredModal', () => {
    let modal_root_el: HTMLElement;
    const mockSetShowVerificationLinkExpiredModal = jest.fn();

    beforeEach(() => {
        mockSetShowVerificationLinkExpiredModal.mockClear();
        mock_push_function.mockClear();
    });

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_store = mockStore({});

    const buttons = [/Send new link/, /Cancel/];

    const renderComponent = () => {
        render(
            <APIProvider>
                <StoreProvider store={mock_store}>
                    <VerificationLinkExpiredModal
                        should_show_verification_link_expired_modal
                        setShouldShowVerificationLinkExpiredModal={mockSetShowVerificationLinkExpiredModal}
                    />
                </StoreProvider>
            </APIProvider>
        );
    };

    it('should render VerificationLinkExpiredModal', () => {
        renderComponent();
        buttons.forEach(value => {
            expect(screen.getByRole('button', { name: value })).toBeInTheDocument();
        });
        expect(screen.getByText(/Link expired/)).toBeInTheDocument();
        expect(screen.getByText(/Request a new verification link via email./)).toBeInTheDocument();
    });

    it('should render mockSetShowVerificationLinkExpiredModal and mock_back_router when Cancel is clicked', () => {
        renderComponent();
        const cancelButton = screen.getByRole('button', { name: buttons[1] });
        userEvent.click(cancelButton);
        expect(mockSetShowVerificationLinkExpiredModal).toBeCalledTimes(1);
        expect(mock_push_function).toBeCalledWith(routes.personal_details);
    });

    it('should show in 60s which is coming from usePhoneNumberVerificationSetTimer', () => {
        (usePhoneNumberVerificationSetTimer as jest.Mock).mockReturnValue({ next_email_otp_request_timer: 60 });
        renderComponent();
        expect(screen.getByText(/in 1m/)).toBeInTheDocument();
    });
});
