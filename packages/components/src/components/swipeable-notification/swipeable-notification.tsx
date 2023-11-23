import React from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useSwipeable } from 'react-swipeable';
import { Localize } from '@deriv/translations';
import Text from '../text';

type TSwipeableNotificationProps = {
    classname?: string;
    content?: React.ReactNode;
    is_failure?: boolean;
    is_success?: boolean;
    onUnmount?: () => void;
    redirect_to?: string;
    timestamp?: number;
    visibility_duration_ms?: number;
};

const SwipeableNotification = ({
    classname = 'swipeable-notification',
    content,
    is_failure,
    is_success,
    onUnmount,
    redirect_to = '',
    timestamp,
    visibility_duration_ms,
}: TSwipeableNotificationProps) => {
    const [is_swipe_right, setSwipeRight] = React.useState(false);
    const [is_shown, setIsShown] = React.useState(true);
    const getSeconds = React.useCallback((timestamp?: number) => {
        return timestamp ? Math.abs(Math.floor(Date.now() / 1000) - timestamp) : null;
    }, []);
    const [seconds, setSeconds] = React.useState<number | null>(getSeconds(timestamp));
    const interval_ref = React.useRef<number>();

    const hideNotification = () => setIsShown(false);
    const debouncedHideNotification = React.useMemo(
        () => debounce(hideNotification, visibility_duration_ms),
        [visibility_duration_ms]
    );
    const getDisplayedTime = () => {
        if (!seconds && seconds !== 0) return;
        return seconds < 10 ? (
            <Localize i18n_default_text='now' />
        ) : (
            <Localize i18n_default_text='{{seconds}}s ago' values={{ seconds }} />
        );
    };
    const onSwipeLeft = () => {
        setSwipeRight(false);
        hideNotification();
    };
    const onSwipeRight = () => {
        setSwipeRight(true);
        hideNotification();
    };
    const swipe_handlers = useSwipeable({
        onSwipedLeft: onSwipeLeft,
        onSwipedRight: onSwipeRight,
    });

    React.useEffect(() => {
        if (timestamp) {
            interval_ref.current = setInterval(() => {
                setSeconds(Math.abs(Math.floor(Date.now() / 1000) - timestamp));
            }, 1000);
        }
        return () => {
            debouncedHideNotification.cancel();
            if (timestamp && interval_ref.current) clearInterval(interval_ref.current);
        };
    }, [debouncedHideNotification, timestamp]);

    return (
        <CSSTransition
            appear
            classNames={{
                appear: `${classname}-appear`,
                appearActive: `${classname}-appear-active`,
                appearDone: `${classname}-appear-done`,
                enter: `${classname}-enter`,
                enterActive: `${classname}-enter-active`,
                enterDone: `${classname}-enter-done`,
                exit: `${classname}-exit`,
                exitActive: `${classname}-exit-active-${is_swipe_right ? 'right' : 'left'}`,
            }}
            in={is_shown}
            onEntered={() => {
                if (visibility_duration_ms) debouncedHideNotification();
            }}
            onExited={onUnmount}
            timeout={300}
            unmountOnExit
        >
            <NavLink
                className={classNames(classname, {
                    [`${classname}--failure`]: is_failure,
                    [`${classname}--success`]: is_success,
                })}
                to={redirect_to}
                {...swipe_handlers}
            >
                <div className={`${classname}-content`}>{content}</div>
                <Text as='p' size='xxxs' line_height='s' className={`${classname}-time`}>
                    {getDisplayedTime()}
                </Text>
            </NavLink>
        </CSSTransition>
    );
};

export default React.memo(SwipeableNotification);
