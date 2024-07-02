import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerificationLinkExpiredModal from '../verification-link-expired-modal';
import { StoreProvider, mockStore } from '@deriv/stores';

const mock_back_router = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        goBack: mock_back_router,
    }),
}));

describe('VerificationLinkExpiredModal', () => {
    let modal_root_el: HTMLElement;
    const mockSetShowVerificationLinkExpiredModal = jest.fn();

    beforeEach(() => {
        mockSetShowVerificationLinkExpiredModal.mockClear();
        mock_back_router.mockClear();
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
            <StoreProvider store={mock_store}>
                <VerificationLinkExpiredModal
                    should_show_verification_link_expired_modal
                    setShouldShowVerificationLinkExpiredModal={mockSetShowVerificationLinkExpiredModal}
                />
            </StoreProvider>
        );
    };

    it('should render VerificationLinkExpiredModal', () => {
        renderComponent();
        buttons.forEach(value => {
            expect(screen.getByRole('button', { name: value })).toBeInTheDocument();
        });
        expect(screen.getByText(/Verification link expired/)).toBeInTheDocument();
        expect(screen.getByText(/Get another link to verify your number./)).toBeInTheDocument();
    });

    it('should render only mockSetShowVerificationLinkExpiredModal when Send new link is clicked', () => {
        renderComponent();
        const cancelButton = screen.getByRole('button', { name: buttons[0] });
        userEvent.click(cancelButton);
        expect(mockSetShowVerificationLinkExpiredModal).toBeCalledTimes(1);
        expect(mock_back_router).not.toBeCalled();
    });

    it('should render mockSetShowVerificationLinkExpiredModal and mock_back_router when Cancel is clicked', () => {
        renderComponent();
        const cancelButton = screen.getByRole('button', { name: buttons[1] });
        userEvent.click(cancelButton);
        expect(mockSetShowVerificationLinkExpiredModal).toBeCalledTimes(1);
        expect(mock_back_router).toBeCalledTimes(1);
    });
});
