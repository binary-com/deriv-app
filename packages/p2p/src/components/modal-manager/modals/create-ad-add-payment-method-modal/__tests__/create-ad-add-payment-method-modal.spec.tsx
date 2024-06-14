import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDevice } from '@deriv-com/ui';
import { APIProvider } from '@deriv/api';
import { isDesktop, isMobile, isMobileOrTablet } from '@deriv/shared';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores';
import { TModalManagerContext } from 'Types';
import CreateAdAddPaymentMethodModal from '../create-ad-add-payment-method-modal';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isDesktop: true, isTablet: false, isMobile: false })),
}));

const wrapper = ({ children }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

const mock_modal_manager_context: Partial<TModalManagerContext> = {
    hideModal: jest.fn(),
    is_modal_open: true,
    showModal: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    useModalManagerContext: () => mock_modal_manager_context,
}));

let mock_store: ReturnType<typeof useStores>;
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: () => mock_store,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => true),
    isMobile: jest.fn(() => false),
    isMobileOrTablet: jest.fn(() => false),
}));

describe('<CreateAdAddPaymentMethodModal />', () => {
    let modal_root_el: HTMLElement;
    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    beforeEach(() => {
        mock_store = {
            general_store: {
                is_form_modified: false,
            },
            my_profile_store: {
                payment_methods_list_items: [],
                selected_payment_method: '',
                selected_payment_method_fields: [],
                setAddPaymentMethodErrorMessage: jest.fn(),
                getPaymentMethodsList: jest.fn(),
                getSelectedPaymentMethodDetails: jest.fn(),
            },
        };
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    it('should render CreateAdAddPaymentMethodModal component in desktop view', () => {
        render(<CreateAdAddPaymentMethodModal />, { wrapper });
        expect(screen.getByText('Add payment method')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should close CreateAdAddPaymentMethodModal component when clicking Cancel button', () => {
        render(<CreateAdAddPaymentMethodModal />, { wrapper });
        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        expect(cancel_button).toBeInTheDocument();
        userEvent.click(cancel_button);
        expect(mock_modal_manager_context.hideModal).toHaveBeenCalled();
    });

    it('should show CancelAddPaymentMethod modal if is_form_modified is true', () => {
        mock_store.general_store.is_form_modified = true;
        render(<CreateAdAddPaymentMethodModal />, { wrapper });
        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        expect(cancel_button).toBeInTheDocument();
        userEvent.click(cancel_button);
        expect(mock_modal_manager_context.showModal).toHaveBeenNthCalledWith(1, {
            key: 'CancelAddPaymentMethodModal',
            props: {
                should_hide_all_modals_on_cancel: true,
            },
        });
    });

    it('should not show Cancel button if selected_payment_method is not empty in desktop view', () => {
        mock_store.my_profile_store.selected_payment_method = ['Bank transfer'];
        render(<CreateAdAddPaymentMethodModal />, { wrapper });
        expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });

    it('should render CreateAdAddPaymentMethodModal component in mobile view', () => {
        (isDesktop as jest.Mock).mockReturnValue(false);
        (isMobile as jest.Mock).mockReturnValue(true);
        (isMobileOrTablet as jest.Mock).mockReturnValue(true);
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false, isTablet: false, isMobile: true });

        render(<CreateAdAddPaymentMethodModal />, { wrapper });
        expect(screen.getByTestId('dt_div_100_vh')).toBeInTheDocument();
        expect(screen.getByText('Add payment method')).toBeInTheDocument();
    });
});
