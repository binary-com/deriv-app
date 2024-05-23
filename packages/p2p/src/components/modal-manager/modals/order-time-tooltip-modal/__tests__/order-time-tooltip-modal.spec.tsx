import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import OrderTimeTooltipModal from '../order-time-tooltip-modal';

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const props = {
    order_time_info_message: 'Orders will expire if they aren’t completed within this time.',
};

const el_modal = document.createElement('div');

describe('<OrderTimeTooltipModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render OrderTimeTooltipModal', () => {
        render(<OrderTimeTooltipModal {...props} />);

        expect(screen.getByText('Orders will expire if they aren’t completed within this time.')).toBeInTheDocument();
    });
    it('should handle ok button click', () => {
        render(<OrderTimeTooltipModal {...props} />);

        const ok_button = screen.getByRole('button', { name: 'OK' });
        userEvent.click(ok_button);
        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
    });
});
