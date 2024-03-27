import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useDevice } from '@deriv/hooks';
import { mockStore } from '@deriv/stores';
import { TRADE_TYPES } from '@deriv/shared';
import TraderProviders from '../../../../../../trader-providers';
import Strike from '../strike';
import userEvent from '@testing-library/user-event';

const mocked_store = {
    modules: {
        trade: {
            barrier_1: '1',
            barrier_choices: ['16', '33', '40'],
            duration_unit: 'm',
            onChange: jest.fn(),
            validation_errors: {},
            expiry_type: 'endtime',
            expiry_date: null,
            vanilla_trade_type: TRADE_TYPES.VANILLA.CALL,
        },
    },
};
const mocked_trade = mocked_store.modules.trade;
const mocked_strike_param_modal = 'Mocked Strike Param Modal Component';
const strike_price = 'Strike price';
const strike_prices = 'Strike Prices';
const spot = 'Spot';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));
jest.mock('Modules/Trading/Containers/strike-param-modal', () => jest.fn(() => <div>{mocked_strike_param_modal}</div>));

describe('<Strike />', () => {
    const mockStrike = (store: typeof mocked_store) => {
        return (
            <TraderProviders store={mockStore(store)}>
                <Strike />
            </TraderProviders>
        );
    };

    it('should render Strike component with default props', () => {
        render(mockStrike(mocked_store));

        expect(screen.getByText(strike_price)).toBeInTheDocument();
    });

    it('should not allow to change strike manually', () => {
        render(mockStrike(mocked_store));

        const inputField: HTMLInputElement = screen.getByTestId('dt_strike_input');
        expect(inputField.value).toBe('1');

        fireEvent.change(inputField, { target: { value: '2400.00' } });

        expect(inputField.value).toBe('1');
    });

    it('should display Spot for minutes correctly', () => {
        mocked_trade.duration_unit = 'm';
        mocked_trade.expiry_type = 'duration';

        render(mockStrike(mocked_store));

        expect(screen.getByText(spot)).toBeInTheDocument();
    });

    it('should display Spot for hours correctly', () => {
        mocked_trade.duration_unit = 'h';

        render(mockStrike(mocked_store));

        expect(screen.getByText(spot)).toBeInTheDocument();
    });

    it('should not display Spot for days', () => {
        mocked_trade.duration_unit = 'd';
        mocked_trade.expiry_type = 'endtime';

        render(mockStrike(mocked_store));

        expect(screen.queryByText(spot)).not.toBeInTheDocument();
    });

    it('should open and close BarriersList on input click', async () => {
        render(mockStrike(mocked_store));

        userEvent.click(screen.getByRole('textbox'));

        await waitFor(() => {
            expect(screen.getByText(strike_prices)).toBeInTheDocument();
        });

        userEvent.click(screen.getByTestId('dt_trade-container__barriers-table__icon_close'));

        await waitFor(() => {
            expect(screen.queryByText(strike_prices)).not.toBeInTheDocument();
        });
    });

    it('should render a proper children components if it is mobile', () => {
        mocked_trade.duration_unit = 'm';
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });

        render(mockStrike(mocked_store));

        expect(screen.getByText(spot)).toBeInTheDocument();
        expect(screen.getByText(strike_price)).toBeInTheDocument();
        expect(screen.getByText(mocked_strike_param_modal)).toBeInTheDocument();
    });

    it('should not render Spot components if it duration_unit is equal to "d" in mobile', () => {
        mocked_trade.duration_unit = 'd';
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });

        render(mockStrike(mocked_store));

        expect(screen.queryByText(spot)).not.toBeInTheDocument();
        expect(screen.getByText(strike_price)).toBeInTheDocument();
        expect(screen.getByText(mocked_strike_param_modal)).toBeInTheDocument();
    });
});
