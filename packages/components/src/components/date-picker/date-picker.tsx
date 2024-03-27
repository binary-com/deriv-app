import React from 'react';
import { addDays, daysFromTodayTo, toMoment, convertDateFormat, getPosition } from '@deriv/shared';
import Input from './date-picker-input';
import Calendar from './date-picker-calendar';
import Native from './date-picker-native';
import { useOnClickOutside } from '../../hooks/use-onclickoutside';
import moment, { MomentInput } from 'moment';
import { TDatePickerOnChangeEvent } from '../types';
import { useDevice } from '@deriv/hooks';

type TDatePicker = Omit<
    React.ComponentProps<typeof Native> & React.ComponentProps<typeof Input> & React.ComponentProps<typeof Calendar>,
    | 'date_format'
    | 'onSelect'
    | 'is_datepicker_visible'
    | 'is_placeholder_visible'
    | 'placement'
    | 'style'
    | 'calendar_el_ref'
    | 'parent_ref'
    | 'onChange'
    | 'onChangeInput'
> & {
    mode?: string;
    value: moment.Moment | string;
    onChange: (e: TDatePickerOnChangeEvent) => void;
    date_format?: string;
};

type TCalendarRef = {
    setSelectedDate?: (date: string) => void;
};

const DatePicker = React.memo((props: TDatePicker) => {
    const {
        alignment = 'bottom',
        keep_open = false,
        date_format = 'YYYY-MM-DD',
        disabled,
        display_format = 'DD MMM YYYY',
        error,
        footer,
        id,
        label,
        has_range_selection,
        has_today_btn,
        mode = 'date',
        max_date,
        min_date,
        start_date,
        name = '',
        onBlur,
        onChange,
        onFocus,
        onChangeCalendarMonth,
        portal_id,
        placeholder,
        required,
        type,
        value,
        data_testid,
        ...other_props
    } = props;

    const datepicker_ref = React.useRef<HTMLDivElement>(null);
    const calendar_ref = React.useRef<TCalendarRef>(null);
    const calendar_el_ref = React.useRef<HTMLDivElement>(null);
    const [placement, setPlacement] = React.useState('');
    const [style, setStyle] = React.useState<React.CSSProperties>({});
    const [date, setDate] = React.useState<string>(value ? toMoment(value).format(display_format) : '');
    const [duration, setDuration] = React.useState<number | null | string>(daysFromTodayTo(value));
    const [is_datepicker_visible, setIsDatepickerVisible] = React.useState(false);
    const [is_placeholder_visible, setIsPlaceholderVisible] = React.useState(!!placeholder && !value);
    const { isMobile } = useDevice();

    useOnClickOutside(
        datepicker_ref,
        () => {
            if (is_datepicker_visible) setIsDatepickerVisible(false);
        },
        e => !calendar_el_ref.current?.contains(e.target as HTMLDivElement)
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
        setIsPlaceholderVisible(!!(placeholder && !value));
    }, [value, placeholder]);

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

    const onHover = (hovered_date: MomentInput) => {
        if (typeof onChange === 'function') {
            onChange({
                date: toMoment(hovered_date).format(display_format),
                duration: mode === 'duration' ? daysFromTodayTo(hovered_date?.toString()) : null,
            });
        }
    };

    const onSelectCalendar = (selected_date: string, is_visible = true) => {
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
                    value: getTargetValue(new_date, new_duration || ''),
                },
            });
        }
    };

    const onSelectCalendarNative = (selected_date: string) => {
        const new_date = selected_date ? toMoment(selected_date).format(display_format) : '';

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
    const onChangeInput: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
        const new_date = addDays(toMoment(), isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)).format(
            display_format
        );
        const new_duration = mode === 'duration' ? e.target.value : '';

        setDate(new_date);
        setDuration(new_duration);
        setIsDatepickerVisible(true);
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

    /**
     * TODO: handle datepicker input clear
     */
    // onClickClear = () => {};

    const getTargetValue = (new_date: string | null, new_duration: string | number | null) => {
        const calendar_value = getCalendarValue(new_date) && toMoment(getCalendarValue(new_date));
        return mode === 'duration' ? new_duration : calendar_value;
    };

    const getInputValue = (): string | number => (mode === 'duration' ? duration || 0 : date);

    const getCalendarValue = (new_date: string | null): string | null => {
        if (!new_date) return isMobile ? null : toMoment(start_date || max_date).format(date_format);
        return convertDateFormat(new_date, display_format, date_format);
    };

    const common_props = {
        date_format,
        display_format,
        error,
        footer,
        label,
        mode,
        max_date,
        min_date,
        onChange,
        portal_id,
        placeholder,
        ...other_props,
    };

    if (isMobile) {
        return (
            <Native
                id={id}
                name={name}
                onBlur={onBlur}
                onFocus={onFocus}
                onSelect={onSelectCalendarNative}
                value={getCalendarValue(date)} // native picker accepts date format yyyy-mm-dd
                disabled={disabled}
                data_testid={data_testid}
                {...common_props}
            />
        );
    }

    return (
        <div id={id} className='dc-datepicker' data-value={getInputValue()}>
            <div ref={datepicker_ref}>
                <Input
                    {...common_props}
                    disabled={disabled}
                    name={name}
                    onClick={handleVisibility}
                    onChangeInput={onChangeInput}
                    is_placeholder_visible={is_placeholder_visible}
                    onBlur={onBlur}
                    required={required}
                    type={type}
                    value={getInputValue()}
                    data-testid={data_testid}
                />
                <Calendar
                    ref={calendar_ref}
                    calendar_el_ref={calendar_el_ref}
                    parent_ref={datepicker_ref}
                    keep_open={keep_open}
                    alignment={alignment}
                    is_datepicker_visible={is_datepicker_visible}
                    onHover={has_range_selection ? onHover : undefined}
                    onSelect={onSelectCalendar}
                    onChangeCalendarMonth={onChangeCalendarMonth}
                    has_today_btn={has_today_btn}
                    placement={placement}
                    style={style}
                    value={getCalendarValue(date) || ''} // Calendar accepts date format yyyy-mm-dd
                    start_date=''
                    has_range_selection={has_range_selection}
                    {...common_props}
                />
            </div>
        </div>
    );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
