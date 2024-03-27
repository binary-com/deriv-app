import React from 'react';
import { render, screen } from '@testing-library/react';
import { useDevice } from '@deriv/hooks';
import userEvent from '@testing-library/user-event';
import PurchaseFieldset from '../purchase-fieldset';

const default_mocked_props: React.ComponentProps<typeof PurchaseFieldset> = {
    basis: '',
    buy_info: {},
    currency: '',
    growth_rate: 0.03,
    has_cancellation: false,
    index: 1,
    info: {
        has_error: false,
        id: 'test_id',
        message: 'test_message',
        growth_rate: 0.03,
        stake: '10',
        spot_time: 0,
        commission: 0.44,
        cancellation: undefined,
        has_error_details: false,
        error_code: '',
        error_field: '',
        limit_order: undefined,
        obj_contract_basis: { text: 'mocked text', value: 'mocked value' },
        payout: 0,
        profit: '',
        returns: '',
        spot: 0,
    },
    is_accumulator: false,
    is_disabled: false,
    is_high_low: false,
    is_loading: false,
    is_market_closed: false,
    is_multiplier: false,
    is_proposal_empty: false,
    is_proposal_error: false,
    is_vanilla: false,
    is_turbos: false,
    onClickPurchase: jest.fn(),
    onHoverPurchase: jest.fn(),
    purchased_states_arr: [true, false],
    setPurchaseState: jest.fn(),
    type: '',
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));
jest.mock('Modules/Trading/Components/Form/Purchase/contract-info', () => jest.fn(() => <div>ContractInfo</div>));
jest.mock('Modules/Trading/Components/Elements/purchase-button', () => jest.fn(() => <div>PurchaseButton</div>));
jest.mock('../../Form/Purchase/cancel-deal-info', () => jest.fn(() => <div>CancelDealInfo</div>));

describe('<PurchaseFieldset />', () => {
    it('should render PurchaseButton and ContractInfo by default', () => {
        render(<PurchaseFieldset {...default_mocked_props} />);

        expect(screen.getByText(/ContractInfo/i)).toBeInTheDocument();
        expect(screen.getByText(/PurchaseButton/i)).toBeInTheDocument();
    });

    it('should render PurchaseButton with Error Popover if is_proposal_error === true and is_market_closed === false', () => {
        render(<PurchaseFieldset {...default_mocked_props} is_proposal_error />);

        expect(screen.getByTestId(/dt_popover_wrapper/i)).toBeInTheDocument();
        expect(screen.getByText(/PurchaseButton/i)).toBeInTheDocument();
    });

    it('should render PurchaseButton with Popover for multiplier contract', () => {
        render(<PurchaseFieldset {...default_mocked_props} is_multiplier />);

        expect(screen.getByTestId(/dt_popover_wrapper/i)).toBeInTheDocument();
        expect(screen.getByText(/PurchaseButton/i)).toBeInTheDocument();
    });

    it('should call function onHoverPurchase if user hovers and/or unhovers on purchase field and is_disabled === false', () => {
        render(<PurchaseFieldset {...default_mocked_props} is_multiplier />);

        const popover = screen.getByTestId(/dt_popover_wrapper/i);
        userEvent.hover(popover);

        expect(default_mocked_props.onHoverPurchase).toBeCalled();

        userEvent.unhover(popover);

        expect(default_mocked_props.onHoverPurchase).toBeCalledTimes(2);
    });

    it('should render CancelDealInfo for mobile if is_multiplier === true, has_cancellation === true', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isMobile: true }));
        render(<PurchaseFieldset {...default_mocked_props} is_multiplier has_cancellation />);

        expect(screen.getByText(/CancelDealInfo/i)).toBeInTheDocument();
        expect(screen.getByText(/PurchaseButton/i)).toBeInTheDocument();
    });
});
