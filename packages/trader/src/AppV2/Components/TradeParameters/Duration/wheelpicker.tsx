import { TimeWheelPickerContainer, WheelPickerContainer } from '@deriv-com/quill-ui';
import { setTime, toMoment } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getOptionPerUnit } from 'AppV2/Utils/trade-params-utils';
import clsx from 'clsx';
import React from 'react';
import { getBoundaries, getSelectedTime } from 'Stores/Modules/Trading/Helpers/end-time';
import { useTraderStore } from 'Stores/useTraderStores';

const getClosestTimeToCurrentGMT = (interval: number): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    };
    const formattedTime = new Intl.DateTimeFormat('en-GB', options).format(now);

    const [hours, minutes] = formattedTime.split(':').map(Number);

    const date = new Date();
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);

    const roundedMinutes = Math.ceil(date.getUTCMinutes() / interval) * interval;

    if (roundedMinutes >= 60) {
        date.setUTCHours(date.getUTCHours() + 1);
        date.setUTCMinutes(0);
    } else {
        date.setUTCMinutes(roundedMinutes);
    }

    const newHours = String(date.getUTCHours()).padStart(2, '0');
    const newMinutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${newHours}:${newMinutes}`;
};

const DurationWheelPicker = observer(
    ({
        unit,
        setEndTime,
        setWheelPickerValue,
        selected_hour,
        selected_time,
        is_wheelpicker_loading,
        toggle_date_picker,
        is24_hour_selected,
        setIs24HourSelected,
    }: {
        unit: string;
        setEndTime: (arg: string) => void;
        setWheelPickerValue: (index: number, value: string | number) => void;
        selected_hour: number[];
        selected_time: number[];
        toggle_date_picker: boolean;
        is_wheelpicker_loading: boolean;
        is24_hour_selected: boolean;
        setIs24HourSelected: (arg: boolean) => void;
    }) => {
        const { common } = useStore();
        const { server_time } = common;
        const { expiry_date, expiry_time, market_open_times, market_close_times, duration_min_max } = useTraderStore();
        const moment_expiry_date = toMoment(expiry_date);
        const market_open_datetimes = market_open_times.map(open_time =>
            setTime(moment_expiry_date.clone(), open_time)
        );
        const market_close_datetimes = market_close_times.map(close_time =>
            setTime(moment_expiry_date.clone(), close_time)
        );
        const expiry_datetime = setTime(moment_expiry_date.clone(), expiry_time);
        const server_datetime = toMoment(server_time);
        const boundaries = getBoundaries(server_datetime.clone(), market_open_datetimes, market_close_datetimes);

        const adjusted_start_time =
            boundaries.start[0]?.clone().add(5, 'minutes').format('HH:mm') || getClosestTimeToCurrentGMT(5);

        const time = getSelectedTime(
            server_datetime.clone(),
            expiry_datetime,
            market_open_datetimes,
            market_close_datetimes
        );

        const options = React.useMemo(
            () => getOptionPerUnit(unit, duration_min_max?.tick?.min === 5),
            [unit, duration_min_max]
        );

        return (
            <div
                className={clsx('duration-container__wheel-picker-container', {
                    'duration-container__wheel-picker-container__day': ['d', 'et'].includes(unit),
                })}
            >
                <div
                    className={clsx({
                        'duration-container__wheel-picker-container__loading': is_wheelpicker_loading,
                    })}
                >
                    {unit !== 'et' ? (
                        <WheelPickerContainer
                            key={`${unit}-${toggle_date_picker}`}
                            data={!is24_hour_selected ? options : [options[0], [{ ...options[1][0] }]]}
                            defaultValue={[String(selected_time)]}
                            containerHeight={unit == 'd' ? '228px' : '268px'}
                            inputValues={unit == 'h' ? selected_hour : selected_time}
                            setInputValues={(index, val) => {
                                if (unit == 'h') {
                                    if (index == 0 && val === 24) {
                                        setIs24HourSelected(true);
                                    } else if (index == 0 && val !== 24) {
                                        setIs24HourSelected(false);
                                    }
                                } else {
                                    setIs24HourSelected(false);
                                }

                                setWheelPickerValue(index, val);
                            }}
                        />
                    ) : (
                        <TimeWheelPickerContainer
                            is12Hour={false}
                            startTimeIn24Format={adjusted_start_time}
                            minutesInterval={5}
                            selectedTime={time}
                            setSelectedValue={val => setEndTime(val as string)}
                            containerHeight='226px'
                            hoursInterval={1}
                        />
                    )}
                </div>
            </div>
        );
    }
);

export default DurationWheelPicker;
