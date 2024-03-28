import classNames from 'classnames';
import React from 'react';
import throttle from 'lodash.throttle';
import { useSwipeable } from 'react-swipeable';
import Button from '../button/button';
import Icon from '../icon';
import Text from '../text';

const THROTTLE_INTERVAL_TIME = 100;

type TTickPicker = {
    default_value: number;
    is_submit_disabled?: boolean;
    min_value: number;
    max_value: number;
    onSubmit: (props: { target: { value: number; name: string } }) => void;
    submit_label: React.ReactElement | string;
    singular_label: string;
    plural_label: string;
    onValueChange: (tick_value: number) => void;
};

const TickPicker = ({
    default_value,
    is_submit_disabled,
    min_value,
    max_value,
    onSubmit,
    submit_label,
    singular_label,
    plural_label,
    onValueChange,
}: TTickPicker) => {
    const normalizedTick = (tick: number) => `${tick}`.padStart(2, '0');
    const tick_value_ref = React.useRef(default_value);
    const is_mounted_ref = React.useRef(false);

    const handleDecrease = () => {
        if (tick_value_ref.current - 1 >= min_value) {
            tick_value_ref.current -= 1;
            updateTickValue();
        }
    };

    const handleIncrease = () => {
        if (tick_value_ref.current + 1 <= max_value) {
            tick_value_ref.current += 1;
            updateTickValue();
        }
    };

    const updateTickValue = () => {
        if (onValueChange) {
            onValueChange(tick_value_ref.current);
        }
    };

    const handleClick = () => {
        onSubmit({
            target: {
                value: tick_value_ref.current,
                name: 'submit',
            },
        });
    };

    React.useEffect(() => {
        if (is_mounted_ref.current) {
            updateTickValue();
        } else {
            is_mounted_ref.current = true;
        }
    }, [tick_value_ref.current]);

    const throttledSwipeHandler = throttle(
        ({ dir }: { dir: string }) => {
            if (dir.toLowerCase() === 'up') {
                handleIncrease();
            }
            if (dir.toLowerCase() === 'down') {
                handleDecrease();
            }
        },
        THROTTLE_INTERVAL_TIME,
        { trailing: true, leading: false }
    );

    const swipe_handlers = useSwipeable({
        onSwiping: throttledSwipeHandler,
    });

    return (
        <div className='dc-tick-picker'>
            <div className='dc-tick-picker__calculation'>
                <Button rounded className='operator' onClick={handleDecrease}>
                    <Icon icon='IcMinus' custom_color='var(--text-prominent)' />
                </Button>
                <div className='dc-tick-picker__holder' {...swipe_handlers}>
                    <Text styles={{ fontSize: '96px', lineHeight: 1, color: 'inherit' }}>
                        {normalizedTick(tick_value_ref.current)}
                    </Text>
                    <Text size='s' weight='bold' align='center' styles={{ color: 'inherit' }}>
                        {tick_value_ref.current === 1 ? singular_label : plural_label}
                    </Text>
                </div>
                <Button rounded className='operator' onClick={handleIncrease}>
                    <Icon icon='IcAdd' custom_color='var(--text-prominent)' />
                </Button>
            </div>
            <div
                className={classNames('dc-tick-picker__submit-wrapper', {
                    'dc-tick-picker__submit-wrapper--is-disabled': is_submit_disabled,
                })}
            >
                <Button
                    rounded
                    onClick={handleClick}
                    renderText={() =>
                        is_submit_disabled && (
                            <Text size='s' weight='bold' align='center' color='disabled'>
                                {submit_label}
                            </Text>
                        )
                    }
                >
                    {submit_label}
                </Button>
            </div>
        </div>
    );
};

export default TickPicker;
