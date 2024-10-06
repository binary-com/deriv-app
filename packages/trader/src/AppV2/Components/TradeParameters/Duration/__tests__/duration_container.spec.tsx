import React from 'react';
import { render, screen } from '@testing-library/react';
import DurationActionSheetContainer from '../container';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../../../../../trader-providers';
import userEvent from '@testing-library/user-event';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

global.ResizeObserver = ResizeObserver;
global.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    LabelPairedCalendarSmBoldIcon: jest.fn(({ onClick }) => (
        <button onClick={onClick}>LabelPairedCalendarSmBoldIcon</button>
    )),
}));

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    DatePicker: jest.fn(({ onChange }) => (
        <div>
            <button
                onClick={() => {
                    const mockDate = new Date(2023, 8, 10);
                    onChange(mockDate);
                }}
            >
                Date Picker
            </button>
        </div>
    )),
}));

describe('DurationActionSheetContainer', () => {
    let default_trade_store: TCoreStores;

    beforeEach(() => {
        default_trade_store = mockStore({
            modules: {
                trade: {
                    duration: 30,
                    duration_unit: 'm',
                    duration_units_list: ['t', 'm', 'h', 'd'],
                    onChangeMultiple: jest.fn(),
                    expiry_time: null,
                    contract_type: 'call',
                },
            },
        });
    });

    const renderDurationContainer = (
        mocked_store: TCoreStores,
        unit = 'm',
        setUnit = jest.fn(),
        hours = {
            selected_hour: [0, 0],
            setSelectedHour: jest.fn(),
        }
    ) => {
        render(
            <TraderProviders store={mocked_store}>
                <DurationActionSheetContainer {...hours} unit={unit} setUnit={setUnit} />
            </TraderProviders>
        );
    };

    it('should render the DurationActionSheetContainer with default values', () => {
        renderDurationContainer(default_trade_store);
        expect(screen.getByText('Duration')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should select duration in hours if duration is more than 59 minutes', () => {
        default_trade_store.modules.trade.duration = 130;
        renderDurationContainer(default_trade_store, 'h');

        const duration_chip = screen.getByText('1 h');
        userEvent.click(duration_chip);

        expect(default_trade_store.modules.trade.onChangeMultiple).not.toHaveBeenCalled();
    });

    it('should call onChangeMultiple with correct data with hours', () => {
        default_trade_store.modules.trade.duration = 130;
        renderDurationContainer(default_trade_store, 'm', jest.fn(), {
            selected_hour: [2, 10],
            setSelectedHour: jest.fn(),
        });

        userEvent.click(screen.getByText('Save'));

        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            duration_unit: 'm',
            duration: 1,
            expiry_time: null,
            expiry_type: 'duration',
        });
    });

    it('should call onChangeMultiple with correct data with ticks', () => {
        default_trade_store.modules.trade.duration = 5;

        renderDurationContainer(default_trade_store, 't');

        userEvent.click(screen.getByText('Save'));

        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            duration_unit: 't',
            duration: 5,
            expiry_time: null,
            expiry_type: 'duration',
        });
    });

    it('should call onChangeMultiple with correct data with seconds', () => {
        default_trade_store.modules.trade.duration = 20;

        renderDurationContainer(default_trade_store, 's');
        userEvent.click(screen.getByText('22 sec'));
        userEvent.click(screen.getByText('Save'));

        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            duration_unit: 's',
            duration: 20,
            expiry_time: null,
            expiry_type: 'duration',
        });
    });

    it('should call onChangeMultiple with correct data with hour', () => {
        default_trade_store.modules.trade.duration = 4;

        renderDurationContainer(default_trade_store, 'h');
        userEvent.click(screen.getByText('4 h'));
        userEvent.click(screen.getByText('Save'));

        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            duration_unit: 'm',
            duration: 60,
            expiry_time: null,
            expiry_type: 'duration',
        });
    });

    it('should show Expiry Date when days are selected', () => {
        renderDurationContainer(default_trade_store, 'd');
        expect(screen.getByText('Expiry')).toBeInTheDocument();
    });

    it('should open datepicker on clicking on calendar icon in the days wheelpicker', () => {
        default_trade_store.modules.trade.duration = 34;
        renderDurationContainer(default_trade_store, 'd');
        expect(screen.getByText('LabelPairedCalendarSmBoldIcon')).toBeInTheDocument();
        userEvent.click(screen.getByText('LabelPairedCalendarSmBoldIcon'));
        expect(screen.getByText('Pick an end date')).toBeInTheDocument();
    });

    it('should select value when clicked on any date on datepicker', () => {
        default_trade_store.modules.trade.duration = 2;
        renderDurationContainer(default_trade_store, 'd');
        expect(screen.getByText('LabelPairedCalendarSmBoldIcon')).toBeInTheDocument();
        userEvent.click(screen.getByText('LabelPairedCalendarSmBoldIcon'));
        expect(screen.getByText('Date Picker')).toBeInTheDocument();
        userEvent.click(screen.getByText('Save'));
        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            duration: 2,
            duration_unit: 'd',
            expiry_time: null,
            expiry_type: 'duration',
        });
    });

    it('should show Current Time when End time is selected', () => {
        default_trade_store.modules.trade.expiry_time = '16:30';
        renderDurationContainer(default_trade_store, 'et');
        expect(screen.getByText('Current time')).toBeInTheDocument();
    });

    it('should handle expiry time selection for end time ("et")', () => {
        renderDurationContainer(default_trade_store, 'et');
        const end_time_chip = screen.getByText('End Time');
        userEvent.click(end_time_chip);
        userEvent.click(screen.getByText('Save'));
        expect(default_trade_store.modules.trade.onChangeMultiple).toHaveBeenCalledWith({
            expiry_time: expect.any(String),
            expiry_type: 'endtime',
        });
    });
    it('should not render chips if duration_units_list contains only ticks', () => {
        default_trade_store.modules.trade.duration = 1;
        default_trade_store.modules.trade.duration_unit = 't';
        default_trade_store.modules.trade.duration_units_list = [{ value: 't' }];
        renderDurationContainer(default_trade_store);

        const chip_names = ['Ticks', 'Seconds', 'Minutes', 'Hours', 'Days', 'End Time'];
        chip_names.forEach(name => expect(screen.queryByText(name)).not.toBeInTheDocument());
    });
});
