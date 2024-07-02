import React from 'react';
import { screen, render } from '@testing-library/react';
import { useStores } from 'Stores';
import BuySellModalTitle from '../buy-sell-modal-title';
import userEvent from '@testing-library/user-event';

const mock_store: DeepPartial<ReturnType<typeof useStores>> = {
    buy_sell_store: {
        selected_ad_state: {
            account_currency: 'USD',
        },
        show_advertiser_page: false,
        table_type: 'sell',
    },
    general_store: {
        is_form_modified: false,
    },
    my_profile_store: {
        setShouldShowAddPaymentMethodForm: jest.fn(),
    },
};

jest.mock('Stores', () => ({
    ...jest.requireActual('Stores'),
    useStores: jest.fn(() => mock_store),
}));

const mock_props = {
    is_buy: false,
    onReturn: jest.fn(),
};

describe('<BuySellModalTitle />', () => {
    it('should display Sell USD if table type is sell', () => {
        render(<BuySellModalTitle {...mock_props} />);

        expect(screen.getByText('Sell USD')).toBeInTheDocument();
    });

    it('should display Buy USD if table type is buy', () => {
        mock_store.buy_sell_store.table_type = 'buy';

        render(<BuySellModalTitle {...mock_props} is_buy={true} />);

        expect(screen.getByText('Buy USD')).toBeInTheDocument();
    });

    it('should display Add payment method text if should_show_add_payment_method_form is true and isDesktop is false', () => {
        mock_store.my_profile_store.should_show_add_payment_method_form = true;

        render(<BuySellModalTitle {...mock_props} />);

        expect(screen.getByText('Add payment method')).toBeInTheDocument();
    });

    it('should display Add payment method text with arrow icon if should_show_add_payment_method_form is true and isDesktop is true', () => {
        (isDesktop as jest.Mock).mockReturnValue(true);

        render(<BuySellModalTitle {...mock_props} />);

        expect(screen.getByTestId('dt_buy_sell_modal_back_icon')).toBeInTheDocument();
        expect(screen.getByText('Add payment method')).toBeInTheDocument();
    });

    it('should call onReturn if user presses return icon', () => {
        render(<BuySellModalTitle {...mock_props} />);

        const back_icon = screen.getByTestId('dt_buy_sell_modal_back_icon');
        userEvent.click(back_icon);

        expect(mock_props.onReturn).toBeCalled();
    });
});
