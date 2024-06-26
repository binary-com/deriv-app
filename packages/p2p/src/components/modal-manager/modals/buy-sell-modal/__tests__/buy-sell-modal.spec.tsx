import React from 'react';
import { screen, render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import BuySellModal from '../buy-sell-modal';

const wrapper = ({ children }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
    showModal: jest.fn(),
};

const el_modal = document.createElement('div');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        search: '',
    }),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('Pages/buy-sell/buy-sell-form', () => jest.fn(() => <div>BuySellForm</div>));
jest.mock('Pages/buy-sell/buy-sell-form-receive-amount.jsx', () => jest.fn(() => <div>BuySellFormReceiveAmount</div>));
jest.mock('../buy-sell-modal-error', () => jest.fn(() => <div>BuySellModalError</div>));

describe('<BuySellModal />', () => {
    beforeEach(() => {
        mock_store = {
            buy_sell_store: {
                advert: {
                    advertiser_details: {
                        name: 'test',
                    },
                    rate: 1,
                    rate_type: 'fixed',
                },
                selected_ad_state: {
                    account_currency: 'USD',
                },
                table_type: 'buy',
                fetchAdvertiserAdverts: jest.fn(),
                form_props: {
                    submitForm: jest.fn(),
                },
                is_buy_advert: true,
                setFormErrorCode: jest.fn(),
                setTempContactInfo: jest.fn(),
                setTempPaymentInfo: jest.fn(),
                temp_contact_info: null,
                unsubscribeAdvertInfo: jest.fn(),
            },
            floating_rate_store: {
                setIsMarketRateChanged: jest.fn(),
            },
            general_store: {
                balance: 10000,
                is_form_modified: false,
            },
            my_profile_store: {
                selected_payment_method_fields: [],
                should_show_add_payment_method_form: false,
                getPaymentMethodsList: jest.fn(),
                getSelectedPaymentMethodDetails: jest.fn(),
                hideAddPaymentMethodForm: jest.fn(),
                setAddPaymentMethodErrorMessage: jest.fn(),
                setSelectedPaymentMethod: jest.fn(),
                setSelectedPaymentMethodDisplayName: jest.fn(),
            },
        };
    });

    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render the BuySellModal', () => {
        render(<BuySellModal />, { wrapper });

        expect(screen.getByText('Buy USD')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });

    it('should call hideModal, fetchAdvertiserAdverts, unsubscribeAdvertInfo when clicking cross icon if should_show_add_payment_method_form is false', () => {
        render(<BuySellModal />, { wrapper });

        const cross_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(cross_icon);

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
        expect(mock_store.buy_sell_store.fetchAdvertiserAdverts).toHaveBeenCalled();
        expect(mock_store.buy_sell_store.unsubscribeAdvertInfo).toHaveBeenCalled();
    });

    it('should call hideAddPaymentMethodForm when clicking cross icon if should_show_add_payment_method_form is true and is_form_modified is false', () => {
        mock_store.my_profile_store.should_show_add_payment_method_form = true;

        render(<BuySellModal />, { wrapper });

        const cross_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(cross_icon);

        expect(mock_store.my_profile_store.hideAddPaymentMethodForm).toHaveBeenCalled();
    });

    it('should call showModal when clicking cross icon if should_show_add_payment_method_form and is_form_modified is true', () => {
        mock_store.my_profile_store.should_show_add_payment_method_form = true;
        mock_store.general_store.is_form_modified = true;

        render(<BuySellModal />, { wrapper });

        const cross_icon = screen.getByTestId('dt_modal_close_icon');
        userEvent.click(cross_icon);

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({ key: 'CancelAddPaymentMethodModal', props: {} });
    });

    it('should call submitForm when pressing Confirm', () => {
        mock_store.buy_sell_store.submitForm = jest.fn();

        render(<BuySellModal />, { wrapper });

        const confirm_button = screen.getByRole('button', { name: 'Confirm' });
        userEvent.click(confirm_button);

        expect(mock_store.buy_sell_store.submitForm).toHaveBeenCalled();
    });

    it('should call showModal when the advertiser has changed the rate', async () => {
        render(<BuySellModal />, { wrapper });

        act(() => {
            mock_store.buy_sell_store.advert.rate = 2;
        });

        await waitFor(() => {
            expect(mock_modal_manager.showModal).toHaveBeenCalled();
        });
    });

    it('should setErrorMessage to empty string if is_modal_open is false', () => {
        const mockSetErrorMessage = jest.spyOn(React, 'useState');
        (mockSetErrorMessage as jest.Mock).mockImplementation(initial_value => [initial_value, jest.fn()]);

        mock_modal_manager.is_modal_open = false;

        render(<BuySellModal />, { wrapper });

        expect(mockSetErrorMessage).toHaveBeenCalledWith('');
    });
});
