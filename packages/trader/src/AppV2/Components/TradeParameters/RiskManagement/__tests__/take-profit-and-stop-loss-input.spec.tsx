import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import * as utils from 'AppV2/Utils/trade-params-utils';
import TraderProviders from '../../../../../trader-providers';
import TakeProfitAndStopLossInput from '../take-profit-and-stop-loss-input';

const tp_data_testid = 'dt_tp_input';
const sl_data_testid = 'dt_sl_input';
const accu_content = 'Note: Cannot be adjusted for ongoing accumulator contracts.';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    WS: {
        send: jest.fn(),
        authorized: {
            send: jest.fn(),
        },
    },
}));
jest.mock('AppV2/Hooks/useDtraderQuery', () => ({
    ...jest.requireActual('AppV2/Hooks/useDtraderQuery'),
    useDtraderQuery: jest.fn(() => ({
        data: {
            proposal: {},
            echo_req: { contract_type: 'TURBOSLONG' },
            error: {},
        },
    })),
}));

describe('TakeProfitAndStopLossInput', () => {
    let default_mock_store: ReturnType<typeof mockStore>,
        default_props: React.ComponentProps<typeof TakeProfitAndStopLossInput>;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    ...mockStore({}).modules.trade,
                    currency: 'USD',
                    validation_params: {
                        TURBOSLONG: { take_profit: { min: '0.1', max: '100' }, stop_loss: { min: '0.1', max: '10' } },
                    },
                    contract_type: 'turboslong',
                    trade_types: { TURBOSLONG: 'Turbos Long' },
                    trade_type_tab: 'TURBOSLONG',
                },
            },
        });
        default_props = { onActionSheetClose: jest.fn() };
    });

    afterEach(() => jest.clearAllMocks());

    const mockTakeProfitAndStopLossInput = () =>
        render(
            <TraderProviders store={default_mock_store}>
                <ModulesProvider store={default_mock_store}>
                    <TakeProfitAndStopLossInput {...default_props} />
                </ModulesProvider>
            </TraderProviders>
        );

    it('should render component with correct data for take_profit type', () => {
        mockTakeProfitAndStopLossInput();

        expect(screen.getByText('Take profit')).toBeInTheDocument();
        expect(screen.getByTestId(tp_data_testid)).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.queryByText(accu_content)).not.toBeInTheDocument();
    });

    it('should render component with correct data for stop_loss type', () => {
        default_props.type = 'stop_loss';
        mockTakeProfitAndStopLossInput();

        expect(screen.getByText('Stop loss')).toBeInTheDocument();
        expect(screen.getByTestId(sl_data_testid)).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.queryByText(accu_content)).not.toBeInTheDocument();
    });

    it('should render specific text content for cases with is_accumulator  === true', () => {
        default_mock_store.modules.trade.is_accumulator = true;
        mockTakeProfitAndStopLossInput();

        expect(screen.getByText(accu_content)).toBeInTheDocument();
    });

    it('should call focusAndOpenKeyboard, when ToggleSwitch is switched to true.', () => {
        const mockFocusAndOpenKeyboard = jest.spyOn(utils, 'focusAndOpenKeyboard');
        mockTakeProfitAndStopLossInput();

        const toggle_switcher = screen.getAllByRole('button')[0];
        userEvent.click(toggle_switcher);
        expect(mockFocusAndOpenKeyboard).toBeCalledTimes(1);
    });

    it('should call focusAndOpenKeyboard, when user clicks on Take Profit overlay.', () => {
        const mockFocusAndOpenKeyboard = jest.spyOn(utils, 'focusAndOpenKeyboard');
        mockTakeProfitAndStopLossInput();

        const take_profit_overlay = screen.getByTestId('dt_take_profit_overlay');
        userEvent.click(take_profit_overlay);

        expect(mockFocusAndOpenKeyboard).toBeCalledTimes(1);
    });

    it('should render take profit overlay if ToggleSwitch was switched to false', () => {
        default_mock_store.modules.trade.has_take_profit = true;
        default_mock_store.modules.trade.take_profit = '5';
        mockTakeProfitAndStopLossInput();

        expect(screen.queryByTestId('dt_take_profit_overlay')).not.toBeInTheDocument();
        const toggle_switcher = screen.getAllByRole('button')[0];
        userEvent.click(toggle_switcher);

        expect(screen.getByTestId('dt_take_profit_overlay')).toBeInTheDocument();
    });

    it('should call onChangeMultiple when user click on Save button, if there are no API errors', () => {
        default_mock_store.modules.trade.has_take_profit = true;
        default_mock_store.modules.trade.take_profit = '5';
        mockTakeProfitAndStopLossInput();

        userEvent.type(screen.getByTestId(tp_data_testid), '2');
        const save_button = screen.getByText('Save');
        userEvent.click(save_button);

        expect(default_mock_store.modules.trade.onChangeMultiple).toBeCalled();
    });
});
