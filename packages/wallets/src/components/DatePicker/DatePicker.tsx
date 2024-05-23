import React, { useEffect, useRef, useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import { useOnClickOutside } from 'usehooks-ts';
import { LegacyCalendar1pxIcon } from '@deriv/quill-icons';
import unixToDateString from '../../utils/utils';
import FlowTextField, { TFlowFieldProps } from '../FlowField/FlowTextField';
import customFormatShortWeekday from './utils';
import 'react-calendar/dist/Calendar.css';
import './DatePicker.scss';

interface TDatePickerProps extends TFlowFieldProps {
    maxDate?: Date;
    minDate?: Date;
    mobileAlignment?: 'above' | 'below';
    onDateChange: (formattedDate: string | null) => void;
}

const DatePicker = ({
    defaultValue,
    disabled,
    label,
    maxDate,
    message,
    minDate,
    mobileAlignment = 'below',
    name,
    onDateChange,
    validationSchema,
}: TDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue ? new Date(defaultValue) : null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const inputeDateRef = useRef<HTMLInputElement>(null);

    const toggleCalendar = () => {
        setIsCalendarOpen(prevState => !prevState);
    };

    useOnClickOutside(datePickerRef, () => {
        setIsCalendarOpen(false);
    });

    const handleDateChange: CalendarProps['onChange'] = value => {
        const calendarSelectedDate = Array.isArray(value) ? value[0] : value;
        setSelectedDate(calendarSelectedDate);
        setIsCalendarOpen(false);
    };

    useEffect(() => {
        if (selectedDate !== null) {
            onDateChange(unixToDateString(selectedDate));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    return (
        <div className='wallets-datepicker' ref={datePickerRef}>
            <FlowTextField
                disabled={disabled}
                inputMode='none'
                label={label}
                message={message}
                name={name}
                onClick={toggleCalendar}
                onKeyDown={e => e.preventDefault()}
                ref={inputeDateRef}
                renderRightIcon={() => (
                    <button
                        className='wallets-datepicker__button'
                        data-testid='wallets_datepicker_button'
                        disabled={disabled}
                        onClick={toggleCalendar}
                    >
                        <LegacyCalendar1pxIcon iconSize='xs' />
                    </button>
                )}
                showMessage
                type='text'
                validationSchema={validationSchema}
                value={selectedDate !== null ? unixToDateString(selectedDate) : ''}
            />
            {isCalendarOpen && (
                <div
                    className={`wallets-datepicker__container wallets-datepicker__container--${mobileAlignment}`}
                    data-testid='wallets_datepicker_container'
                >
                    <Calendar
                        formatShortWeekday={customFormatShortWeekday}
                        inputRef={inputeDateRef}
                        maxDate={maxDate}
                        minDate={minDate}
                        onChange={handleDateChange}
                        value={selectedDate !== null ? selectedDate : ''}
                    />
                </div>
            )}
        </div>
    );
};

export default DatePicker;
