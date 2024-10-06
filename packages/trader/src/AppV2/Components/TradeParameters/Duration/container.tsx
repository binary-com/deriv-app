import React, { useEffect, useState } from 'react';
import { ActionSheet, CaptionText, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import DurationEndDatePicker from './datepicker';
import { observer } from '@deriv/stores';
import DurationChips from './chips';
import DurationWheelPicker from './wheelpicker';

const DurationActionSheetContainer = observer(
    ({
        selected_hour,
        setSelectedHour,
        unit,
        setUnit,
    }: {
        selected_hour: number[];
        setSelectedHour: (arg: number[]) => void;
        unit: string;
        setUnit: (arg: string) => void;
    }) => {
        const { duration, duration_units_list, onChangeMultiple } = useTraderStore();
        const [selected_time, setSelectedTime] = useState([duration]);
        const [expiry_date_data, setExpiryDate] = useState<Date>(new Date());
        const [end_time, setEndTime] = useState<string>('');
        const [toggle_date_picker, setToggleDatePicker] = useState<boolean>(false);
        const [current_gmt_time, setCurrentGmtTime] = useState<string>('');
        const [is_wheelpicker_loading, setIsWheelPickerLoading] = useState<boolean>(false);
        const [is24_hour_selected, setIs24HourSelected] = useState(false);
        const show_duration_chips = !(duration_units_list.length === 1 && duration_units_list[0].value === 't');

        useEffect(() => {
            const updateCurrentGmtTime = () => {
                const now = new Date();
                const gmt_time = now.toLocaleTimeString('en-GB', { timeZone: 'GMT', hour12: false });
                setCurrentGmtTime(gmt_time);
            };
            updateCurrentGmtTime();
            const interval = setInterval(updateCurrentGmtTime, 1000);

            return () => clearInterval(interval);
        }, []);

        const onAction = () => {
            if (unit === 'h') {
                const minutes = selected_hour[0] * 60 + selected_hour[1];
                const hour = Math.floor(duration / 60);
                const min = duration % 60;
                setSelectedHour([hour, min]);
                onChangeMultiple({
                    duration_unit: 'm',
                    duration: Number(minutes),
                    expiry_time: null,
                    expiry_type: 'duration',
                });
            } else if (unit === 'et') {
                setSelectedHour([]);
                onChangeMultiple({
                    expiry_time: end_time,
                    expiry_type: 'endtime',
                });
            } else {
                setSelectedHour([]);
                onChangeMultiple({
                    duration_unit: unit,
                    duration: Number(selected_time),
                    expiry_time: null,
                    expiry_type: 'duration',
                });
            }
        };

        const onChangeUnit = React.useCallback(
            (value: string) => {
                setIsWheelPickerLoading(true);
                setUnit(value);
                if (value !== 'h') {
                    setIs24HourSelected(false);
                    setSelectedHour([]);
                }
                const timeoutId = setTimeout(() => {
                    setIsWheelPickerLoading(false);
                }, 300);

                return () => clearTimeout(timeoutId);
            },
            [setUnit, setSelectedHour]
        );

        const handleSelectExpiryDate = (date: Date) => {
            setExpiryDate(date);
            const current_date = new Date();
            const time_difference = +date - +current_date;
            const day_difference = Math.ceil(time_difference / (1000 * 60 * 60 * 24));
            setSelectedTime([day_difference]);
            setToggleDatePicker(!toggle_date_picker);
        };

        const setWheelPickerValue = (index: number, value: string | number) => {
            const num_value = Number(value);
            if (unit === 'h') {
                const arr = selected_hour;
                arr[index] = num_value;
                setSelectedHour(arr);
            } else if (unit == 'd') {
                if (selected_time[0] !== num_value) {
                    const updated_date = new Date();
                    updated_date.setDate(updated_date.getDate() + num_value);
                    setSelectedTime([num_value]);
                    setExpiryDate(updated_date);
                }
            } else {
                setSelectedTime([num_value]);
            }
        };
        return (
            <div className='duration-container'>
                <ActionSheet.Header title={<Localize i18n_default_text='Duration' />} />
                {show_duration_chips && (
                    <DurationChips duration_units_list={duration_units_list} onChangeUnit={onChangeUnit} unit={unit} />
                )}
                <DurationWheelPicker
                    unit={unit}
                    setEndTime={setEndTime}
                    setWheelPickerValue={setWheelPickerValue}
                    selected_hour={selected_hour}
                    is_wheelpicker_loading={is_wheelpicker_loading}
                    selected_time={selected_time}
                    toggle_date_picker={toggle_date_picker}
                    is24_hour_selected={is24_hour_selected}
                    setIs24HourSelected={setIs24HourSelected}
                />
                {unit == 'd' && (
                    <DurationEndDatePicker setExpiryDate={handleSelectExpiryDate} expiry_date={expiry_date_data} />
                )}
                {unit == 'et' && (
                    <div className='duration-container__endtime'>
                        <CaptionText color='quill-typography__color--subtle'>
                            <Localize i18n_default_text='Current time' />
                        </CaptionText>
                        <Text size='sm'>{`${current_gmt_time} GMT`}</Text>
                    </div>
                )}
                <ActionSheet.Footer
                    alignment='vertical'
                    primaryAction={{
                        content: <Localize i18n_default_text='Save' />,
                        onAction,
                    }}
                />
            </div>
        );
    }
);

export default DurationActionSheetContainer;
