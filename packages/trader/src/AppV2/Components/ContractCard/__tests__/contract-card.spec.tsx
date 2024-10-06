import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    getCardLabels,
    getStartTime,
    getContractPath,
    hasForwardContractStarted,
    isForwardStarting,
    toMoment,
} from '@deriv/shared';
import { TPortfolioPosition } from '@deriv/stores/types';
import { TClosedPosition } from 'AppV2/Containers/Positions/positions-content';
import ContractCard from '../contract-card';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isForwardStarting: jest.fn(),
    getStartTime: jest.fn(),
    hasForwardContractStarted: jest.fn(),
}));

const mockedNow = Math.floor(Date.now() / 1000);

const closedPositions = [
    {
        contract_info: {
            app_id: 16929,
            buy_price: 10,
            contract_id: 243585717228,
            contract_type: 'TURBOSLONG',
            duration_type: 'minutes',
            longcode:
                'You will receive a payout at expiry if the spot price never breaches the barrier. The payout is equal to the payout per point multiplied by the distance between the final price and the barrier.',
            payout: 0,
            purchase_time: '27 May 2024 09:41:00',
            sell_price: 0,
            sell_time: '27 May 2024 09:43:36',
            shortcode: 'TURBOSLONG_1HZ100V_10.00_1716802860_1716804660_S-237P_3.971435_1716802860',
            transaction_id: 485824148848,
            underlying_symbol: '1HZ100V',
            profit_loss: '-10.00',
            display_name: '',
            purchase_time_unix: 1716802860,
        },
    },
] as TClosedPosition[];

