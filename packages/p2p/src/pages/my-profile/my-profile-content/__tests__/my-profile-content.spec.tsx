import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores/index';
import MyProfileContent from '../my-profile-content';

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};

let mock_store: DeepPartial<ReturnType<typeof useStores>>;

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    MobileOrTabletWrapper: jest.fn(({ children }) => children),
}));

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

jest.mock('../../my-profile-form', () => jest.fn(() => <div>MyProfileForm</div>));
jest.mock('../../my-profile-stats', () => jest.fn(() => <div>MyProfileStats</div>));
jest.mock('../../payment-methods', () => jest.fn(() => <div>PaymentMethods</div>));
jest.mock('../../block-user', () => jest.fn(() => <div>BlockUser</div>));

describe('<MyProfileContent />', () => {
    beforeEach(() => {
        mock_store = {
            general_store: {
                is_form_modified: false,
            },
            my_profile_store: {
                active_tab: my_profile_tabs.MY_STATS,
                hideAddPaymentMethodForm: jest.fn(),
                selected_payment_method: 'alipay',
                setShouldShowEditPaymentMethodForm: jest.fn(),
                should_show_add_payment_method_form: false,
                should_show_edit_payment_method_form: false,
            },
        };
    });

    it('should render MyProfileStats if active_tab is MY_STATS', () => {
        render(<MyProfileContent />);

        expect(screen.getByText('MyProfileStats')).toBeInTheDocument();
    });

    it('should render MyProfileForm if active_tab is AD_TEMPLATE', () => {
        mock_store.my_profile_store.active_tab = my_profile_tabs.AD_TEMPLATE;

        render(<MyProfileContent />);

        expect(screen.getByText('MyProfileForm')).toBeInTheDocument();
    });

    it('should render BlockUser if active_tab is MY_COUNTERPARTIES', () => {
        mock_store.my_profile_store.active_tab = my_profile_tabs.MY_COUNTERPARTIES;

        render(<MyProfileContent />);

        expect(screen.getByText('BlockUser')).toBeInTheDocument();
    });

    it('should render PaymentMethods if active_tab is PAYMENT_METHODS', () => {
        mock_store.my_profile_store.active_tab = my_profile_tabs.PAYMENT_METHODS;

        render(<MyProfileContent />);

        expect(screen.getAllByText('PaymentMethods')).toHaveLength(2);
    });

    it('should call hideAddPaymentMethodForm and setShouldShowEditPaymentMethodForm when clicking return icon', () => {
        mock_store.my_profile_store.selected_payment_method = '';
        mock_store.my_profile_store.active_tab = my_profile_tabs.PAYMENT_METHODS;

        render(<MyProfileContent />);

        const pageReturnIcon = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(pageReturnIcon);

        expect(mock_store.my_profile_store.hideAddPaymentMethodForm).toBeCalled();
        expect(mock_store.my_profile_store.setShouldShowEditPaymentMethodForm).toBeCalledWith(false);
    });

    it('should call showModal with CancelAddPaymentMethodModal if is_form_modified is true and should_show_add_payment_method_form is true', () => {
        mock_store.my_profile_store.active_tab = my_profile_tabs.PAYMENT_METHODS;
        mock_store.general_store.is_form_modified = true;
        mock_store.my_profile_store.should_show_add_payment_method_form = true;

        render(<MyProfileContent />);

        const pageReturnIcon = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(pageReturnIcon);

        expect(mock_modal_manager.showModal).toBeCalledWith({ key: 'CancelAddPaymentMethodModal' });
    });

    it('should call showModal with CancelEditPaymentMethodModal if is_form_modified is true and should_show_edit_payment_method_form is true', () => {
        mock_store.my_profile_store.active_tab = my_profile_tabs.PAYMENT_METHODS;
        mock_store.general_store.is_form_modified = true;
        mock_store.my_profile_store.should_show_edit_payment_method_form = true;

        render(<MyProfileContent />);

        const pageReturnIcon = screen.getByTestId('dt_mobile_full_page_return_icon');

        userEvent.click(pageReturnIcon);

        expect(mock_modal_manager.showModal).toBeCalledWith({ key: 'CancelEditPaymentMethodModal' });
    });
});
