import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import { DatePicker, Tooltip } from '@deriv/components';
import { isTimeValid, setTime, toMoment, useIsMounted, hasIntradayDurationUnit } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

type TDatePickerOnChange = React.ComponentProps<typeof DatePicker>['onChange'];
type TMarketEvent = {
    dates: string[];
    descrip: string;
};
type TTradingDatePickerProps = {
    id: string;
    is_24_hours_contract?: boolean;
    mode?: string;
    name: string;
};

const TradingDatePicker = observer(({ id, is_24_hours_contract, mode, name }: TTradingDatePickerProps) => {
    const { common } = useStore();
    const { server_time } = common;
    const {
        duration: current_duration,
        duration_min_max,
        duration_units_list,
        expiry_type,
        onChange,
        start_date,
        start_time,
        symbol,
        validation_errors,
    } = useTraderStore();

    const isMounted = useIsMounted();

    const [disabled_days, setDisabledDays] = React.useState<number[]>([]);
    const [market_events, setMarketEvents] = React.useState<TMarketEvent[]>([]);
    const [duration, setDuration] = React.useState(current_duration);
    const [selected_date, setSelectedDate] = React.useState<moment.Moment>();

    React.useEffect(() => {
        onChangeCalendarMonth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (duration !== current_duration) {
            setDuration(current_duration);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current_duration]);

    const getMinDuration = () => {
        return hasIntradayDurationUnit(duration_units_list)
            ? toMoment(server_time).clone()
            : toMoment(server_time).clone().add(duration_min_max?.daily?.min, 'second');
    };

    const getMomentContractStartDateTime = () => {
        return setTime(
            toMoment(getMinDuration()),
            isTimeValid(start_time ?? '') ? start_time : server_time?.format('HH:mm:ss') ?? ''
        );
    };

    const getMaxDailyDuration = () => {
        return duration_min_max.daily ? duration_min_max.daily.max : 365 * 24 * 3600;
    };

    const getMinDateExpiry = () => {
        const is_duration_contract = expiry_type === 'duration';
        const min_date = getMomentContractStartDateTime().clone().startOf('day');

        return is_duration_contract && hasIntradayDurationUnit(duration_units_list) ? min_date.add(1, 'day') : min_date;
    };

    const getMaxDateDuration = () => {
        const max_daily_duration = start_date ? 24 * 3600 : getMaxDailyDuration();
        return is_24_hours_contract
            ? getMomentContractStartDateTime().clone().add(max_daily_duration, 'second')
            : getMomentContractStartDateTime().clone().add(getMaxDailyDuration(), 'second');
    };

    const hasRangeSelection = () => mode === 'duration';

    const getFooter = () => {
        if (!hasRangeSelection()) return '';

        if (!duration) return localize('Minimum duration is 1 day');
        if (+duration === 1) return localize('Duration: {{duration}} day', { duration });
        return localize('Duration: {{duration}} days', { duration });
    };

    const getDatepickerValue = () => {
        return hasRangeSelection()
            ? toMoment().add(duration, 'days').format('YYYY-MM-DD')
            : selected_date || getMinDateExpiry();
    };

    const onChangeDate: TDatePickerOnChange = e => {
        if (isMounted()) {
            if (hasRangeSelection()) {
                setDuration(Number(e.duration));
            } else if (e.target?.value) {
                setSelectedDate(toMoment(e.target?.value));
            }
        }

        if (typeof onChange === 'function' && e.target) {
            const value = hasRangeSelection() ? e.target.value : toMoment(e.target.value).format('YYYY-MM-DD');
            onChange({
                target: {
                    name: e.target.name || '',
                    value,
                },
            });
        }
    };

    const onChangeCalendarMonth = React.useCallback(
        // Do not move this callback up. It will cause infinite loop.
        async (e = toMoment().format('YYYY-MM-DD')) => {
            const new_market_events: TMarketEvent[] = [];
            let new_disabled_days: number[] = [];
            const events = await ContractType.getTradingEvents(e, symbol);
            events?.forEach(evt => {
                const dates = evt.dates.split(', '); // convert dates str into array
                const idx = dates.indexOf('Fridays');
                if (idx !== -1) {
                    new_disabled_days = [6, 0]; // Sat, Sun
                }
                new_market_events.push({
                    dates,
                    descrip: evt.descrip,
                });
            });

            if (isMounted()) {
                setDisabledDays(new_disabled_days);
                setMarketEvents(new_market_events);
            }
        },
        [isMounted, symbol]
    );

    const has_error = !!validation_errors?.[name]?.length;

    return (
        <div
            className={classNames('dc-input-field', {
                'dc-input-field--has-error': has_error,
            })}
        >
            <Tooltip
                className='trade-container__tooltip'
                alignment='left'
                message={has_error ? validation_errors[name][0] : undefined}
                has_error={has_error}
            >
                <DatePicker
                    id={id}
                    alignment='left'
                    display_format='DD MMM YYYY'
                    show_leading_icon
                    error={validation_errors?.[name]?.length ? '' : undefined}
                    mode={mode}
                    max_date={getMaxDateDuration()}
                    min_date={getMinDateExpiry()}
                    name={name}
                    onChange={onChangeDate}
                    onChangeCalendarMonth={onChangeCalendarMonth}
                    has_range_selection={hasRangeSelection()}
                    has_today_btn={!hasRangeSelection()}
                    footer={getFooter()}
                    events={market_events}
                    disabled_days={disabled_days}
                    keep_open
                    readOnly={!hasRangeSelection()}
                    value={getDatepickerValue() as string}
                />
            </Tooltip>
        </div>
    );
});

export default TradingDatePicker;
