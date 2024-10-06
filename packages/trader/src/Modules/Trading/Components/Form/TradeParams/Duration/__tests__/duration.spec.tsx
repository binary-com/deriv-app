import React from 'react';
import { screen, render } from '@testing-library/react';
import Duration from '../duration';
import moment from 'moment';
import userEvent from '@testing-library/user-event';

jest.mock('@deriv/components', () => {
    return {
        ...jest.requireActual('@deriv/components'),
        Dropdown: jest.fn(() => 'MockedDropdown'),
    };
});

jest.mock('../advanced-duration.tsx', () => jest.fn(() => 'MockedAdvancedDuration'));
jest.mock('../simple-duration.tsx', () => jest.fn(() => 'MockedSimpleDuration'));
jest.mock('App/Components/Form/RangeSlider', () => jest.fn(() => 'MockedRangeSlider'));

describe('<DurationMobile />', () => {
    let default_props: React.ComponentProps<typeof Duration>;
    const duration_toggle_label_text = 'Toggle between advanced and simple duration settings';
    beforeEach(() => {
        default_props = {
            advanced_duration_unit: '',
            advanced_expiry_type: '',
            contract_type: '',
            duration_t: 5,
            duration_unit: 'd',
            duration_units_list: [
                {
                    text: 'Ticks',
                    value: 't',
                },
                {
                    text: 'Seconds',
                    value: 's',
                },
                {
                    text: 'Minutes',
                    value: 'm',
                },
                {
                    text: 'Hours',
                    value: 'h',
                },
                {
                    text: 'Days',
                    value: 'd',
                },
            ],
            duration: 12,
            expiry_date: '2023-11-22',
            expiry_epoch: 1703057788,
            expiry_time: '21:00:00',
            expiry_type: 'duration',
            getDurationFromUnit: jest.fn(),
            hasDurationUnit: jest.fn(),
            is_advanced_duration: false,
            is_minimized: false,
            max_value: 1000,
            min_value: 10,
            onChange: jest.fn(),
            onChangeMultiple: jest.fn(),
            onChangeUiStore: jest.fn(),
            server_time: moment('2023-11-21T14:30:00'),
            simple_duration_unit: '',
            start_date: 0,
        };
    });
    it('Should render Range slider and simple duration widget if is_advanced_duration is false, duration_unit = t and duration_unit_list is length = 1', () => {
        default_props.duration_units_list = [
            {
                text: 'Ticks',
                value: 't',
            },
        ];
        default_props.duration_unit = 't';
        render(<Duration {...default_props} />);
        expect(screen.getByText(/mockeddropdown/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedrangeslider/i)).toBeInTheDocument();
    });
    it('Should render Duration toggle if contract_type is not vanilla ', () => {
        render(<Duration {...default_props} />);
        expect(screen.getByLabelText(duration_toggle_label_text)).toBeInTheDocument();
    });
    it('Should not render Duration toggle if contract_type is vanilla ', () => {
        default_props.contract_type = 'vanillalongcall';
        render(<Duration {...default_props} />);
        expect(screen.queryByLabelText(duration_toggle_label_text)).not.toBeInTheDocument();
    });
    it('Should render AdvanceDuration widget if is_advanced_duration is true and duration_units_list length is > 1', () => {
        default_props.is_advanced_duration = true;
        render(<Duration {...default_props} />);
        expect(screen.getByText(/mockedadvancedduration/i)).toBeInTheDocument();
    });
    it('Should render SimpleDuration widget if is_advanced_duration is false and duration_units_list length is > 1', () => {
        render(<Duration {...default_props} />);
        expect(screen.getByText(/mockedsimpleduration/i)).toBeInTheDocument();
    });
    it('Should call onChangeUiStore and onChangeMultiple when duration toggle is clicked', () => {
        default_props.is_advanced_duration = true;
        render(<Duration {...default_props} />);
        userEvent.click(screen.getByLabelText(duration_toggle_label_text));
        expect(default_props.onChangeUiStore).toHaveBeenCalled();
        expect(default_props.onChangeMultiple).toHaveBeenCalled();
    });
    it('Should render 12 Days if is_minimized is true and expiry_type is duration', () => {
        const text_to_get = '12 Days';
        default_props.is_minimized = true;
        render(<Duration {...default_props} />);
        expect(screen.getByText(text_to_get)).toBeInTheDocument();
        expect(screen.getByText(text_to_get)).toHaveClass('fieldset-minimized');
        expect(screen.getByText(text_to_get)).toHaveClass('fieldset-minimized__duration');
    });
    it('Should render expiry date and time if is_minimized is true and expiry_type is not duration', () => {
        default_props.expiry_type = 'endtime';
        default_props.is_minimized = true;
        render(<Duration {...default_props} />);
        expect(screen.getByText('Wed - 22 Nov, 2023 21:00:00')).toBeInTheDocument();
    });
});
