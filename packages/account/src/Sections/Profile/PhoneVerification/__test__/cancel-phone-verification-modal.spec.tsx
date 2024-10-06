import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CancelPhoneVerificationModal from '../cancel-phone-verification-modal';
import { StoreProvider, mockStore } from '@deriv/stores';
import { routes } from '@deriv/shared';
import { useGrowthbookGetFeatureValue } from '@deriv/hooks';

const mock_push = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mock_push,
        block: jest.fn(callback => {
            callback({ pathname: routes.personal_details });
            return jest.fn();
        }),
    }),
    useLocation: () => ({
        pathname: '/phone-verification',
    }),
}));
jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    usePhoneNumberVerificationSessionTimer: jest.fn(() => ({
        should_show_session_timeout_modal: false,
    })),
    useGrowthbookGetFeatureValue: jest.fn(),
}));

describe('CancelPhoneVerificationModal', () => {
    let modal_root_el: HTMLElement;

    beforeAll(() => {
        (useGrowthbookGetFeatureValue as jest.Mock).mockReturnValue([true]);
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const mock_store = mockStore({});

    const buttons = [/Continue verification/, /Cancel/];

    const renderComponent = () => {
        render(
            <StoreProvider store={mock_store}>
                <CancelPhoneVerificationModal />
            </StoreProvider>
        );
    };

    it('it should render CancelPhoneVerificationModal', () => {
        renderComponent();
        buttons.forEach(value => {
            expect(screen.getByRole('button', { name: value })).toBeInTheDocument();
        });
        expect(screen.getByText(/Cancel phone number verification?/)).toBeInTheDocument();
        expect(screen.getByText(/If you cancel, you'll lose all progress./)).toBeInTheDocument();
    });

    it('it should render only mockSetShowCancelModal when Continue verification is clicked', () => {
        renderComponent();
        const cancelButton = screen.getByRole('button', { name: buttons[0] });
        userEvent.click(cancelButton);
        expect(mock_push).not.toBeCalled();
    });

    it('it should render mockSetShowCancelModal and mock_back_router when Cancel is clicked', () => {
        renderComponent();
        const cancelButton = screen.getByRole('button', { name: buttons[1] });
        userEvent.click(cancelButton);
        expect(mock_push).toBeCalledWith(routes.personal_details);
    });
});