const openPositions = [
    {
        contract_info: {
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
            date_expiry: mockedNow + 1000,
            date_settlement: mockedNow + 1000,
            date_start: 1716220562,
            display_name: 'Volatility 100 (1s) Index',
            entry_spot: 682.6,
            entry_spot_display_value: '682.60',
            entry_tick: 682.6,
            entry_tick_display_value: '682.60',
            entry_tick_time: 1716220563,
            expiry_time: mockedNow + 1000,
            id: '917d1b48-305b-a2f4-5b9c-7fb1f2c6c145',
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
            shortcode: `CALL_1HZ100V_17.61_1716220562_${mockedNow + 1000}F_S0P_0`,
            status: 'open',
            transaction_ids: {
                buy: 484286139408,
            },
            underlying: '1HZ100V',
        },
        details:
            'Win payout if Volatility 100 (1s) Index is strictly higher than entry spot at 2024-05-20 16:05:00 GMT.',
        display_name: '',
        id: 242807007748,
        indicative: 6.38,
        payout: 17.61,
        purchase: 9,
        reference: 484286139408,
        type: 'CALL',
        profit_loss: -2.62,
        is_valid_to_sell: true,
        status: 'profit',
        barrier: 682.6,
        entry_spot: 682.6,
    },
    {
        contract_info: {
            account_id: 112905368,
            barrier_count: 1,
            bid_price: 8.9,
            buy_price: 9.39,
            cancellation: {
                ask_price: 0.39,
                date_expiry: 1716224183,
            },
            commission: 0.03,
            contract_id: 242807045608,
            contract_type: 'MULTUP',
            currency: 'USD',
            current_spot: 681.71,
            current_spot_display_value: '681.71',
            current_spot_time: 1716220672,
            date_expiry: mockedNow + 1000,
            date_settlement: mockedNow + 1000,
            date_start: 1716220583,
            display_name: 'Volatility 100 (1s) Index',
            entry_spot: 682.23,
            entry_spot_display_value: '682.23',
            entry_tick: 682.23,
            entry_tick_display_value: '682.23',
            entry_tick_time: 1716220584,
            expiry_time: mockedNow + 1000,
            id: '917d1b48-305b-a2f4-5b9c-7fb1f2c6c145',
            is_expired: 0,
            is_forward_starting: 0,
            is_intraday: 0,
            is_path_dependent: 1,
            is_settleable: 0,
            is_sold: 0,
            is_valid_to_cancel: 1,
            is_valid_to_sell: 0,
            limit_order: {
                stop_out: {
                    display_name: 'Stop out',
                    order_amount: -9,
                    order_date: 1716220583,
                    value: '614.26',
                },
                stop_loss: {
                    order_amount: -1,
                },
                take_profit: {
                    order_amount: 5,
                },
            },
            longcode:
                "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 90, minus commissions.",
            multiplier: 10,
            profit: -0.1,
            profit_percentage: -1.11,
            purchase_time: 1716220583,
            shortcode: `MULTUP_1HZ100V_9.00_10_1716220583_${mockedNow + 1000}_60m_0.00_N1`,
            status: 'open',
            transaction_ids: {
                buy: 484286215128,
            },
            underlying: '1HZ100V',
            validation_error:
                'The spot price has moved. We have not closed this contract because your profit is negative and deal cancellation is active. Cancel your contract to get your full stake back.',
            validation_error_code: 'General',
        },
        details:
            "If you select 'Up', your total profit/loss will be the percentage increase in Volatility 100 (1s) Index, multiplied by 90, minus commissions.",
        display_name: '',
        id: 242807045608,
        indicative: 8.9,
        purchase: 9.39,
        reference: 484286215128,
        type: 'MULTUP',
        contract_update: {
            stop_out: {
                display_name: 'Stop out',
                order_amount: -9,
                order_date: 1716220583,
                value: '614.26',
            },
        },
        profit_loss: -0.1,
        is_valid_to_sell: false,
        status: 'profit',
        entry_spot: 682.23,
    },
    {
        contract_info: {
            account_id: 112905368,
            barrier_count: 2,
            barrier_spot_distance: '0.296',
            bid_price: 9.84,
            buy_price: 9,
            contract_id: 242807268688,
            contract_type: 'ACCU',
            currency: 'USD',
            current_spot: 682.72,
            current_spot_display_value: '682.72',
            current_spot_high_barrier: '683.016',
            current_spot_low_barrier: '682.424',
            current_spot_time: 1716220720,
            date_expiry: mockedNow + 1000,
            date_settlement: mockedNow + 1000,
            date_start: 1716220710,
            display_name: 'Volatility 100 (1s) Index',
            entry_spot: 682.58,
            entry_spot_display_value: '682.58',
            entry_tick: 682.58,
            entry_tick_display_value: '682.58',
            entry_tick_time: 1716220711,
            expiry_time: mockedNow + 1000,
            growth_rate: 0.01,
            high_barrier: '683.046',
            id: '917d1b48-305b-a2f4-5b9c-7fb1f2c6c145',
            is_expired: 0,
            is_forward_starting: 0,
            is_intraday: 0,
            is_path_dependent: 1,
            is_settleable: 0,
            is_sold: 0,
            is_valid_to_cancel: 0,
            is_valid_to_sell: 1,
            longcode:
                'After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.04331% from the previous spot price.',
            low_barrier: '682.454',
            profit: 0.84,
            profit_percentage: 9.33,
            purchase_time: 1716220710,
            shortcode: 'ACCU_1HZ100V_9.00_0_0.01_1_0.000433139675_1716220710',
            status: 'open',
            tick_count: 230,
            tick_passed: 9,
            tick_stream: [
                {
                    epoch: 1716220711,
                    tick: 682.58,
                    tick_display_value: '682.58',
                },
                {
                    epoch: 1716220712,
                    tick: 682.71,
                    tick_display_value: '682.71',
                },
                {
                    epoch: 1716220713,
                    tick: 682.5,
                    tick_display_value: '682.50',
                },
                {
                    epoch: 1716220714,
                    tick: 682.57,
                    tick_display_value: '682.57',
                },
                {
                    epoch: 1716220715,
                    tick: 682.57,
                    tick_display_value: '682.57',
                },
                {
                    epoch: 1716220716,
                    tick: 682.75,
                    tick_display_value: '682.75',
                },
                {
                    epoch: 1716220717,
                    tick: 682.87,
                    tick_display_value: '682.87',
                },
                {
                    epoch: 1716220718,
                    tick: 682.74,
                    tick_display_value: '682.74',
                },
                {
                    epoch: 1716220719,
                    tick: 682.75,
                    tick_display_value: '682.75',
                },
                {
                    epoch: 1716220720,
                    tick: 682.72,
                    tick_display_value: '682.72',
                },
            ],
            transaction_ids: {
                buy: 484286658868,
            },
            underlying: '1HZ100V',
        },
        details:
            'After the entry spot tick, your stake will grow continuously by 1% for every tick that the spot price remains within the ± 0.04331% from the previous spot price.',
        display_name: '',
        id: 242807268688,
        indicative: 9.84,
        purchase: 9,
        reference: 484286658868,
        type: 'ACCU',
        profit_loss: 0.84,
        is_valid_to_sell: true,
        current_tick: 9,
        status: 'profit',
        entry_spot: 682.58,
        high_barrier: 683.046,
        low_barrier: 682.454,
    },
] as TPortfolioPosition[];

