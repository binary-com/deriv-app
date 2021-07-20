import PropTypes from 'prop-types';
import React from 'react';
import { addDays, daysFromTodayTo, toMoment, convertDateFormat, getPosition, isMobile } from '@deriv/shared';

import Input from './date-picker-input.jsx';
import Calendar from './date-picker-calendar.jsx';
import Native from './date-picker-native.jsx';
import MobileWrapper from '../mobile-wrapper';
import DesktopWrapper from '../desktop-wrapper';
import { useOnClickOutside } from '../../hooks/use-onclickoutside';

const DatePicker = React.memo(props => {
    const {
        date_format,
        disabled,
        display_format,
        error,
        footer,
        id,
        label,
        has_range_selection,
        mode,
        max_date,
        min_date,
        start_date,
        name,
        onBlur,
        onChange,
        onFocus,
        portal_id,
        placeholder,
        required,
        type,
        value,
        ...other_props
    } = props;

    const datepicker_ref = React.useRef();
    const calendar_ref = React.useRef();
    const calendar_el_ref = React.useRef();
    const [placement, setPlacement] = React.useState('');
    const [style, setStyle] = React.useState({});
    const [date, setDate] = React.useState(value ? toMoment(value).format(display_format) : '');
    const [duration, setDuration] = React.useState(daysFromTodayTo(value));
    const [is_datepicker_visible, setIsDatepickerVisible] = React.useState(false);
    const [is_placeholder_visible, setIsPlaceholderVisible] = React.useState(placeholder && !value);

    useOnClickOutside(
        datepicker_ref,
        () => {
            if (is_datepicker_visible) setIsDatepickerVisible(false);
        },
        e => !calendar_el_ref.current?.contains(e.target)
    );

    React.useEffect(() => {
        if (is_datepicker_visible && datepicker_ref.current && calendar_el_ref.current && portal_id) {
            const position_style = getPosition({
                preferred_alignment: 'bottom',
                parent_el: datepicker_ref.current,
                child_el: calendar_el_ref.current,
                should_consider_parent_height: false,
            });
            setStyle(position_style.style);
            setPlacement(position_style.placement);
        }
    }, [is_datepicker_visible, portal_id]);

    React.useEffect(() => {
        if (value) setDate(toMoment(value).format(display_format));
    }, [value, display_format, setDate]);

    React.useEffect(() => {
        if (duration !== value) {
            setDuration(daysFromTodayTo(value));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleVisibility = () => {
        setIsDatepickerVisible(!is_datepicker_visible);
    };

    const onHover = hovered_date => {
        if (typeof onChange === 'function') {
            onChange({
                date: toMoment(hovered_date).format(display_format),
                duration: mode === 'duration' ? daysFromTodayTo(hovered_date) : null,
            });
        }
    };

    const onSelectCalendar = (selected_date, is_visible = true) => {
        const new_date = toMoment(selected_date).format(display_format);
        const new_duration = mode === 'duration' ? daysFromTodayTo(selected_date) : null;

        setDate(new_date);
        setDuration(new_duration);
        setIsDatepickerVisible(is_visible);
        setIsPlaceholderVisible(false);

        if (typeof onChange === 'function') {
            onChange({
                date: new_date,
                duration: new_duration,
                target: {
                    name,
                    value: getTargetValue(new_date, new_duration),
                },
            });
        }
    };

    const onSelectCalendarNative = selected_date => {
        const new_date = selected_date ? toMoment(selected_date).format(display_format) : null;

        setDate(new_date);

        if (typeof onChange === 'function') {
            onChange({
                target: {
                    name,
                    value: getTargetValue(new_date, duration),
                },
            });
        }
    };

    /**
     * TODO: currently only works for duration, make it works for date as well
     */
    const onChangeInput = e => {
        const new_date = addDays(toMoment(), e.target.value).format(display_format);
        const new_duration = mode === 'duration' ? e.target.value : '';

        setDate(new_date);
        setDuration(new_duration);
        setIsDatepickerVisible(true);
        setIsPlaceholderVisible(false);

        calendar_ref.current?.setSelectedDate(new_date);

        if (typeof onChange === 'function') {
            onChange({
                date: new_date,
                duration: new_duration,
                target: {
                    name,
                    value: getTargetValue(new_date, new_duration),
                },
            });
        }
    };

    /**
     * TODO: handle datepicker input clear
     */
    // onClickClear = () => {};

    const getTargetValue = (new_date, new_duration) => {
        const calendar_value = getCalendarValue(new_date) && toMoment(getCalendarValue(new_date));
        return mode === 'duration' ? new_duration : calendar_value;
    };

    const getInputValue = () => (mode === 'duration' ? duration : date);

    const getCalendarValue = new_date => {
        if (!new_date) return isMobile() ? null : toMoment(start_date || max_date).format(date_format);
        return convertDateFormat(new_date, display_format, date_format);
    };

    const common_props = {
        date_format,
        display_format,
        error,
        footer,
        label,
        has_range_selection,
        mode,
        max_date,
        min_date,
        onChange,
        portal_id,
        placeholder,
        ...other_props,
    };

    return (
        <React.Fragment>
            <MobileWrapper>
                <Native
                    id={id}
                    name={name}
                    display_format={display_format}
                    error={error}
                    label={label}
                    max_date={max_date}
                    min_date={min_date}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onSelect={onSelectCalendarNative}
                    placeholder={placeholder}
                    value={getCalendarValue(date)} // native picker accepts date format yyyy-mm-dd
                    disabled={disabled}
                />
            </MobileWrapper>
            <DesktopWrapper>
                <div id={id} className='dc-datepicker' data-value={getInputValue()}>
                    <div ref={datepicker_ref}>
                        <Input
                            {...common_props}
                            disabled={disabled}
                            name={name}
                            onClick={handleVisibility}
                            onChangeInput={onChangeInput}
                            // onClickClear={this.onClickClear}
                            is_placeholder_visible={is_placeholder_visible}
                            onBlur={onBlur}
                            required={required}
                            type={type}
                            value={getInputValue()}
                        />
                        <Calendar
                            ref={calendar_ref}
                            calendar_el_ref={calendar_el_ref}
                            parent_ref={datepicker_ref}
                            date_format={date_format}
                            is_datepicker_visible={is_datepicker_visible}
                            onHover={has_range_selection ? onHover : undefined}
                            onSelect={onSelectCalendar}
                            placement={placement}
                            style={style}
                            value={getCalendarValue(date)} // Calendar accepts date format yyyy-mm-dd
                            {...common_props}
                        />
                    </div>
                </div>
            </DesktopWrapper>
        </React.Fragment>
    );
});

DatePicker.defaultProps = {
    alignment: 'bottom',
    date_format: 'YYYY-MM-DD',
    mode: 'date',
    display_format: 'DD MMM YYYY',
    keep_open: false,
};

DatePicker.propTypes = {
    error_messages: PropTypes.array,
    label: PropTypes.string,
    is_alignment_top: PropTypes.bool,
};

export default DatePicker;
