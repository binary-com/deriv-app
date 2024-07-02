import React from 'react';
import classNames from 'classnames';
import { Dropdown, Icon, Text, Tooltip } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import { getHoursList } from 'Constants/business-hour-times';
import SeparatorContainerLine from 'Components/separator-container-line';
import './business-hour-modal-edit.scss';

type TBusinessHourModalEditProps = {
    data: {
        day: JSX.Element;
        short_day: JSX.Element;
        time: JSX.Element;
        start_time?: string | null;
        end_time?: string | null;
        value: string;
    }[];
};

const BusinessHourModalEdit = ({ data }: TBusinessHourModalEditProps) => {
    const [selected_days, setSelectedDays] = React.useState<string[]>([]);
    const today = new Date().getDay();

    React.useEffect(() => {
        const filtered_days = data
            .filter(day => day.start_time !== undefined && day.end_time !== undefined)
            .map(day => day.value);

        setSelectedDays(filtered_days);
    }, []);

    const onSelectTime = () => {
        // TODO: implement on select time when implementing BE
    };

    const onClickDay = () => {
        // TODO: implement on select day when implementing BE
    };

    const onReset = () => {
        // TODO: implement on reset when implementing BE
    };

    return (
        <div className='business-hour-modal-edit'>
            <div className='business-hour-modal-edit__days'>
                {data.map(day => {
                    const includes_day = selected_days.includes(day.value);

                    return (
                        <Text
                            as='button'
                            className={classNames('business-hour-modal-edit__days-circle', {
                                'business-hour-modal-edit__days-circle--unselected': !includes_day,
                            })}
                            color={includes_day ? 'colored-background' : 'general'}
                            key={day.value}
                            onClick={onClickDay}
                        >
                            {day.short_day}
                        </Text>
                    );
                })}
            </div>
            <SeparatorContainerLine />
            <div className='business-hour-modal-edit__selector'>
                {data.map((day, idx) => {
                    const text_weight = idx === today - 1 ? 'bold' : 'normal';
                    const includes_day = selected_days.includes(day.value);
                    const are_times_undefined = day.start_time === undefined && day.end_time === undefined;
                    const are_times_null = day.start_time === null && day.end_time === null;

                    return (
                        <div className='business-hour-modal-edit__selector-item' key={`${day.value}_${day.start_time}`}>
                            <Text
                                className='business-hour-modal-edit__selector-item-text'
                                color={includes_day ? 'general' : 'less-prominent'}
                                size='xxs'
                                weight={text_weight}
                            >
                                {day.day}
                            </Text>
                            <div
                                className={classNames('business-hour-modal-edit__selector-item__dropdown', {
                                    'business-hour-modal-edit__selector-item__dropdown--single': !includes_day,
                                })}
                            >
                                {includes_day && !are_times_null ? (
                                    <div
                                        className={classNames(
                                            'business-hour-modal-edit__selector-item__dropdown-group',
                                            {
                                                'business-hour-modal-edit__selector-item__dropdown-group--bold':
                                                    idx === today - 1,
                                            }
                                        )}
                                    >
                                        <Dropdown
                                            is_align_text_left
                                            list={getHoursList()}
                                            onChange={onSelectTime}
                                            should_animate_suffix_icon
                                            suffix_icon='IcArrowDropDown'
                                            value={day.start_time!}
                                        />
                                        <Text size='xxs'>
                                            <Localize i18n_default_text='to' />
                                        </Text>
                                        <Dropdown
                                            is_align_text_left
                                            list={getHoursList()}
                                            onChange={onSelectTime}
                                            should_animate_suffix_icon
                                            suffix_icon='IcArrowDropDown'
                                            value={day.end_time!}
                                        />
                                    </div>
                                ) : (
                                    <div className='business-hour-modal-edit__selector-item__dropdown__open-text'>
                                        <Text color={are_times_null ? 'general' : 'less-prominent'} size='xxs'>
                                            <Localize i18n_default_text='Open 24 hours' />
                                        </Text>
                                        <Icon icon='IcArrowDropDown' />
                                    </div>
                                )}
                            </div>
                            <Tooltip alignment='top' message={localize('Reset')}>
                                <Icon
                                    className={classNames('business-hour-modal-edit__selector-item__icon', {
                                        'business-hour-modal-edit__selector-item__icon--disabled':
                                            !includes_day && are_times_undefined,
                                    })}
                                    icon='IcResetTime'
                                    onClick={onReset}
                                />
                            </Tooltip>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BusinessHourModalEdit;
