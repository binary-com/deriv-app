import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider } from '@deriv/api';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useStores } from 'Stores/index';
import {
    payment_method_info_alipay,
    payment_method_info_bank,
} from 'Pages/my-profile/__mocks__/mock-payment-method-data';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import PaymentMethodsList from '../payment-methods-list';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    general_store: {
        active_index: 3,
    },
    my_ads_store: {
        payment_method_ids: [1],
    },
    my_profile_store: {
        setActiveTab: jest.fn(),
        setPaymentMethodToDelete: jest.fn(),
        setPaymentMethodToEdit: jest.fn(),
        setShouldShowAddPaymentMethodForm: jest.fn(),
    },
};

const mock_modal_manager = {
    isCurrentModal: jest.fn(() => false),
};

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <StoreProvider store={mockStore({})}>{children}</StoreProvider>
    </APIProvider>
);

const mock_p2p_advertiser_payment_methods_hooks = {
    data: undefined,
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileOrTabletWrapper: jest.fn(({ children }) => children),
}));

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useP2PAdvertiserPaymentMethods: jest.fn(() => mock_p2p_advertiser_payment_methods_hooks),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

describe('<PaymentMethodsList /> Desktop', () => {
    it('should render the Loading component if data is empty', () => {
        render(<PaymentMethodsList />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render PaymentMethodsList component', () => {
        mock_p2p_advertiser_payment_methods_hooks.data = [payment_method_info_alipay, payment_method_info_bank];
        render(<PaymentMethodsList />, { wrapper });

        expect(screen.getAllByRole('button', { name: 'Add new' })).toHaveLength(2);
        expect(screen.getAllByText('Alipay')).toHaveLength(2);
        expect(screen.getAllByText('test_account')).toHaveLength(2);

        expect(screen.getAllByText('Bank Transfers')).toHaveLength(2);
        expect(screen.getAllByText('test_bank_name')).toHaveLength(2);
    });

    it('should call setShouldShowAddPaymentMethodForm when clicking Add new button', () => {
        render(<PaymentMethodsList />, { wrapper });

        const addNewButtons = screen.getAllByRole('button', { name: 'Add new' });

        userEvent.click(addNewButtons[0]);

        expect(mock_store.my_profile_store.setShouldShowAddPaymentMethodForm).toBeCalledWith(true);
    });

    it('should call setActiveTab when clicking return icon', () => {
        render(<PaymentMethodsList />, { wrapper });

        const pageReturnIcon = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(pageReturnIcon);

        expect(mock_store.my_profile_store.setActiveTab).toBeCalledWith(my_profile_tabs.MY_STATS);
    });
});
