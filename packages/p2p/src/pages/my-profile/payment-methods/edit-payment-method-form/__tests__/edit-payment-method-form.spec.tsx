import React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { payment_method_info_alipay } from 'Pages/my-profile/__mocks__/mock-payment-method-data';
import EditPaymentMethodForm from '../edit-payment-method-form';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

describe('<EditPaymentMethodForm />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                active_index: 3,
                setFormikRef: jest.fn(),
            },
            my_profile_store: {
                payment_method_to_edit: payment_method_info_alipay,
                selected_payment_method_fields: [
                    { 0: 'account', 1: { display_name: 'Alipay ID', required: 1, type: 'text' } },
                    { 0: 'instructions', 1: { display_name: 'Instructions', required: 0, type: 'memo' } },
                ],
                setAddPaymentMethodErrorMessage: jest.fn(),
                setPaymentMethodToEdit: jest.fn(),
                setSelectedPaymentMethod: jest.fn(),
                setSelectedPaymentMethodDisplayName: jest.fn(),
                setShouldShowEditPaymentMethodForm: jest.fn(),
                updatePaymentMethod: jest.fn(),
                validatePaymentMethodFields: jest.fn(),
            },
        };
    });

    it('should render the EditPaymentMethodForm component', () => {
        render(<EditPaymentMethodForm />, { wrapper });

        expect(screen.getByText('Edit payment method')).toBeInTheDocument();
        expect(screen.getByText('Choose your payment method')).toBeInTheDocument();
        expect(screen.getByLabelText('Alipay ID')).toBeInTheDocument();
        expect(screen.getByText('Instructions')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
    });

    it('should render the Loading component if payment_method_info is empty', () => {
        mock_store.my_profile_store.payment_method_to_edit = {};

        render(<EditPaymentMethodForm />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should call setShouldShowEditPaymentMethodForm if form fields are filled when clicking page return', () => {
        render(<EditPaymentMethodForm />, { wrapper });

        const pageReturnIcon = screen.getByTestId('dt_page_return_icon');

        userEvent.click(pageReturnIcon);

        expect(mock_store.my_profile_store.setShouldShowEditPaymentMethodForm).toBeCalledWith(false);
    });

    it('should call setPaymentMethodToEdit and setShouldShowEditPaymentMethodForm if form fields are filled when clicking Cancel button', () => {
        render(<EditPaymentMethodForm />, { wrapper });

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        userEvent.click(cancelButton);

        expect(mock_store.my_profile_store.setPaymentMethodToEdit).toBeCalledWith(null);
        expect(mock_store.my_profile_store.setShouldShowEditPaymentMethodForm).toBeCalledWith(false);
    });

    it('should call showModal if form fields are not filled when clicking page return', async () => {
        render(<EditPaymentMethodForm />, { wrapper });

        const alipayIdInput = screen.getByLabelText('Alipay ID');
        const pageReturnIcon = screen.getByTestId('dt_page_return_icon');

        userEvent.clear(alipayIdInput);

        await waitFor(() => userEvent.click(pageReturnIcon));

        await waitFor(() =>
            expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
                key: 'CancelEditPaymentMethodModal',
                props: {},
            })
        );
    });

    it('should call showModal if form fields are not filled when clicking Cancel button', async () => {
        render(<EditPaymentMethodForm />, { wrapper });

        const alipayIdInput = screen.getByLabelText('Alipay ID');
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });

        userEvent.clear(alipayIdInput);

        await waitFor(() => userEvent.click(cancelButton));

        await waitFor(() =>
            expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
                key: 'CancelEditPaymentMethodModal',
                props: {},
            })
        );
    });
});
