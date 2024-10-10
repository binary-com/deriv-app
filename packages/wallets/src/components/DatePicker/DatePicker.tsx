import React, { useRef, useState } from 'react';
import { Field, FieldProps } from 'formik';
import Calendar from 'react-calendar';
import { useOnClickOutside } from 'usehooks-ts';
import { LegacyCalendar1pxIcon } from '@deriv/quill-icons';
import { FormatUtils } from '@deriv-com/utils';
import { WalletTextField } from '../Base';
import type { TFormFieldProps } from '../FormField';
import customFormatShortWeekday from './utils';
import 'react-calendar/dist/Calendar.css';
import './DatePicker.scss';

interface TDatePickerProps extends TFormFieldProps {
    displayFormat?: 'DD MMM YYYY' | 'DD-MM-YYYY' | 'MMM DD YYYY' | 'YYYY-MM-DD';
    maxDate?: Date;
    minDate?: Date;
    mobileAlignment?: 'above' | 'below';
}

const DatePicker = ({
    disabled,
    displayFormat = 'YYYY-MM-DD',
    label,
    maxDate,
    message,
    minDate,
    mobileAlignment = 'below',
    name,
}: TDatePickerProps) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [hasTouched, setHasTouched] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const inputDateRef = useRef<HTMLInputElement>(null);

    const toggleCalendar = () => {
        setIsCalendarOpen(prevState => !prevState);
    };

    useOnClickOutside(datePickerRef, () => {
        setIsCalendarOpen(false);
    });

    return (
        <Field name={name}>
            {({ field, form }: FieldProps) => {
                return (
                    <div className='wallets-datepicker' ref={datePickerRef}>
                        <WalletTextField
                            autoComplete='off'
                            defaultValue={
                                field.value
                                    ? FormatUtils.getFormattedDateString(field.value, { format: displayFormat })
                                    : ''
                            }
                            disabled={disabled}
                            errorMessage={hasTouched && form.errors[name] ? form.errors[name] : undefined}
                            inputMode='none'
                            isInvalid={hasTouched && !!form.errors[name]}
                            label={label}
                            message={message}
                            onBlur={() => setHasTouched(true)}
                            onClick={toggleCalendar}
                            onKeyDown={e => e.preventDefault()}
                            ref={inputDateRef}
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
                            value={
                                field.value
                                    ? FormatUtils.getFormattedDateString(field.value, { format: displayFormat })
                                    : ''
                            }
                        />
                        {isCalendarOpen && (
                            <div
                                className={`wallets-datepicker__container wallets-datepicker__container--${mobileAlignment}`}
                                data-testid='wallets_datepicker_container'
                            >
                                <Calendar
                                    formatShortWeekday={customFormatShortWeekday}
                                    inputRef={inputDateRef}
                                    maxDate={maxDate}
                                    minDate={minDate}
                                    onChange={value => {
                                        const calendarSelectedDate = Array.isArray(value) ? value[0] : value;
                                        setIsCalendarOpen(false);
                                        form.setFieldValue(
                                            name,
                                            FormatUtils.getFormattedDateString(calendarSelectedDate as Date, {
                                                format: 'YYYY-MM-DD',
                                            })
                                        );
                                    }}
                                    value={field.value ? FormatUtils.getFormattedDateString(field.value) : ''}
                                />
                            </div>
                        )}
                    </div>
                );
            }}
        </Field>
    );
};

export default DatePicker;
