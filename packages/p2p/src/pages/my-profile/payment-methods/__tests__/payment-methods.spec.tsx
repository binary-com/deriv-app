import React from 'react';
import { screen, render } from '@testing-library/react';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import { payment_method_info_alipay } from 'Pages/my-profile/__mocks__/mock-payment-method-data';
import { TPaymentMethod } from 'Types/my-profile.types';
import PaymentMethods from '../payment-methods';

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

const mock_p2p_advertiser_payment_methods_hooks = {
    data: [] as TPaymentMethod[],
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PAdvertiserPaymentMethods: jest.fn(() => mock_p2p_advertiser_payment_methods_hooks),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('Components/add-payment-method', () => jest.fn(() => <div>AddPaymentMethod</div>));
jest.mock('../edit-payment-method-form', () => jest.fn(() => <div>EditPaymentMethodForm</div>));
jest.mock('../payment-methods-empty', () => jest.fn(() => <div>PaymentMethodsEmpty</div>));
jest.mock('../payment-methods-list', () => jest.fn(() => <div>PaymentMethodsList</div>));

describe('<PaymentMethods />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                active_index: 3,
                setFormikRef: jest.fn(),
            },
            my_profile_store: {
                advertiser_has_payment_methods: true,
                hideAddPaymentMethodForm: jest.fn(),
                is_loading: false,
                getAdvertiserPaymentMethods: jest.fn(),
                setAddPaymentMethodErrorMessage: jest.fn(),
                setIsLoading: jest.fn(),
                setShouldShowAddPaymentMethodForm: jest.fn(),
                setShouldShowEditPaymentMethodForm: jest.fn(),
                should_show_add_payment_method_form: false,
            },
        };
    });

    it('should render PaymentMethodsList by default', () => {
        mock_p2p_advertiser_payment_methods_hooks.data = [payment_method_info_alipay];
        render(<PaymentMethods />, { wrapper });

        expect(screen.getByText('PaymentMethodsList')).toBeInTheDocument();
    });

    it('should render Loading Component if is_loading is true', () => {
        mock_store.my_profile_store.is_loading = true;

        render(<PaymentMethods />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render AddPaymentMethod if should_show_add_payment_method_form is true', () => {
        mock_store.my_profile_store.should_show_add_payment_method_form = true;

        render(<PaymentMethods />, { wrapper });

        expect(screen.getByText('AddPaymentMethod')).toBeInTheDocument();
    });

    it('should render EditPaymentMethodForm if should_show_edit_payment_method_form is true', () => {
        mock_store.my_profile_store.should_show_edit_payment_method_form = true;

        render(<PaymentMethods />, { wrapper });

        expect(screen.getByText('EditPaymentMethodForm')).toBeInTheDocument();
    });

    it('should render PaymentMethodsEmpty if advertiser_has_payment_methods is false', () => {
        mock_p2p_advertiser_payment_methods_hooks.data = [];

        render(<PaymentMethods />, { wrapper });

        expect(screen.getByText('PaymentMethodsEmpty')).toBeInTheDocument();
    });
});
