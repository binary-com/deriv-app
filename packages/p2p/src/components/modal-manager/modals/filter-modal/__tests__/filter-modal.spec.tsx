import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import FilterModal from '../filter-modal';
import { StoreProvider, mockStore } from '@deriv/stores';

const mock_store = {
    buy_sell_store: {
        onClickApply: jest.fn(),
        selected_payment_method_text: [],
        selected_payment_method_value: [],
        setSelectedPaymentMethodText: jest.fn(),
        setSelectedPaymentMethodValue: jest.fn(),
        setShowFilterPaymentMethods: jest.fn(),
        setShouldUseClientLimits: jest.fn(),
        show_filter_payment_methods: false,
    },
    my_profile_store: {
        getPaymentMethodsList: jest.fn(),
        setSearchResults: jest.fn(),
        setSearchTerm: jest.fn(),
        payment_methods_list_items: [
            {
                text: 'Skrill',
                value: 'skrill',
            },
        ],
    },
};
jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const mock_fn = jest.fn();
let mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
    hideModal: jest.fn(),
    is_modal_open: true,
    useSavedState: jest.fn(() => [[], mock_fn]),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const el_modal = document.createElement('div');

describe('<FilterModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the component', () => {
        render(<FilterModal />);
        expect(mock_store.my_profile_store.getPaymentMethodsList).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Filter')).toBeInTheDocument();
    });
    it('should clear the search results and search term on unmount', () => {
        const { unmount } = render(<FilterModal />);
        unmount();
        expect(mock_store.my_profile_store.setSearchResults).toHaveBeenCalledWith([]);
        expect(mock_store.my_profile_store.setSearchTerm).toHaveBeenCalledWith('');
    });
    it('should handle clicking close icon', () => {
        mock_modal_manager.useSavedState
            .mockReturnValueOnce([false, mock_fn])
            .mockReturnValueOnce([[], mock_fn])
            .mockReturnValueOnce([false, mock_fn]);
        render(<FilterModal />);
        const close_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(close_icon);
        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
        expect(mock_store.buy_sell_store.setShowFilterPaymentMethods).toHaveBeenCalledWith(false);
        expect(mock_store.my_profile_store.setSearchResults).toHaveBeenCalledWith([]);
        expect(mock_store.my_profile_store.setSearchTerm).toHaveBeenCalledWith('');
    });
    it('should open LeavePageModal if user has made changes and clicks close icon', () => {
        mock_modal_manager = {
            ...mock_modal_manager,
            useSavedState: jest.fn(() => [['skrill'], mock_fn]),
        };
        render(<FilterModal />);
        const close_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(close_icon);
        expect(mock_modal_manager.showModal).toHaveBeenCalledTimes(1);
        (mock_modal_manager.showModal as jest.Mock)?.mock.calls[0][0].props.onLeavePage();
        expect(mock_modal_manager.hideModal).toHaveBeenCalledTimes(1);
    });
    it('should handle clicking reset button', () => {
        render(<FilterModal />);
        const reset_button = screen.getByRole('button', { name: 'Reset' });
        userEvent.click(reset_button);
        expect(mock_store.buy_sell_store.setShouldUseClientLimits).toHaveBeenCalledWith(true);
    });
    it('should handle clicking apply button', () => {
        render(<FilterModal />);
        const apply_button = screen.getByRole('button', { name: 'Apply' });
        userEvent.click(apply_button);
        expect(mock_store.buy_sell_store.onClickApply).toHaveBeenCalledTimes(1);
    });
    it('should handle clicking confirm button', () => {
        (useStores as jest.Mock).mockReturnValue({
            ...mock_store,
            buy_sell_store: {
                ...mock_store.buy_sell_store,
                show_filter_payment_methods: true,
            },
        });
        render(<FilterModal />);
        const confirm_button = screen.getByRole('button', { name: 'Confirm' });
        userEvent.click(confirm_button);
        expect(mock_store.buy_sell_store.setShowFilterPaymentMethods).toHaveBeenCalledWith(false);
        expect(mock_store.my_profile_store.setSearchResults).toHaveBeenCalledWith([]);
        expect(mock_store.my_profile_store.setSearchTerm).toHaveBeenCalledWith('');
    });
    it('should handle clicking clear button', () => {
        render(<FilterModal />);
        const clear_button = screen.getByRole('button', { name: 'Clear' });
        userEvent.click(clear_button);
        expect(mock_fn).toHaveBeenCalledTimes(2);
    });
    it('should close the payment methods section on clicking back from there', async () => {
        render(<FilterModal />);
        const back_icon = screen.getByTestId('dt_page_return_icon');
        userEvent.click(back_icon);
        expect(mock_store.buy_sell_store.setShowFilterPaymentMethods).toHaveBeenCalledWith(false);
    });
});
