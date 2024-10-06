import React from 'react';
import clsx from 'clsx';
import { Heading, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { usePrevious } from '@deriv/components';

type TCurrentSpotDisplayProps = {
    has_tick_count?: boolean;
    spot: string | null;
    tick: number | null;
};

const ACTIONS = {
    INC: 'increment',
    DEC: 'decrement',
    ADD10: 'add10',
} as const;
const TOTAL_ANIMATION_TIME = 80;

const CurrentSpotDisplay = ({ has_tick_count, spot, tick }: TCurrentSpotDisplayProps) => {
    const last_digit = Number(spot?.slice(-1));
    const prev_spot = usePrevious(spot);
    const prev_last_digit = Number(prev_spot?.slice(-1));

    const [should_enter_from_top, setShouldEnterFromTop] = React.useState(false);
    const [should_enter_from_bottom, setShouldEnterFromBottom] = React.useState(false);
    const [next_displayed_last_digit, setNextDisplayedLastDigit] = React.useState(last_digit);
    const [displayed_last_digit, setDisplayedLastDigit] = React.useState(last_digit);

    const last_digit_ref = React.useRef(prev_last_digit);
    const spin_interval_id = React.useRef<ReturnType<typeof setInterval>>();
    const spin_timeout_id = React.useRef<ReturnType<typeof setTimeout>>();
    const spinning_wrapper_ref = React.useRef<HTMLDivElement>(null);

    const spinLastDigit = (
        action: typeof ACTIONS[keyof typeof ACTIONS],
        interval_ms: number,
        start: number,
        end: number
    ) => {
        clearInterval(spin_interval_id.current);
        const interval_id = setInterval(() => {
            if (action === ACTIONS.INC && last_digit_ref.current < end) {
                last_digit_ref.current = (last_digit_ref.current + 1) % 10;
            } else if (action === ACTIONS.DEC && last_digit_ref.current > end) {
                last_digit_ref.current = Math.abs(last_digit_ref.current - 1) % 10;
            } else if (action === ACTIONS.ADD10 && last_digit_ref.current < start + 10) {
                last_digit_ref.current += 1;
            } else if (
                action === ACTIONS.ADD10 ? last_digit_ref.current === start + 10 : last_digit_ref.current === end
            ) {
                clearInterval(interval_id);
            }
            setNextDisplayedLastDigit(last_digit_ref.current % 10);
        }, interval_ms);
        spin_interval_id.current = interval_id;
    };

    React.useEffect(() => {
        if (isNaN(prev_last_digit) || isNaN(last_digit) || !spot) return;

        const diff = Math.abs(Number(prev_last_digit) - last_digit);
        const timeout_speed = diff > 0 ? Math.floor(TOTAL_ANIMATION_TIME / diff) : TOTAL_ANIMATION_TIME;
        const should_increment = Number(prev_last_digit) <= last_digit;

        spinning_wrapper_ref.current?.style.setProperty('--animation-time', `${timeout_speed}ms`);

        if (should_increment) {
            setShouldEnterFromTop(true);
        } else {
            setShouldEnterFromBottom(true);
        }

        spin_timeout_id.current = setTimeout(() => {
            setShouldEnterFromTop(false);
            setShouldEnterFromBottom(false);
            setDisplayedLastDigit(last_digit_ref.current % 10);
        }, TOTAL_ANIMATION_TIME);

        const getAction = () => {
            let action: typeof ACTIONS[keyof typeof ACTIONS] = ACTIONS.ADD10;
            if (Number(prev_last_digit) < last_digit) {
                action = ACTIONS.INC;
            } else if (Number(prev_last_digit) > last_digit) {
                action = ACTIONS.DEC;
            }
            return action;
        };
        last_digit_ref.current = Number(prev_last_digit);
        spinLastDigit(getAction(), timeout_speed, Number(prev_last_digit), last_digit);

        return () => {
            clearTimeout(spin_timeout_id.current);
            clearInterval(spin_interval_id.current);
        };
    }, [spot, prev_last_digit, last_digit]);

    if (!spot) return null;
    return (
        <div className='current-spot__display'>
            {has_tick_count && (
                <Text size='xl' color='quill-typography__color--prominent'>
                    <Localize i18n_default_text='Tick {{current_tick}}' values={{ current_tick: tick }} />
                </Text>
            )}
            <div className='current-spot'>
                <Text size='xl' bold color='quill-typography__color--prominent'>
                    {spot.slice(0, -1)}
                </Text>
                <div className='current-spot__last-digit-container'>
                    <div
                        ref={spinning_wrapper_ref}
                        className={clsx(
                            'current-spot__last-digit-wrapper',
                            should_enter_from_top && 'current-spot__last-digit-wrapper--enter-from-top',
                            should_enter_from_bottom && 'current-spot__last-digit-wrapper--enter-from-bottom'
                        )}
                    >
                        {should_enter_from_top && (
                            <Heading.H2 color='quill-typography__color--prominent' className='current-spot__last-digit'>
                                {next_displayed_last_digit}
                            </Heading.H2>
                        )}
                        <Heading.H2 color='quill-typography__color--prominent' className='current-spot__last-digit'>
                            {displayed_last_digit}
                        </Heading.H2>
                        {should_enter_from_bottom && (
                            <Heading.H2 color='quill-typography__color--prominent' className='current-spot__last-digit'>
                                {next_displayed_last_digit}
                            </Heading.H2>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(CurrentSpotDisplay);
