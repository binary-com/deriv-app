import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores/index';
import MarketRateChangeErrorModal from '../market-rate-change-error-modal';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        form_props: {
            setIsMarketRateErrorModalOpen: jest.fn(),
        },
        setTempContactInfo: jest.fn(),
        setTempPaymentInfo: jest.fn(),
        payment_method_ids: [],
    },
};

const mock_modal_manager: Partial<ReturnType<typeof useModalManagerContext>> = {
    hideModal: jest.fn(),
    is_modal_open: true,
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const el_modal = document.createElement('div');

let mock_ui_store = {
    is_desktop: true,
    is_mobile: false,
};

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({ ui: mock_ui_store })}>{children}</StoreProvider>
);

const mock_props = {
    submitForm: jest.fn(),
    values: {
        currency: 'USD',
        input_amount: 100,
        local_currency: 'IDR',
        received_amount: 100,
    },
};

describe('<MarketRateChangeErrorModal />', () => {
    beforeAll(() => {
        el_modal.setAttribute('id', 'modal_root');
        document.body.appendChild(el_modal);
    });

    afterAll(() => {
        document.body.removeChild(el_modal);
    });

    it('should render MarketRateChangeErrorModal', () => {
        render(<MarketRateChangeErrorModal {...mock_props} />, { wrapper });

        expect(screen.getByText('Attention: Rate fluctuation')).toBeInTheDocument();
        expect(screen.queryByText(/You are creating an order to buy/)).toBeInTheDocument();
        expect(screen.getByText('USD 100')).toBeInTheDocument();
        expect(screen.getByText(/for/)).toBeInTheDocument();
        expect(screen.getByText('IDR 100')).toBeInTheDocument();
        expect(
            screen.getByText(
                'The exchange rate may vary slightly due to market fluctuations. The final rate will be shown when you proceed with your order.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText('If the rate changes significantly, we may not be able to create your order.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue with order' })).toBeInTheDocument();
    });

    it('should call hideModal and setIsMarketRateErrorModalOpen when clicking Cancel', () => {
        render(<MarketRateChangeErrorModal {...mock_props} />, { wrapper });

        const cancel_button = screen.getByRole('button', { name: 'Cancel' });
        cancel_button.click();

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
        expect(mock_store.buy_sell_store.form_props.setIsMarketRateErrorModalOpen).toHaveBeenCalledWith(false);
        expect(mock_store.buy_sell_store.setTempContactInfo).toHaveBeenCalledWith(null);
    });

    it('should call submitForm and not hideModal on desktop, when clicking on Continue with order button', () => {
        render(<MarketRateChangeErrorModal {...mock_props} />, { wrapper });

        const continue_button = screen.getByRole('button', { name: 'Continue with order' });
        continue_button.click();

        expect(mock_modal_manager.hideModal).not.toHaveBeenCalled();
        expect(mock_props.submitForm).toHaveBeenCalled();
    });

    it('should call submitForm and hideModal on mobile, when clicking on Continue with order button', () => {
        mock_ui_store = {
            is_desktop: false,
            is_mobile: true,
        };

        render(<MarketRateChangeErrorModal {...mock_props} />, { wrapper });

        const continue_button = screen.getByRole('button', { name: 'Continue with order' });
        continue_button.click();

        expect(mock_modal_manager.hideModal).toHaveBeenCalled();
        expect(mock_props.submitForm).toHaveBeenCalled();
    });
});
