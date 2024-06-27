import React from 'react';
import * as formik from 'formik';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import OrderTimeSelection from '../order-time-selection';

const mockUseFormikContext = jest.spyOn(formik, 'useFormikContext') as jest.Mock;

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

const mock_props = {
    ui: {
        is_mobile: false,
    },
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PSettings: jest.fn(() => ({
        p2p_settings: {
            order_expiry_options: [30, 60, 90, 120],
        },
    })),
}));

describe('<OrderTimeSelection/>', () => {
    beforeEach(() => {
        mockUseFormikContext.mockReturnValue({
            handleSubmit: jest.fn(),
            values: {},
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props = mock_props) =>
        render(
            <StoreProvider store={mockStore(props)}>
                <OrderTimeSelection />
            </StoreProvider>
        );

    it('should render the OrderTimeSelection component', () => {
        renderComponent();

        expect(screen.getByText('Orders must be completed in')).toBeInTheDocument();
        expect(screen.getByTestId('dt_order_time_selection_info_icon')).toBeInTheDocument();
    });
    it('should show tooltip message on hovering info icon in desktop view', () => {
        renderComponent();
        const info_icon = screen.getByTestId('dt_order_time_selection_info_icon');
        userEvent.hover(info_icon);

        expect(screen.getByText('Orders will expire if they aren’t completed within this time.')).toBeInTheDocument();
    });
    it('should open orderTimeTooltipModal on clicking info icon in responsive view', () => {
        renderComponent({ ui: { is_mobile: true } });

        const info_icon = screen.getByTestId('dt_order_time_selection_info_icon');

        userEvent.click(info_icon);
        expect(mock_modal_manager.showModal).toHaveBeenCalledWith(
            expect.objectContaining({ key: 'OrderTimeTooltipModal' })
        );
    });
});
