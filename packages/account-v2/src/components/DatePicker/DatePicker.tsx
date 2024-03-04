import React, { ComponentProps, useEffect, useRef, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { useOnClickOutside } from 'usehooks-ts';
import { Input } from '@deriv-com/ui';
import CalendarIcon from '../../assets/date-picker/ic-calendar.svg';
import unixToDateString from './utils';
import 'react-calendar/dist/Calendar.css';
import './DatePicker.scss';

interface TDatePickerProps extends ComponentProps<typeof Input> {
    errorMessage?: string;
    isInvalid?: boolean;
    maxDate?: Date;
    minDate: Date;
    mobileAlignment?: 'above' | 'below';
    onDateChange: (formattedDate: string | null) => void;
    value: string;
}

function customFormatShortWeekday(_locale: string | undefined, date: Date) {
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return weekdays[date.getDay()];
}

// TODO: Move this component to @deriv-com/ui
const DatePicker = ({
    disabled,
    errorMessage,
    isInvalid,
    label,
    maxDate,
    minDate,
    mobileAlignment = 'below',
    onBlur,
    onChange,
    onDateChange,
    ...props
}: TDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(props.value ? new Date(props.value ?? '') : null);
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const toggleCalendar = () => {
        setIsCalendarOpen(prevState => !prevState);
    };

    useOnClickOutside(datePickerRef, () => {
        setIsCalendarOpen(false);
    });

    const handleDateChange: CalendarProps['onChange'] = value => {
        const calendarSelectedDate = Array.isArray(value) ? value[0] : value;
        setSelectedDate(new Date(calendarSelectedDate?.toString() ?? ''));
        setIsCalendarOpen(false);
    };

    useEffect(() => {
        if (selectedDate !== null) {
            onDateChange(unixToDateString(selectedDate));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    return (
        <div className='datepicker' ref={datePickerRef}>
            <Input
                {...props}
                error={isInvalid}
                label={label}
                message={isInvalid ? errorMessage?.toString() : ''}
                onBlur={onBlur}
                onChange={onChange}
                onClick={toggleCalendar}
                rightPlaceholder={
                    <button
                        className='datepicker__button'
                        data-testid='dt_datepicker_button'
                        disabled={disabled}
                        onClick={toggleCalendar}
                        type='button'
                    >
                        <CalendarIcon />
                    </button>
                }
                value={selectedDate ? unixToDateString(selectedDate) : ''}
                wrapperClassName='w-full'
            />
            {isCalendarOpen && (
                <div
                    className={`datepicker__container datepicker__container--${mobileAlignment}`}
                    data-testid='dt_datepicker_container'
                >
                    <Calendar
                        formatShortWeekday={customFormatShortWeekday}
                        maxDate={maxDate}
                        minDate={minDate}
                        onChange={handleDateChange}
                        value={selectedDate ?? ''}
                    />
                </div>
            )}
        </div>
    );
};

export default DatePicker;
