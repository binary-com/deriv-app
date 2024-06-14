import React from 'react';
import moment from 'moment';
import Loadable from 'react-loadable';
import { DesktopWrapper, InputField, MobileOrTabletWrapper, useOnClickOutside } from '@deriv/components';
import { daysFromTodayTo, toMoment } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize } from 'Components/i18next';
import CalendarIcon from './calendar-icon';
import CalendarSideList from './calendar-side-list';
import CompositeCalendarMobile from './composite-calendar-mobile';

export type TInputDateRange = {
    value?: string;
    label?: string;
    duration?: number;
};

type TCompositeCalendarProps = {
    input_date_range: TInputDateRange;
    onChange: (values: { to?: moment.Moment; from?: moment.Moment; is_batch?: boolean }) => void;
    to: number;
    from: number;
};

const TwoMonthPickerLoadable = Loadable({
    loader: () => import(/* webpackChunkName: "two-month-picker" */ './two-month-picker'),
    loading: () => null,
    render(loaded, props) {
        const Component = loaded.default;
        return <Component {...props} />;
    },
});

type TDateFieldComponentProps = {
    label: string;
    placeholder: string;
    showCalendar: (e: string) => void;
    value: string;
};

const DateFieldComponent = ({ label, placeholder, showCalendar, value }: TDateFieldComponentProps) => {
    const { ui } = useStore();
    const { current_focus, setCurrentFocus } = ui;

    return (
        <InputField
            current_focus={current_focus}
            data_testid={`dt_calendar_input_${label}`}
            icon={CalendarIcon}
            is_read_only
            name={`${label}_date`}
            onClick={() => showCalendar(label)}
            placeholder={placeholder}
            setCurrentFocus={setCurrentFocus}
            value={value}
        />
    );
};

const CompositeCalendar = (props: TCompositeCalendarProps) => {
    const { ui } = useStore();
    const { current_focus, setCurrentFocus } = ui;
    const { from, to, onChange } = props;

    const days_duration_list = [
        {
            value: 'all_time',
            label: localize('All time'),
            duration: 0,
        },
        {
            value: 'today',
            label: localize('Today'),
            duration: 1,
        },
        {
            value: 'last_7_days',
            label: localize('Last 7 days'),
            duration: 7,
        },
        {
            value: 'last_30_days',
            label: localize('Last 30 days'),
            duration: 30,
        },
        {
            value: 'last_60_days',
            label: localize('Last 60 days'),
            duration: 60,
        },
        {
            value: 'last_quarter',
            label: localize('Last quarter'),
            duration: 90,
        },
    ];

    const [show_to, setShowTo] = React.useState(false);
    const [show_from, setShowFrom] = React.useState(false);

    const wrapper_ref = React.useRef<HTMLInputElement>(null);

    const validateClickOutside = (event: MouseEvent) => !wrapper_ref.current?.contains(event.target as Node);

    const calculateFrom = (new_from: number) =>
        new_from === 1 ? toMoment().startOf('day') : toMoment().startOf('day').subtract(new_from, 'day').add(1, 's');

    const selectDateRange = (new_from?: number) => {
        hideCalendar();
        onChange({
            from: new_from ? calculateFrom(new_from) : undefined,
            to: toMoment().endOf('day'),
            is_batch: true,
        });
    };

    /**
     * The below function is used to generate the labe for the "To" date input field.
     * Checks if the difference between the current date and the date in the "To" field is 0, which means label will be Today.
     * If the difference is not zero, formats the date in the format MMM, DD YYYY.
     * @returns {string}
     */
    const getToDateLabel = () => {
        const date = toMoment(to);
        return daysFromTodayTo(date) === 0 ? localize('Today') : date.format('MMM, DD YYYY');
    };

    /**
     * The below function is used to generate the labe for the "From" date input field.
     * It formats the date in the format MMM, DD YYYY.
     * @returns {string}
     */
    const getFromDateLabel = () => {
        const date = toMoment(from);
        return from ? date.format('MMM, DD YYYY') : '';
    };

    const hideCalendar = () => {
        setShowFrom(false);
        setShowTo(false);
    };

    const showCalendar = (label: string) => {
        if (label === 'from') {
            setShowFrom(true);
        }
        if (label === 'to') {
            setShowTo(true);
        }
    };

    useOnClickOutside(
        wrapper_ref,
        (event: MouseEvent) => {
            event?.stopPropagation();
            event?.preventDefault();
            hideCalendar();
        },
        validateClickOutside
    );

    const setFromToDate = (date: moment.Moment, label: string) => {
        if (label === 'to') {
            onChange({ to: toMoment(date).endOf('day') });
        } else {
            onChange({ from: toMoment(date) });
        }

        hideCalendar();
    };

    /**
     * The below function is used to determine whether a given date should be disalbed or not(either from or to) based on the current from and to date.
     * @returns {boolean}
     */
    const getIsPeriodDisabled = (date: moment.Moment, label: string) => {
        if (label === 'from') {
            return date.unix() > to;
        }
        return date.unix() < from || date.unix() > toMoment().endOf('day').unix();
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='composite-calendar__input-fields'>
                    <DateFieldComponent
                        label='from'
                        showCalendar={showCalendar}
                        placeholder={localize('Date from')}
                        value={getFromDateLabel()}
                    />
                    <DateFieldComponent
                        label='to'
                        showCalendar={showCalendar}
                        placeholder={localize('Date to')}
                        value={getToDateLabel()}
                    />
                </div>
                {(show_to || show_from) && (
                    <div className='composite-calendar' ref={wrapper_ref}>
                        <CalendarSideList
                            from={from}
                            to={to}
                            items={days_duration_list}
                            onClickItem={selectDateRange}
                        />
                        <TwoMonthPickerLoadable
                            value={show_to ? to : from}
                            onChange={date => setFromToDate(date, show_to ? 'to' : 'from')}
                            getIsPeriodDisabled={date => getIsPeriodDisabled(date, show_to ? 'to' : 'from')}
                        />
                    </div>
                )}
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <CompositeCalendarMobile
                    duration_list={days_duration_list}
                    current_focus={current_focus}
                    setCurrentFocus={setCurrentFocus}
                    {...props}
                />
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
};

export default React.memo(observer(CompositeCalendar));
