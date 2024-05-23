import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore, StoreProvider } from '@deriv/stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import BuySellRowAction from '../buy-sell-row-action';

const mock_modal_manager: DeepPartial<ReturnType<typeof useModalManagerContext>> = {
    showModal: jest.fn(),
};

jest.mock('Components/modal-manager/modal-manager-context', () => ({
    ...jest.requireActual('Components/modal-manager/modal-manager-context'),
    useModalManagerContext: jest.fn(() => mock_modal_manager),
}));

const wrapper = ({ children }: { children: JSX.Element }) => (
    <StoreProvider store={mockStore({})}>{children}</StoreProvider>
);

describe('<BuySellRowAction />', () => {
    it('should render the component', () => {
        render(<BuySellRowAction />, { wrapper });
        expect(screen.getByRole('button', { name: 'Unavailable' })).toBeInTheDocument();
    });
    it('should show the Buy button if advertiser is eligible to create a buy order against the advert', () => {
        const onClick = jest.fn();

        render(<BuySellRowAction account_currency='USD' is_buy_advert is_eligible onClick={onClick} />, { wrapper });

        const buy_btn = screen.getByRole('button', { name: 'Buy USD' });
        expect(buy_btn).toBeInTheDocument();
        userEvent.click(buy_btn);
        expect(onClick).toHaveBeenCalled();
    });
    it('should show the Sell button if advertiser is eligible to create a sell order against the advert', () => {
        const onClick = jest.fn();

        render(<BuySellRowAction account_currency='USD' is_eligible onClick={onClick} />, { wrapper });

        const sell_btn = screen.getByRole('button', { name: 'Sell USD' });
        expect(sell_btn).toBeInTheDocument();
        userEvent.click(sell_btn);
        expect(onClick).toHaveBeenCalled();
    });
    it('should show the proper message if advertiser does not meet the completion rate', () => {
        const onClick = jest.fn();
        const eligibility_status = ['completion_rate'];

        render(<BuySellRowAction eligibility_status={eligibility_status} onClick={onClick} />, { wrapper });
        userEvent.click(screen.getByRole('button', { name: 'Unavailable' }));

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
            key: 'ErrorModal',
            props: { error_message: 'Your completion rate is too low for this ad.' },
        });
    });
    it('should show the proper message if advertiser does not meet the minimum no. of joining days', () => {
        const onClick = jest.fn();
        const eligibility_status = ['join_date'];

        render(<BuySellRowAction eligibility_status={eligibility_status} onClick={onClick} />, { wrapper });
        userEvent.click(screen.getByRole('button', { name: 'Unavailable' }));

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
            key: 'ErrorModal',
            props: { error_message: "You've not used Deriv P2P long enough for this ad." },
        });
    });
    it('should show the proper message if advertiser does not meet any of the conditions set for the advert', () => {
        const onClick = jest.fn();
        const eligibility_status = ['join_date', 'completion_rate', 'country'];

        render(<BuySellRowAction eligibility_status={eligibility_status} onClick={onClick} />, { wrapper });
        userEvent.click(screen.getByRole('button', { name: 'Unavailable' }));

        expect(mock_modal_manager.showModal).toHaveBeenCalledWith({
            key: 'ErrorModal',
            props: { error_message: "The advertiser has set conditions for this ad that you don't meet." },
        });
    });
});
