import React from 'react';
import { render, screen } from '@testing-library/react';
import { getStartTime, hasForwardContractStarted, isForwardStarting, toMoment } from '@deriv/shared';
import ForwardStartingBanner from '../forward-starting-banner';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isForwardStarting: jest.fn(),
    getStartTime: jest.fn(),
    hasForwardContractStarted: jest.fn(),
}));

const mocked_date = 1727251488;
const banner_text = 'This contract starts on';
const mocked_open_positions = [
    {
        account_id: 112905368,
        barrier: '682.60',
        barrier_count: 1,
        bid_price: 6.38,
        buy_price: 9,
        contract_id: 242807007748,
        contract_type: 'CALL',
        currency: 'USD',
        current_spot: 681.76,
        current_spot_display_value: '681.76',
        current_spot_time: 1716220628,
        date_expiry: mocked_date + 1000,
        date_settlement: mocked_date + 1000,
        date_start: 1716220562,
        display_name: 'Volatility 100 (1s) Index',
        entry_spot: 682.6,
        entry_spot_display_value: '682.60',
        entry_tick: 682.6,
        entry_tick_display_value: '682.60',
        entry_tick_time: 1716220563,
        expiry_time: mocked_date + 1000,
        is_expired: 0,
        is_forward_starting: 0,
        is_intraday: 1,
        is_path_dependent: 0,
        is_settleable: 0,
        is_sold: 0,
        is_valid_to_cancel: 0,
        is_valid_to_sell: 1,
        longcode:
            'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 2024-05-20 16:05:00 GMT.',
        payout: 17.61,
        profit: -2.62,
        profit_percentage: -29.11,
        purchase_time: 1716220562,
        shortcode: `CALL_1HZ100V_17.61_1716220562_${mocked_date + 1000}F_S0P_0`,
        status: 'open',
        transaction_ids: {
            buy: 484286139408,
        },
        underlying: '1HZ100V',
    },
    {
        account_id: 147849428,
        barrier_count: 1,
        bid_price: 9.53,
        buy_price: 10,
        contract_id: 257552458028,
        contract_type: 'CALL',
        currency: 'USD',
        current_spot: 9102.91,
        current_spot_time: 1727096138,
        date_expiry: mocked_date + 3000,
        date_settlement: mocked_date + 3000,
        date_start: mocked_date + 2000,
        display_name: 'Volatility 10 (1s) Index',
        expiry_time: mocked_date + 3000,
        is_expired: 0,
        is_forward_starting: 1,
        is_intraday: 1,
        is_path_dependent: 0,
        is_settleable: 0,
        is_sold: 0,
        is_valid_to_cancel: 0,
        is_valid_to_sell: 1,
        longcode:
            'Win payout if Volatility 10 (1s) Index is strictly higher than entry spot at 15 minutes after 2024-09-23 13:05:00 GMT.',
        payout: 19.54,
        profit: -0.47,
        profit_percentage: -4.7,
        purchase_time: 1727096132,
        shortcode: `CALL_1HZ10V_19.54_${mocked_date + 2000}F_${mocked_date + 3000}_S0P_0`,
        status: 'open',
    },
];
const mocked_props = {
    contract_info: mocked_open_positions[1],
    server_time: toMoment(mocked_date),
} as React.ComponentProps<typeof ForwardStartingBanner>;

describe('ForwardStartingBanner', () => {
    it('should render component if it is a forward starting contract and it has not started yet', () => {
        (isForwardStarting as jest.Mock).mockReturnValueOnce(true);
        (hasForwardContractStarted as jest.Mock).mockReturnValueOnce(false);
        (getStartTime as jest.Mock).mockReturnValueOnce(124525522);
        render(<ForwardStartingBanner {...mocked_props} />);

        expect(screen.getByText(banner_text)).toBeInTheDocument();
    });

    it('should not render component if it is not a forward starting contract', () => {
        mocked_props.contract_info = mocked_open_positions[0] as React.ComponentProps<
            typeof ForwardStartingBanner
        >['contract_info'];
        render(<ForwardStartingBanner {...mocked_props} />);

        expect(screen.queryByText(banner_text)).not.toBeInTheDocument();
    });
});
