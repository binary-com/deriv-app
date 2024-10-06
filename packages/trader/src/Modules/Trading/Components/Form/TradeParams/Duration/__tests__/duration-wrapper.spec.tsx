import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TRADE_TYPES } from '@deriv/shared';
import userEvent from '@testing-library/user-event';
import DurationWrapper from '../duration-wrapper';
import TraderProviders from '../../../../../../../trader-providers';

const duration = 'Duration';
const duration_options = {
    ticks: 'Ticks',
    seconds: 'Seconds',
    minutes: 'Minutes',
    hours: 'Hours',
    days: 'Days',
};
const trading_date_picker = 'TradingDatePicker';
const trading_time_picker = 'TradingTimePicker';

jest.mock('../../../DatePicker', () => jest.fn(() => <div>{trading_date_picker}</div>));
jest.mock('../../../TimePicker', () => jest.fn(() => <div>{trading_time_picker}</div>));

describe('<DurationWrapper />', () => {
    let default_mock_store: ReturnType<typeof mockStore>;
    beforeEach(() => {
        default_mock_store = {
            ...mockStore({}),
            modules: {
                trade: {
                    contract_expiry_type: 'intraday',
                    contract_type: TRADE_TYPES.RISE_FALL,
                    duration: 3,
                    duration_unit: 'm',
                    duration_units_list: [
                        {
                            text: duration_options.ticks,
                            value: 't',
                        },
                        {
                            text: duration_options.seconds,
                            value: 's',
                        },
                        {
                            text: duration_options.minutes,
                            value: 'm',
                        },
                        {
                            text: duration_options.hours,
                            value: 'h',
                        },
                        {
                            text: duration_options.days,
                            value: 'd',
                        },
                    ],
                    duration_min_max: {
                        daily: {
                            min: 86400,
                            max: 31536000,
                        },
                        intraday: {
                            min: 15,
                            max: 86400,
                        },
                        tick: {
                            min: 1,
                            max: 10,
                        },
                    },
                    expiry_type: 'duration',
                    expiry_date: null,
                    expiry_epoch: '',
                    expiry_time: null,
                    onChange: jest.fn(),
                    onChangeMultiple: jest.fn(),
                    start_date: 0,
                    market_close_times: [],
                    market_open_times: [],
                    validation_errors: { duration: [] },
                },
            },
            ui: {
                ...mockStore({}).ui,
                advanced_expiry_type: 'duration',
                advanced_duration_unit: 'm',
                duration_t: 5,
                getDurationFromUnit: jest.fn(() => 3),
                is_advanced_duration: true,
                onChangeUiStore: jest.fn(),
                simple_duration_unit: 't',
            },
        };
    });

    const mockDurationWrapper = () => {
        return (
            <TraderProviders store={default_mock_store}>
                <DurationWrapper />
            </TraderProviders>
        );
    };

    it('should render advanced duration with Duration & End time toggle, and 3 Minutes', () => {
        render(mockDurationWrapper());

        expect(screen.getByText(duration)).toBeInTheDocument();
        expect(screen.getByText('End time')).toBeInTheDocument();
        expect(screen.getByDisplayValue(/3/i)).toBeInTheDocument();
        expect(screen.getByText(duration_options.minutes)).toBeInTheDocument();
        expect(screen.getByText(/Range: 1 - 1,440 minute/i)).toBeInTheDocument();
    });
    it('should render 15 Seconds duration', () => {
        default_mock_store.modules.trade.duration = 15;
        default_mock_store.modules.trade.duration_unit = 's';
        default_mock_store.ui.advanced_duration_unit = 's';
        default_mock_store.ui.getDurationFromUnit = jest.fn(() => 15);
        render(mockDurationWrapper());

        expect(screen.getByText(duration_options.seconds)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/15/i)).toBeInTheDocument();
        expect(screen.getByText(/Range: 15 - 86,400 seconds/i)).toBeInTheDocument();
    });
    it('should execute onChange & onChangeUiStore when a user is typing a new value', () => {
        default_mock_store.modules.trade.duration = 2;
        default_mock_store.ui.getDurationFromUnit = jest.fn(() => 2);
        render(mockDurationWrapper());

        const duration_input = screen.getByDisplayValue(/2/i);
        userEvent.type(duration_input, '5');

        expect(default_mock_store.modules.trade.onChange).toHaveBeenCalledWith({
            target: { name: 'duration', value: 25 },
        });
        expect(default_mock_store.ui.onChangeUiStore).toHaveBeenCalledWith({ name: 'duration_m', value: 25 });
        expect(default_mock_store.modules.trade.onChangeMultiple).toHaveBeenCalledTimes(0);
    });
    it('should render simple duration with Ticks & Minutes toggle, and 3 Minutes', () => {
        default_mock_store.ui.is_advanced_duration = false;
        default_mock_store.ui.simple_duration_unit = 'm';
        render(mockDurationWrapper());

        expect(screen.getByText(duration_options.ticks)).toBeInTheDocument();
        expect(screen.getByText(duration_options.minutes)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/3/i)).toBeInTheDocument();
        expect(screen.getByText(/Range: 1 - 1,440 minute/i)).toBeInTheDocument();
    });
    it('should render advanced Duration & End time toggle with date & time pickers when expiry_type is endtime', () => {
        default_mock_store.modules.trade.expiry_type = 'endtime';
        render(mockDurationWrapper());

        expect(screen.getByText(duration)).toBeInTheDocument();
        expect(screen.getByText(/End time/i)).toBeInTheDocument();
        expect(screen.getByText(trading_date_picker)).toBeInTheDocument();
        expect(screen.getByText(trading_time_picker)).toBeInTheDocument();
    });
    it('should render simple Duration & End time toggle with date & time pickers when expiry_type is intraday', () => {
        default_mock_store.ui.is_advanced_duration = false;
        default_mock_store.modules.trade.expiry_type = 'intraday';
        render(mockDurationWrapper());

        expect(screen.getByText(duration_options.ticks)).toBeInTheDocument();
        expect(screen.getByText(duration_options.minutes)).toBeInTheDocument();
        expect(screen.queryByText(trading_date_picker)).not.toBeInTheDocument();
        expect(screen.queryByText(trading_time_picker)).not.toBeInTheDocument();
    });
});