const buttonLoaderId = 'dt_button_loader';
const symbolName = 'Volatility 100 (1s) Index';

describe('ContractCard', () => {
    const { CANCEL, CLOSE, CLOSED } = getCardLabels();
    const history = createBrowserHistory();
    const mockProps: React.ComponentProps<typeof ContractCard> = {
        contractInfo: openPositions[0].contract_info,
        currency: 'USD',
        hasActionButtons: true,
        isSellRequested: false,
        serverTime: toMoment(mockedNow),
    };
    const mockedContractCard = (props = mockProps) => (
        <Router history={history}>
            <ContractCard {...props} />
        </Router>
    );
    beforeEach(() => {
        history.push('/');
    });
    it('should not render component if contractInfo prop is empty/missing contract_type', () => {
        const { container } = render(mockedContractCard({ ...mockProps, contractInfo: {} }));

        expect(container).toBeEmptyDOMElement();
    });
    it('should render a card for an open Rise position with a Close button only and with remaining time', () => {
        render(mockedContractCard());
        expect(screen.getByText('Rise')).toBeInTheDocument();
        expect(screen.getByText(symbolName)).toBeInTheDocument();
        expect(screen.getByText('9.00 USD')).toBeInTheDocument();
        expect(screen.getByText('00:16:40')).toBeInTheDocument();
        expect(screen.getByText('2.62 USD')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: CLOSE })).toBeEnabled();
        expect(screen.queryByRole('button', { name: CANCEL })).not.toBeInTheDocument();
    });
    it('should render a card for an open Multiplier position with Cancel & Close buttons and with tags for risk management (if it is active) instead of remaining time', () => {
        render(
            mockedContractCard({
                ...mockProps,
                contractInfo: openPositions[1].contract_info,
            })
        );
        expect(screen.getByText('Multipliers Up')).toBeInTheDocument();
        expect(screen.getByText(symbolName)).toBeInTheDocument();
        expect(screen.getByText('9.39 USD')).toBeInTheDocument();
        expect(screen.getByText('TP')).toBeInTheDocument();
        expect(screen.getByText('SL')).toBeInTheDocument();
        expect(screen.getByText('DC')).toBeInTheDocument();
        expect(screen.getByText('0.49 USD')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: CANCEL })).toBeEnabled();
        expect(screen.getByRole('button', { name: CLOSE })).toBeDisabled();
    });
    it('should render specific tag if it is a forward starting contract', () => {
        (isForwardStarting as jest.Mock).mockReturnValueOnce(true);
        (hasForwardContractStarted as jest.Mock).mockReturnValueOnce(false);
        (getStartTime as jest.Mock).mockReturnValueOnce(124525522);

        render(mockedContractCard());

        expect(screen.getByTestId('dt_forward-starting')).toBeInTheDocument();
    });
    it('should render a card for an open Accumulators position with a Close button only and ticks progress', () => {
        render(
            mockedContractCard({
                ...mockProps,
                contractInfo: openPositions[2].contract_info,
            })
        );
        expect(screen.getByText('Accumulators')).toBeInTheDocument();
        expect(screen.getByText(symbolName)).toBeInTheDocument();
        expect(screen.getByText('9.00 USD')).toBeInTheDocument();
        expect(screen.getByText('9/230 ticks')).toBeInTheDocument();
        expect(screen.getByText('0.84 USD')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: CLOSE })).toBeEnabled();
        expect(screen.queryByRole('button', { name: CANCEL })).not.toBeInTheDocument();
    });
    it('should show loader when a Close button is clicked and isSellRequested === true', () => {
        const mockedOnClose = jest.fn();
        const { rerender } = render(
            mockedContractCard({
                ...mockProps,
                contractInfo: openPositions[2].contract_info,
                onClose: mockedOnClose,
            })
        );
        const closeButton = screen.getByRole('button', { name: getCardLabels().CLOSE });
        userEvent.click(closeButton);
        expect(mockedOnClose).toHaveBeenCalledTimes(1);

        rerender(
            mockedContractCard({
                ...mockProps,
                contractInfo: openPositions[2].contract_info,
                isSellRequested: true,
            })
        );
        expect(screen.getByTestId(buttonLoaderId)).toBeInTheDocument();
        expect(closeButton).toBeDisabled();
    });
    it('should show loader when a Cancel button is clicked and isSellRequested === true', () => {
        const mockedOnCancel = jest.fn();
        const { rerender } = render(
            mockedContractCard({
                ...mockProps,
                contractInfo: openPositions[1].contract_info,
                onCancel: mockedOnCancel,
            })
        );
        const cancelButton = screen.getByRole('button', { name: CANCEL });
        userEvent.click(cancelButton);
        expect(mockedOnCancel).toHaveBeenCalledTimes(1);

        rerender(
            mockedContractCard({
                ...mockProps,
                contractInfo: openPositions[1].contract_info,
                isSellRequested: true,
            })
        );
        expect(screen.getByTestId(buttonLoaderId)).toBeInTheDocument();
        expect(cancelButton).toBeDisabled();
    });
    it('should render a card for a closed position with Closed status and with no buttons if hasActionButtons === false', () => {
        render(
            mockedContractCard({
                ...mockProps,
                contractInfo: closedPositions[0].contract_info,
                hasActionButtons: false,
            })
        );
        expect(screen.getByText(CLOSED)).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: CLOSE })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: CANCEL })).not.toBeInTheDocument();
    });
    it('should call onClick when a card is clicked, and should redirect to a correct route if redirectTo is passed', () => {
        const mockedOnClick = jest.fn();
        const redirectTo = getContractPath(Number(closedPositions[0].contract_info.contract_id));
        render(
            mockedContractCard({
                ...mockProps,
                contractInfo: closedPositions[0].contract_info,
                onClick: mockedOnClick,
                redirectTo,
            })
        );
        const card = screen.getByText('Turbos Up');
        userEvent.click(card);
        expect(mockedOnClick).toHaveBeenCalledTimes(1);
        expect(history.location.pathname).toBe(redirectTo);
    });
    it('should call onClick when a card is clicked, but should not redirect anywhere if redirectTo prop is missing', () => {
        const mockedOnClick = jest.fn();
        const redirectTo = getContractPath(Number(closedPositions[0].contract_info.contract_id));
        render(
            mockedContractCard({
                ...mockProps,
                contractInfo: closedPositions[0].contract_info,
                onClick: mockedOnClick,
            })
        );
        const card = screen.getByText('Turbos Up');
        userEvent.click(card);
        expect(mockedOnClick).toHaveBeenCalledTimes(1);
        expect(history.location.pathname).not.toBe(redirectTo);
    });
});
