import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import CoolDownPeriodModal from '../cool-down-period-modal';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { routes } from '@deriv/shared';

const mock_push_function = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useHistory: () => ({
        push: mock_push_function,
    }),
}));

describe('CooldownPeriodModal', () => {
    const mock_store = mockStore({});
    const show_cool_down_period_modal = true;
    const mockSetShowCoolDownPeriodModal = jest.fn();

    const renderComponent = () => {
        render(
            <StoreProvider store={mock_store}>
                <CoolDownPeriodModal
                    show_cool_down_period_modal={show_cool_down_period_modal}
                    setShowCoolDownPeriodModal={mockSetShowCoolDownPeriodModal}
                />
            </StoreProvider>
        );
    };
    it('should show CooldownPeriodModal when show_cool_down_period_modal is true', () => {
        renderComponent();
        expect(screen.getByText(/OTP limit reached/)).toBeInTheDocument();
        expect(screen.getByText(/Request a new OTP after 10 minutes./)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /OK/ })).toBeInTheDocument();
    });

    it('should call history.push, setIsForcedToExitPnv, mockSetShowCoolDownPeriodModal with value of personal details', () => {
        renderComponent();
        const ok_button = screen.getByRole('button', { name: /OK/ });
        userEvent.click(ok_button);
        expect(mock_push_function).toBeCalledWith(routes.personal_details);
        expect(mockSetShowCoolDownPeriodModal).toBeCalledWith(false);
        expect(mock_store.ui.setIsForcedToExitPnv).toBeCalledWith(false);
    });
});
